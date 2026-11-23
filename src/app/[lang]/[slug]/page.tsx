import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/contact-section";
import { ContentArticle } from "@/components/content-article";
import { PageShell } from "@/components/page-shell";
import { alternatesFor } from "@/i18n/config";
import { getLocale, getT } from "@/i18n/server";
import { getPage, getPages } from "@/lib/data";

/**
 * Content pages edited as HTML in Admin → Pages (Terms, Privacy and any page added there), at /{slug}.
 * The coded pages (/videos, /seo, …) are separate routes and always win over a slug.
 */

/** Sample param for builds without the API (Docker). Never a real page, so no real URL gets baked in as a 404. */
const BUILD_PLACEHOLDER = "__placeholder__";

export async function generateStaticParams() {
  const pages = await getPages();
  // Cache Components needs at least one sample param; unknown slugs render on first request
  return pages.length ? pages.map((p) => ({ slug: p.slug })) : [{ slug: BUILD_PLACEHOLDER }];
}

const load = async (slug: string) => (slug === BUILD_PLACEHOLDER ? null : getPage(slug, await getLocale()));

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const page = await load(slug);
  if (!page) return { title: locale === "nl" ? "Pagina niet gevonden — Finloa" : "Page not found — Finloa" };
  return {
    title: page.seoTitle ?? `${page.title} — Finloa`,
    description: page.seoDescription ?? undefined,
    alternates: alternatesFor(locale, `/${page.slug}`),
  };
}

export default async function ContentPageRoute({ params }: PageProps<"/[lang]/[slug]">) {
  const { slug } = await params;
  const [page, locale, t] = await Promise.all([load(slug), getLocale(), getT()]);
  if (!page) notFound();

  /** Extra structured data from the admin (validated as JSON when saved) */
  let jsonLd: unknown = null;
  try {
    jsonLd = page.jsonLd ? JSON.parse(page.jsonLd) : null;
  } catch {}
  const updated = new Date(page.updatedAt).toLocaleDateString(locale === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const legal = page.slug === "terms" || page.slug === "privacy";

  return (
    <PageShell ctaHref="#contact">
      {jsonLd !== null && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
      <ContentArticle
        eyebrow={page.eyebrow}
        title={page.title}
        updated={`${t("Last updated", "Laatst bijgewerkt op")} ${updated}`}
        html={page.html}
        css={page.css}
        sections={page.sections}
      />
      <ContactSection
        source={legal ? "legal" : `page-${page.slug}`.slice(0, 40)}
        intro={
          legal
            ? t(
                "Questions about this policy, or ready to grow? Send us a message and we'll reply within two working days.",
                "Vragen over dit beleid, of klaar om te groeien? Stuur ons een bericht, dan reageren we binnen twee werkdagen.",
              )
            : t(
                "Questions, or ready to grow? Send us a message and we'll reply within two working days.",
                "Vragen, of klaar om te groeien? Stuur ons een bericht, dan reageren we binnen twee werkdagen.",
              )
        }
        fourthField={{ name: "website", placeholder: t("Website", "Website") }}
      />
    </PageShell>
  );
}
