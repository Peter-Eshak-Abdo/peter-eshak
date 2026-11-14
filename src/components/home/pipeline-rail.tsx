"use client";

import { m, useScroll, useSpring } from "motion/react";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type Stage = { id: string; label: string };

/**
 * The page as a CI pipeline: each section is a stage that goes pending → running → passed
 * as you scroll. Large screens get a vertical rail in the gutter; smaller screens a thin
 * progress bar under the header. Stages are real links, so it doubles as a section nav.
 */
export function PipelineRail({ stages, label }: { stages: Stage[]; label: string }) {
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const sections = stages.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = sections.indexOf(entry.target as HTMLElement);
            if (index >= 0) setActive(index);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [stages]);

  return (
    <>
      {/* Mobile / tablet: progress bar */}
      <m.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent rtl:origin-right 2xl:hidden" style={{ scaleX: progress }} />

      {/* Wide screens: the rail */}
      <nav aria-label={label} className="fixed start-6 top-1/2 z-40 hidden -translate-y-1/2 2xl:block no-print">
        <p className="label-mono mb-4 ps-0.5" dir="ltr">
          run <span className="text-accent">#2019</span>
        </p>
        <ol className="relative flex flex-col gap-7">
          <span aria-hidden="true" className="absolute bottom-1.5 start-[5px] top-1.5 w-px bg-line" />
          <m.span aria-hidden="true" className="absolute bottom-1.5 start-[5px] top-1.5 w-px origin-top bg-accent" style={{ scaleY: progress }} />
          {stages.map((stage, i) => {
            const state = i < active ? "done" : i === active ? "running" : "pending";
            return (
              <li key={stage.id} className="relative">
                <a
                  href={`#${stage.id}`}
                  aria-current={state === "running" ? "step" : undefined}
                  className="group flex items-center gap-3"
                >
                  <span
                    className={cn(
                      "relative grid size-[11px] place-items-center rounded-full border transition-colors duration-500",
                      state === "pending" && "border-line-strong bg-bg",
                      state === "running" && "border-accent bg-bg",
                      state === "done" && "border-accent bg-accent",
                    )}
                  >
                    {state === "running" && <span className="absolute inset-0 animate-ping-soft rounded-full bg-accent" />}
                    {state === "done" && <Check size={8} strokeWidth={4} className="text-on-accent" aria-hidden="true" />}
                  </span>
                  <span
                    dir="ltr"
                    className={cn(
                      "font-mono text-[0.7rem] transition-[color,opacity,transform] duration-500",
                      state === "running" ? "translate-x-0.5 text-fg" : "text-subtle opacity-60 group-hover:opacity-100",
                    )}
                  >
                    <span className="text-subtle">0{i + 1}</span> {stage.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
