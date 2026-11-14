/** Joins class names, skipping falsy values. Small enough that a dependency isn't worth it. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
