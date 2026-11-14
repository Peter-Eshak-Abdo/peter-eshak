// Post-export fix-ups for static hosting.
//
// Next 16's client requests per-segment prefetch payloads with dotted names, e.g.
//   /en/projects/x/__next.$d$locale.projects.$d$slug.__PAGE__.txt
// but `output: "export"` writes them as nested folders:
//   /en/projects/x/__next.$d$locale/projects/$d$slug/__PAGE__.txt
// Without an alias every navigation logs 404s and the prefetch is wasted. Copying each payload
// under the requested name is harmless and idempotent.
import { copyFile, readdir, stat } from "node:fs/promises";
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
async function filesBelow(dir, prefix = []) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const segs = [...prefix, entry.name];
    if (entry.isDirectory()) result.push(...(await filesBelow(path.join(dir, entry.name), segs)));
    else if (entry.name.endsWith(".txt")) result.push(segs);
  }
  return result;
}

let aliased = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const segs of await filesBelow(full)) {
        const dotted = path.join(dir, [entry.name, ...segs].join("."));
        if (!(await exists(dotted))) {
          await copyFile(path.join(full, ...segs), dotted);
          aliased += 1;
        }
      }
    } else if (entry.name !== "_next" && entry.name !== "media") {
      await walk(full);
    }
  }
}

await walk(OUT);
console.log(`✓ postbuild: aliased ${aliased} segment prefetch file(s)`);
