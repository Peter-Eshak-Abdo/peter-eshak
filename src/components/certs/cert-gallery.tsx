"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type GalleryCert = { slug: string; title: string; issuer: string; date: string; featured: boolean; topic: string };

/**
 * Certificate grid + lightbox on a native <dialog> (focus trap, Esc and inert background
 * for free). Arrow keys move between certificates.
 */
export function CertGallery({
  certs,
  labels,
}: {
  certs: GalleryCert[];
  labels: { close: string; previous: string; next: string; view: string };
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const current = index === null ? null : certs[index];

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = useCallback((dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + certs.length) % certs.length)), [certs.length]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onKey = (e: KeyboardEvent) => {
      if (!d.open) return;
      const rtl = document.documentElement.dir === "rtl";
      if (e.key === "ArrowRight") step(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {certs.map((c, i) => (
          <li key={c.slug}>
            <button
              type="button"
              onClick={() => open(i)}
              className="spotlight surface group flex h-full w-full flex-col overflow-hidden text-start transition-[border-color] hover:border-line-strong"
              aria-label={`${labels.view}: ${c.title}`}
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden border-b border-line bg-white">
                <Image
                  src={`/media/certifications/${c.slug}`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
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
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label={current?.title}
        className="m-auto max-h-[92dvh] w-[min(96vw,64rem)] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-[oklch(0.12_0.02_258/0.8)] backdrop:backdrop-blur-sm open:animate-[palette-in_260ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        {current && (
          <figure className="surface flex max-h-[92dvh] flex-col overflow-hidden">
            <div className="relative min-h-0 flex-1 bg-white">
              <Image
                key={current.slug}
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
                  {current.issuer} · {current.date} · {(index ?? 0) + 1}/{certs.length}
                </p>
              </div>
              {[
                { dir: -1 as const, label: labels.previous, Icon: ChevronLeft },
                { dir: 1 as const, label: labels.next, Icon: ChevronRight },
              ].map(({ dir, label, Icon }) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => step(dir)}
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full border border-line text-muted hover:bg-sunken hover:text-fg"
                >
                  <Icon size={17} className="rtl:-scale-x-100" aria-hidden="true" />
                </button>
              ))}
              <button
                type="button"
                onClick={close}
                aria-label={labels.close}
                className={cn("grid size-9 place-items-center rounded-full bg-fg text-bg")}
              >
                <X size={17} aria-hidden="true" />
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
