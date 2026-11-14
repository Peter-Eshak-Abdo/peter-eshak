"use client";

import { AnimatePresence, LayoutGroup, m } from "motion/react";
import { ArrowUpRight, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Accent, ProjectCategory } from "@/content/schema";
import { cn } from "@/lib/cn";
import { SpotlightGroup } from "@/components/ui/spotlight-group";

export type ExplorerProject = {
  slug: string;
  href: string;
  external?: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  status: string;
  statusKey: "live" | "private" | "archived" | "concept" | "content";
  year: string;
  stack: string[];
  accent: Accent;
  image?: { name: string; alt: string };
  featured: boolean;
};

type Filter = "all" | ProjectCategory;

const ease = [0.16, 1, 0.3, 1] as const;

export function ProjectExplorer({
  projects,
  filters,
  countLabel,
  filterLabel,
}: {
  projects: ExplorerProject[];
  filters: { id: Filter; label: string }[];
  countLabel: string;
  filterLabel: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(() => (filter === "all" ? projects : projects.filter((p) => p.category === filter)), [filter, projects]);
  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", projects.length]]);
    for (const p of projects) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, [projects]);

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label={filterLabel} className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 scrollbar-none">
          {filters.map((f) => {
            const on = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={cn("relative shrink-0 rounded-full border px-4 py-2 text-sm transition-colors", on ? "border-transparent text-on-accent" : "border-line text-muted hover:text-fg")}
              >
                {on && <m.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">
                  {f.label} <span className="font-mono text-xs opacity-70">{counts.get(f.id) ?? 0}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="font-mono text-xs text-subtle" aria-live="polite" dir="ltr">
          {visible.length} {countLabel}
        </p>
      </div>

      <SpotlightGroup>
        <m.ul layout className="mt-8 grid grid-flow-dense gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p) => (
              <m.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease }}
                className={cn(p.image && p.featured && "sm:col-span-2")}
              >
                <ProjectTile project={p} large={Boolean(p.image && p.featured)} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      </SpotlightGroup>
    </LayoutGroup>
  );
}

function ProjectTile({ project, large }: { project: ExplorerProject; large: boolean }) {
  const isExternal = Boolean(project.external);
  const content = (
    <>
      {project.image && (
        <div className={cn("relative overflow-hidden border-b border-line bg-sunken", large ? "aspect-[16/9]" : "aspect-[16/8]")}>
          <Image
            src={`/media/projects/${project.image.name}`}
            alt={project.image.alt}
            fill
            sizes={large ? "(min-width: 1024px) 760px, 100vw" : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"}
            className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] text-subtle">
            <span className={cn("size-1.5 rounded-full", project.statusKey === "live" ? "bg-tone" : "bg-line-strong")} />
            {project.statusKey === "private" && <Lock size={11} aria-hidden="true" />}
            {project.status}
          </span>
          <span className="font-mono text-[0.7rem] text-subtle">{project.year}</span>
        </div>
        <h3 className={cn("font-semibold leading-tight", large ? "text-h3" : "text-lg")}>{project.title}</h3>
        <p className="text-sm text-muted">{project.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p className="font-mono text-[0.7rem] text-subtle" dir="ltr">
            {project.stack.slice(0, large ? 6 : 3).join(" · ")}
          </p>
          <ArrowUpRight size={17} className="shrink-0 text-subtle transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-tone rtl:-scale-x-100" aria-hidden="true" />
        </div>
      </div>
    </>
  );

  const className = "spotlight surface group flex h-full flex-col overflow-hidden transition-[border-color] duration-300 hover:border-line-strong";
  return isExternal ? (
    <a href={project.external} target="_blank" rel="noopener noreferrer" data-tone={project.accent} className={className}>
      {content}
    </a>
  ) : (
    <Link href={project.href} data-tone={project.accent} className={className}>
      {content}
    </Link>
  );
}
