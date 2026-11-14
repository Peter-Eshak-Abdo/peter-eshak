"use client";

import { Clock, GitCommitHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import type { GitHubActivity } from "@/lib/github";
import type { Locale } from "@/lib/i18n";
import { useHydrated } from "@/lib/use-hydrated";
import { StatusDot } from "@/components/ui/bits";

function relativeTime(iso: string, locale: Locale, now: number): string {
  const diff = (new Date(iso).getTime() - now) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale === "ar" ? "ar-EG" : "en", { numeric: "auto" });
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of steps) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return rtf.format(0, "minute");
}

function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** "● Open to opportunities · 14:32 in Ismailia · last push to abona-faltaus 3 hours ago" */
export function LiveStatus({
  locale,
  timezone,
  place,
  availability,
  activity,
  labels,
}: {
  locale: Locale;
  timezone: string;
  place: string;
  availability: string;
  activity: GitHubActivity | null;
  labels: { localTime: string; lastPush: string };
}) {
  const hydrated = useHydrated();
  const now = useNow(30_000);

  // Time-dependent text only renders after hydration so server and client HTML match.
  const time = hydrated
    ? new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: timezone }).format(now)
    : "--:--";

  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[0.8rem] text-muted">
      <li className="flex items-center gap-2 font-medium text-fg">
        <StatusDot tone="mint" />
        {availability}
      </li>
      <li className="flex items-center gap-1.5" title={labels.localTime}>
        <Clock size={14} className="text-subtle" aria-hidden="true" />
        <span className="sr-only">{labels.localTime}: </span>
        <time className="font-mono tabular-nums">{time}</time>
        <span className="text-subtle">· {place}</span>
      </li>
      {activity && (
        <li className="flex items-center gap-1.5">
          <GitCommitHorizontal size={15} className="text-subtle" aria-hidden="true" />
          <span>{labels.lastPush}</span>
          <a href={activity.url} target="_blank" rel="noopener noreferrer" className="font-mono text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent" dir="ltr">
            {activity.repo}
          </a>
          <span className="text-subtle">{hydrated ? relativeTime(activity.at, locale, now) : ""}</span>
        </li>
      )}
    </ul>
  );
}
