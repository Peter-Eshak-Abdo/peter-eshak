import type { z } from "zod";
import type { journeySchema } from "./schema";

/** Newest first. */
export const journey: z.input<typeof journeySchema>[] = [
  {
    id: "nti-mean",
    kind: "course",
    start: "2026-07",
    end: "2026-08",
    title: { en: "MEAN-Stack Web Development", ar: "تطوير الويب MEAN-Stack" },
    org: { en: "NTI × ITIDA — National Telecommunication Institute", ar: "المعهد القومي للاتصالات (NTI) و ITIDA" },
    points: [
      {
        en: "120-hour summer training (90 technical + 30 freelancing hours), 26 July – 20 August 2026 — finished with a score of 98%.",
        ar: "تدريب صيفي 120 ساعة (90 ساعة تقنية + 30 ساعة Freelancing)، من 26 يوليو لـ 20 أغسطس 2026 — وخلّصته بتقدير 98%.",
      },
      {
        en: "MongoDB, Express, Angular and Node.js end to end; built PharmaHub as the track project.",
        ar: "MongoDB و Express و Angular و Node.js من الأول للآخر؛ وعملت PharmaHub كمشروع التراك.",
      },
    ],
    tags: ["Angular", "MongoDB", "Express", "Node.js"],
  },
  {
    id: "iti-node",
    kind: "course",
    start: "2026-07",
    end: "2026-08",
    title: { en: "Backend Fundamentals using Node.js", ar: "أساسيات الـ Backend باستخدام Node.js" },
    org: { en: "ITI — Information Technology Institute", ar: "معهد تكنولوجيا المعلومات (ITI)" },
    points: [
      {
        en: "162 hours, 1 July – 15 August 2026: client-side technologies, modern JavaScript (ES6+), Node.js application development, MongoDB, scalable APIs with NestJS, generative AI, AI agents & workflow automation, freelancing and a final project.",
        ar: "162 ساعة، من 1 يوليو لـ 15 أغسطس 2026: تقنيات الـ Client-side، و JavaScript الحديثة (ES6+)، وتطوير تطبيقات Node.js، و MongoDB، وبناء APIs قابلة للتوسع بـ NestJS، والـ Generative AI والـ AI Agents وأتمتة الـ Workflows، والـ Freelancing، ومشروع نهائي.",
      },
    ],
    tags: ["Node.js", "NestJS", "MongoDB", "AI agents"],
  },
  {
    id: "first-production-app",
    kind: "milestone",
    start: "2024",
    title: { en: "Moved to Next.js and shipped my first production app", ar: "انتقلت لـ Next.js ونشرت أول تطبيق حقيقي" },
    org: { en: "Abouna Faltaous", ar: "أبونا فلتاؤس" },
    points: [
      {
        en: "Rebuilt the first HTML version of Abouna Faltaous in Next.js and TypeScript; it has grown into a 25-section platform.",
        ar: "أعدت بناء أول نسخة HTML من أبونا فلتاؤس بـ Next.js و TypeScript؛ وكبرت لحد ما بقت منصة فيها 25 قسم.",
      },
    ],
    tags: ["Next.js", "TypeScript"],
  },
  {
    id: "copy-cat",
    kind: "work",
    start: "2023-12",
    end: "present",
    title: { en: "Document & Print Services Specialist", ar: "أخصائي خدمات الطباعة والمستندات" },
    org: { en: "Copy Cat — Print & Copy Office", ar: "كوبي كات — مكتبة طباعة وتصوير" },
    place: { en: "Ismailia, Egypt", ar: "الإسماعيلية، مصر" },
    points: [
      {
        en: "Run daily operations in a high-volume document-services centre and handle customer requests end to end.",
        ar: "بدير التشغيل اليومي في مركز خدمات مستندات عليه ضغط شغل كبير، وبتابع طلبات العملاء من البداية للنهاية.",
      },
      {
        en: "Format and edit complex documents, research papers and presentations in Word, PowerPoint and Excel.",
        ar: "بنسّق وأعدّل مستندات وأبحاث وعروض تقديمية معقدة على Word و PowerPoint و Excel.",
      },
      {
        en: "Built Copy Cat Studio — the shop's storefront and 15+ internal tools — to automate the repetitive work.",
        ar: "عملت Copy Cat Studio — متجر المكتبة وأكتر من 15 أداة داخلية — عشان أخلّي الشغل المتكرر أوتوماتيك.",
      },
    ],
    tags: ["Customer service", "MS Office", "Next.js"],
  },
  {
    id: "scu",
    kind: "education",
    start: "2023",
    end: "2027",
    title: { en: "B.Sc. Computers & Information — Information Systems", ar: "بكالوريوس حاسبات ومعلومات — نظم معلومات" },
    org: { en: "Suez Canal University", ar: "جامعة قناة السويس" },
    place: { en: "Ismailia, Egypt", ar: "الإسماعيلية، مصر" },
    points: [
      {
        en: "Expected graduation 2027. Coursework includes databases, programming in Python, Java and C++, information security and mobile computing.",
        ar: "التخرج المتوقع 2027. المواد تشمل قواعد البيانات، والبرمجة بـ Python و Java و C++، وأمن المعلومات، والـ Mobile Computing.",
      },
    ],
    tags: [],
  },
  {
    id: "pharmacy",
    kind: "work",
    start: "2021-07",
    end: "2021-09",
    title: { en: "Pharmacy Assistant", ar: "مساعد صيدلي" },
    org: { en: "Community pharmacy", ar: "صيدلية" },
    place: { en: "Ismailia, Egypt", ar: "الإسماعيلية، مصر" },
    points: [
      {
        en: "Supported pharmacists with inventory management, stock organisation and keeping a hygienic environment.",
        ar: "ساعدت الصيادلة في إدارة المخزون وترتيب البضاعة والحفاظ على بيئة نضيفة.",
      },
    ],
    tags: [],
  },
  {
    id: "teaching",
    kind: "milestone",
    start: "2020",
    title: { en: "Started teaching what I learned", ar: "بدأت أشرح اللي اتعلمته" },
    org: { en: "Blog & YouTube", ar: "المدونة ويوتيوب" },
    points: [
      {
        en: "Wrote beginner HTML and Adobe Illustrator courses in Arabic and earned the Microsoft Technology Associate certificate in HTML5.",
        ar: "كتبت كورسات HTML و Adobe Illustrator للمبتدئين بالعربي، وأخدت شهادة Microsoft Technology Associate في HTML5.",
      },
    ],
    tags: ["HTML", "Teaching"],
  },
  {
    id: "first-line",
    kind: "milestone",
    start: "2019",
    title: { en: "Wrote my first line of HTML", ar: "كتبت أول سطر HTML" },
    org: { en: "Self-taught", ar: "تعلّم ذاتي" },
    points: [
      {
        en: "Taught myself HTML and CSS from free courses — the start of everything on this page.",
        ar: "علّمت نفسي HTML و CSS من كورسات مجانية — ودي بداية كل اللي في الصفحة دي.",
      },
    ],
    tags: ["HTML", "CSS"],
  },
];
