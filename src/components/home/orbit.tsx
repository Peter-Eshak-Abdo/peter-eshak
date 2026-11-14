"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Accent } from "@/content/schema";

export type OrbitItem = { label: string; tone: Accent };

type Ring = { items: OrbitItem[]; rx: number; ry: number; tilt: number; speed: number; offset: number };

const TAU = Math.PI * 2;
const IDLE_SPEED = 0.18; // radians per second

/**
 * Two tilted rings of technologies orbiting the portrait — a 3D effect built from plain
 * 2D transforms (depth = scale + opacity + z-index), so it's cheap and needs no WebGL.
 * Drag to spin with inertia. Pauses off-screen; static under prefers-reduced-motion.
 */
export function Orbit({
  inner,
  outer,
  portrait,
  alt,
  hint,
}: {
  inner: OrbitItem[];
  outer: OrbitItem[];
  portrait: string;
  alt: string;
  hint: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-orbit]"));
    const rings: Ring[] = [
      { items: inner, rx: 0.44, ry: 0.2, tilt: -0.32, speed: 1, offset: 0 },
      { items: outer, rx: 0.5, ry: 0.16, tilt: 0.38, speed: -0.78, offset: 0.4 },
    ];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let size = el.clientWidth;
    let angle = 0.6;
    let velocity = 0;
    let last = performance.now();
    let raf = 0;
    let visible = true;
    let dragging = false;
    let lastX = 0;

    const layout = () => {
      for (const node of nodes) {
        const ring = rings[Number(node.dataset.ring)];
        if (!ring) continue;
        const index = Number(node.dataset.index);
        const theta = angle * ring.speed + (index / ring.items.length) * TAU + ring.offset;
        const px = Math.cos(theta) * ring.rx * size;
        const py = Math.sin(theta) * ring.ry * size;
        const x = px * Math.cos(ring.tilt) - py * Math.sin(ring.tilt);
        const y = px * Math.sin(ring.tilt) + py * Math.cos(ring.tilt);
        const depth = (Math.sin(theta) + 1) / 2; // 0 = behind, 1 = in front
        node.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(0.78 + depth * 0.26).toFixed(3)})`;
        node.style.opacity = (0.32 + depth * 0.68).toFixed(3);
        node.style.zIndex = depth > 0.5 ? "30" : "5";
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      if (!dragging) {
        angle += (IDLE_SPEED + velocity) * dt;
        velocity *= Math.pow(0.06, dt); // inertia decays smoothly
      }
      layout();
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (reduce || raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const resize = new ResizeObserver(() => {
      size = el.clientWidth;
      layout();
    });
    resize.observe(el);

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting) && document.visibilityState === "visible";
      if (visible) start();
    });
    io.observe(el);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onDown = (e: PointerEvent) => {
      if (reduce) return;
      dragging = true;
      lastX = e.clientX;
      last = performance.now();
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dt = Math.max(now - last, 1) / 1000;
      const delta = ((e.clientX - lastX) / size) * Math.PI;
      angle += delta;
      velocity = Math.max(-6, Math.min(6, delta / dt));
      lastX = e.clientX;
      last = now;
      if (!raf) layout();
    };
    const onUp = () => {
      dragging = false;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    layout();
    start();

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [inner, outer]);

  return (
    <div className="relative mx-auto w-full max-w-[520px] px-10 sm:px-8 lg:px-0">
      <div
        ref={root}
        dir="ltr"
        className="relative aspect-square w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
        role="img"
        aria-label={alt}
      >
        {/* Orbit paths */}
        <svg viewBox="-50 -50 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
          <ellipse rx="44" ry="20" transform="rotate(-18.3)" fill="none" stroke="var(--line-strong)" strokeWidth="0.25" strokeDasharray="0.6 1.4" />
          <ellipse rx="50" ry="16" transform="rotate(21.8)" fill="none" stroke="var(--line-strong)" strokeWidth="0.25" strokeDasharray="0.6 1.4" />
        </svg>

        {/* Portrait */}
        <div className="absolute left-1/2 top-1/2 z-10 aspect-[4/5] w-[42%] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute -inset-3 rounded-[2.2rem] bg-[radial-gradient(closest-side,var(--mint-soft),transparent)] blur-xl" aria-hidden="true" />
          <div className="relative size-full overflow-hidden rounded-[2rem] border border-line bg-sunken shadow-[var(--shadow)]">
            <Image src={portrait} alt="" fill priority sizes="(min-width: 1024px) 240px, 46vw" className="object-cover" draggable={false} />
          </div>
        </div>

        {[inner, outer].map((items, ring) =>
          items.map((item, index) => (
            <span
              key={`${ring}-${item.label}`}
              data-orbit=""
              data-ring={ring}
              data-index={index}
              data-tone={item.tone}
              className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-line bg-raised px-3 py-1.5 font-mono text-[0.72rem] text-fg shadow-[var(--shadow)] will-change-transform"
            >
              <span className="me-1.5 inline-block size-1.5 -translate-y-px rounded-full bg-tone align-middle" />
              {item.label}
            </span>
          )),
        )}
      </div>
      <p className="label-mono mt-1 text-center" aria-hidden="true">
        ← {hint} →
      </p>
    </div>
  );
}
