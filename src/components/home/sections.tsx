import { ArrowUpRight, Briefcase, GraduationCap, Languages, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import type { JourneyEntry, Profile, SkillGroup } from "@/content/schema";
import type { Dictionary } from "@/i18n";
import { formatMonth, href, tr, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Chip, SectionHeading, StatusDot } from "@/components/ui/bits";
import { CopyButton } from "@/components/ui/copy-button";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { SpotlightGroup } from "@/components/ui/spotlight-group";

const cell = "spotlight surface flex flex-col gap-4 p-6";

function MoreLink({ to, label, context }: { to: string; label: string; context: string }) {
  return (
    <Link href={to} className="group inline-flex items-center gap-1.5 text-sm font-medium text-fg">
      <span className="underline decoration-line-strong underline-offset-4 transition-colors group-hover:decoration-accent">
        {label}
        <span className="sr-only"> — {context}</span>
      </span>
      <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
    </Link>
  );
}

/* ───────────────────────────── About (bento) ───────────────────────────── */
export function AboutBento({ locale, dict, profile, journey }: { locale: Locale; dict: Dictionary; profile: Profile; journey: JourneyEntry[] }) {
  const job = journey.find((j) => j.kind === "work" && j.end === "present");
  const school = journey.find((j) => j.kind === "education");
  const courses = journey.filter((j) => j.kind === "course");

  return (
    <section id="about" aria-labelledby="about-title" className="container-page scroll-mt-24 py-24 sm:py-32">
      <SectionHeading command="cat about.md" title={dict.home.aboutTitle} id="about-title" tone="apricot" />
      <SpotlightGroup className="mt-12">
        <Stagger className="grid gap-4 md:grid-cols-6">
          <StaggerItem className="md:col-span-4 md:row-span-2">
            <div className={cn(cell, "h-full justify-between gap-8 sm:p-8")} data-tone="apricot">
              <div className="flex flex-col gap-4 text-lg leading-relaxed">
                {profile.bio.slice(0, 2).map((p, i) => (
                  <p key={i} className={i === 0 ? "text-fg" : "text-muted"}>
                    {tr(p, locale)}
                  </p>
                ))}
              </div>
              <MoreLink to={href(locale, "/about")} label={dict.home.morePage} context={dict.nav.about} />
            </div>
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <div className={cn(cell, "h-full")} data-tone="mint">
              <span className="flex items-center gap-2 text-sm font-medium">
                <StatusDot /> {tr(profile.availability.label, locale)}
              </span>
              <p className="text-sm text-muted">{tr(profile.availability.detail, locale)}</p>
              <ul className="mt-auto flex flex-col gap-1.5">
                {profile.availability.roles.map((r) => (
                  <li key={r.en} className="font-mono text-xs text-subtle" dir="ltr">
                    <span className="text-tone">→</span> {tr(r, locale)}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>

          {job && (
            <StaggerItem className="md:col-span-2">
              <div className={cn(cell, "h-full")} data-tone="sky">
                <Briefcase size={18} className="text-tone" aria-hidden="true" />
                <div>
                  <p className="font-medium">{tr(job.title, locale)}</p>
                  <p className="text-sm text-muted">{tr(job.org, locale)}</p>
                </div>
                <p className="mt-auto font-mono text-xs text-subtle">
                  {formatMonth(job.start, locale)} — {dict.about.present}
                </p>
              </div>
            </StaggerItem>
          )}

          {school && (
            <StaggerItem className="md:col-span-3">
              <div className={cn(cell, "h-full")} data-tone="lavender">
                <GraduationCap size={18} className="text-tone" aria-hidden="true" />
                <div>
                  <p className="font-medium">{tr(school.title, locale)}</p>
                  <p className="text-sm text-muted">
                    {tr(school.org, locale)} · {school.start}–{school.end}
                  </p>
                </div>
                <ul className="mt-auto flex flex-wrap gap-1.5">
                  {courses.map((c) => (
                    <li key={c.id}>
                      <Chip>{tr(c.org, "en").split(" — ")[0]} · {tr(c.title, locale)}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          )}

          <StaggerItem className="md:col-span-3">
            <div className={cn(cell, "h-full")} data-tone="apricot">
              <div className="flex items-center justify-between">
                <Languages size={18} className="text-tone" aria-hidden="true" />
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <MapPin size={14} aria-hidden="true" /> {tr(profile.location, locale)}
                </span>
              </div>
              <ul className="mt-auto grid grid-cols-2 gap-4">
                {profile.spokenLanguages.map((l) => (
                  <li key={l.name.en} className="flex flex-col">
                    <span className="font-display text-xl font-semibold">{tr(l.name, locale)}</span>
                    <span className="text-sm text-muted">{tr(l.level, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        </Stagger>
      </SpotlightGroup>
    </section>
  );
}

/* ───────────────────────────── Stack preview ───────────────────────────── */
const levelDots = { daily: 3, solid: 2, familiar: 1 } as const;

export function StackPreview({ locale, dict, skills }: { locale: Locale; dict: Dictionary; skills: SkillGroup[] }) {
  return (
    <section id="stack" aria-labelledby="stack-title" className="container-page scroll-mt-24 py-24 sm:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading command="npm ls --depth=0" title={dict.home.stackTitle} intro={dict.home.stackIntro} id="stack-title" tone="lavender" />
        <MoreLink to={href(locale, "/skills")} label={dict.home.morePage} context={dict.nav.skills} />
      </div>
      <SpotlightGroup className="mt-12">
        <Stagger className="grid gap-4 md:grid-cols-2">
          {skills.map((group, gi) => (
            <StaggerItem key={group.id} className={gi === 0 ? "md:row-span-2" : ""}>
              <div className={cn(cell, "h-full")} data-tone={group.accent}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-h3 font-semibold">{tr(group.title, locale)}</h3>
                  <span className="font-mono text-xs text-subtle" dir="ltr">
                    {group.items.length} pkgs
                  </span>
                </div>
                <p className="text-sm text-muted">{tr(group.description, locale)}</p>
                <ul className={cn("mt-2 grid gap-x-6 gap-y-2.5", gi === 0 ? "sm:grid-cols-2" : "grid-cols-2")}>
                  {group.items.map((item) => (
                    <li key={item.name} className="flex items-center justify-between gap-3 border-b border-dashed border-line pb-2 text-sm">
                      <span>{item.name}</span>
                      <span role="img" className="flex gap-0.5" aria-label={dict.skills.levels[item.level]} title={dict.skills.levels[item.level]}>
                        {[0, 1, 2].map((d) => (
                          <span key={d} className={cn("h-1.5 w-3 rounded-full", d < levelDots[item.level] ? "bg-tone" : "bg-line")} />
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </SpotlightGroup>
    </section>
  );
}

/* ───────────────────────────── Journey preview (git log) ───────────────────────────── */
const kindTone = { work: "sky", education: "lavender", course: "apricot", milestone: "mint" } as const;

function shortHash(id: string) {
  let h = 2166136261;
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

export function JourneyPreview({ locale, dict, journey }: { locale: Locale; dict: Dictionary; journey: JourneyEntry[] }) {
  return (
    <section id="journey" aria-labelledby="journey-title" className="container-page scroll-mt-24 py-24 sm:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading command="git log --graph --oneline" title={dict.home.journeyTitle} id="journey-title" tone="sky" />
        <MoreLink to={href(locale, "/about#journey")} label={dict.home.morePage} context={dict.home.journeyTitle} />
      </div>
      <ol className="relative mt-12 flex flex-col">
        <span aria-hidden="true" className="absolute bottom-3 start-[7px] top-3 w-px bg-gradient-to-b from-line-strong via-line to-transparent" />
        {journey.map((entry, i) => (
          <Reveal as="li" key={entry.id} delay={Math.min(i * 0.05, 0.3)} className="relative grid gap-x-6 gap-y-1 py-4 ps-8 md:grid-cols-[10rem_1fr]">
            <span data-tone={kindTone[entry.kind]} aria-hidden="true" className="absolute start-0 top-[1.45rem] grid size-[15px] place-items-center rounded-full border border-tone bg-bg">
              <span className="size-[7px] rounded-full bg-tone" />
            </span>
            <div className="flex items-center gap-3 font-mono text-xs text-subtle md:flex-col md:items-start md:gap-1 md:pt-1" dir="ltr">
              <span className="text-apricot">{shortHash(entry.id)}</span>
              <span>
                {formatMonth(entry.start, "en")}
                {entry.end && ` → ${entry.end === "present" ? "now" : formatMonth(entry.end, "en")}`}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="flex flex-wrap items-baseline gap-x-2 font-medium">
                <span data-tone={kindTone[entry.kind]} className="font-mono text-[0.7rem] uppercase text-tone">
                  {dict.about.kinds[entry.kind]}
                </span>
                {tr(entry.title, locale)}
              </p>
              <p className="text-sm text-muted">{tr(entry.org, locale)}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ───────────────────────────── Contact ───────────────────────────── */
export function ContactSection({ locale, dict, profile }: { locale: Locale; dict: Dictionary; profile: Profile }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="container-page scroll-mt-24 py-24 sm:py-32">
      <Reveal className="relative overflow-hidden rounded-[2rem] border border-line bg-raised p-6 shadow-[var(--shadow)] sm:p-12 lg:p-16">
        <div aria-hidden="true" className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)] rtl:[mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]" />
        <div aria-hidden="true" className="absolute -end-24 -top-24 size-72 rounded-full bg-mint opacity-20 blur-3xl" />
        <div className="relative flex flex-col gap-10">
          <SectionHeading command="./contact.sh" title={dict.home.contactTitle} intro={dict.home.contactBody} id="contact-title" tone="mint" />
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <CopyButton value={profile.contact.email} label={profile.contact.email} copiedLabel={dict.actions.copied} variant="primary" size="lg" />
            </Magnetic>
            <Magnetic>
              <ButtonAnchor href={profile.contact.whatsapp} variant="secondary" size="lg">
                <MessageCircle size={17} aria-hidden="true" />
                {dict.actions.whatsapp}
              </ButtonAnchor>
            </Magnetic>
            <ButtonAnchor href={`mailto:${profile.contact.email}`} variant="ghost" size="lg">
              <Mail size={17} aria-hidden="true" />
              {dict.actions.sendEmail}
            </ButtonAnchor>
          </div>
          <div className="flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {profile.contact.phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`} className="inline-flex items-center gap-2 font-mono hover:text-fg" dir="ltr">
                    <Phone size={14} aria-hidden="true" />
                    {p.display}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              <ButtonAnchor href={profile.socials.github} variant="secondary" size="sm" aria-label="GitHub">
                <GitHubIcon size={15} /> GitHub
              </ButtonAnchor>
              <ButtonAnchor href={profile.socials.linkedin} variant="secondary" size="sm" aria-label="LinkedIn">
                <LinkedInIcon size={14} /> LinkedIn
              </ButtonAnchor>
              <ButtonLink href={href(locale, "/cv")} variant="secondary" size="sm">
                {dict.nav.cv}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
