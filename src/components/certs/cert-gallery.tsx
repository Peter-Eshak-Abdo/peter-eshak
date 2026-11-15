"use client";

import { AnimatePresence, LayoutGroup, m } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type GalleryCert = { slug: string; title: string; issuer: string; date: string; featured: boolean; topic: string; topicLabel: string };

type Labels = {
  close: string;
  previous: string;
  next: string;
  view: string;
  featured: string;
  all: string;
  allFilter: string;
  count: string;
  filterLabel: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Certificates: highlights first, then the full list with topic filters. The lightbox is a native
 * <dialog> (focus trap + Esc) and walks through whichever list it was opened from; arrows respect RTL.
 */
export function CertGallery({ certs, topics, labels }: { certs: GalleryCert[]; topics: { id: string; label: string }[]; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [filter, setFilter] = useState("all");
  const [viewer, setViewer] = useState<{ list: GalleryCert[]; index: number } | null>(null);

  const featured = useMemo(() => certs.filter((c) => c.featured), [certs]);
  const filtered = useMemo(() => (filter === "all" ? certs : certs.filter((c) => c.topic === filter)), [certs, filter]);
  const counts = useMemo(() => {
    const map = new Map<string, number>([["all", certs.length]]);
    for (const c of certs) map.set(c.topic, (map.get(c.topic) ?? 0) + 1);
    return map;
  }, [certs]);

  const open = (list: GalleryCert[], index: number) => {
    setViewer({ list, index });
    dialog.current?.showModal();
  };
  const step = useCallback(
    (dir: 1 | -1) => setViewer((v) => (v ? { ...v, index: (v.index + dir + v.list.length) % v.list.length } : v)),
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialog.current?.open) return;
      const rtl = document.documentElement.dir === "rtl";
      if (e.key === "ArrowRight") step(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const current = viewer ? viewer.list[viewer.index] : null;

  const card = (c: GalleryCert, list: GalleryCert[], i: number, big = false) => (
    <button
      type="button"
      onClick={() => open(list, i)}
      className="spotlight surface group flex h-full w-full flex-col overflow-hidden text-start transition-[border-color] hover:border-line-strong"
      aria-label={`${labels.view}: ${c.title}`}
    >
      <span className={cn("relative block w-full overflow-hidden border-b border-line bg-white", big ? "aspect-[4/3]" : "aspect-[4/3]")}>
        <Image
          src={`/media/certifications/${c.slug}`}
          alt=""
          fill
          sizes={big ? "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"}
          className="object-contain p-2 transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
        />
      </span>
      <span className="flex flex-1 flex-col gap-1 p-3.5">
        <span className="line-clamp-2 text-sm font-medium leading-snug">{c.title}</span>
        <span className="mt-auto font-mono text-[0.7rem] text-subtle">
          {c.issuer} · {c.date}
        </span>
      </span>
    </button>
  );

  return (
    <>
      <section aria-labelledby="cert-featured">
        <h2 id="cert-featured" className="label-mono mb-5">
          {labels.featured} <span className="text-accent">({featured.length})</span>
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((c, i) => (
            <li key={c.slug}>{card(c, featured, i, true)}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cert-all" className="mt-20">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="cert-all" className="label-mono">
              {labels.all}
            </h2>
            <p className="font-mono text-xs text-subtle" aria-live="polite" dir="ltr">
              {filtered.length} {labels.count}
            </p>
          </div>
          <LayoutGroup>
            <div role="group" aria-label={labels.filterLabel} className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 scrollbar-none">
              {[{ id: "all", label: labels.allFilter }, ...topics].map((t) => {
                const on = t.id === filter;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(t.id)}
                    className={cn("relative shrink-0 rounded-full border px-4 py-2 text-sm transition-colors", on ? "border-transparent text-on-accent" : "border-line text-muted hover:text-fg")}
                  >
                    {on && <m.span layoutId="cert-filter" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                    <span className="relative">
                      {t.label} <span className="font-mono text-xs opacity-70">{counts.get(t.id) ?? 0}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <m.ul layout className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.map((c, i) => (
                  <m.li
                    key={c.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    {card(c, filtered, i)}
                  </m.li>
                ))}
              </AnimatePresence>
            </m.ul>
          </LayoutGroup>
        </div>
      </section>

      <dialog
        ref={dialog}
        onClose={() => setViewer(null)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        aria-label={current?.title}
        className="m-auto max-h-[92dvh] w-[min(96vw,64rem)] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-[oklch(0.12_0.02_258/0.8)] backdrop:backdrop-blur-sm open:animate-[palette-in_260ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        {current && viewer && (
          <figure className="surface flex max-h-[92dvh] flex-col overflow-hidden">
            <div className="relative min-h-0 flex-1 bg-white">
              <Image
                key={current.slug}
                loading="eager"
                src={`/media/certifications/${current.slug}`}
                alt={current.title}
                width={1600}
                height={1200}
                sizes="(min-width: 1024px) 1024px, 96vw"
                className="mx-auto h-auto max-h-[72dvh] w-auto object-contain"
              />
            </div>
            <figcaption className="flex items-center gap-3 border-t border-line p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{current.title}</p>
                <p className="font-mono text-xs text-subtle">
                  {current.issuer} · {current.date} · {current.topicLabel} ·{" "}
                  <span dir="ltr">
                    {viewer.index + 1}/{viewer.list.length}
                  </span>
                </p>
              </div>
              <button type="button" onClick={() => step(-1)} aria-label={labels.previous} className="grid size-9 place-items-center rounded-full border border-line text-muted hover:bg-sunken hover:text-fg">
                <ChevronLeft size={17} className="rtl:-scale-x-100" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label={labels.next} className="grid size-9 place-items-center rounded-full border border-line text-muted hover:bg-sunken hover:text-fg">
                <ChevronRight size={17} className="rtl:-scale-x-100" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => dialog.current?.close()} aria-label={labels.close} className="grid size-9 place-items-center rounded-full bg-fg text-bg">
                <X size={17} aria-hidden="true" />
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
