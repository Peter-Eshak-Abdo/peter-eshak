/**
 * Canonical origin of the deployed site. Override with NEXT_PUBLIC_SITE_URL when the
 * site moves to a new Firebase Hosting site or a custom domain (see remaintodo.md).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://peter-eshak.web.app").replace(/\/$/, "");

export const GITHUB_USER = "Peter-Eshak-Abdo";
