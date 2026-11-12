import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/contact-section";
import { PageShell } from "@/components/page-shell";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { YoutubePlayer } from "@/components/youtube-player";
import { HTML_LANG, SITE_URL } from "@/i18n/config";
import { getLocale, getT } from "@/i18n/server";
import type { PostAuthor } from "@/lib/api";
import { getPost, getPosts } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";
/** Sample param for builds without the API (Docker). Never a real post, so no real URL gets baked in as a 404. */
const BUILD_PLACEHOLDER = "__placeholder__";

export async function generateStaticParams() {
  const posts = await getPosts();
  // Cache Components needs at least one sample param; unknown slugs render on first request
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: BUILD_PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const SITE = SITE_URL[locale];
  const post = slug === BUILD_PLACEHOLDER ? null : await getPost(slug, locale);
  if (!post) return { title: locale === "nl" ? "Artikel niet gevonden — Finloa" : "Post not found — Finloa" };
  const url = `${SITE}/blog/${post.slug}`;
  const image = post.coverImage ?? (post.youtubeId ? `https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg` : undefined);
  const description = post.seoDescription ?? post.excerpt ?? undefined;
  return {
    title: post.seoTitle ?? `${post.title.replace(/\.$/, "")} | Finloa Blog`,
    description,
    alternates: {
      canonical: url,
      languages: { en: `${SITE_URL.en}/blog/${post.slug}`, "nl-NL": `${SITE_URL.nl}/blog/${post.slug}` },
    },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1 },
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      type: "article",
      siteName: "Finloa",
      title: post.seoTitle ?? post.title,
      description,
      url,
      images: image ? [image] : undefined,
      videos: post.youtubeId ? [`https://www.youtube.com/embed/${post.youtubeId}`] : undefined,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: post.topic || undefined,
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.seoTitle ?? post.title, description },
  };
}

const fmtDate = (iso: string, lang: string) =>
  new Date(iso).toLocaleDateString(lang === "en" ? "en-US" : lang, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

/** "2:48" → "PT2M48S" */
function isoDuration(len: string | null) {
  const parts = len?.split(":").map(Number);
  if (!parts || parts.some(Number.isNaN)) return undefined;
  const [h, m, s] = parts.length === 3 ? parts : [0, ...parts];
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ?? 0}S`;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** Author photo, or their initials when there is none */
function Avatar({ author, className }: { author: PostAuthor; className: string }) {
  return author.avatarUrl ? (
    <Image src={author.avatarUrl} alt="" width={84} height={84} unoptimized className={`flex-none rounded-full object-cover ${className}`} />
  ) : (
    <div className={`flex flex-none items-center justify-center rounded-full font-bold ${className}`}>{initials(author.name)}</div>
  );
}

export default async function BlogPostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getT();
  const SITE = SITE_URL[locale];
  const post = slug === BUILD_PLACEHOLDER ? null : await getPost(slug, locale);
  if (!post) notFound();
  const author = post.author;
  /** Extra structured data from the admin (already validated as JSON when saved) */
  let extraJsonLd: unknown = null;
  try {
    extraJsonLd = post.jsonLd ? JSON.parse(post.jsonLd) : null;
  } catch {}

  const { html, toc } = renderMarkdown(post.body);
  const url = `${SITE}/blog/${post.slug}`;
  const shortTitle = post.title.split(":")[0].replace(/\.$/, "");
  const contents = [
    ...toc,
    ...(post.faqs.length ? [{ id: "faq", text: t("FAQ", "Veelgestelde vragen") }] : []),
    ...(post.transcript ? [{ id: "transcript", text: t("Transcript", "Transcript") }] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt ?? undefined,
        image: post.coverImage ?? (post.youtubeId ? `https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg` : undefined),
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: author
          ? {
              "@type": "Person",
              name: author.name,
              jobTitle: author.role || undefined,
              image: author.avatarUrl ?? undefined,
              sameAs: [author.linkedinUrl, author.youtubeUrl, author.websiteUrl].filter(Boolean),
            }
          : undefined,
        publisher: { "@type": "Organization", name: "Finloa", url: SITE },
        mainEntityOfPage: url,
        articleSection: post.topic || undefined,
        keywords: post.tags.join(", ") || undefined,
        video: post.youtubeId ? { "@id": `${url}#video` } : undefined,
      },
      post.youtubeId && {
        "@type": "VideoObject",
        "@id": `${url}#video`,
        name: shortTitle,
        description: post.excerpt ?? post.title,
        thumbnailUrl: `https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg`,
        uploadDate: post.publishedAt,
        duration: isoDuration(post.videoLength),
        embedUrl: `https://www.youtube.com/embed/${post.youtubeId}`,
        transcript: post.transcript ?? undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t("Home", "Home"), item: SITE },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
          { "@type": "ListItem", position: 3, name: shortTitle },
        ],
      },
      post.faqs.length > 0 && {
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ].filter(Boolean),
  };

  return (
    <PageShell ctaHref="/#goals">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      {extraJsonLd != null && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(extraJsonLd).replace(/</g, "\\u003c") }} />
      )}
      {post.newsletterPopup && <NewsletterPopup source="blog-popup" />}
      <article className="bg-[#F3F5F9]">
        {/* ---------- Hero ---------- */}
        <section className="bg-brand px-6 pt-9 pb-[72px] text-white">
          <div className="mx-auto max-w-[1140px]">
            <nav aria-label={t("Breadcrumb", "Kruimelpad")} className="flex flex-wrap gap-2 text-[13px] text-[#D5E0FF]">
              <Link href="/" className="text-[#D5E0FF] hover:text-white">
                {t("Home", "Home")}
              </Link>
              <span>/</span>
              <Link href="/blog" className="text-[#D5E0FF] hover:text-white">
                Blog
              </Link>
              <span>/</span>
              <span aria-current="page" className="text-white">
                {shortTitle}
              </span>
            </nav>
            <div className="mt-10 flex flex-wrap items-center gap-12">
              <div className="flex-[1_1_420px]">
                <div className="font-mono text-xs tracking-[0.14em] uppercase">
                  {post.topic ? `${post.topic} · ` : ""}
                  {post.readMinutes} {t("min read", "min. leestijd")}
                </div>
                {!post.translated && (
                  <p className="mt-3 inline-block rounded-lg bg-white/15 px-3 py-1.5 text-[13px]">
                    {t("This article has not been translated yet.", "Dit artikel is nog niet vertaald. Je leest de Engelse versie.")}
                  </p>
                )}
                <h1 className="mt-4 mb-[18px] text-[clamp(40px,5.4vw,66px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance">
                  {post.title}
                </h1>
                {post.excerpt && <p className="mb-6 max-w-[460px] text-[17px] leading-[1.55]">{post.excerpt}</p>}
                <div className="flex items-center gap-3">
                  {author && <Avatar author={author} className="size-11 border-2 border-white bg-[#5B86FF] text-sm" />}
                  <div className="text-sm leading-[1.4]">
                    {author && (
                      <a href="#author" rel="author" className="font-bold text-white hover:underline">
                        {author.name}
                      </a>
                    )}
                    <div>
                      <time dateTime={post.publishedAt}>{fmtDate(post.publishedAt, HTML_LANG[locale])}</time>
                    </div>
                  </div>
                </div>
              </div>

              {post.youtubeId ? (
                <figure id="video" className="relative m-0 flex-[1_1_460px]">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] border-8 border-ink bg-ink shadow-[0_40px_80px_-30px_rgba(5,10,40,.6)]">
                    <YoutubePlayer youtubeId={post.youtubeId} title={shortTitle} label={shortTitle} />
                  </div>
                  <div className="absolute -top-3.5 left-5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-ink">
                    <span className="font-mono text-brand">01</span> {t("Video", "Video")}{post.videoLength ? ` · ${post.videoLength}` : ""}
                  </div>
                  {post.transcript && (
                    <a
                      href="#transcript"
                      className="absolute right-[-10px] bottom-7 rounded-lg border border-[#2A3550] bg-ink px-2.5 py-1.5 text-xs font-semibold text-white max-[520px]:right-0"
                    >
                      <span className="font-mono text-[#8FA9FF]">02</span> {t("Transcript below", "Transcript hieronder")}
                    </a>
                  )}
                </figure>
              ) : (
                post.coverImage && (
                  <div className="relative aspect-[16/10] flex-[1_1_460px] overflow-hidden rounded-[22px] border-8 border-ink bg-ink">
                    <Image src={post.coverImage} alt="" fill unoptimized className="object-cover" />
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ---------- Body ---------- */}
        <div className="mx-auto flex max-w-[1140px] flex-wrap items-start gap-14 px-6 pt-16 pb-20">
          {contents.length > 0 && (
            <nav aria-label={t("Table of contents", "Inhoudsopgave")} className="min-w-[180px] flex-[0_1_200px] min-[900px]:sticky min-[900px]:top-24">
              <div className="mb-3.5 font-mono text-[11px] tracking-[0.14em] text-[#5B6475]">{t("CONTENTS", "INHOUD")}</div>
              <div className="flex flex-col gap-2.5 text-sm">
                {contents.map((c, i) => (
                  <a key={c.id} href={`#${c.id}`} className="text-[#2A3245] hover:text-brand">
                    {String(i + 1).padStart(2, "0")} · {c.text}
                  </a>
                ))}
              </div>
            </nav>
          )}

          <div className="max-w-[740px] min-w-0 flex-[1_1_520px]">
            <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

            {post.faqs.length > 0 && (
              <>
                <h2 id="faq" className="mt-11 mb-[18px] scroll-mt-24 text-[32px] leading-[1.15] font-bold tracking-[-0.03em]">
                  {t("Frequently asked questions", "Veelgestelde vragen")}
                </h2>
                <div className="flex flex-col border-t border-[#DCE2EC]">
                  {post.faqs.map((f, i) => (
                    <details key={i} open={i === 0} className="group border-b border-[#DCE2EC] py-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                        {f.q}
                        <span className="text-brand transition-transform group-open:rotate-45" aria-hidden>
                          +
                        </span>
                      </summary>
                      <p className="mt-2 text-base leading-[1.6] text-[#5B6475]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </>
            )}

            {post.transcript && (
              <details id="transcript" className="mt-8 scroll-mt-24 rounded-[14px] border border-[#E4E8F0] bg-white px-5 py-[18px]">
                <summary className="cursor-pointer list-none font-mono text-xs tracking-[0.12em] text-brand [&::-webkit-details-marker]:hidden">
                  {t("VIDEO TRANSCRIPT", "TRANSCRIPT VAN DE VIDEO")}
                </summary>
                <p className="mt-3 text-[15px] leading-[1.65] whitespace-pre-line text-[#5B6475]">{post.transcript}</p>
              </details>
            )}

            {post.tags.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#DCE2EC] bg-white px-3 py-1.5 text-[13px] text-[#2A3245]">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {author && (
              <section id="author" className="mt-10 overflow-hidden rounded-[20px] border border-[#E4E8F0] bg-white">
                <div className="h-14 bg-brand" />
                <div className="-mt-10 px-[26px] pb-[26px]">
                  <Avatar author={author} className="size-[84px] border-4 border-white bg-[#DCE3F0] text-2xl text-ink" />
                  <div className="mt-2.5 text-[22px] font-bold">{author.name}</div>
                  {author.role && <div className="text-sm text-[#5B6475]">{author.role}</div>}
                  {author.bio && <p className="mt-2.5 mb-3.5 text-[15px] leading-[1.6] whitespace-pre-line text-[#3B4456]">{author.bio}</p>}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-semibold">
                    {author.linkedinUrl && (
                      <a href={author.linkedinUrl} target="_blank" rel="noreferrer me" className="text-brand">
                        LinkedIn ↗
                      </a>
                    )}
                    {author.youtubeUrl && (
                      <a href={author.youtubeUrl} target="_blank" rel="noreferrer me" className="text-brand">
                        YouTube ↗
                      </a>
                    )}
                    {author.websiteUrl && (
                      <a href={author.websiteUrl} target="_blank" rel="noreferrer me" className="text-brand">
                        {t("Website", "Website")} ↗
                      </a>
                    )}
                    <Link href="/blog" className="text-brand">
                      {t("More from the blog →", "Meer van de blog →")}
                    </Link>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </article>
      <ContactSection
        source="blog-post"
        intro={t(
          "Want help putting these ideas to work? Tell us about your goals and we'll come back with next steps.",
          "Hulp nodig om deze ideeën in de praktijk te brengen? Vertel ons over je doelen, dan komen we terug met de volgende stappen.",
        )}
        fourthField={{ name: "website", placeholder: t("Website", "Website") }}
      />
    </PageShell>
  );
}
