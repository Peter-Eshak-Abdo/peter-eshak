import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SectionHeading, StatusDot, Chip } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { journey, profile } from "@/content";
import { getDictionary } from "@/i18n";
import { formatMonth, isLocale, tr } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/cn";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/about", title: dict.about.title, description: dict.about.intro });
}

const kindTone = { work: "sky", education: "lavender", course: "apricot", milestone: "mint" } as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="container-page pt-32 sm:pt-40">
      <SectionHeading as="h1" command="cat ~/about.md" title={dict.about.title} intro={dict.about.intro} tone="apricot" />

      <section aria-labelledby="story" className="mt-14 grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-line bg-sunken shadow-[var(--shadow)] lg:sticky lg:top-28">
            <Image src={profile.portrait.src} alt={tr(profile.portrait.alt, locale)} fill priority sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <div className="flex flex-col gap-10 lg:col-span-8">
          <div>
            <h2 id="story" className="label-mono mb-5">
              {dict.about.story}
            </h2>
            <div className="flex flex-col gap-5 text-lg leading-relaxed">
              {profile.bio.map((p, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className={i === 0 ? "text-fg" : "text-muted"}>{tr(p, locale)}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface flex flex-col gap-3 p-6" data-tone="mint">
              <h2 className="label-mono">{dict.about.availability}</h2>
              <p className="flex items-center gap-2 font-medium">
                <StatusDot /> {tr(profile.availability.label, locale)}
              </p>
              <p className="text-sm text-muted">{tr(profile.availability.detail, locale)}</p>
            </div>
            <div className="surface flex flex-col gap-3 p-6">
              <h2 className="label-mono">{dict.about.languages}</h2>
              <ul className="flex flex-col gap-2">
                {profile.spokenLanguages.map((l) => (
                  <li key={l.name.en} className="flex items-baseline justify-between gap-3">
                    <span className="font-medium">{tr(l.name, locale)}</span>
                    <span className="text-sm text-muted">{tr(l.level, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="label-mono mb-4">{dict.about.softSkills}</h2>
            <ul className="flex flex-wrap gap-2">
              {profile.softSkills.map((s) => (
                <li key={s.en}>
                  <span className="inline-flex rounded-full border border-line bg-raised px-3.5 py-1.5 text-sm text-muted">{tr(s, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="journey" aria-labelledby="journey-title" className="mt-28 scroll-mt-28">
        <SectionHeading command="git log --reverse --stat" title={dict.about.journey} id="journey-title" tone="sky" />
        <ol className="relative mt-12">
          <span aria-hidden="true" className="absolute bottom-0 start-[7px] top-2 w-px bg-line md:start-[calc(12rem+7px)]" />
          {journey.map((entry, i) => (
            <Reveal as="li" key={entry.id} delay={Math.min(i * 0.04, 0.2)} className="relative grid gap-3 pb-12 ps-8 md:grid-cols-[12rem_1fr] md:gap-10 md:ps-0">
              <div className="flex flex-col gap-1 md:pt-0.5 md:text-end">
                <span className="font-mono text-sm">
                  {formatMonth(entry.start, locale)}
                  {entry.end && ` — ${entry.end === "present" ? dict.about.present : formatMonth(entry.end, locale)}`}
                </span>
                <span data-tone={kindTone[entry.kind]} className="label-mono text-tone">
                  {dict.about.kinds[entry.kind]}
                </span>
              </div>
              <span
                data-tone={kindTone[entry.kind]}
                aria-hidden="true"
                className="absolute start-0 top-1 grid size-[15px] place-items-center rounded-full border border-tone bg-bg md:start-[12rem]"
              >
                <span className="size-[7px] rounded-full bg-tone" />
              </span>
              <div className={cn("flex flex-col gap-3 md:ps-10")}>
                <div>
                  <h3 className="text-h3 font-semibold">{tr(entry.title, locale)}</h3>
                  <p className="text-muted">
                    {tr(entry.org, locale)}
                    {entry.place && <span className="text-subtle"> · {tr(entry.place, locale)}</span>}
                  </p>
                </div>
                <ul className="flex flex-col gap-2">
                  {entry.points.map((p) => (
                    <li key={p.en} className="flex gap-3 text-muted">
                      <span className="mt-2.5 size-1 shrink-0 rounded-full bg-line-strong" aria-hidden="true" />
                      {tr(p, locale)}
                    </li>
                  ))}
                </ul>
                {entry.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <li key={tag}>
                        <Chip>{tag}</Chip>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </section>
    </div>
  );
}
