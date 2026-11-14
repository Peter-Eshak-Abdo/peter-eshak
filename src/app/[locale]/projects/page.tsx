import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectExplorer, type ExplorerProject } from "@/components/projects/project-explorer";
import { SectionHeading } from "@/components/ui/bits";
import { projects } from "@/content";
import type { ProjectCategory } from "@/content/schema";
import { getDictionary } from "@/i18n";
import { href, isLocale, tr } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/projects", title: dict.projects.title, description: dict.projects.intro });
}

const order: ProjectCategory[] = ["product", "automation", "backend", "academic", "early", "teaching"];

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const sorted = [...projects].sort((a, b) => {
    const fa = a.featured ?? 99;
    const fb = b.featured ?? 99;
    if (fa !== fb) return fa - fb;
    return order.indexOf(a.category) - order.indexOf(b.category);
  });

  const items: ExplorerProject[] = sorted.map((p) => ({
    slug: p.slug,
    href: href(locale, `/projects/${p.slug}`),
    // Teaching content has no detail page — link straight to it.
    external: p.category === "teaching" ? p.links.live : undefined,
    title: tr(p.title, locale),
    tagline: tr(p.tagline, locale),
    category: p.category,
    status: dict.projects.status[p.status],
    statusKey: p.status,
    year: p.year,
    stack: p.stack,
    accent: p.accent,
    image: p.image ? { name: p.image.name, alt: tr(p.image.alt, locale) } : undefined,
    featured: p.featured !== undefined,
  }));

  const filters = (["all", ...order] as const).map((id) => ({ id, label: dict.projects.filters[id] }));

  return (
    <div className="container-page pt-32 sm:pt-40">
      <SectionHeading as="h1" command="ls -la ~/projects" title={dict.projects.title} intro={dict.projects.intro} tone="mint" />
      <div className="mt-12">
        <ProjectExplorer projects={items} filters={filters} countLabel={dict.projects.count} filterLabel={dict.projects.filterLabel} />
      </div>
    </div>
  );
}
