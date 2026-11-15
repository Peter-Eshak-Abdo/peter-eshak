import type { z } from "zod";
import type { skillGroupSchema } from "./schema";

/** level: daily = use it in almost every project · solid = shipped real work with it · familiar = studied / small projects */
export const skills: z.input<typeof skillGroupSchema>[] = [
  {
    id: "frontend",
    title: { en: "Front-end", ar: "Front-end" },
    description: {
      en: "Interfaces that load fast, work offline and feel good in two languages.",
      ar: "واجهات سريعة، بتشتغل أوفلاين، ومريحة بلغتين.",
    },
    accent: "mint",
    items: [
      { name: "Next.js", level: "daily", since: "2024" },
      { name: "React", level: "daily", since: "2024" },
      { name: "TypeScript", level: "daily", since: "2024" },
      { name: "JavaScript", level: "daily", since: "2020" },
      { name: "Tailwind CSS", level: "daily" },
      { name: "shadcn/ui", level: "solid" },
      { name: "HTML5", level: "daily", since: "2019" },
      { name: "CSS3", level: "daily", since: "2019" },
      { name: "Angular", level: "solid", since: "2026" },
      { name: "SASS / SCSS", level: "solid" },
      { name: "Bootstrap", level: "solid", since: "2023" },
      { name: "jQuery", level: "familiar" },
    ],
  },
  {
    id: "backend",
    title: { en: "Back-end & data", ar: "Back-end وقواعد البيانات" },
    description: {
      en: "APIs, real-time servers and the databases behind them.",
      ar: "APIs وسيرفرات لحظية وقواعد البيانات اللي وراها.",
    },
    accent: "apricot",
    items: [
      { name: "Node.js", level: "daily" },
      { name: "Express.js", level: "solid" },
      { name: "Socket.io", level: "solid" },
      { name: "REST APIs", level: "solid" },
      { name: "JWT auth", level: "solid" },
      { name: "Supabase", level: "solid" },
      { name: "PostgreSQL", level: "solid" },
      { name: "Firebase", level: "daily" },
      { name: "MongoDB / Mongoose", level: "solid", since: "2026" },
      { name: "NestJS", level: "familiar", since: "2026" },
    ],
  },
  {
    id: "automation",
    title: { en: "Tools, cloud & automation", ar: "أدوات، سحابة، وأتمتة" },
    description: {
      en: "Shipping, monitoring and letting machines do the boring parts.",
      ar: "النشر والمتابعة وإن المكن يعمل الجزء الممل.",
    },
    accent: "lavender",
    items: [
      { name: "Git & GitHub", level: "daily" },
      { name: "GitHub Actions", level: "solid" },
      { name: "Vercel", level: "daily" },
      { name: "Firebase Hosting", level: "solid" },
      { name: "PWA / Service Workers", level: "solid" },
      { name: "Gemini & AI SDKs", level: "solid" },
      { name: "AI agents & workflows", level: "familiar", since: "2026" },
      { name: "OneSignal", level: "solid" },
      { name: "Google Search Console", level: "solid" },
      { name: "n8n", level: "familiar" },
      { name: "Make.com", level: "familiar" },
    ],
  },
  {
    id: "mobile-academic",
    title: { en: "Mobile & academic", ar: "موبايل وأكاديمي" },
    description: {
      en: "Languages from university and a year of Flutter.",
      ar: "لغات من الكلية وسنة Flutter.",
    },
    accent: "sky",
    items: [
      { name: "Flutter & Dart", level: "familiar" },
      { name: "Python", level: "familiar" },
      { name: "Java", level: "familiar" },
      { name: "C++", level: "familiar" },
    ],
  },
];
