import { ImageResponse } from "next/og";
import { locales } from "@/lib/i18n";

export const dynamic = "force-static";
export const alt = "Peter Eshak Abdo — Full-Stack Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Rendered once per locale at build time. Latin-only text (the bundled OG font has no Arabic glyphs).
export default function OpenGraphImage() {
  const ink = "#141a24";
  const paper = "#f2efe8";
  const mint = "#6fdcbc";
  const muted = "#a3acbd";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: ink,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          color: paper,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}>
            <div style={{ display: "flex", background: paper, color: ink, borderRadius: 999, padding: "10px 18px", fontWeight: 700 }}>
              pe<span style={{ color: "#2f9c7f" }}>_</span>
            </div>
            <span style={{ color: muted }}>$ whoami</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: muted }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: mint }} />
            Open to opportunities
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
            Peter Eshak Abdo<span style={{ color: mint }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 38, color: muted }}>Full-stack web developer · Next.js · Node.js · Supabase</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: muted }}>
          {["Real-time", "Offline-first", "AI", "Ismailia, Egypt"].map((t) => (
            <div key={t} style={{ display: "flex", border: "1px solid #2f3a4d", borderRadius: 999, padding: "8px 18px" }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
