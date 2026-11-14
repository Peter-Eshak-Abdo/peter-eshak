import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { en } from "@/i18n/en";
import { ar } from "@/i18n/ar";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "404 — Peter Eshak Abdo",
  robots: { index: false },
};

// Served by Firebase Hosting as /404.html for any unknown URL, in both languages.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <main className="bg-dots grid min-h-dvh place-items-center p-6">
          <div className="surface flex w-full max-w-lg flex-col gap-6 p-8">
            <pre dir="ltr" className="overflow-x-auto font-mono text-sm leading-relaxed text-muted" aria-hidden="true">
              <span className="text-accent">$</span> cd {"<this-page>"}
              {"\n"}
              <span className="text-apricot">bash: cd: no such file or directory</span>
            </pre>
            <div className="flex flex-col gap-2">
              <h1 className="text-h2 font-semibold">{en.notFound.title}</h1>
              <p className="text-muted">{en.notFound.body}</p>
            </div>
            <div lang="ar" dir="rtl" className="flex flex-col gap-2 border-t border-line pt-6">
              <p className="font-semibold">{ar.notFound.title}</p>
              <p className="text-muted">{ar.notFound.body}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              
              <Link href="/en" className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent">
                {en.actions.backHome}
              </Link>
              <Link href="/ar" lang="ar" className="rounded-full border border-line px-5 py-2.5 text-sm">
                {ar.actions.backHome}
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
