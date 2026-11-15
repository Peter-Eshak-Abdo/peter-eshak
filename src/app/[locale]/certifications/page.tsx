import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { CertGallery } from "@/components/certs/cert-gallery";
import { SectionHeading } from "@/components/ui/bits";
import { ButtonAnchor } from "@/components/ui/button";
import { certifications, certificationsAlbum } from "@/content";
import { getDictionary } from "@/i18n";
import { formatMonth, isLocale, tr } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({ locale, path: "/certifications", title: dict.certifications.title, description: dict.certifications.intro });
}

export default async function CertificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  // Featured first, then newest.
  const sorted = [...certifications].sort((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date));
  const certs = sorted.map((c) => ({
    slug: c.slug,
    title: tr(c.title, locale),
    issuer: c.issuer,
    date: formatMonth(c.date, locale),
    featured: c.featured,
    topic: c.topic,
    topicLabel: dict.certifications.topics[c.topic],
  }));
  const topicOrder = ["web", "programming", "office", "education", "design", "business", "marketing", "engineering"] as const;
  const topics = topicOrder.filter((t) => certifications.some((c) => c.topic === t)).map((t) => ({ id: t, label: dict.certifications.topics[t] }));

  return (
    <div className="container-page pt-32 sm:pt-40">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading as="h1" command="ls ~/certificates" title={dict.certifications.title} intro={dict.certifications.intro} tone="apricot" />
        <ButtonAnchor href={certificationsAlbum} variant="secondary">
          {dict.actions.openAlbum}
          <ArrowUpRight size={16} className="rtl:-scale-x-100" aria-hidden="true" />
        </ButtonAnchor>
      </div>
      <div className="mt-12">
        <CertGallery
          certs={certs}
          topics={topics}
          labels={{
            close: dict.a11y.close,
            previous: dict.a11y.previous,
            next: dict.a11y.next,
            view: dict.actions.viewCertificate,
            featured: dict.certifications.featured,
            all: dict.certifications.all,
            allFilter: dict.projects.filters.all,
            count: dict.certifications.count,
            filterLabel: dict.certifications.filterLabel,
          }}
        />
      </div>
    </div>
  );
}
