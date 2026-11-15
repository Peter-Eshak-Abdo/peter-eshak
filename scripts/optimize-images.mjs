// Generates the web-ready images in /public/media from the originals in /assets.
// Run with `npm run images` whenever a source image changes; the output is committed
// because static export ships images as-is (no runtime optimizer on Firebase Hosting).
import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "assets");
const OUT = path.join(ROOT, "public", "media");

/** @param {string} dir */
async function fresh(dir) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
}

const PORTRAIT = path.join(SRC, "portrait.png");

async function portrait() {
  const dir = path.join(OUT, "portrait");
  await fresh(dir);
  // 4:5 crop of the full width, biased towards the top so the face stays centred.
  const { width = 0, height = 0 } = await sharp(PORTRAIT).metadata();
  const cropH = Math.min(height, Math.round(width * 1.25));
  const crop = { left: 0, top: Math.round((height - cropH) * 0.2), width, height: cropH };
  for (const w of [480, 900]) {
    await sharp(PORTRAIT)
      .extract(crop)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(dir, `portrait-${w}.webp`));
  }
}

/**
 * Site icons from the headshot: a round favicon / touch icon (transparent corners) plus a
 * full-bleed "maskable" PWA icon. Written to src/app (Next metadata files) and public/icons.
 */
async function icons() {
  // Square crop around the face of the 689×1024 headshot.
  const face = sharp(PORTRAIT).extract({ left: 65, top: 40, width: 560, height: 560 });
  const round = async (size) => {
    const mask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);
    return face.clone().resize(size, size).composite([{ input: mask, blend: "dest-in" }]).png({ palette: true, quality: 85, compressionLevel: 9 }).toBuffer();
  };
  const appDir = path.join(ROOT, "src", "app");
  const pubDir = path.join(ROOT, "public", "icons");
  await fresh(pubDir);
  await sharp(await round(96)).toFile(path.join(appDir, "icon.png")); // favicon
  await face.clone().resize(180, 180).png({ palette: true, quality: 85 }).toFile(path.join(appDir, "apple-icon.png"));
  await sharp(await round(192)).toFile(path.join(pubDir, "icon-192.png"));
  await sharp(await round(512)).toFile(path.join(pubDir, "icon-512.png"));
  // Maskable: the face fills the safe zone on a solid background.
  await sharp({ create: { width: 512, height: 512, channels: 3, background: "#e9edf3" } })
    .composite([{ input: await face.clone().resize(410, 410).toBuffer(), left: 51, top: 51 }])
    .png({ palette: true, quality: 85 })
    .toFile(path.join(pubDir, "maskable-512.png"));
}

async function certifications() {
  const from = path.join(SRC, "certifications");
  const dir = path.join(OUT, "certifications");
  await fresh(dir);
  const files = (await readdir(from)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  await Promise.all(
    files.map(async (file) => {
      const slug = path.parse(file).name;
      const base = sharp(path.join(from, file)).rotate();
      await base.clone().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(dir, `${slug}-1600.webp`));
      await base.clone().resize({ width: 560 }).webp({ quality: 70 }).toFile(path.join(dir, `${slug}-560.webp`));
    }),
  );
  return files.length;
}

async function projects() {
  const from = path.join(SRC, "projects");
  const dir = path.join(OUT, "projects");
  await fresh(dir);
  let files = [];
  try {
    files = (await readdir(from)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  } catch {
    return 0;
  }
  await Promise.all(
    files.map(async (file) => {
      const slug = path.parse(file).name;
      const base = sharp(path.join(from, file));
      await base.clone().resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(dir, `${slug}-1440.webp`));
      await base.clone().resize({ width: 720 }).webp({ quality: 72 }).toFile(path.join(dir, `${slug}-720.webp`));
    }),
  );
  return files.length;
}

/** assets/gallery/<project>/<shot>.png → public/media/gallery/<project>-<shot>-<width>.webp */
async function gallery() {
  const from = path.join(SRC, "gallery");
  const dir = path.join(OUT, "gallery");
  await fresh(dir);
  let count = 0;
  let projectsDirs = [];
  try {
    projectsDirs = await readdir(from, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const project of projectsDirs.filter((d) => d.isDirectory())) {
    const files = (await readdir(path.join(from, project.name))).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
    await Promise.all(
      files.map(async (file) => {
        const name = `${project.name}-${path.parse(file).name}`;
        const base = sharp(path.join(from, project.name, file));
        await base.clone().resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 74 }).toFile(path.join(dir, `${name}-1440.webp`));
        await base.clone().resize({ width: 720, withoutEnlargement: true }).webp({ quality: 70 }).toFile(path.join(dir, `${name}-720.webp`));
      }),
    );
    count += files.length;
  }
  return count;
}

async function cv() {
  const dir = path.join(OUT, "cv");
  await fresh(dir);
  await copyFile(path.join(SRC, "Peter-Eshak-Abdo-CV.pdf"), path.join(dir, "Peter-Eshak-Abdo-CV.pdf"));
}

await portrait();
await icons();
const certs = await certifications();
const shots = await projects();
const galleryShots = await gallery();
await cv();
console.log(`✓ portrait, ${certs} certificates, ${shots} project screenshots, ${galleryShots} gallery shots, CV`);
