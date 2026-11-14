"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { otherLocale, switchLocalePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export const LOCALE_STORAGE_KEY = "preferred-locale";

export function rememberLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* storage may be unavailable (private mode) — the URL still carries the locale */
  }
}

export function LocaleSwitch({ locale, label, className }: { locale: Locale; label: string; className?: string }) {
  const pathname = usePathname();
  const target = otherLocale(locale);

  return (
    <Link
      href={switchLocalePath(pathname, target)}
      hrefLang={target}
      lang={target}
      onClick={() => rememberLocale(target)}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.8rem] font-medium text-muted transition-colors hover:bg-sunken hover:text-fg",
        className,
      )}
    >
      <Languages size={15} aria-hidden="true" />
      {label}
    </Link>
  );
}
