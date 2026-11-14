export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** A string that exists in every supported locale. */
export type Localized = Record<Locale, string>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en";
}

/** Pick the right translation of a localized value. */
export function tr(value: Localized, locale: Locale): string {
  return value[locale];
}

/** Builds an internal href for a locale, e.g. href("ar", "/projects") → "/ar/projects". */
export function href(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Swaps the locale prefix of a pathname, keeping the rest of the route. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/");
  if (parts[1] && isLocale(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}

export function formatMonth(iso: string, locale: Locale): string {
  const [year, month] = iso.split("-").map(Number);
  if (!year) return iso;
  if (!month) return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", { useGrouping: false }).format(year);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", { month: "short", year: "numeric" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}
