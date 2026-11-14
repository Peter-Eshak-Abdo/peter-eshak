import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightGroup } from "@/components/ui/spotlight-group";
import { skills } from "@/content";
import { getDictionary } from "@/i18n";
import { isLocale, tr } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/cn";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/skills", title: dict.skills.title, description: dict.skills.intro });
}

const levels = ["daily", "solid", "familiar"] as const;
const filled = { daily: 3, solid: 2, familiar: 1 } as const;

function LevelBar({ level, label }: { level: (typeof levels)[number]; label: string }) {
  return (
    <span className="flex items-center gap-2" title={label}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[0, 1, 2].map((d) => (
          <span key={d} className={cn("h-1.5 w-4 rounded-full", d < filled[level] ? "bg-tone" : "bg-line")} />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default async function SkillsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="container-page pt-32 sm:pt-40">
      <SectionHeading as="h1" command="cat package.json | jq .dependencies" title={dict.skills.title} intro={dict.skills.intro} tone="lavender" />

      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted" data-tone="mint">
        {levels.map((l) => (
          <li key={l} className="flex items-center gap-2">
            <LevelBar level={l} label={dict.skills.levels[l]} />
            <span aria-hidden="true">{dict.skills.levels[l]}</span>
          </li>
        ))}
      </ul>

      <SpotlightGroup className="mt-12 grid gap-4 lg:grid-cols-2">
        {skills.map((group, gi) => (
          <Reveal key={group.id} delay={gi * 0.06}>
            <section data-tone={group.accent} aria-labelledby={`g-${group.id}`} className="spotlight surface flex h-full flex-col gap-5 p-6 sm:p-8">
              <header className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 id={`g-${group.id}`} className="text-h3 font-semibold">
                    {tr(group.title, locale)}
                  </h2>
                  <span className="font-mono text-xs text-subtle" dir="ltr">
                    {group.items.length} pkgs
                  </span>
                </div>
                <p className="text-sm text-muted">{tr(group.description, locale)}</p>
              </header>
              <table className="w-full text-sm">
                <tbody>
                  {group.items.map((item) => (
                    <tr key={item.name} className="border-t border-dashed border-line">
                      <th scope="row" className="py-2.5 text-start font-medium">
                        {item.name}
                      </th>
                      <td className="py-2.5 font-mono text-xs text-subtle">{item.since ? `${dict.skills.since} ${item.since}` : ""}</td>
                      <td className="py-2.5">
                        <div className="flex justify-end">
                          <LevelBar level={item.level} label={dict.skills.levels[item.level]} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </Reveal>
        ))}
      </SpotlightGroup>
    </div>
  );
}
