"use client";

import { AnimatePresence, m } from "motion/react";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "./button";

export function CopyButton({
  value,
  label,
  copiedLabel,
  variant = "secondary",
  size = "md",
  className,
}: {
  value: string;
  label: string;
  copiedLabel: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked (insecure context, permissions); fall back to mailto.
      window.location.href = `mailto:${value}`;
    }
  }

  return (
    <button type="button" onClick={copy} className={buttonClass(variant, size, className)}>
      <span className="relative grid size-4 place-items-center" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          <m.span
            key={copied ? "check" : "copy"}
            initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0, rotate: 30 }}
            transition={{ type: "spring", stiffness: 500, damping: 26 }}
            className="absolute"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </m.span>
        </AnimatePresence>
      </span>
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
