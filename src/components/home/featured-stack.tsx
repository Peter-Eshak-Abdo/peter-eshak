"use client";

import { m, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useSyncExternalStore, type ReactNode } from "react";

const query = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function useStackEnabled() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Cards pin under the header and stack on top of each other; the ones underneath recede in
 * depth (scale + a slight backwards tilt). On small screens or with reduced motion they are a
 * normal list.
 */
export function FeaturedStack({ cards }: { cards: ReactNode[] }) {
  const container = useRef<HTMLDivElement>(null);
  const enabled = useStackEnabled();
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });

  return (
    <div ref={container} className="relative flex flex-col gap-6 md:gap-[14vh]">
      {cards.map((card, i) => (
        <StackCard key={i} index={i} total={cards.length} progress={scrollYProgress} enabled={enabled}>
          {card}
        </StackCard>
      ))}
    </div>
  );
}

function StackCard({
  children,
  index,
  total,
  progress,
  enabled,
}: {
  children: ReactNode;
  index: number;
  total: number;
  progress: MotionValue<number>;
  enabled: boolean;
}) {
  const start = index / total;
  const depth = total - index - 1;
  const scale = useTransform(progress, [start, 1], [1, 1 - depth * 0.045]);
  const rotateX = useTransform(progress, [start, 1], [0, depth * 2.2]);
  const shade = useTransform(progress, [start, 1], [0, depth * 0.12]);

  return (
    <div className="md:sticky" style={{ top: `calc(6rem + ${index * 1.5}rem)` }}>
      <m.div
        className="relative origin-top"
        style={enabled ? { scale, rotateX, transformPerspective: 1400 } : undefined}
      >
        {children}
        {enabled && (
          <m.span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[oklch(0.15_0.02_258)]" style={{ opacity: shade }} />
        )}
      </m.div>
    </div>
  );
}
