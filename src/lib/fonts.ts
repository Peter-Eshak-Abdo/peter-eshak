import { Bricolage_Grotesque, Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";

// Fonts are downloaded at build time and self-hosted — no runtime requests to Google.
export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--nf-display",
  display: "swap",
  axes: ["opsz", "wdth"],
});

export const sans = Geist({ subsets: ["latin"], variable: "--nf-sans", display: "swap" });

export const mono = Geist_Mono({ subsets: ["latin"], variable: "--nf-mono", display: "swap" });

export const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--nf-arabic",
  display: "swap",
});

export const fontVariables = [display.variable, sans.variable, mono.variable, arabic.variable].join(" ");
