import type { Metadata } from "next";
import { getDictionary } from "@/i18n";
import { href, locales, type Locale } from "./i18n";
import { SITE_URL } from "./site";

/** Per-page metadata with canonical + hreflang alternates for both languages. */
export function pageMetadata({
  locale,
  path = "/",
  title,
  description,
}: {
  locale: Locale;
  path?: string;
  title?: string;
  description?: string;
}): Metadata {
  const dict = getDictionary(locale);
  const canonical = href(locale, path);
  const languages = Object.fromEntries(locales.map((l) => [l, href(l, path)])) as Record<Locale, string>;
  const desc = description ?? dict.meta.description;
  const fullTitle = title ? `${title} — ${dict.meta.siteTitle.split(" — ")[0]}` : dict.meta.siteTitle;

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical, languages: { ...languages, "x-default": href("en", path) } },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${canonical}`,
      title: fullTitle,
      description: desc,
      siteName: dict.meta.siteTitle,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_EG",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc },
  };
}
