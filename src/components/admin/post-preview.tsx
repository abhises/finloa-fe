"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Faq } from "@/lib/api";
import { prepareHtml, safeCss } from "@/lib/post-html";

export type PreviewAuthor = { name: string; role?: string; roleNl?: string; bio?: string; bioNl?: string; avatarUrl?: string | null };

export type PreviewPost = {
  lang: "en" | "nl";
  title: string;
  excerpt: string;
  /** Article HTML (generated from the sections, or written by hand) */
  html: string;
  layout: "toc" | "wide";
  css: string;
  faqs: Faq[];
  transcript: string;
  tags: string[];
  youtubeId: string | null;
  videoLength: string;
  coverImage: string;
  readMinutes: number;
  topic: string;
  author: PreviewAuthor | null;
  publishedAt: string;
  /** false: the Dutch title is empty, so nl.finloa.com shows the English text with a note */
  translated: boolean;
};

/**
 * Prepares an empty iframe with the admin page's stylesheets (Tailwind + globals.css) and returns its <body>, so
 * React can render into it through a portal: the preview uses the live site's CSS and media queries follow the
 * iframe's width (mobile preview).
 */
export function useFrameBody() {
  const [body, setBody] = useState<HTMLElement | null>(null);
  const ref = useCallback((iframe: HTMLIFrameElement | null) => {
    const d = iframe?.contentDocument;
    if (!d) return;
    d.open();
    d.write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"></head><body></body></html>');
    d.close();
    d.documentElement.className = document.documentElement.className;
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((n) => d.head.appendChild(n.cloneNode(true)));
    const own = d.createElement("style");
    own.textContent = "body{margin:0}.fl-sec.is-selected{outline:2px dashed #2f6bff;outline-offset:10px;border-radius:2px}";
    d.head.appendChild(own);
    setBody(d.body);
  }, []);
  return { ref, body };
}

/** The post preview frame. `selected` outlines that section and scrolls it into view. */
export function PreviewFrame({ mobile, selected, children }: { mobile: boolean; selected?: string | null; children: ReactNode }) {
  const { ref, body } = useFrameBody();

  // Outline the selected section after every render (the article HTML may have been replaced)
  useEffect(() => {
    if (!body) return;
    body.querySelectorAll(".fl-sec.is-selected").forEach((el) => el.classList.remove("is-selected"));
    if (selected) body.querySelector(`[data-section="${CSS.escape(selected)}"]`)?.classList.add("is-selected");
  });
  // Scroll the preview (not the admin page) to a newly selected section
  useEffect(() => {
    const win = body?.ownerDocument.defaultView;
    const el = selected ? body?.querySelector(`[data-section="${CSS.escape(selected)}"]`) : null;
    if (win && el) win.scrollTo({ top: el.getBoundingClientRect().top + win.scrollY - 24, behavior: "smooth" });
  }, [body, selected]);

  return (
    <div className={`ad-preview${mobile ? " ad-preview--mobile" : ""}`}>
      <iframe ref={ref} title="Preview" />
      {body && createPortal(children, body)}
    </div>
  );
}

/** One section (or any article HTML) in the site's article style, sized to its content. `scale` < 1 makes a thumbnail. */
export function SectionPreview({ html, css = "", scale = 1, width = 900, maxHeight, minHeight = 120, className = "" }: {
  html: string;
  css?: string;
  scale?: number;
  width?: number;
  maxHeight?: number;
  minHeight?: number;
  className?: string;
}) {
  const { ref, body } = useFrameBody();
  const [height, setHeight] = useState(minHeight);
  useEffect(() => {
    if (!body) return;
    const measure = () => setHeight(Math.max(minHeight, body.scrollHeight));
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    measure();
    return () => ro.disconnect();
  }, [body, minHeight]);
  const outer = Math.min(height * scale, maxHeight ?? Infinity);
  return (
    <div className={`sp ${className}`} style={{ height: outer, overflow: maxHeight && height * scale > maxHeight && scale === 1 ? "auto" : "hidden" }}>
      <iframe
        ref={ref}
        title="Section preview"
        tabIndex={scale < 1 ? -1 : 0}
        style={{
          width: scale < 1 ? width : "100%",
          height,
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
          border: 0,
          display: "block",
          pointerEvents: scale < 1 ? "none" : undefined,
        }}
      />
      {body &&
        createPortal(
          <div className="bg-[#F3F5F9] px-6 py-6 font-sans text-ink">
            {css && <style dangerouslySetInnerHTML={{ __html: safeCss(css) }} />}
            <div className="post-body mx-auto max-w-[740px]" dangerouslySetInnerHTML={{ __html: html }} />
          </div>,
          body,
        )}
    </div>
  );
}

const fmtDate = (iso: string, lang: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(lang === "en" ? "en-US" : "nl-NL", { month: "short", day: "numeric", year: "numeric" });
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Avatar({ author, className }: { author: PreviewAuthor; className: string }) {
  return author.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={author.avatarUrl} alt="" className={`flex-none rounded-full object-cover ${className}`} />
  ) : (
    <div className={`flex flex-none items-center justify-center rounded-full font-bold ${className}`}>{initials(author.name)}</div>
  );
}

/** The blog post as it renders on the site (same markup as app/[lang]/blog/[slug]), without the site header and footer. */
export function PostPreview({ post }: { post: PreviewPost }) {
  const t = (en: string, nl: string) => (post.lang === "nl" ? nl : en);
  const { html, toc } = prepareHtml(post.html);
  const author = post.author;
  const title = post.title || t("Untitled post", "Naamloos artikel");
  const shortTitle = title.split(":")[0].replace(/\.$/, "");
  const contents = post.layout === "wide" ? [] : [
    ...toc,
    ...(post.faqs.length ? [{ id: "faq", text: t("FAQ", "Veelgestelde vragen") }] : []),
    ...(post.transcript ? [{ id: "transcript", text: "Transcript" }] : []),
  ];

  return (
    <article className="bg-[#F3F5F9] font-sans text-ink">
      {post.css && <style dangerouslySetInnerHTML={{ __html: safeCss(post.css) }} />}
      <section className="bg-brand px-6 pt-9 pb-[72px] text-white">
        <div className="mx-auto max-w-[1140px]">
          <nav className="flex flex-wrap gap-2 text-[13px] text-[#D5E0FF]">
            <span>Home</span>
            <span>/</span>
            <span>Blog</span>
            <span>/</span>
            <span className="text-white">{shortTitle}</span>
          </nav>
          <div className="mt-10 flex flex-wrap items-center gap-12">
            <div className="flex-[1_1_420px]">
              <div className="font-mono text-xs tracking-[0.14em] uppercase">
                {post.topic ? `${post.topic} · ` : ""}
                {post.readMinutes} {t("min read", "min. leestijd")}
              </div>
              {!post.translated && (
                <p className="mt-3 inline-block rounded-lg bg-white/15 px-3 py-1.5 text-[13px]">Dit artikel is nog niet vertaald. Je leest de Engelse versie.</p>
              )}
              <h1 className="mt-4 mb-[18px] text-[clamp(40px,5.4vw,66px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance">{title}</h1>
              {post.excerpt && <p className="mb-6 max-w-[460px] text-[17px] leading-[1.55]">{post.excerpt}</p>}
              <div className="flex items-center gap-3">
                {author && <Avatar author={author} className="size-11 border-2 border-white bg-[#5B86FF] text-sm" />}
                <div className="text-sm leading-[1.4]">
                  {author && <span className="font-bold text-white">{author.name}</span>}
                  <div>{fmtDate(post.publishedAt, post.lang)}</div>
                </div>
              </div>
            </div>

            {post.youtubeId ? (
              <figure className="relative m-0 flex-[1_1_460px]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] border-8 border-ink bg-ink shadow-[0_40px_80px_-30px_rgba(5,10,40,.6)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${post.youtubeId}/hqdefault.jpg`} alt="" className="absolute inset-0 size-full object-cover opacity-80" />
                  <span className="absolute top-1/2 left-1/2 flex size-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-brand">▶</span>
                </div>
                <div className="absolute -top-3.5 left-5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-ink">
                  <span className="font-mono text-brand">01</span> Video{post.videoLength ? ` · ${post.videoLength}` : ""}
                </div>
                {post.transcript && (
                  <span className="absolute right-[-10px] bottom-7 rounded-lg border border-[#2A3550] bg-ink px-2.5 py-1.5 text-xs font-semibold text-white max-[520px]:right-0">
                    <span className="font-mono text-[#8FA9FF]">02</span> {t("Transcript below", "Transcript hieronder")}
                  </span>
                )}
              </figure>
            ) : (
              post.coverImage && (
                <div className="relative aspect-[16/10] flex-[1_1_460px] overflow-hidden rounded-[22px] border-8 border-ink bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImage} alt="" className="absolute inset-0 size-full object-cover" />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1140px] flex-wrap items-start gap-14 px-6 pt-16 pb-20">
        {contents.length > 0 && (
          <nav className="min-w-[180px] flex-[0_1_200px] min-[900px]:sticky min-[900px]:top-6">
            <div className="mb-3.5 font-mono text-[11px] tracking-[0.14em] text-[#5B6475]">{t("CONTENTS", "INHOUD")}</div>
            <div className="flex flex-col gap-2.5 text-sm">
              {contents.map((c, i) => (
                <a key={c.id} href={`#${c.id}`} target="_self" className="text-[#2A3245] hover:text-brand">
                  {String(i + 1).padStart(2, "0")} · {c.text}
                </a>
              ))}
            </div>
          </nav>
        )}

        <div className={`min-w-0 flex-[1_1_520px] ${post.layout === "wide" ? "mx-auto max-w-[860px]" : "max-w-[740px]"}`}>
          {html.trim() ? (
            <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p className="text-[#5B6475]">{t("The article text appears here.", "De tekst van het artikel verschijnt hier.")}</p>
          )}

          {post.faqs.length > 0 && (
            <>
              <h2 id="faq" className="mt-11 mb-[18px] text-[32px] leading-[1.15] font-bold tracking-[-0.03em]">
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
            <details id="transcript" className="mt-8 rounded-[14px] border border-[#E4E8F0] bg-white px-5 py-[18px]">
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
            <section className="mt-10 overflow-hidden rounded-[20px] border border-[#E4E8F0] bg-white">
              <div className="h-14 bg-brand" />
              <div className="-mt-10 px-[26px] pb-[26px]">
                <Avatar author={author} className="size-[84px] border-4 border-white bg-[#DCE3F0] text-2xl text-ink" />
                <div className="mt-2.5 text-[22px] font-bold">{author.name}</div>
                {(post.lang === "nl" ? author.roleNl || author.role : author.role) && (
                  <div className="text-sm text-[#5B6475]">{post.lang === "nl" ? author.roleNl || author.role : author.role}</div>
                )}
                {(post.lang === "nl" ? author.bioNl || author.bio : author.bio) && (
                  <p className="mt-2.5 mb-0 text-[15px] leading-[1.6] whitespace-pre-line text-[#3B4456]">{post.lang === "nl" ? author.bioNl || author.bio : author.bio}</p>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
