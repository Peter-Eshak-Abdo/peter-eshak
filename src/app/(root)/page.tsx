import Link from "next/link";

/*
 * "/" picks a language: the visitor's saved choice, else English.
 * Static hosting has no server-side negotiation, so this runs as a tiny inline script before paint;
 * the visible links are the no-JS fallback.
 */
const pickLocale = `(function(){try{var s=localStorage.getItem("preferred-locale");var l=s==="ar"||s==="en"?s:"en";location.replace("/"+l+location.hash)}catch(e){location.replace("/en")}})();`;

export default function LanguageGate() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: pickLocale }} />
      <main className="grid min-h-dvh place-items-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="label-mono">~/choose-language</span>
          <div className="flex gap-3">
            <Link href="/en" className="rounded-full border border-line px-5 py-2 hover:bg-sunken">
              English
            </Link>
            <Link href="/ar" lang="ar" className="rounded-full border border-line px-5 py-2 hover:bg-sunken">
              العربية
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
