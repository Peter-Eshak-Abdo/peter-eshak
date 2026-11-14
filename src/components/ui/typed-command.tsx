"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * A terminal prompt that types itself out when it enters the viewport, e.g. `$ cd ~/projects`.
 * The full string is always rendered (the untyped tail is transparent), so there is no layout shift
 * and nothing is lost without JavaScript. Always LTR — it's code, even on the Arabic site.
 */
export function TypedCommand({ command, className, prompt = "$" }: { command: string; className?: string; prompt?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const animate = hydrated && !reduce;
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!animate || !inView) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= command.length) window.clearInterval(id);
    }, 38);
    return () => window.clearInterval(id);
  }, [animate, inView, command.length]);

  const shown = animate ? typed : command.length;
  const done = shown >= command.length;

  return (
    <span ref={ref} dir="ltr" aria-hidden="true" className={cn("label-mono inline-flex items-center gap-2 normal-case tracking-normal", className)}>
      <span className="text-tone">{prompt}</span>
      <span>
        <span className="text-muted">{command.slice(0, shown)}</span>
        <span className="opacity-0">{command.slice(shown)}</span>
      </span>
      <span className={cn("inline-block h-[1.1em] w-[0.55em] -translate-y-px bg-tone", done && "animate-blink")} />
    </span>
  );
}
