# الحاجات اللي فاضلة عليك ✅

الموقع اتبنى بالكامل على branch اسمه `worktree-portfolio-redesign`، وفيه Pull Request (Draft). كل بند تحت محتاج منك قرار أو صلاحية أنا مقدرش أعملها.

---

## 1) راجع الـ Preview واعمل Merge (أهم خطوة)

1. افتح الـ Pull Request على GitHub. الـ workflow هيبني الموقع ويحط لينك **Preview** في تعليق على الـ PR.
2. لفّ على الصفحات باللغتين وعلى الموبايل: `/en` و `/ar` و `/en/projects` و `/en/projects/abona-faltaus` و `/en/cv`.
3. لو كله تمام: **Ready for review ← Merge**. الـ merge على `main` بينشر الموقع على Firebase أوتوماتيك.

> لو الـ Preview منزلش، اتأكد إن الـ secret `FIREBASE_SERVICE_ACCOUNT_TOFA7A_5E936` لسه موجود في
> GitHub → Settings → Secrets → Actions (كان موجود قبل كده).

## 2) اسم الموقع والريبو ✅ (اتعملت)

- الموقع بقى على **https://peter-eshak.web.app**. والـ site ده كان موجود في مشروع Firebase بتاعك أصلًا.
- `tofa7a-5e936.web.app` بعد الـ Merge هيعمل **Redirect 301** لكل صفحة على الدومين الجديد، فاللينكات القديمة هتفضل شغالة.
- الريبو اتغير اسمه لـ **`Peter-Eshak-Abdo/peter-eshak`**، و GitHub بيحوّل اللينكات القديمة أوتوماتيك.
- حاجات مينفعش تتغير: **Project ID** بتاع Firebase (`tofa7a-5e936`) ثابت للأبد، لكنه مش بيظهر لأي حد. ولو عايز، غيّر الـ **Display name** بس من Firebase Console ← Project settings.
- عليك:
  - حدّث لينك الموقع في **LinkedIn** و**بروفايل GitHub** وفي **الـ CV** (خانة Portfolio في ملف الـ Word/PDF).
  - اسم الفولدر على جهازك لسه `P:\Projects\tofa7a`. غيّره بعد ما تقفل أي برنامج فاتحه (VS Code / Claude).
  - اختياري: اسم الـ secret `FIREBASE_SERVICE_ACCOUNT_TOFA7A_5E936` داخلي ومش بيظهر. لو حابب تغيّره، اعمل secret جديد بنفس القيمة وعدّل الاسم في الـ workflows.

## 3) راجع المعلومات اللي استنتجتها (صحّح أي حاجة غلط في `src/content/`)

| المعلومة | الملف | محتاج تأكيد |
| --- | --- | --- |
| بداية الكلية 2023 | `journey.ts` | ✔︎ / ✘ |
| أول تطبيق Next.js حقيقي سنة 2024 | `journey.ts` | ✔︎ / ✘ |
| أبونا فلتاؤس: 25+ قسم، ~30 API route، 13 تصنيف امتحانات | `projects.ts` | الأرقام اتعدّت من الريبو |
| Copy Cat: 355 منتج، 15+ أداة داخلية | `projects.ts` | من الموقع والريبو |
| شباب النسور: الإشعارات بـ OneSignal ولا FCM ولا الاتنين؟ | `projects.ts` | الـ CV بيقول OneSignal والريبو بيقول FCM |
| "6 تطبيقات شغالة لوحدي" | `profile.ts` | أبونا فلتاؤس، النسور، Copy Cat، نوتة، VoiceClear، PharmaHub |
| شهادة Excel: الجهة "Seattle" | `certifications.ts` | اسم الجهة كامل |
| شهادة إدراك (معالج النصوص): سنة 2020 | `certifications.ts` | السنة |
| الصيدلية: "Community pharmacy" | `journey.ts` | تحب تكتب اسمها؟ |

## 4) راجع الترجمة العربية

كل النصوص العربية كتبتها أنا بالعامية المصرية المهذبة. راجعها وعدّل اللي مش على مزاجك:

- `src/i18n/ar.ts`: نصوص الواجهة (الأزرار والعناوين).
- `src/content/*.ts`: كل حقل `ar:`.

## 5) أرقام حقيقية (هتفرق جدًا مع اللي بيوظفوا)

لو عندك أرقام من **Vercel Analytics** أو **Google Search Console** (عدد الزوار، المستخدمين، الامتحانات اللي اتعملت…)، ضيفها في `metrics` لكل مشروع في `src/content/projects.ts`.

## 6) صور المشاريع

أضفت **معرض صور جوه كل مشروع**: 12 صورة لأبونا فلتاؤس، و5 لـ Copy Cat، و3 لـ PharmaHub، وصورة موبايل لكل من النسور ونوتة و VoiceClear. كلهم screenshots حقيقية من المواقع اللايف.
عشان تضيف صور بنفسك (مثلًا صور من جوه النسور بعد تسجيل الدخول):

1. حط الصورة في `assets/gallery/<slug>/<name>.png`. للديسكتوب 1440×900، وللموبايل 390×844 (أو ضعفها).
2. ضيفها في `gallery` بتاع المشروع في `src/content/projects.ts`، ومعاها caption بالعربي والإنجليزي، و `device: "mobile"` لو صورة موبايل.
3. شغّل `npm run images`. ولو نسيت صورة، الـ build هيقولك بالظبط أنهي واحدة ناقصة.

### الصورة الرئيسية لكل مشروع (اختياري)

الصور الحالية screenshots أخدتها أوتوماتيك من المواقع اللايف. لو عايز صور أجمل (مثلًا لقطة من جوه أبونا فلتاؤس، أو لقطة موبايل):

1. حط الصورة في `assets/projects/<slug>.png` (مقاس 1440×900 مثالي).
2. شغّل `npm run images` واعمل commit.

## 7) الـ CV

- لينك الـ CV على LinkedIn **مؤقت وهيقف يوم 26 نوفمبر 2026**. الموقع دلوقتي فيه نسخة خاصة بيه على `/media/cv/Peter-Eshak-Abdo-CV.pdf` ونسخة HTML تتطبع على `/cv`.
- لما تحدّث الـ CV: حط الـ PDF الجديد مكان `assets/Peter-Eshak-Abdo-CV.pdf` وشغّل `npm run images`.

## 8) تنضيف الريبو الأصلي (بعد الـ Merge)

في الـ checkout الأساسي عندك حاجتين متعملهمش commit:

- `app/page.tsx` و `package.json`: دي الـ draft القديمة. المعلومات اللي فيها اتنقلت كلها للموقع الجديد، فتقدر تمسحها بـ `git checkout -- app/page.tsx package.json`.
- `Peter Eshak Abdo.pdf` في أول الريبو: اتنسخ في `assets/`، فتقدر تمسحه.

## 9) أيقونة الموقع ⚠️

الصورة اللي بعتها كـ "Image #3" للأيقونة **موصلتليش** (مكانش ليها مسار على الجهاز). فمؤقتًا عملت الأيقونة **دايرة من صورتك البروفيشنال**. لو عايز صورة تانية:

1. حطها مكان `assets/portrait.png`، أو ابعتلي مسارها وأنا أركّبها.
2. شغّل `npm run images`. ده هيولّد `src/app/icon.png` و `apple-icon.png` و `public/icons/*`.

## 10) الأمان 🔒 (اتعمل)

- **CSP صارم لكل صفحة** فيه hashes بالظبط لكل inline script، و**SRI** على كل ملف JS و CSS. جربت أحقن script على الـ Preview **واتمنع**.
- **Headers:** HSTS preload، و COOP/COEP/CORP (الموقع `crossOriginIsolated`)، و Permissions-Policy كاملة، و `frame-ancestors 'none'`، وغيرهم. التفاصيل في `SECURITY.md`.
- **GitHub:** شغّلت Secret scanning + Push protection، و Dependabot security updates، و Private vulnerability reporting، و **CodeQL** (extended). والـ Actions متثبتة على commit SHAs.
- **عليك (اختياري):**
  - فعّل **2FA** على حساب GitHub و Google (Firebase) لو مش مفعّل.
  - اعمل **Branch protection** على `main` (Settings ← Branches): مفيش push مباشر، وكل حاجة تعدّي من PR والـ checks تبقى خضرا. مسيبتهاش أنا عشان انت بتعمل push مباشر أحيانًا.
  - بعد ما الموقع يبقى لايف، اختبره على https://securityheaders.com و https://observatory.mozilla.org .

## 11) الشهادات

- اتضافت كل الشهادات اللي في فولدر `Certificates` (**81 شهادة في المجموع**)، ومعاها فلترة حسب المجال و7 مميزين في الأول.
- استبعدت التكرارات: النسخة العربي من شهادة Excel، ونسخة BitDegree التانية، وشهادة Kingston اللي طالعة فاضية من غير اسم.
- تواريخ شهادات Microsoft Educator Center كلها أكتوبر 2020. وشهادة Minecraft Hour of Code (Code.org) مكتوب عليها 2020 بس، من غير شهر. لو عندك التاريخ بالظبط عدّله في `src/content/certifications.ts`.

## 12) تحسينات اختيارية بعدين

- **الأداء على الموبايل**: Lighthouse بيدي ~80 (ووقت الـ LCP الفعلي أقل من ثانية، بس المحاكاة بتحسب حجم الـ JS). لو عايز توصل لـ 90+، ممكن نخفف Motion في الصفحات الداخلية.
- **مدونة / مقالات** عن اللي اتعلمته (المحتوى ده بيساعد جدًا في البحث).
- **صورة OG بالعربي**: محتاجة ملف خط عربي يتحط مع الـ build.
