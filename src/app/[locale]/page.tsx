import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeaturedStack } from "@/components/home/featured-stack";
import { Hero } from "@/components/home/hero";
import { PipelineRail } from "@/components/home/pipeline-rail";
import { AboutBento, ContactSection, JourneyPreview, StackPreview } from "@/components/home/sections";
import { FeaturedCard } from "@/components/projects/featured-card";
import { SectionHeading } from "@/components/ui/bits";
import { featuredProjects, journey, profile, skills } from "@/content";
import { getDictionary } from "@/i18n";
import { getLatestActivity } from "@/lib/github";
import { href, isLocale, tr } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({ locale });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const activity = await getLatestActivity();
  const r = dict.home.rail;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: tr(profile.name, "en"),
    alternateName: tr(profile.name, "ar"),
    jobTitle: tr(profile.role, "en"),
    url: `${SITE_URL}${href(locale)}`,
    image: `${SITE_URL}${profile.portrait.src}-900.webp`,
    email: `mailto:${profile.contact.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Ismailia", addressCountry: "EG" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Suez Canal University" },
    knowsLanguage: ["ar", "en"],
    sameAs: [profile.socials.github, profile.socials.linkedin],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} />
      <PipelineRail
        label={r.label}
        stages={[
          { id: "hello", label: r.hello },
          { id: "work", label: r.work },
          { id: "about", label: r.about },
          { id: "stack", label: r.stack },
          { id: "journey", label: r.journey },
          { id: "contact", label: r.contact },
        ]}
      />
      <Hero locale={locale} dict={dict} profile={profile} activity={activity} />

      <section id="work" aria-labelledby="work-title" className="container-page scroll-mt-24 py-24 sm:py-32">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading command="ls ~/work --featured" title={dict.home.featuredTitle} intro={dict.home.featuredIntro} id="work-title" tone="mint" />
          <Link href={href(locale, "/projects")} className="group inline-flex items-center gap-1.5 text-sm font-medium">
            <span className="underline decoration-line-strong underline-offset-4 group-hover:decoration-accent">{dict.actions.allProjects}</span>
            <ArrowUpRight size={15} className="rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
        <FeaturedStack
          cards={featuredProjects.map((project, i) => (
            <FeaturedCard key={project.slug} project={project} index={i} total={featuredProjects.length} locale={locale} dict={dict} />
          ))}
        />
      </section>

      <AboutBento locale={locale} dict={dict} profile={profile} journey={journey} />
      <StackPreview locale={locale} dict={dict} skills={skills} />
      <JourneyPreview locale={locale} dict={dict} journey={journey.slice(0, 6)} />
      <ContactSection locale={locale} dict={dict} profile={profile} />
    </>
  );
}
