import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Peter Eshak Abdo — Full-Stack Web Developer",
  description: "Full-stack web developer from Ismailia, Egypt.",
  alternates: { canonical: "/en", languages: { en: "/en", ar: "/ar", "x-default": "/en" } },
  robots: { index: false, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
