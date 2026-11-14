import type { Metadata } from "next";
import { Download } from "lucide-react";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ButtonAnchor } from "@/components/ui/button";
import { PrintButton } from "@/components/ui/print-button";
import { TypedCommand } from "@/components/ui/typed-command";
import { certifications, featuredProjects, journey, profile, skills } from "@/content";
import { getDictionary } from "@/i18n";
import { formatMonth, isLocale, tr, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/cv", title: dict.cv.title, description: dict.cv.intro });
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line pt-6 sm:grid-cols-[10rem_1fr] print:break-inside-avoid-page">
      <h2 className="label-mono pt-1">{title}</h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function range(start: string, end: string | undefined, locale: Locale, present: string) {
  if (!end) return formatMonth(start, locale);
  return `${formatMonth(start, locale)} — ${end === "present" ? present : formatMonth(end, locale)}`;
}

export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const work = journey.filter((j) => j.kind === "work");
  const study = journey.filter((j) => j.kind === "education" || j.kind === "course");

  return (
    <div className="container-page pt-32 sm:pt-40 print:p-0">
      <div className="no-print mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end" data-tone="sky">
        <div className="flex flex-col gap-3">
          <TypedCommand command="lp ./cv.pdf" />
          <h1 className="text-h1 font-semibold">{dict.cv.title}</h1>
          <p className="max-w-xl text-muted">{dict.cv.intro}</p>
        </div>
        <div className="flex gap-2">
          <PrintButton label={dict.actions.print} />
          <ButtonAnchor href={profile.cvPdf} download>
            <Download size={16} aria-hidden="true" />
            {dict.actions.downloadCv}
          </ButtonAnchor>
        </div>
      </div>

      <article className="surface mx-auto flex max-w-4xl flex-col gap-8 p-6 sm:p-12 print:max-w-none print:border-0 print:p-0 print:shadow-none">
        <header className="flex flex-col gap-2">
          <p className="font-display text-4xl font-semibold tracking-tight">{tr(profile.name, locale)}</p>
          <p className="text-lg text-muted">
            {tr(profile.role, locale)} · {tr(profile.location, locale)}
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted" dir="ltr">
            <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
            {profile.contact.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`}>
                {p.display}
              </a>
            ))}
            <a href={profile.socials.github}>{profile.socials.github.replace("https://", "")}</a>
            <a href={profile.socials.linkedin}>{profile.socials.linkedin.replace("https://www.", "")}</a>
            <a href={SITE_URL}>{SITE_URL.replace("https://", "")}</a>
          </p>
        </header>

        <p className="leading-relaxed">{tr(profile.bio[0] ?? profile.intro, locale)}</p>

        <Block title={dict.cv.experience}>
          {work.map((w) => (
            <div key={w.id} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">
                  {tr(w.title, locale)} <span className="font-normal text-muted">· {tr(w.org, locale)}</span>
                </h3>
                <span className="font-mono text-xs text-subtle">{range(w.start, w.end, locale, dict.about.present)}</span>
              </div>
              <ul className="flex list-disc flex-col gap-1 ps-5 text-sm text-muted marker:text-line-strong">
                {w.points.map((p) => (
                  <li key={p.en}>{tr(p, locale)}</li>
                ))}
              </ul>
            </div>
          ))}
        </Block>

        <Block title={dict.cv.projects}>
          {featuredProjects.map((p) => (
            <div key={p.slug} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold">{tr(p.title, locale)}</h3>
                <span className="font-mono text-xs text-subtle" dir="ltr">
                  {p.links.live?.replace("https://", "") ?? p.links.repo?.replace("https://", "")}
                </span>
              </div>
              <p className="font-mono text-xs text-subtle" dir="ltr">
                {p.stack.slice(0, 7).join(" · ")}
              </p>
              <ul className="flex list-disc flex-col gap-1 ps-5 text-sm text-muted marker:text-line-strong">
                {p.highlights.slice(0, 3).map((h) => (
                  <li key={h.en}>{tr(h, locale)}</li>
                ))}
              </ul>
            </div>
          ))}
        </Block>

        <Block title={dict.cv.skills}>
          <dl className="grid gap-2 text-sm">
            {skills.map((g) => (
              <div key={g.id} className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                <dt className="font-medium">{tr(g.title, locale)}</dt>
                <dd className="text-muted">{g.items.map((i) => i.name).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title={dict.cv.education}>
          {study.map((s) => (
            <div key={s.id} className="flex flex-wrap items-baseline justify-between gap-2">
              <p>
                <span className="font-semibold">{tr(s.title, locale)}</span>
                <span className="text-muted"> · {tr(s.org, locale)}</span>
              </p>
              <span className="font-mono text-xs text-subtle">{range(s.start, s.end, locale, dict.about.present)}</span>
            </div>
          ))}
        </Block>

        <Block title={dict.certifications.title}>
          <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
            {certifications
              .filter((c) => c.featured)
              .map((c) => (
                <li key={c.slug}>
                  <span className="font-medium">{tr(c.title, locale)}</span>
                  <span className="text-muted"> · {c.issuer}, {formatMonth(c.date, locale)}</span>
                </li>
              ))}
          </ul>
        </Block>

        <Block title={dict.about.languages}>
          <p className="text-sm">
            {profile.spokenLanguages.map((l) => `${tr(l.name, locale)} — ${tr(l.level, locale)}`).join(" · ")}
          </p>
        </Block>
      </article>
    </div>
  );
}
