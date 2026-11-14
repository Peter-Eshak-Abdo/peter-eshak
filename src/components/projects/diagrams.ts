import type { Accent } from "@/content/schema";
import type { Localized } from "@/lib/i18n";

export type DiagramNode = { id: string; label: string; sub: string; x: number; y: number; tone: Accent };
export type DiagramEdge = { id: string; from: string; to: string; label: string; bend?: number };
export type Scenario = { id: string; title: Localized; path: string[]; steps: Localized[] };
export type Diagram = { width: number; height: number; nodes: DiagramNode[]; edges: DiagramEdge[]; scenarios: Scenario[] };

/** Node labels are technical names and stay in English; scenario text is localized. */
export const diagrams: Record<"abona-faltaus" | "ai-pipeline", Diagram> = {
  "abona-faltaus": {
    width: 800,
    height: 440,
    nodes: [
      { id: "admin", label: "Servant", sub: "laptop · admin", x: 120, y: 70, tone: "apricot" },
      { id: "client", label: "Next.js PWA", sub: "youth · phones", x: 120, y: 220, tone: "mint" },
      { id: "sw", label: "Service worker", sub: "offline cache", x: 120, y: 370, tone: "mint" },
      { id: "socket", label: "Socket.io server", sub: "Express · rooms", x: 400, y: 70, tone: "lavender" },
      { id: "api", label: "API routes", sub: "Vercel functions", x: 400, y: 220, tone: "sky" },
      { id: "supabase", label: "Supabase", sub: "Postgres · auth", x: 680, y: 220, tone: "mint" },
      { id: "ai", label: "Gemini · AI SDK", sub: "RAG · chat · TTS", x: 680, y: 370, tone: "lavender" },
    ],
    edges: [
      { id: "start", from: "admin", to: "socket", label: "start-exam", bend: -30 },
      { id: "score", from: "socket", to: "admin", label: "answer-submitted", bend: -30 },
      { id: "question", from: "socket", to: "client", label: "question", bend: -28 },
      { id: "answer", from: "client", to: "socket", label: "submit-answer", bend: -28 },
      { id: "cache", from: "client", to: "sw", label: "cache-first" },
      { id: "fetch", from: "client", to: "api", label: "fetch" },
      { id: "query", from: "api", to: "supabase", label: "query" },
      { id: "prompt", from: "api", to: "ai", label: "retrieve + prompt" },
    ],
    scenarios: [
      {
        id: "quiz",
        title: { en: "Live team quiz", ar: "مسابقة فرق لايف" },
        path: ["start", "question", "answer", "score"],
        steps: [
          { en: "The servant opens a room and starts the exam from a laptop.", ar: "الخادم بيفتح غرفة ويبدأ الامتحان من اللابتوب." },
          { en: "The server shuffles the questions and broadcasts one to every team in the room.", ar: "السيرفر بيلخبط الأسئلة ويبعت سؤال لكل الفرق في الغرفة." },
          { en: "Each team answers from its phone; the server scores it.", ar: "كل فريق بيجاوب من موبايله؛ والسيرفر بيصحح." },
          { en: "The servant's scoreboard updates live.", ar: "لوحة نتايج الخادم بتتحدث لايف." },
        ],
      },
      {
        id: "offline",
        title: { en: "Reading offline", ar: "قراءة أوفلاين" },
        path: ["cache", "fetch", "query"],
        steps: [
          { en: "Bible, Agpeya and readings are served from the service-worker cache — no signal needed.", ar: "الكتاب المقدس والأجبية والقراءات بتتقري من كاش الـ Service Worker — من غير شبكة." },
          { en: "When the connection returns, the app fetches fresh data through the API.", ar: "لما الشبكة ترجع، التطبيق بيجيب البيانات الجديدة من الـ API." },
          { en: "API routes read the latest content from Supabase.", ar: "الـ API بيقرا آخر محتوى من Supabase." },
        ],
      },
      {
        id: "ai",
        title: { en: "AI Bible search", ar: "بحث AI في الكتاب" },
        path: ["fetch", "prompt"],
        steps: [
          { en: "A question is sent to an API route.", ar: "السؤال بيتبعت لـ API route." },
          { en: "The route retrieves the most relevant commentary passages and asks Gemini to answer from them (RAG).", ar: "الـ route بيجيب أقرب مقاطع من التفاسير ويطلب من Gemini يجاوب منها (RAG)." },
        ],
      },
    ],
  },
  "ai-pipeline": {
    width: 800,
    height: 440,
    nodes: [
      { id: "phone", label: "Telegram", sub: "my phone", x: 100, y: 70, tone: "sky" },
      { id: "bot", label: "Bot", sub: "Python · Actions", x: 300, y: 70, tone: "apricot" },
      { id: "notion", label: "Notion DB", sub: "task queue", x: 500, y: 70, tone: "mint" },
      { id: "action", label: "notion-to-pr", sub: "scheduled Action", x: 700, y: 70, tone: "lavender" },
      { id: "g25", label: "Gemini 2.5 Flash", sub: "model 1", x: 700, y: 200, tone: "lavender" },
      { id: "g20", label: "Gemini 2.0 Flash", sub: "fallback 1", x: 700, y: 290, tone: "lavender" },
      { id: "groq", label: "Groq Llama 3.3", sub: "fallback 2", x: 700, y: 380, tone: "lavender" },
      { id: "github", label: "GitHub", sub: "branch + PR", x: 400, y: 290, tone: "mint" },
      { id: "review", label: "Me", sub: "review & merge", x: 120, y: 290, tone: "sky" },
    ],
    edges: [
      { id: "msg", from: "phone", to: "bot", label: "message" },
      { id: "task", from: "bot", to: "notion", label: "create task" },
      { id: "next", from: "notion", to: "action", label: "next ready task" },
      { id: "prompt", from: "action", to: "g25", label: "prompt" },
      { id: "fb1", from: "g25", to: "g20", label: "quota → fallback" },
      { id: "fb2", from: "g20", to: "groq", label: "fallback" },
      { id: "files25", from: "g25", to: "github", label: "files" },
      { id: "files20", from: "g20", to: "github", label: "files" },
      { id: "files-groq", from: "groq", to: "github", label: "files" },
      { id: "pr", from: "github", to: "review", label: "pull request" },
      { id: "status", from: "github", to: "notion", label: "status", bend: 30 },
    ],
    scenarios: [
      {
        id: "capture",
        title: { en: "Capture a task", ar: "تسجيل مهمة" },
        path: ["msg", "task"],
        steps: [
          { en: "I text the bot an emoji-tagged task from my phone.", ar: "ببعت للبوت مهمة متعلّمة بالإيموجي من موبايلي." },
          { en: "The bot parses it and creates a structured task in Notion, then replies with the link.", ar: "البوت بيحللها ويعمل مهمة منظمة في نوشن ويرد باللينك." },
        ],
      },
      {
        id: "pr",
        title: { en: "Generate a PR", ar: "توليد PR" },
        path: ["next", "prompt", "files25", "pr", "status"],
        steps: [
          { en: "On schedule, the Action picks the next ready task whose dependencies are done.", ar: "في ميعاده، الـ Action بيختار المهمة الجاهزة اللي اعتمادياتها خلصت." },
          { en: "It builds a prompt from the repo's file tree and docs and sends it to Gemini.", ar: "بيبني prompt من شجرة الملفات والتوثيق ويبعته لـ Gemini." },
          { en: "Valid JSON files come back and are committed to a new branch.", ar: "بترجع ملفات JSON سليمة وبتتعمل Commit على Branch جديد." },
          { en: "A pull request is opened for my review, and the Notion status is updated.", ar: "بيتفتح Pull Request أراجعه، والحالة في نوشن بتتحدث." },
        ],
      },
      {
        id: "fallback",
        title: { en: "Quota hit → fallback", ar: "الحد خلص ← بديل" },
        path: ["prompt", "fb1", "files20", "pr"],
        steps: [
          { en: "Gemini 2.5 Flash returns a quota error.", ar: "Gemini 2.5 Flash بيرجّع خطأ إن الحد خلص." },
          { en: "The run falls through to Gemini 2.0 Flash (then Groq if needed).", ar: "التشغيل بيعدّي لـ Gemini 2.0 Flash (وبعده Groq لو احتاج)." },
          { en: "The pull request still lands — no manual retry.", ar: "والـ Pull Request بيتفتح برضه — من غير إعادة يدوية." },
        ],
      },
    ],
  },
};
