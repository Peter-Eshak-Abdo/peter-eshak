"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/cn";

/**
 * Light/dark switch. Where the View Transitions API exists, the new theme spreads out
 * from the button as a circle; otherwise (or with reduced motion) it switches instantly.
 */
export function useThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  return function toggle(origin?: { x: number; y: number }) {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const apply = () => {
      // Apply synchronously so the transition snapshot captures the new colours.
      const root = document.documentElement;
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      setTheme(next);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      apply();
      return;
    }
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? 0;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 620, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  };
}

export function ThemeToggle({ label, className }: { label: string; className?: string }) {
  const { resolvedTheme } = useTheme();
  const hydrated = useHydrated();
  const toggle = useThemeSwitch();

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }

  const Icon = !hydrated ? SunMoon : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn("grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-fg", className)}
    >
      <Icon size={17} className="transition-transform duration-500 ease-spring hover:rotate-45" aria-hidden="true" />
    </button>
  );
}
