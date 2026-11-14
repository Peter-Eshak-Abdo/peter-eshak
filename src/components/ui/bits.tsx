import type { ReactNode } from "react";
import type { Accent } from "@/content/schema";
import { cn } from "@/lib/cn";
import { TypedCommand } from "./typed-command";
import { RevealHeading } from "./reveal";

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-line bg-raised px-2.5 py-1 font-mono text-[0.72rem] leading-none text-muted", className)}>
      {children}
    </span>
  );
}

export function StatusDot({ tone = "mint", pulse = true }: { tone?: Accent; pulse?: boolean }) {
  return (
    <span data-tone={tone} className="relative inline-flex size-2.5 shrink-0" aria-hidden="true">
      {pulse && <span className="absolute inset-0 animate-ping-soft rounded-full bg-tone" />}
      <span className="relative inline-flex size-2.5 rounded-full bg-tone" />
    </span>
  );
}

/** Section header: a typed terminal command above a masked, rising heading. */
export function SectionHeading({
  command,
  title,
  intro,
  id,
  tone = "mint",
  as = "h2",
  className,
}: {
  command: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  tone?: Accent;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <header data-tone={tone} className={cn("flex max-w-3xl flex-col gap-4", className)}>
      <TypedCommand command={command} />
      <RevealHeading as={as} id={id} className={as === "h1" ? "text-h1 font-semibold" : "text-h2 font-semibold"}>
        {title}
      </RevealHeading>
      {intro && <p className="max-w-2xl text-base text-muted sm:text-lg">{intro}</p>}
    </header>
  );
}

/** Faux browser chrome around a screenshot. */
export function BrowserFrame({ url, children, className }: { url?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-sunken shadow-[var(--shadow)]", className)}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2" dir="ltr">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </span>
        {url && <span className="mx-auto truncate rounded-md bg-bg px-3 py-0.5 font-mono text-[0.68rem] text-subtle">{url.replace(/^https?:\/\//, "")}</span>}
      </div>
      {children}
    </div>
  );
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded border border-line bg-bg px-1 font-mono text-[0.68rem] text-subtle", className)}>
      {children}
    </kbd>
  );
}
