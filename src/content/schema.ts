import { z } from "zod";

/**
 * Content schemas. Every content file is validated at build time (see ./index.ts),
 * so a typo in a URL or a missing translation fails the build instead of shipping.
 */

export const localized = z.object({ en: z.string().min(1), ar: z.string().min(1) });
const url = z.url({ protocol: /^https?$/ });
const yearMonth = z.string().regex(/^\d{4}(-\d{2})?$/, "Use YYYY or YYYY-MM");
const slug = z.string().regex(/^[a-z0-9-]+$/);

export const accent = z.enum(["mint", "apricot", "lavender", "sky"]);

export const profileSchema = z.object({
  name: localized,
  initials: z.string().length(2),
  role: localized,
  headline: localized,
  intro: localized,
  bio: z.array(localized).min(1),
  location: localized,
  timezone: z.string(),
  availability: z.object({
    open: z.boolean(),
    label: localized,
    detail: localized,
    roles: z.array(localized),
  }),
  stats: z.array(z.object({ value: z.string(), label: localized })),
  contact: z.object({
    email: z.email(),
    whatsapp: url,
    phones: z.array(z.object({ display: z.string(), tel: z.string().regex(/^\+\d+$/) })),
  }),
  socials: z.object({ github: url, linkedin: url, youtube: url, blog: url }),
  cvPdf: z.string().startsWith("/media/"),
  portrait: z.object({ src: z.string().startsWith("/media/"), alt: localized }),
  softSkills: z.array(localized),
  spokenLanguages: z.array(z.object({ name: localized, level: localized })),
});

const snippetSchema = z.object({
  title: localized,
  file: z.string(),
  lang: z.enum(["javascript", "typescript", "python", "yaml"]),
  source: z.string(),
  caption: localized,
});

const caseStudySchema = z.object({
  challenge: localized,
  approach: z.array(z.object({ title: localized, body: localized })),
  diagram: z.enum(["abona-faltaus", "ai-pipeline"]).optional(),
  snippets: z.array(snippetSchema),
  outcome: localized,
  learned: localized,
});

export const projectCategory = z.enum(["product", "backend", "automation", "academic", "early", "teaching"]);

export const projectSchema = z.object({
  slug,
  title: localized,
  tagline: localized,
  summary: localized,
  category: projectCategory,
  featured: z.number().int().positive().optional(),
  year: z.string(),
  role: localized,
  status: z.enum(["live", "private", "archived", "concept", "content"]),
  stack: z.array(z.string()).min(1),
  links: z.object({ live: url.optional(), repo: url.optional() }),
  highlights: z.array(localized),
  metrics: z.array(z.object({ value: z.string(), label: localized })).max(4),
  image: z.object({ name: slug, alt: localized }).optional(),
  /** Extra screenshots: assets/gallery/<project-slug>/<name>.png */
  gallery: z.array(z.object({ name: slug, caption: localized, device: z.enum(["desktop", "mobile"]).default("desktop") })).default([]),
  accent,
  caseStudy: caseStudySchema.optional(),
});

export const skillGroupSchema = z.object({
  id: slug,
  title: localized,
  description: localized,
  accent,
  items: z.array(
    z.object({
      name: z.string(),
      level: z.enum(["daily", "solid", "familiar"]),
      since: z.string().optional(),
    }),
  ),
});

export const journeySchema = z.object({
  id: slug,
  kind: z.enum(["work", "education", "course", "milestone"]),
  start: yearMonth,
  end: z.union([yearMonth, z.literal("present")]).optional(),
  title: localized,
  org: localized,
  place: localized.optional(),
  points: z.array(localized),
  tags: z.array(z.string()).default([]),
});

export const certificationSchema = z.object({
  slug,
  title: localized,
  issuer: z.string(),
  date: yearMonth,
  featured: z.boolean(),
  topic: z.enum(["web", "office", "business", "marketing"]),
});

export type Profile = z.infer<typeof profileSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectCategory = z.infer<typeof projectCategory>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type Snippet = z.infer<typeof snippetSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type JourneyEntry = z.infer<typeof journeySchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Accent = z.infer<typeof accent>;
