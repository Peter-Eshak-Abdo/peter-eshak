import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg" | "sm";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out-expo active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent shadow-[0_1px_0_oklch(1_0_0/0.25)_inset,0_8px_20px_-8px_var(--accent)] hover:shadow-[0_1px_0_oklch(1_0_0/0.25)_inset,0_12px_28px_-8px_var(--accent)]",
  secondary: "border border-line bg-raised text-fg hover:border-line-strong hover:bg-sunken",
  ghost: "text-muted hover:bg-sunken hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-[0.95rem]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({ variant, size, className, ...props }: CommonProps & ComponentProps<"button">) {
  return <button type="button" className={buttonClass(variant, size, className)} {...props} />;
}

/** Internal link styled as a button. */
export function ButtonLink({ variant, size, className, ...props }: CommonProps & ComponentProps<typeof Link>) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/** External link (new tab, no referrer leakage) styled as a button. */
export function ButtonAnchor({ variant, size, className, ...props }: CommonProps & ComponentProps<"a">) {
  const external = typeof props.href === "string" && /^https?:/.test(props.href);
  return (
    <a
      className={buttonClass(variant, size, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
