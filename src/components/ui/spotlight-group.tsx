"use client";

import { useRef, type ReactNode } from "react";

/**
 * Feeds the cursor position into any `.spotlight` descendant as --mx/--my (one listener for the
 * whole group, throttled to one write per frame). The glow itself is pure CSS.
 */
export function SpotlightGroup({ children, className }: { children: ReactNode; className?: string }) {
  const frame = useRef(0);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const target = (e.target as HTMLElement).closest<HTMLElement>(".spotlight");
    if (!target) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${clientX - r.left}px`);
      target.style.setProperty("--my", `${clientY - r.top}px`);
    });
  }

  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
