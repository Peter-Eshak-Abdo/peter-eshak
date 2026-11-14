import type { MetadataRoute } from "next";
import { projectsWithPages } from "@/content";
import { href, locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/projects", "/about", "/skills", "/certifications", "/cv", ...projectsWithPages.map((p) => `/projects/${p.slug}`)];
  const lastModified = new Date();

  return paths.map((path) => ({
    url: `${SITE_URL}${href("en", path)}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/projects/") ? 0.7 : 0.8,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}${href(l, path)}`])) },
  }));
}
