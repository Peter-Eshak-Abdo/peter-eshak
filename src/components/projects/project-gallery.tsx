"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type GalleryShot = { src: string; caption: string; device: "desktop" | "mobile" };

/**
 * Project screenshots: desktop shots in browser frames, mobile shots in phone frames, and a
 * native <dialog> lightbox (focus trap + Esc for free; arrow keys respect RTL).
 */
export function ProjectGallery({
  shots,
  labels,
}: {
  shots: GalleryShot[];
  labels: { close: string; previous: string; next: string; open: string };
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const current = index === null ? null : shots[index];

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = useCallback((dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + shots.length) % shots.length)), [shots.length]);

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

  const desktop = shots.map((s, i) => ({ ...s, i })).filter((s) => s.device === "desktop");
  const mobile = shots.map((s, i) => ({ ...s, i })).filter((s) => s.device === "mobile");

  return (
    <>
      {desktop.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {desktop.map((shot) => (
            <li key={shot.src}>
              <button type="button" onClick={() => open(shot.i)} className="group flex w-full flex-col gap-2.5 text-start" aria-label={`${labels.open}: ${shot.caption}`}>
                <span className="relative block overflow-hidden rounded-xl border border-line bg-sunken shadow-[var(--shadow)] transition-[border-color,transform] duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:border-line-strong">
                  <span className="flex items-center gap-1.5 border-b border-line px-3 py-2" aria-hidden="true">
                    <span className="size-2 rounded-full bg-line-strong" />
                    <span className="size-2 rounded-full bg-line-strong" />
                    <span className="size-2 rounded-full bg-line-strong" />
                  </span>
                  <span className="relative block aspect-[16/10]">
                    <Image src={shot.src} alt="" fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
                  </span>
                  <span className="absolute end-3 top-10 grid size-8 place-items-center rounded-full bg-bg/80 text-fg opacity-0 backdrop-blur transition-opacity group-hover:opacity-100" aria-hidden="true">
                    <Expand size={14} />
                  </span>
                </span>
                <span className="text-sm text-muted">{shot.caption}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {mobile.length > 0 && (
        <ul className={cn("flex flex-wrap gap-5", desktop.length > 0 && "mt-8")}>
          {mobile.map((shot) => (
            <li key={shot.src} className="w-[calc(50%-0.625rem)] sm:w-48">
              <button type="button" onClick={() => open(shot.i)} className="group flex w-full flex-col gap-2.5 text-start" aria-label={`${labels.open}: ${shot.caption}`}>
                <span className="relative block overflow-hidden rounded-[1.6rem] border-[5px] border-fg/85 bg-sunken shadow-[var(--shadow)] transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
                  <span className="relative block aspect-[390/844]">
                    <Image src={shot.src} alt="" fill sizes="200px" className="object-cover object-top" />
                  </span>
                </span>
                <span className="text-sm text-muted">{shot.caption}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        aria-label={current?.caption}
        className="m-auto max-h-[94dvh] w-[min(96vw,72rem)] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-[oklch(0.12_0.02_258/0.85)] backdrop:backdrop-blur-sm open:animate-[palette-in_260ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        {current && (
          <figure className="surface flex max-h-[94dvh] flex-col overflow-hidden">
            <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto bg-sunken">
              <Image
                key={current.src}
                loading="eager"
                src={current.src}
                alt={current.caption}
                width={current.device === "mobile" ? 780 : 1440}
                height={current.device === "mobile" ? 1688 : 900}
                sizes={current.device === "mobile" ? "420px" : "(min-width: 1024px) 1152px, 96vw"}
                className={cn("h-auto object-contain", current.device === "mobile" ? "max-h-[78dvh] w-auto" : "w-full")}
              />
            </div>
            <figcaption className="flex items-center gap-3 border-t border-line p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{current.caption}</p>
                <p className="font-mono text-xs text-subtle" dir="ltr">
                  {(index ?? 0) + 1} / {shots.length}
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
