// Post-export fix-ups for static hosting. Runs automatically after `next build` (npm "postbuild").
//
// 1. Segment-prefetch aliases.
//    Next 16's client requests per-segment prefetch payloads with dotted names, e.g.
//      /en/projects/x/__next.$d$locale.projects.$d$slug.__PAGE__.txt
//    but `output: "export"` writes them as nested folders:
//      /en/projects/x/__next.$d$locale/projects/$d$slug/__PAGE__.txt
//    Without an alias every navigation logs 404s and the prefetch is wasted.
//
// 2. Strict, hash-based Content-Security-Policy per page.
//    A static export can't use nonces, and Next inlines bootstrap scripts, so the header CSP in
//    firebase.json has to allow inline scripts. Here we hash every inline <script> of each HTML file
//    and inject a <meta http-equiv="Content-Security-Policy"> that allows exactly those hashes
//    and nothing else. Browsers enforce *both* policies, so the effective policy is the strict one:
//    an injected inline script (XSS) is refused even though the header alone would allow it.
//
// 3. Subresource Integrity on every first-party script and stylesheet.
//    Each <script src>, script preload and stylesheet under /_next/ gets integrity="sha384-…"
//    computed from the exact file being deployed, so a modified file is refused by the browser.
import { createHash } from "node:crypto";
import { copyFile, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "..", "out");

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

/** All files below `dir`, as path segments relative to it. */
async function filesBelow(dir, filter, prefix = []) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const segs = [...prefix, entry.name];
    if (entry.isDirectory()) result.push(...(await filesBelow(path.join(dir, entry.name), filter, segs)));
    else if (filter(entry.name)) result.push(segs);
  }
  return result;
}

// ─────────────────────────── 1. prefetch aliases ───────────────────────────
let aliased = 0;
async function alias(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const segs of await filesBelow(full, (n) => n.endsWith(".txt"))) {
        const dotted = path.join(dir, [entry.name, ...segs].join("."));
        if (!(await exists(dotted))) {
          await copyFile(path.join(full, ...segs), dotted);
          aliased += 1;
        }
      }
    } else if (entry.name !== "_next" && entry.name !== "media") {
      await alias(full);
    }
  }
}

// ─────────────────────────── 2. hash-based CSP ───────────────────────────
const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
const DATA_TYPES = /type=["']?(application\/(ld\+)?json|text\/plain)/i;

function policy(hashes) {
  return [
    "default-src 'none'",
    `script-src 'self' ${hashes.map((h) => `'${h}'`).join(" ")}`.trim(),
    "style-src 'self' 'unsafe-inline'", // React style props / Motion write inline styles
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "media-src 'self'",
    "worker-src 'none'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const sriCache = new Map();
async function sri(url) {
  const clean = url.split("?")[0].split("#")[0];
  if (!clean.startsWith("/_next/")) return null;
  if (!sriCache.has(clean)) {
    const file = path.join(OUT, ...clean.split("/").filter(Boolean));
    sriCache.set(clean, (await exists(file)) ? `sha384-${createHash("sha384").update(await readFile(file)).digest("base64")}` : null);
  }
  return sriCache.get(clean);
}

/** Adds integrity="…" to script/preload/stylesheet tags that point at /_next/ files. */
async function addIntegrity(html) {
  const TAG = /<(script|link)\b([^>]*?)(\/?)>/gi;
  const out = [];
  let last = 0;
  for (const m of html.matchAll(TAG)) {
    const [whole, tag, attrs, selfClose] = m;
    out.push(html.slice(last, m.index));
    last = m.index + whole.length;
    const isScript = tag.toLowerCase() === "script";
    const isAsset = isScript || /rel="(preload|modulepreload|stylesheet)"/i.test(attrs);
    const url = (isScript ? /\bsrc="([^"]+)"/ : /\bhref="([^"]+)"/).exec(attrs)?.[1];
    if (!isAsset || !url || /\bintegrity=/i.test(attrs) || (!isScript && /rel="preload"/i.test(attrs) && !/as="(script|style)"/i.test(attrs))) {
      out.push(whole);
      continue;
    }
    const hash = await sri(url);
    out.push(hash ? `<${tag}${attrs} integrity="${hash}"${selfClose}>` : whole);
  }
  out.push(html.slice(last));
  return out.join("");
}

let pages = 0;
let maxHashes = 0;
for (const segs of await filesBelow(OUT, (n) => n.endsWith(".html"))) {
  const file = path.join(OUT, ...segs);
  let html = await addIntegrity(await readFile(file, "utf8"));
  if (html.includes('http-equiv="Content-Security-Policy"')) continue; // idempotent
  const hashes = new Set();
  for (const [, attrs, body] of html.matchAll(INLINE_SCRIPT)) {
    if (DATA_TYPES.test(attrs) || body.length === 0) continue;
    hashes.add(`sha256-${createHash("sha256").update(body, "utf8").digest("base64")}`);
  }
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy([...hashes])}"/>`;
  // Must come before any script; right after <meta charset> keeps charset within the first bytes.
  const charset = /<meta charSet="utf-8"\/>/i;
  html = charset.test(html) ? html.replace(charset, (m) => m + meta) : html.replace(/<head>/i, `<head>${meta}`);
  await writeFile(file, html);
  pages += 1;
  maxHashes = Math.max(maxHashes, hashes.size);
}

await alias(OUT);
console.log(`✓ postbuild: aliased ${aliased} prefetch file(s); strict CSP on ${pages} page(s) (max ${maxHashes} inline hashes)`);
