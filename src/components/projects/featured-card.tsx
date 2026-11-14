import { ArrowUpRight, Lock } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/content/schema";
import type { Dictionary } from "@/i18n";
import { href, tr, type Locale } from "@/lib/i18n";
import { GitHubIcon } from "@/components/icons";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Chip } from "@/components/ui/bits";
import { ProjectVisual } from "./project-visual";

export function FeaturedCard({ project, index, total, locale, dict }: { project: Project; index: number; total: number; locale: Locale; dict: Dictionary }) {
  const page = href(locale, `/projects/${project.slug}`);

  return (
    <article
      data-tone={project.accent}
      aria-labelledby={`featured-${project.slug}`}
      className="spotlight group grid overflow-hidden rounded-[1.75rem] border border-line bg-raised shadow-[var(--shadow)] md:min-h-[min(74vh,620px)] md:grid-cols-12"
    >
      <div className="flex flex-col gap-6 p-6 sm:p-8 md:col-span-5 md:justify-between lg:p-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-subtle" dir="ltr">
              <span className="text-tone">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
            </span>
            <span className="label-mono">{project.year}</span>
          </div>
          <h3 id={`featured-${project.slug}`} className="text-h2 font-semibold">
            <Link href={page} className="after:absolute after:inset-0 after:z-0 md:after:hidden">
              {tr(project.title, locale)}
            </Link>
          </h3>
          <p className="text-muted">{tr(project.tagline, locale)}</p>
        </div>

        {project.metrics.length > 0 && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            {project.metrics.slice(0, 4).map((metric) => (
              <div key={metric.value + tr(metric.label, "en")} className="flex flex-col">
                <dt className="order-2 text-xs text-subtle">{tr(metric.label, locale)}</dt>
                <dd className="order-1 font-display text-2xl font-semibold text-tone" dir="ltr">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="relative z-10 flex flex-col gap-5">
          <ul className="flex flex-wrap gap-1.5" aria-label={dict.projects.stack}>
            {project.stack.slice(0, 6).map((tech) => (
              <li key={tech}>
                <Chip>{tech}</Chip>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink href={page} size="md">
              {project.caseStudy ? dict.actions.readCaseStudy : dict.actions.viewProject}
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
            </ButtonLink>
            {project.links.live && (
              <ButtonAnchor href={project.links.live} variant="ghost" size="md">
                {dict.actions.liveSite}
                <span className="sr-only"> {dict.a11y.external}</span>
              </ButtonAnchor>
            )}
            {project.links.repo ? (
              <ButtonAnchor href={project.links.repo} variant="ghost" size="md" aria-label={`${dict.actions.sourceCode} — GitHub`}>
                <GitHubIcon size={16} />
              </ButtonAnchor>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 text-xs text-subtle">
                <Lock size={13} aria-hidden="true" />
                {dict.actions.privateSource}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="relative flex items-center overflow-hidden border-t border-line bg-sunken p-5 sm:p-8 md:col-span-7 md:border-s md:border-t-0 lg:p-12">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(90%_80%_at_80%_10%,var(--tone-soft),transparent_70%)] rtl:bg-[radial-gradient(90%_80%_at_20%_10%,var(--tone-soft),transparent_70%)]" />
        <div aria-hidden="true" className="bg-dots absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative w-full transition-transform duration-700 ease-out-expo md:group-hover:scale-[1.01]">
          <ProjectVisual project={project} locale={locale} sizes="(min-width: 768px) 55vw, 100vw" />
        </div>
      </div>
    </article>
  );
}
