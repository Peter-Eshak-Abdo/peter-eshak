import { ArrowDown, Download } from "lucide-react";
import type { Profile } from "@/content/schema";
import type { Dictionary } from "@/i18n";
import type { GitHubActivity } from "@/lib/github";
import { tr, type Locale } from "@/lib/i18n";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { Magnetic } from "@/components/ui/magnetic";
import { TypedCommand } from "@/components/ui/typed-command";
import { LiveStatus } from "./live-status";
import { Orbit, type OrbitItem } from "./orbit";

const inner: OrbitItem[] = [
  { label: "Next.js", tone: "mint" },
  { label: "React", tone: "sky" },
  { label: "TypeScript", tone: "sky" },
  { label: "Tailwind", tone: "mint" },
  { label: "Angular", tone: "apricot" },
  { label: "PWA", tone: "lavender" },
];
const outer: OrbitItem[] = [
  { label: "Node.js", tone: "mint" },
  { label: "Supabase", tone: "mint" },
  { label: "Socket.io", tone: "lavender" },
  { label: "Firebase", tone: "apricot" },
  { label: "PostgreSQL", tone: "sky" },
  { label: "MongoDB", tone: "mint" },
  { label: "Gemini", tone: "lavender" },
];

export function Hero({ locale, dict, profile, activity }: { locale: Locale; dict: Dictionary; profile: Profile; activity: GitHubActivity | null }) {
  const [first, ...rest] = tr(profile.name, locale).split(" ");

  return (
    <section id="hello" aria-labelledby="hero-title" className="container-page relative pb-10 pt-28 sm:pt-32 lg:pt-36">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-7 lg:col-span-7" data-tone="mint">
          <TypedCommand command="whoami" />
          <h1 id="hero-title" className="text-display font-semibold">
            <span className="sr-only">{dict.home.kicker} </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block animate-rise" style={{ animationDelay: "60ms" }}>
                {first}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] text-muted">
              <span className="block animate-rise" style={{ animationDelay: "160ms" }}>
              {rest.join(" ")}
              <span className="text-accent">.</span>
              </span>
            </span>
          </h1>
          <div className="flex max-w-xl animate-fade-up flex-col gap-4" style={{ animationDelay: "300ms" }}>
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-raised px-3 py-1.5 font-mono text-xs text-muted">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {tr(profile.role, locale)}
            </p>
            <p className="text-xl leading-snug text-fg sm:text-2xl">{tr(profile.headline, locale)}</p>
            <p className="text-muted">{tr(profile.intro, locale)}</p>
          </div>
          <div className="flex animate-fade-up flex-wrap items-center gap-3" style={{ animationDelay: "400ms" }}>
            <Magnetic>
              <ButtonLink href="#work" size="lg">
                {dict.home.featuredTitle}
                <ArrowDown size={17} className="transition-transform duration-300 group-hover/btn:translate-y-0.5" aria-hidden="true" />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonAnchor href={profile.cvPdf} variant="secondary" size="lg" download>
                <Download size={16} aria-hidden="true" />
                {dict.actions.downloadCv}
              </ButtonAnchor>
            </Magnetic>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "500ms" }}>
            <LiveStatus
              locale={locale}
              timezone={profile.timezone}
              place={tr(profile.location, locale)}
              availability={tr(profile.availability.label, locale)}
              activity={activity}
              labels={{ localTime: dict.status.localTime, lastPush: dict.status.lastPush }}
            />
          </div>
        </div>
        <div className="animate-fade-up lg:col-span-5" style={{ animationDelay: "200ms" }}>
          <Orbit inner={inner} outer={outer} portrait={profile.portrait.src} alt={tr(profile.portrait.alt, locale)} hint={dict.actions.dragToSpin} />
        </div>
      </div>

      <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line lg:grid-cols-4">
        {profile.stats.map((stat) => (
          <div key={stat.value} className="flex flex-col gap-1 bg-raised p-5 sm:p-6">
            <dt className="order-2 text-sm text-muted">{tr(stat.label, locale)}</dt>
            <dd className="order-1 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              <CountUp value={stat.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
