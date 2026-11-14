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

async function portrait() {
  const dir = path.join(OUT, "portrait");
  await fresh(dir);
  // 4:5 crop centred on the upper body of the 1200×1600 original.
  const crop = { left: 190, top: 150, width: 900, height: 1125 };
  for (const width of [480, 900]) {
    await sharp(path.join(SRC, "portrait.jpg"))
      .extract(crop)
      .resize(width)
      .webp({ quality: 80 })
      .toFile(path.join(dir, `portrait-${width}.webp`));
  }
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
      await base.clone().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(dir, `${slug}.webp`));
      await base.clone().resize({ width: 560 }).webp({ quality: 70 }).toFile(path.join(dir, `${slug}-thumb.webp`));
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
      await base.clone().resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(dir, `${slug}.webp`));
      await base.clone().resize({ width: 720 }).webp({ quality: 72 }).toFile(path.join(dir, `${slug}-720.webp`));
    }),
  );
  return files.length;
}

async function cv() {
  const dir = path.join(OUT, "cv");
  await fresh(dir);
  await copyFile(path.join(SRC, "Peter-Eshak-Abdo-CV.pdf"), path.join(dir, "Peter-Eshak-Abdo-CV.pdf"));
}

await portrait();
const certs = await certifications();
const shots = await projects();
await cv();
console.log(`✓ portrait, ${certs} certificates, ${shots} project screenshots, CV`);
