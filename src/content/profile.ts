import type { z } from "zod";
import type { profileSchema } from "./schema";

export const profile = {
  name: { en: "Peter Eshak Abdo", ar: "بيتر إسحاق عبده" },
  initials: "PE",
  role: { en: "Full-Stack Web Developer", ar: "مطوّر ويب Full-Stack" },
  headline: {
    en: "I build web platforms people actually use — fast, offline-ready and real-time.",
    ar: "أبني منصات ويب يستخدمها الناس فعلًا — سريعة، تشتغل بدون إنترنت، ولحظية.",
  },
  intro: {
    en: "Full-stack developer working with Next.js, TypeScript, Node.js and Supabase. I've shipped six live apps solo — for my church community and for the print shop I work at.",
    ar: "مطوّر Full-Stack بشتغل بـ Next.js و TypeScript و Node.js و Supabase. نفّذت ست تطبيقات شغّالة لوحدي — لخدمة الكنيسة وللمكتبة اللي بشتغل فيها.",
  },
  bio: [
    {
      en: "I'm a full-stack web developer from Ismailia, Egypt. I wrote my first HTML page in 2019, was teaching it on my blog and YouTube channel a year later, and have spent the last two years shipping production apps with Next.js, TypeScript and Node.js.",
      ar: "أنا مطوّر ويب Full-Stack من الإسماعيلية، مصر. كتبت أول صفحة HTML سنة 2019، وبعدها بسنة كنت بشرح HTML على مدونتي وقناتي على يوتيوب، وآخر سنتين بنفّذ تطبيقات حقيقية بـ Next.js و TypeScript و Node.js.",
    },
    {
      en: "Most of what I build starts with people I know. My church youth needed the Bible, hymns and live quizzes in one place that works offline — so I built Abouna Faltaous. Youth meetings were tracked on paper — so I built a QR attendance PWA. The print shop where I work needed a faster way to make passport photos, ID cards and PDFs — so I built Copy Cat Studio.",
      ar: "أغلب اللي ببنيه بيبدأ من ناس أعرفهم. شباب الكنيسة كانوا محتاجين الكتاب المقدس والألحان والمسابقات اللايف في مكان واحد يشتغل أوفلاين — فعملت أبونا فلتاؤس. الحضور في الاجتماعات كان بيتسجل على ورق — فعملت تطبيق حضور بالـ QR. والمكتبة اللي بشتغل فيها كانت محتاجة طريقة أسرع لصور الباسبور والكارنيهات والـ PDF — فعملت Copy Cat Studio.",
    },
    {
      en: "I'm studying Information Systems at Suez Canal University (class of 2027) and completed NTI's MEAN-stack and ITI's Node.js back-end tracks. I'm now looking for my first full-time role in software — internship, junior or freelance — anywhere I can learn from a real team and ship things that matter.",
      ar: "بدرس نظم معلومات في جامعة قناة السويس (دفعة 2027)، وخلّصت تراك MEAN Stack في NTI وتراك Node.js Back-end في ITI. ودلوقتي بدوّر على أول فرصة حقيقية في البرمجة — تدريب أو Junior أو Freelance — أي مكان أتعلم فيه من فريق حقيقي وأنفّذ حاجات ليها قيمة.",
    },
  ],
  location: { en: "Ismailia, Egypt", ar: "الإسماعيلية، مصر" },
  timezone: "Africa/Cairo",
  availability: {
    open: true,
    label: { en: "Open to opportunities", ar: "متاح لفرص جديدة" },
    detail: {
      en: "Internships, junior roles and freelance — anything that brings real-world experience.",
      ar: "تدريب، وظيفة Junior، أو Freelance — أي حاجة فيها خبرة حقيقية.",
    },
    roles: [
      { en: "Full-stack (Next.js / Node.js)", ar: "Full-stack (Next.js / Node.js)" },
      { en: "Front-end (React / Angular)", ar: "Front-end (React / Angular)" },
      { en: "Back-end (Node.js / Express)", ar: "Back-end (Node.js / Express)" },
    ],
  },
  stats: [
    { value: "2019", label: { en: "writing for the web since", ar: "بكتب للويب من سنة" } },
    { value: "2y", label: { en: "shipping with Next.js", ar: "بنفّذ بـ Next.js" } },
    { value: "6", label: { en: "live apps, built solo", ar: "تطبيقات شغّالة، لوحدي" } },
    { value: "25+", label: { en: "sections in my flagship platform", ar: "قسم في أكبر مشروع ليّا" } },
  ],
  contact: {
    email: "petereshak11@gmail.com",
    whatsapp: "https://wa.me/message/AOH44Q2TY3H2E1",
    phones: [
      { display: "+20 122 133 1602", tel: "+201221331602" },
      { display: "+20 120 222 4608", tel: "+201202224608" },
    ],
  },
  socials: {
    github: "https://github.com/Peter-Eshak-Abdo",
    linkedin: "https://www.linkedin.com/in/peter-eshak-a177491b9/",
    youtube: "https://www.youtube.com/channel/UCdt02aWMr-mlqM2eC8A_brg",
    blog: "https://peter-eshak.blogspot.com/",
  },
  cvPdf: "/media/cv/Peter-Eshak-Abdo-CV.pdf",
  portrait: {
    src: "/media/portrait/portrait",
    alt: { en: "Professional headshot of Peter Eshak Abdo", ar: "صورة شخصية احترافية لبيتر إسحاق عبده" },
  },
  softSkills: [
    { en: "Self-education", ar: "التعلّم الذاتي" },
    { en: "Problem solving", ar: "حل المشكلات" },
    { en: "Working under pressure", ar: "الشغل تحت ضغط" },
    { en: "Public speaking & mentoring", ar: "التحدث والتدريب" },
    { en: "Teamwork & collaboration", ar: "العمل الجماعي" },
    { en: "Task prioritization", ar: "ترتيب الأولويات" },
    { en: "Customer service", ar: "خدمة العملاء" },
    { en: "Time management", ar: "إدارة الوقت" },
    { en: "Adaptability", ar: "المرونة" },
    { en: "Active listening", ar: "الاستماع الفعّال" },
  ],
  spokenLanguages: [
    { name: { en: "Arabic", ar: "العربية" }, level: { en: "Native", ar: "اللغة الأم" } },
    { name: { en: "English", ar: "الإنجليزية" }, level: { en: "Intermediate (B1)", ar: "متوسط (B1)" } },
  ],
} satisfies z.input<typeof profileSchema>;
