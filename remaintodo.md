# الحاجات اللي فاضلة عليك ✅

الموقع اتبنى بالكامل على branch اسمه `worktree-portfolio-redesign`، وفيه Pull Request (Draft). كل بند تحت محتاج منك قرار أو صلاحية أنا مقدرش أعملها.

---

## 1) راجع الـ Preview واعمل Merge (أهم خطوة)

1. افتح الـ Pull Request على GitHub. الـ workflow هيبني الموقع ويحط لينك **Preview** في تعليق على الـ PR.
2. لفّ على الصفحات باللغتين وعلى الموبايل: `/en` و `/ar` و `/en/projects` و `/en/projects/abona-faltaus` و `/en/cv`.
3. لو كله تمام: **Ready for review ← Merge**. الـ merge على `main` بينشر الموقع على Firebase أوتوماتيك.

> لو الـ Preview منزلش، اتأكد إن الـ secret `FIREBASE_SERVICE_ACCOUNT_TOFA7A_5E936` لسه موجود في
> GitHub → Settings → Secrets → Actions (كان موجود قبل كده).

## 2) دومين جديد من غير "tofa7a" (اتفقنا عليها)

اسم مشروع Firebase مينفعش يتغير، بس ممكن تعمل **site** جديد جوه نفس المشروع:

```bash
firebase login
firebase hosting:sites:create peter-eshak-abdo        # لو الاسم محجوز جرّب اسم تاني
firebase target:apply hosting portfolio peter-eshak-abdo
```

وبعدها عدّل 3 حاجات (أو قولّي وأنا أعدلها):

- `firebase.json`: ضيف `"target": "portfolio"` جوه `hosting`.
- الـ workflows في `.github/workflows/*.yml`: ضيف `target: portfolio` تحت `with:` في خطوة `action-hosting-deploy`، وضيف `NEXT_PUBLIC_SITE_URL: https://peter-eshak-abdo.web.app` في `env` بتاع خطوة الـ build.
- اختياري: خلّي `tofa7a-5e936.web.app` يعمل redirect للدومين الجديد.

**وبعدها حدّث اللينك** في: LinkedIn، والـ CV (خانة Portfolio)، وبروفايل GitHub.

## 3) راجع المعلومات اللي استنتجتها (صحّح أي حاجة غلط في `src/content/`)

| المعلومة | الملف | محتاج تأكيد |
| --- | --- | --- |
| كورس NTI MEAN: يوليو – سبتمبر 2026 | `journey.ts` | التواريخ بالظبط |
| كورس ITI Node.js: 2026 | `journey.ts` | الشهر |
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

## 6) صور أحسن للمشاريع (اختياري)

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

## 9) تحسينات اختيارية بعدين

- **الأداء على الموبايل**: Lighthouse بيدي ~80 (ووقت الـ LCP الفعلي أقل من ثانية، بس المحاكاة بتحسب حجم الـ JS). لو عايز توصل لـ 90+، ممكن نخفف Motion في الصفحات الداخلية.
- **مدونة / مقالات** عن اللي اتعلمته (المحتوى ده بيساعد جدًا في البحث).
- **صورة OG بالعربي**: محتاجة ملف خط عربي يتحط مع الـ build.
