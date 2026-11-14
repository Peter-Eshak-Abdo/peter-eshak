import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PaletteProvider } from "@/components/palette/palette-provider";
import type { PaletteData } from "@/components/palette/types";
import { Providers } from "@/components/providers";
import { profile, projectsWithPages } from "@/content";
import { getDictionary } from "@/i18n";
import { fontVariables } from "@/lib/fonts";
import { dirOf, href, isLocale, locales, tr, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#141a24" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.siteTitle, template: `%s` },
    description: dict.meta.description,
    applicationName: tr(profile.name, "en"),
    authors: [{ name: tr(profile.name, "en"), url: SITE_URL }],
    creator: tr(profile.name, "en"),
    keywords: ["Peter Eshak Abdo", "full-stack developer", "Next.js", "TypeScript", "Node.js", "Supabase", "Egypt", "Ismailia", "portfolio"],
    formatDetection: { telephone: false, email: false, address: false },
  };
}

function buildPaletteData(locale: Locale): PaletteData {
  const dict = getDictionary(locale);
  const nav: PaletteData["navigation"] = [
    { id: "home", label: dict.nav.home, href: href(locale), hint: "~" },
    { id: "projects", label: dict.nav.projects, href: href(locale, "/projects"), hint: "01" },
    { id: "about", label: dict.nav.about, href: href(locale, "/about"), hint: "02" },
    { id: "skills", label: dict.nav.skills, href: href(locale, "/skills"), hint: "03" },
    { id: "certs", label: dict.nav.certifications, href: href(locale, "/certifications"), hint: "04" },
    { id: "cv", label: dict.nav.cv, href: href(locale, "/cv"), hint: "05" },
    { id: "contact", label: dict.nav.contact, href: `${href(locale)}#contact`, hint: "@" },
  ];
  return {
    locale,
    labels: {
      ...dict.palette,
      copyEmail: dict.actions.copyEmail,
      copied: dict.actions.copied,
      downloadCv: dict.actions.downloadCv,
      close: dict.a11y.close,
    },
    navigation: nav,
    projects: projectsWithPages.map((p) => ({
      id: p.slug,
      label: tr(p.title, locale),
      href: href(locale, `/projects/${p.slug}`),
      hint: p.stack.slice(0, 2).join(" · "),
      keywords: [...p.stack, tr(p.title, locale === "en" ? "ar" : "en")],
    })),
    external: [
      { id: "github", label: "GitHub", href: profile.socials.github, hint: "@Peter-Eshak-Abdo" },
      { id: "linkedin", label: "LinkedIn", href: profile.socials.linkedin },
      { id: "whatsapp", label: dict.actions.whatsapp, href: profile.contact.whatsapp },
      { id: "email", label: dict.actions.sendEmail, href: `mailto:${profile.contact.email}` },
    ],
    email: profile.contact.email,
    cvPdf: profile.cvPdf,
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const nav = [
    { href: href(locale, "/projects"), label: dict.nav.projects },
    { href: href(locale, "/about"), label: dict.nav.about },
    { href: href(locale, "/skills"), label: dict.nav.skills },
    { href: href(locale, "/certifications"), label: dict.nav.certifications },
    { href: href(locale, "/cv"), label: dict.nav.cv },
  ];

  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVariables} suppressHydrationWarning>
      <body>
        <noscript>
          {/* Without JS, scroll reveals never fire — show their content immediately instead. */}
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}[style*="translateY(105%)"]{transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="fixed start-3 top-3 z-[200] -translate-y-24 rounded-full bg-fg px-4 py-2 text-sm text-bg transition-transform focus:translate-y-0"
        >
          {dict.a11y.skip}
        </a>
        <Providers>
          <PaletteProvider data={buildPaletteData(locale)}>
            <div aria-hidden="true" className="bg-dots pointer-events-none fixed inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
            <Header
              locale={locale}
              name={tr(profile.name, locale)}
              nav={nav}
              labels={{
                search: dict.palette.hint,
                openMenu: dict.a11y.openMenu,
                closeMenu: dict.a11y.closeMenu,
                toggleTheme: dict.a11y.toggleTheme,
                switchLanguage: dict.language.switchTo,
                primary: dict.nav.primary,
                openPalette: dict.a11y.openPalette,
              }}
            />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <Footer locale={locale} dict={dict} profile={profile} />
          </PaletteProvider>
        </Providers>
      </body>
    </html>
  );
}
