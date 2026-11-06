import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/contact-section";
import { PageShell } from "@/components/page-shell";
import { YoutubePlayer } from "@/components/youtube-player";
import { getPost, getPosts } from "@/lib/data";
import { renderMarkdown } from "@/lib/markdown";

const SITE = "https://finloa.com";
/** Sample param for builds without the API (Docker). Never a real post, so no real URL gets baked in as a 404. */
const BUILD_PLACEHOLDER = "__placeholder__";

export async function generateStaticParams() {
  const posts = await getPosts();
  // Cache Components needs at least one sample param; unknown slugs render on first request
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: BUILD_PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = slug === BUILD_PLACEHOLDER ? null : await getPost(slug);
  if (!post) return { title: "Post not found — Finloa" };
  const url = `${SITE}/blog/${post.slug}`;
  const image = post.coverImage ?? (post.youtubeId ? `https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg` : undefined);
  return {
    title: `${post.title.replace(/\.$/, "")} | Finloa Blog`,
    description: post.excerpt ?? undefined,
    alternates: { canonical: url },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1 },
    authors: post.authorName ? [{ name: post.authorName }] : undefined,
    openGraph: {
      type: "article",
      siteName: "Finloa",
      title: post.title,
      description: post.excerpt ?? undefined,
      url,
      images: image ? [image] : undefined,
      videos: post.youtubeId ? [`https://www.youtube.com/embed/${post.youtubeId}`] : undefined,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: post.topic,
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt ?? undefined },
  };
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

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

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = slug === BUILD_PLACEHOLDER ? null : await getPost(slug);
  if (!post) notFound();

  const { html, toc } = renderMarkdown(post.body);
  const url = `${SITE}/blog/${post.slug}`;
  const shortTitle = post.title.split(":")[0].replace(/\.$/, "");
  const contents = [
    ...toc,
    ...(post.faqs.length ? [{ id: "faq", text: "FAQ" }] : []),
    ...(post.transcript ? [{ id: "transcript", text: "Transcript" }] : []),
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
        author: post.authorName ? { "@type": "Person", name: post.authorName, jobTitle: post.authorRole ?? undefined } : undefined,
        publisher: { "@type": "Organization", name: "Finloa", url: SITE },
        mainEntityOfPage: url,
        articleSection: post.topic,
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
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
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
      <article className="bg-[#F3F5F9]">
        {/* ---------- Hero ---------- */}
        <section className="bg-brand px-6 pt-9 pb-[72px] text-white">
          <div className="mx-auto max-w-[1140px]">
            <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-[13px] text-[#D5E0FF]">
              <Link href="/" className="text-[#D5E0FF] hover:text-white">
                Home
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
                  {post.topic} · {post.readMinutes} min read
                </div>
                <h1 className="mt-4 mb-[18px] text-[clamp(40px,5.4vw,66px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance">
                  {post.title}
                </h1>
                {post.excerpt && <p className="mb-6 max-w-[460px] text-[17px] leading-[1.55]">{post.excerpt}</p>}
                <div className="flex items-center gap-3">
                  {post.authorName && (
                    <div className="flex size-11 flex-none items-center justify-center rounded-full border-2 border-white bg-[#5B86FF] text-sm font-bold">
                      {initials(post.authorName)}
                    </div>
                  )}
                  <div className="text-sm leading-[1.4]">
                    {post.authorName && (
                      <a href="#author" rel="author" className="font-bold text-white hover:underline">
                        {post.authorName}
                      </a>
                    )}
                    <div>
                      <time dateTime={post.publishedAt}>{fmtDate(post.publishedAt)}</time>
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
                    <span className="font-mono text-brand">01</span> Video{post.videoLength ? ` · ${post.videoLength}` : ""}
                  </div>
                  {post.transcript && (
                    <a
                      href="#transcript"
                      className="absolute right-[-10px] bottom-7 rounded-lg border border-[#2A3550] bg-ink px-2.5 py-1.5 text-xs font-semibold text-white max-[520px]:right-0"
                    >
                      <span className="font-mono text-[#8FA9FF]">02</span> Transcript below
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
            <nav aria-label="Table of contents" className="min-w-[180px] flex-[0_1_200px] min-[900px]:sticky min-[900px]:top-24">
              <div className="mb-3.5 font-mono text-[11px] tracking-[0.14em] text-[#5B6475]">CONTENTS</div>
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
                  Frequently asked questions
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
                  VIDEO TRANSCRIPT
                </summary>
                <p className="mt-3 text-[15px] leading-[1.65] whitespace-pre-line text-[#5B6475]">{post.transcript}</p>
              </details>
            )}

            {post.tags.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full border border-[#DCE2EC] bg-white px-3 py-1.5 text-[13px] text-[#2A3245]">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {post.authorName && (
              <section id="author" className="mt-10 overflow-hidden rounded-[20px] border border-[#E4E8F0] bg-white">
                <div className="h-14 bg-brand" />
                <div className="-mt-10 px-[26px] pb-[26px]">
                  <div className="flex size-[84px] items-center justify-center rounded-full border-4 border-white bg-[#DCE3F0] text-2xl font-bold text-ink">
                    {initials(post.authorName)}
                  </div>
                  <div className="mt-2.5 text-[22px] font-bold">{post.authorName}</div>
                  {post.authorRole && <div className="text-sm text-[#5B6475]">{post.authorRole}</div>}
                  {post.authorBio && <p className="mt-2.5 mb-3.5 text-[15px] leading-[1.6] text-[#3B4456]">{post.authorBio}</p>}
                  <Link href="/blog" className="text-[13px] font-semibold text-brand">
                    More from the blog →
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </article>
      <ContactSection
        source="blog-post"
        intro="Want help putting these ideas to work? Tell us about your goals and we'll come back with next steps."
        fourthField={{ name: "website", placeholder: "Website" }}
      />
    </PageShell>
  );
}
