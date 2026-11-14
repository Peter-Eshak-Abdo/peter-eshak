"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Counts the numeric part of a value ("25+", "2019", "6") up from zero the first time it's seen.
 * The server renders the final value, so there's nothing to miss without JavaScript.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const match = /^(\d+)(.*)$/.exec(value);
    if (!el || !inView || reduce || !match) return;
    const target = Number(match[1]);
    const suffix = match[2] ?? "";
    // Years count up from a nearby start so "2019" doesn't spin through 2,000 numbers.
    const from = target > 1900 ? target - 12 : 0;
    const controls = animate(from, target, {
      duration: target > 1900 ? 1.1 : 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className} dir="ltr">
      {value}
    </span>
  );
}
