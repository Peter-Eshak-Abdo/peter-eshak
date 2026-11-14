"use client";

import { m, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { href, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { Kbd } from "@/components/ui/bits";
import { usePalette } from "@/components/palette/palette-provider";
import { LocaleSwitch } from "./locale-switch";
import { ThemeToggle } from "./theme-toggle";

export type NavItem = { href: string; label: string };

type HeaderProps = {
  locale: Locale;
  name: string;
  nav: NavItem[];
  labels: { search: string; openMenu: string; closeMenu: string; toggleTheme: string; switchLanguage: string; primary: string; openPalette: string };
};

export function Header({ locale, name, nav, labels }: HeaderProps) {
  const pathname = usePathname();
  const { open } = usePalette();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (menuOpen && !d.open) d.showModal();
    if (!menuOpen && d.open) d.close();
  }, [menuOpen]);

  const isActive = (target: string) => pathname === target || pathname.startsWith(`${target}/`);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 no-print">
      <div className="container-page">
        <div
          className={cn(
            "pointer-events-auto flex h-14 items-center gap-2 rounded-full border px-2 transition-[background-color,border-color,box-shadow] duration-500 ease-out-expo",
            scrolled
              ? "border-line bg-[color-mix(in_oklch,var(--bg-raised)_78%,transparent)] shadow-[var(--shadow)] backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <Link href={href(locale)} className="group flex items-center gap-2.5 rounded-full py-1 pe-3 ps-1" aria-label={name}>
            <span dir="ltr" className="grid h-10 min-w-10 place-items-center rounded-full bg-fg px-2 font-mono text-[0.8rem] font-semibold text-bg transition-transform duration-500 ease-spring group-hover:-rotate-6">
              <span>
                pe<span className="animate-blink text-accent">_</span>
              </span>
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">{name}</span>
          </Link>

          <nav aria-label={labels.primary} className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="relative">
                    {active && (
                      <m.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-sunken"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn("relative block rounded-full px-3.5 py-2 text-sm transition-colors", active ? "text-fg" : "text-muted hover:text-fg")}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ms-auto flex items-center gap-1 lg:ms-0">
            <button
              type="button"
              onClick={open}
              aria-label={labels.openPalette}
              className="flex h-9 items-center gap-2 rounded-full border border-line bg-raised pe-1.5 ps-3 text-[0.8rem] text-subtle transition-colors hover:border-line-strong hover:text-fg"
            >
              <Search size={14} aria-hidden="true" />
              <span className="hidden md:inline">{labels.search}</span>
              <span className="hidden items-center gap-0.5 md:flex" dir="ltr">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </span>
            </button>
            <LocaleSwitch locale={locale} label={labels.switchLanguage} className="hidden sm:inline-flex" />
            <ThemeToggle label={labels.toggleTheme} />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={labels.openMenu}
              aria-expanded={menuOpen}
              className="grid size-9 place-items-center rounded-full text-muted hover:bg-sunken hover:text-fg lg:hidden"
            >
              <Menu size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <dialog
        ref={dialog}
        onClose={() => setMenuOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setMenuOpen(false)}
        className="pointer-events-auto m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-3 backdrop:bg-[oklch(0.15_0.02_258/0.4)] backdrop:backdrop-blur-sm open:animate-[sheet-in_300ms_cubic-bezier(0.16,1,0.3,1)] lg:hidden"
      >
        <div className="surface flex flex-col gap-6 p-5">
          <div className="flex items-center justify-between">
            <span className="label-mono">~/menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={labels.closeMenu}
              className="grid size-9 place-items-center rounded-full text-muted hover:bg-sunken hover:text-fg"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label={labels.primary}>
            <ul className="flex flex-col">
              {[{ href: href(locale), label: name }, ...nav].map((item, i) => (
                <li key={item.href} style={{ animationDelay: `${60 + i * 40}ms` }} className="animate-[sheet-in_400ms_cubic-bezier(0.16,1,0.3,1)_both]">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="flex items-baseline gap-3 border-b border-line py-3 font-display text-2xl font-semibold text-fg aria-[current=page]:text-accent"
                  >
                    <span className="font-mono text-xs text-subtle" dir="ltr">
                      0{i}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LocaleSwitch locale={locale} label={labels.switchLanguage} className="self-start border border-line" />
        </div>
      </dialog>
    </header>
  );
}
