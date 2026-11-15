# Peter Eshak Abdo — Portfolio

Personal portfolio of Peter Eshak Abdo, a full-stack web developer from Ismailia, Egypt. It's a static, bilingual site (English / Arabic with RTL) built with Next.js 16 and deployed to Firebase Hosting.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, `output: "export"` → fully static) |
| Styling | Tailwind CSS v4, OKLCH design tokens in `src/app/globals.css` (light + dark) |
| Motion | Motion (`motion/react`, lazy-loaded features), CSS keyframes for above-the-fold, SVG SMIL in diagrams |
| Content | Typed TS files in `src/content`, validated with zod at build time |
| i18n | `/en` and `/ar` routes, dictionaries in `src/i18n`, logical CSS properties for RTL |
| Code highlighting | Shiki at build time (no client JS) |
| Command palette | cmdk, loaded on first open |
| Hosting | Firebase Hosting with CSP, HSTS and caching headers (`firebase.json`) |

## Signature details

- **Pipeline rail**: the home page reads like a CI run. Each section is a stage that goes pending → running → passed as you scroll.
- **Tech orbit**: a draggable 2.5D orbit around the portrait with inertia. It pauses off-screen and stays static with reduced motion.
- **Stacking work cards**: featured projects pin and recede in depth.
- **Interactive architecture diagrams** on case studies, with scenario tabs and packets travelling along the data path.
- **⌘/Ctrl + K command palette**: navigation, projects, theme, language, copy email and CV.
- **Theme switch** that spreads from the button (View Transitions API).
- **Live status**: local time in Ismailia, plus the latest public GitHub push, refreshed by a daily CI rebuild.

## Project structure

```
src/
  app/
    (root)/           "/" language gate (saved choice → browser language → English)
    [locale]/         every page, generated for en + ar
    global-not-found  bilingual 404 (served as /404.html)
    sitemap.ts, robots.ts, manifest.ts, icon.svg
  components/         home/, projects/, certs/, layout/, palette/, ui/
  content/            profile, projects, skills, journey, certifications (+ zod schema)
  i18n/               en.ts / ar.ts UI strings
  lib/                i18n helpers, metadata, GitHub activity, image loader
assets/               original images + CV PDF (source of truth)
public/media/         generated WebP variants (commit after `npm run images`)
scripts/              optimize-images.mjs, postbuild.mjs
```

## Editing content

All text lives in `src/content/*.ts`, with every string in both `en` and `ar`. A missing translation, a malformed URL or a duplicate slug fails the build with a readable error.

- **New project**: add an entry to `src/content/projects.ts`. For a screenshot, drop `assets/projects/<slug>.png` and run `npm run images`.
- **Project gallery**: drop extra screenshots in `assets/gallery/<project-slug>/<name>.png`, list them in the project's `gallery` (add `device: "mobile"` for phone shots), then run `npm run images`. The build fails if a listed image is missing.
- **New certificate**: add `assets/certifications/<slug>.jpg`, add an entry to `certifications.ts`, then run `npm run images`.
- **New CV**: replace `assets/Peter-Eshak-Abdo-CV.pdf`, then run `npm run images`.

## Scripts

```bash
npm run dev        # local dev server
npm run images     # regenerate /public/media from /assets
npm run check      # lint + typecheck + production build (→ out/)
npm run start      # serve out/ locally
npm run deploy     # check + firebase deploy (needs `firebase login`)
```

CI (`.github/workflows`) runs lint, typecheck and build on every PR and deploys a preview channel. Pushes to `main` deploy live, and a daily scheduled run refreshes the GitHub activity indicator.

## Hosting

The site is served from the Firebase Hosting site **`peter-eshak`** (https://peter-eshak.web.app). The old site `tofa7a-5e936.web.app` only 301-redirects every path to the new domain (`hosting-redirect/`). Both sites live in the Firebase project `tofa7a-5e936`. Firebase project IDs can't be renamed, but this one never appears publicly.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (default `https://peter-eshak.web.app`) |
| `GITHUB_TOKEN` | Optional at build time; raises the GitHub API rate limit for the activity indicator |
