"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const ease = [0.16, 1, 0.3, 1] as const;

/** Fades and lifts content in once, the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </Comp>
  );
}

/**
 * Heading that rises out of a mask — the text slides up from behind its own baseline.
 * Transform-only, so it stays on the compositor.
 */
export function RevealHeading({
  children,
  as = "h2",
  className,
  delay = 0,
  id,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "span";
  className?: string;
  delay?: number;
  id?: string;
}) {
  const Tag = as;
  return (
    <Tag id={id} className={cn("block overflow-hidden pb-[0.08em]", className)}>
      <m.span
        className="block"
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 0.9, delay, ease }}
      >
        {children}
      </m.span>
    </Tag>
  );
}

/** Staggers its direct <StaggerItem> children into view. */
export function Stagger({ children, className, gap = 0.07 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 18, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } } }}
    >
      {children}
    </m.div>
  );
}
