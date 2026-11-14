import Link from "next/link";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import type { Dictionary } from "@/i18n";
import { href, tr, type Locale } from "@/lib/i18n";
import type { Profile } from "@/content/schema";

export function Footer({ locale, dict, profile }: { locale: Locale; dict: Dictionary; profile: Profile }) {
  const year = new Date().getFullYear();
  const links = [
    { href: href(locale, "/projects"), label: dict.nav.projects },
    { href: href(locale, "/about"), label: dict.nav.about },
    { href: href(locale, "/skills"), label: dict.nav.skills },
    { href: href(locale, "/certifications"), label: dict.nav.certifications },
    { href: href(locale, "/cv"), label: dict.nav.cv },
  ];

  return (
    <footer className="no-print mt-32 border-t border-line">
      <div className="container-page flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-sm flex-col gap-3">
          <span dir="ltr" className="font-mono text-sm text-subtle">
            <span className="text-accent">❯</span> exit 0
          </span>
          <p className="text-sm text-muted">{dict.footer.built}</p>
          <p className="text-xs text-subtle">
            © {year} {tr(profile.name, locale)}. {dict.footer.rights}
          </p>
        </div>
        <div className="flex flex-col gap-6 md:items-end">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition-colors hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg">
              <GitHubIcon size={16} />
            </a>
            <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg">
              <LinkedInIcon size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
