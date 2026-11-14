"use client";

import { Command } from "cmdk";
import { ArrowUpRight, Copy, CornerDownLeft, Download, FileText, Languages, SunMoon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { otherLocale, switchLocalePath } from "@/lib/i18n";
import { useThemeSwitch } from "@/components/layout/theme-toggle";
import { rememberLocale } from "@/components/layout/locale-switch";
import { Kbd } from "@/components/ui/bits";
import type { PaletteData } from "./types";

const itemClass =
  "group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted outline-none transition-colors " +
  "data-[selected=true]:bg-sunken data-[selected=true]:text-fg";

export function CommandPalette({ data, open, onOpenChange }: { data: PaletteData; open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const toggleTheme = useThemeSwitch();
  const [copied, setCopied] = useState(false);
  const { labels } = data;

  function run(action: () => void, keepOpen = false) {
    action();
    if (!keepOpen) onOpenChange(false);
  }

  function go(href: string) {
    run(() => {
      if (/^https?:/.test(href)) window.open(href, "_blank", "noopener,noreferrer");
      else if (href.endsWith(".pdf")) window.open(href, "_blank", "noopener");
      else router.push(href);
    });
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label={labels.placeholder}
      loop
      overlayClassName="fixed inset-0 z-[90] bg-[oklch(0.15_0.02_258/0.45)] backdrop-blur-[3px] data-[state=open]:animate-[fade-in_160ms_ease-out]"
      contentClassName="fixed inset-x-4 top-[12vh] z-[100] mx-auto max-w-xl overflow-hidden rounded-2xl border border-line bg-raised shadow-[0_30px_80px_-20px_oklch(0.1_0.02_258/0.5)] data-[state=open]:animate-[palette-in_240ms_cubic-bezier(0.16,1,0.3,1)]"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <span className="font-mono text-sm text-accent" aria-hidden="true">
          ›
        </span>
        <Command.Input
          placeholder={labels.placeholder}
          className="h-14 w-full bg-transparent text-[0.95rem] text-fg outline-none placeholder:text-subtle"
        />
        <Kbd>esc</Kbd>
      </div>
      <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain p-2 [&_[cmdk-group-heading]]:label-mono [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3">
        <Command.Empty className="px-3 py-8 text-center text-sm text-subtle">{labels.empty}</Command.Empty>

        <Command.Group heading={labels.navigate}>
          {data.navigation.map((item) => (
            <Command.Item key={item.id} value={item.label} keywords={item.keywords} onSelect={() => go(item.href)} className={itemClass}>
              <span className="grid size-6 place-items-center rounded-md border border-line font-mono text-[0.65rem] text-subtle">
                {item.hint ?? "→"}
              </span>
              <span className="flex-1">{item.label}</span>
              <CornerDownLeft size={14} className="opacity-0 group-data-[selected=true]:opacity-60 rtl:-scale-x-100" aria-hidden="true" />
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading={labels.projects}>
          {data.projects.map((item) => (
            <Command.Item key={item.id} value={`${item.label} ${item.hint ?? ""}`} keywords={item.keywords} onSelect={() => go(item.href)} className={itemClass}>
              <FileText size={15} aria-hidden="true" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.hint && <span className="hidden truncate text-xs text-subtle sm:inline">{item.hint}</span>}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading={labels.actions}>
          <PaletteAction icon={<SunMoon size={15} />} label={labels.toggleTheme} onSelect={() => run(() => toggleTheme())} />
          <PaletteAction
            icon={<Languages size={15} />}
            label={labels.switchLanguage}
            onSelect={() =>
              run(() => {
                const target = otherLocale(data.locale);
                rememberLocale(target);
                router.push(switchLocalePath(window.location.pathname, target));
              })
            }
          />
          <PaletteAction
            icon={<Copy size={15} />}
            label={copied ? labels.copied : `${labels.copyEmail} — ${data.email}`}
            onSelect={() =>
              run(() => {
                navigator.clipboard
                  ?.writeText(data.email)
                  .then(() => setCopied(true))
                  .catch(() => {});
              }, true)
            }
          />
          <PaletteAction icon={<Download size={15} />} label={labels.downloadCv} onSelect={() => go(data.cvPdf)} />
        </Command.Group>

        <Command.Group heading={labels.links}>
          {data.external.map((item) => (
            <Command.Item key={item.id} value={item.label} keywords={item.keywords} onSelect={() => go(item.href)} className={itemClass}>
              <ArrowUpRight size={15} className="rtl:-scale-x-100" aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {item.hint && <span className="text-xs text-subtle">{item.hint}</span>}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-[0.7rem] text-subtle" dir="ltr">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> navigate
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd> open
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd> toggle
        </span>
      </div>
    </Command.Dialog>
  );
}

function PaletteAction({ icon, label, onSelect, shortcut }: { icon: ReactNode; label: string; onSelect: () => void; shortcut?: string }) {
  return (
    <Command.Item value={label} onSelect={onSelect} className={itemClass}>
      <span aria-hidden="true">{icon}</span>
      <span className="flex-1">{label}</span>
      {shortcut && <Kbd>{shortcut}</Kbd>}
    </Command.Item>
  );
}
