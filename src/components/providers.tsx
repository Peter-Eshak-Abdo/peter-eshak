"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

// Motion's feature bundle (gestures, layout animations) is code-split and loaded after hydration.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LazyMotion features={loadFeatures} strict>
        {/* "user" = transform/layout animations are skipped when the OS asks for reduced motion. */}
        <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 30 }}>
          {children}
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
