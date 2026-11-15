import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GitHubIcon } from "@/components/icons";
import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { CodeBlock } from "@/components/projects/code-block";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectVisual } from "@/components/projects/project-visual";
import { Chip, RiseHeading } from "@/components/ui/bits";
import { ButtonAnchor } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { TypedCommand } from "@/components/ui/typed-command";
import { getProject, projectsWithPages } from "@/content";
import { getDictionary } from "@/i18n";
import { href, isLocale, locales, tr } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => projectsWithPages.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) return {};
  return pageMetadata({ locale, path: `/projects/${slug}`, title: tr(project.title, locale), description: tr(project.tagline, locale) });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="label-mono mb-5">{children}</h2>;
}

export default async function ProjectPage({ params }: Params) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project || project.category === "teaching") notFound();
  const dict = getDictionary(locale);
  const t = dict.projects;
  const cs = project.caseStudy;

  const index = projectsWithPages.findIndex((p) => p.slug === slug);
  const next = projectsWithPages[(index + 1) % projectsWithPages.length];

  return (
    <article data-tone={project.accent} className="container-page pt-28 sm:pt-36">
      <Link href={href(locale, "/projects")} className="group inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:translate-x-0.5" aria-hidden="true" />
        {dict.actions.backToProjects}
      </Link>

      <header className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <TypedCommand command={`open ./${project.slug}`} />
          <RiseHeading className="text-h1 font-semibold">{tr(project.title, locale)}</RiseHeading>
          <p className="max-w-2xl text-xl text-muted">{tr(project.tagline, locale)}</p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {project.links.live && (
              <ButtonAnchor href={project.links.live}>
                {dict.actions.liveSite}
                <ArrowUpRight size={16} className="rtl:-scale-x-100" aria-hidden="true" />
                <span className="sr-only">{dict.a11y.external}</span>
              </ButtonAnchor>
            )}
            {project.links.repo ? (
              <ButtonAnchor href={project.links.repo} variant="secondary">
                <GitHubIcon size={16} />
                {dict.actions.sourceCode}
              </ButtonAnchor>
            ) : (
              <span className="inline-flex h-11 items-center gap-2 rounded-full border border-dashed border-line px-4 text-sm text-subtle">
                <Lock size={14} aria-hidden="true" />
                {dict.actions.privateSource}
              </span>
            )}
          </div>
        </div>
        <dl className="grid grid-cols-2 content-start gap-x-6 gap-y-5 border-line lg:col-span-5 lg:border-s lg:ps-8">
          <div>
            <dt className="label-mono">{t.role}</dt>
            <dd className="mt-1 text-sm">{tr(project.role, locale)}</dd>
          </div>
          <div>
            <dt className="label-mono">{t.year}</dt>
            <dd className="mt-1 font-mono text-sm">{project.year}</dd>
          </div>
          <div className="col-span-2">
            <dt className="label-mono">{t.stack}</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </dd>
          </div>
        </dl>
      </header>

      {(project.image || project.slug === "ai-task-pipeline") && (
        <Reveal className="relative mt-14 overflow-hidden rounded-[1.75rem] border border-line bg-sunken p-4 sm:p-10 lg:p-14">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_0%,var(--tone-soft),transparent_70%)]" />
          <div className="relative mx-auto max-w-5xl">
            <ProjectVisual project={project} locale={locale} priority sizes="(min-width: 1024px) 1024px, 100vw" />
          </div>
        </Reveal>
      )}

      {project.metrics.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-4">
          {project.metrics.map((m) => (
            <div key={m.value + m.label.en} className="flex flex-col gap-1 bg-raised p-5">
              <dt className="order-2 text-sm text-muted">{tr(m.label, locale)}</dt>
              <dd className="order-1 font-display text-3xl font-semibold text-tone" dir="ltr">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <section className="mt-20 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel>{t.overview}</SectionLabel>
          <p className="text-lg leading-relaxed">{tr(project.summary, locale)}</p>
        </div>
        {project.highlights.length > 0 && (
          <div className="lg:col-span-7">
            <SectionLabel>{t.highlights}</SectionLabel>
            <ul className="flex flex-col">
              {project.highlights.map((h, i) => (
                <Reveal as="li" key={i} delay={i * 0.05} className="grid grid-cols-[2.5rem_1fr] gap-2 border-t border-line py-4 last:border-b">
                  <span className="font-mono text-xs text-tone" dir="ltr">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-muted">{tr(h, locale)}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </section>

      {project.gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="mt-20">
          <h2 id="gallery-title" className="label-mono mb-6">
            {t.gallery} <span className="text-tone">({project.gallery.length})</span>
          </h2>
          <ProjectGallery
            shots={project.gallery.map((g) => ({ src: `/media/gallery/${project.slug}-${g.name}`, caption: tr(g.caption, locale), device: g.device }))}
            labels={{ close: dict.a11y.close, previous: dict.a11y.previous, next: dict.a11y.next, open: dict.actions.openImage }}
          />
        </section>
      )}

      {cs && (
        <>
          <section className="mt-24 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel>{t.challenge}</SectionLabel>
              <p className="font-display text-h3 font-medium leading-snug">{tr(cs.challenge, locale)}</p>
            </div>
            <div className="lg:col-span-7">
              <SectionLabel>{t.approach}</SectionLabel>
              <ol className="grid gap-4 sm:grid-cols-2">
                {cs.approach.map((step, i) => (
                  <Reveal as="li" key={i} delay={i * 0.08} className={i === 0 && cs.approach.length % 2 === 1 ? "sm:col-span-2" : ""}>
                    <div className="surface h-full p-5">
                      <p className="font-mono text-xs text-tone" dir="ltr">
                        step {i + 1}
                      </p>
                      <h3 className="mt-2 font-semibold">{tr(step.title, locale)}</h3>
                      <p className="mt-2 text-sm text-muted">{tr(step.body, locale)}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </section>

          {cs.diagram && (
            <section className="mt-24">
              <SectionLabel>{t.architecture}</SectionLabel>
              <p className="mb-6 max-w-2xl text-muted">{t.architectureHint}</p>
              <ArchitectureDiagram id={cs.diagram} locale={locale} hint={t.architecture} />
            </section>
          )}

          {cs.snippets.length > 0 && (
            <section className="mt-24">
              <SectionLabel>{t.code}</SectionLabel>
              <div className="flex flex-col gap-6">
                {cs.snippets.map((s) => (
                  <CodeBlock key={s.file} snippet={s} locale={locale} />
                ))}
              </div>
            </section>
          )}

          <section className="mt-24 grid gap-4 md:grid-cols-2">
            <Reveal className="surface p-6 sm:p-8">
              <SectionLabel>{t.outcome}</SectionLabel>
              <p className="text-lg leading-relaxed">{tr(cs.outcome, locale)}</p>
            </Reveal>
            <Reveal delay={0.08} className="surface bg-tone-soft p-6 sm:p-8">
              <SectionLabel>{t.learned}</SectionLabel>
              <p className="text-lg leading-relaxed">{tr(cs.learned, locale)}</p>
            </Reveal>
          </section>
        </>
      )}

      {next && next.slug !== project.slug && (
        <nav aria-label={t.next} className="mt-24 border-t border-line pt-10">
          <Link href={href(locale, `/projects/${next.slug}`)} data-tone={next.accent} className="group flex flex-col gap-2">
            <span className="label-mono">{t.next} →</span>
            <span className="flex items-center justify-between gap-4">
              <span className="text-h2 font-semibold transition-colors group-hover:text-tone">{tr(next.title, locale)}</span>
              <ArrowUpRight size={28} className="shrink-0 text-subtle transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-tone rtl:-scale-x-100" aria-hidden="true" />
            </span>
            <span className="text-muted">{tr(next.tagline, locale)}</span>
          </Link>
        </nav>
      )}
    </article>
  );
}
