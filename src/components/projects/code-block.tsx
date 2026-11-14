import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { codeToHtml } from "shiki";
import type { Snippet } from "@/content/schema";
import { tr, type Locale } from "@/lib/i18n";

const SNIPPET_DIR = path.join(process.cwd(), "src", "content", "snippets");

/**
 * Real source excerpts, highlighted at build time with Shiki (dual light/dark theme via CSS
 * variables) — zero JavaScript ships for syntax highlighting.
 */
export async function CodeBlock({ snippet, locale }: { snippet: Snippet; locale: Locale }) {
  const file = path.join(SNIPPET_DIR, path.basename(snippet.file));
  const code = (await readFile(file, "utf8")).trimEnd();
  const html = await codeToHtml(code, {
    lang: snippet.lang,
    themes: { light: "github-light", dark: "github-dark-dimmed" },
    defaultColor: false,
  });

  return (
    <figure className="surface overflow-hidden">
      <figcaption className="flex flex-col gap-1 border-b border-line px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-medium">{tr(snippet.title, locale)}</span>
        <span className="font-mono text-xs text-subtle" dir="ltr">
          {snippet.source}
        </span>
      </figcaption>
      <div
        dir="ltr"
        className="max-h-[32rem] overflow-auto bg-sunken py-4 font-mono text-[0.8rem] leading-relaxed [&_pre]:!bg-transparent"
        // Shiki output is generated at build time from files in this repo, not user input.
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <p className="border-t border-line px-5 py-3.5 text-sm text-muted">{tr(snippet.caption, locale)}</p>
    </figure>
  );
}
