import Image from "next/image";
import type { Project } from "@/content/schema";
import { tr, type Locale } from "@/lib/i18n";
import { BrowserFrame } from "@/components/ui/bits";

/** Screenshot in a browser frame, or — for projects without a UI — a stylised terminal run. */
export function ProjectVisual({ project, locale, priority = false, sizes }: { project: Project; locale: Locale; priority?: boolean; sizes?: string }) {
  if (project.image) {
    return (
      <BrowserFrame url={project.links.live}>
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={`/media/projects/${project.image.name}`}
            alt={tr(project.image.alt, locale)}
            fill
            priority={priority}
            sizes={sizes ?? "(min-width: 1024px) 640px, 100vw"}
            className="object-cover object-top"
          />
        </div>
      </BrowserFrame>
    );
  }
  if (project.slug === "ai-task-pipeline") return <PipelineTerminal />;
  return null;
}

const run: { step: string; status: "ok" | "skip" | "info"; text: string }[] = [
  { step: "telegram", status: "ok", text: 'task received · "add hymn lyrics page"' },
  { step: "notion", status: "ok", text: "queued · dependency resolved" },
  { step: "context", status: "info", text: "file tree + docs → prompt" },
  { step: "gemini-2.5", status: "skip", text: "quota exceeded → fallback" },
  { step: "gemini-2.0", status: "ok", text: "3 files generated · JSON valid" },
  { step: "github", status: "ok", text: "branch created · PR opened for review" },
  { step: "notion", status: "ok", text: 'status → "In review"' },
];

function PipelineTerminal() {
  return (
    <div dir="ltr" className="overflow-hidden rounded-xl border border-line bg-[oklch(0.2_0.02_258)] text-[oklch(0.9_0.01_85)] shadow-[var(--shadow)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 font-mono text-[0.68rem] text-white/50">
        <span>notion-to-pr.yml · example run</span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[oklch(0.84_0.11_170)]" /> passed
        </span>
      </div>
      <ol className="flex flex-col gap-2.5 p-5 font-mono text-[0.78rem] leading-relaxed sm:p-6">
        {run.map((line, i) => (
          <li key={i} className="grid grid-cols-[1.25rem_6.5rem_1fr] items-baseline gap-2">
            <span className={line.status === "ok" ? "text-[oklch(0.84_0.11_170)]" : line.status === "skip" ? "text-[oklch(0.83_0.11_60)]" : "text-white/40"}>
              {line.status === "ok" ? "✓" : line.status === "skip" ? "↷" : "·"}
            </span>
            <span className="text-[oklch(0.8_0.095_290)]">{line.step}</span>
            <span className="text-white/75">{line.text}</span>
          </li>
        ))}
        <li className="mt-1 text-white/40">
          <span className="text-[oklch(0.84_0.11_170)]">$</span> <span className="inline-block h-[1em] w-[0.55em] translate-y-0.5 animate-blink bg-white/60" />
        </li>
      </ol>
    </div>
  );
}
