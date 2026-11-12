"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { ImageField, MediaPicker } from "@/components/admin/media-library";
import { adminApi, parseYoutubeId, useNlOrigin, type AdminError } from "@/lib/admin-client";
import type { Faq } from "@/lib/api";
import { renderMarkdown } from "@/lib/markdown";

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  titleNl: string;
  excerpt: string | null;
  excerptNl: string | null;
  coverImage: string | null;
  readMinutes: number;
  body: string;
  bodyNl: string;
  youtubeId: string | null;
  videoLength: string | null;
  transcript: string | null;
  transcriptNl: string | null;
  faqs: Faq[];
  faqsNl: Faq[];
  tags: string[];
  tagsNl: string[];
  seoTitle: string | null;
  seoTitleNl: string | null;
  seoDescription: string | null;
  seoDescriptionNl: string | null;
  jsonLd: string | null;
  featured: boolean;
  newsletterPopup: boolean;
  categoryId: string | null;
  authorId: string | null;
  published: boolean;
  publishedAt: string;
};

type Lang = "en" | "nl";
/** The fields that exist in both languages */
type Copy = { title: string; excerpt: string; body: string; transcript: string; faqs: Faq[]; tags: string; seoTitle: string; seoDescription: string };
type Option = { id: string; name: string };

const emptyCopy: Copy = { title: "", excerpt: "", body: "", transcript: "", faqs: [], tags: "", seoTitle: "", seoDescription: "" };

const copyFrom = (p: AdminPost | undefined, lang: Lang): Copy =>
  !p
    ? emptyCopy
    : lang === "en"
      ? {
          title: p.title,
          excerpt: p.excerpt ?? "",
          body: p.body,
          transcript: p.transcript ?? "",
          faqs: p.faqs,
          tags: p.tags.join(", "),
          seoTitle: p.seoTitle ?? "",
          seoDescription: p.seoDescription ?? "",
        }
      : {
          title: p.titleNl,
          excerpt: p.excerptNl ?? "",
          body: p.bodyNl,
          transcript: p.transcriptNl ?? "",
          faqs: p.faqsNl,
          tags: p.tagsNl.join(", "),
          seoTitle: p.seoTitleNl ?? "",
          seoDescription: p.seoDescriptionNl ?? "",
        };

const splitTags = (s: string) =>
  s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
const cleanFaqs = (f: Faq[]) => f.filter((x) => x.q.trim() && x.a.trim());

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** "2026-11-05T09:00" for <input type="datetime-local"> in the browser's time zone */
const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

const estimateMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));

type Errors = Record<string, string[] | undefined>;

const LANG_LABEL: Record<Lang, string> = { en: "English", nl: "Nederlands" };

export function PostEditor({ post }: { post?: AdminPost }) {
  const router = useRouter();
  const confirm = useConfirm();
  const isNew = !post;

  const [lang, setLang] = useState<Lang>("en");
  const [copy, setCopy] = useState<Record<Lang, Copy>>({ en: copyFrom(post, "en"), nl: copyFrom(post, "nl") });
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [youtube, setYoutube] = useState(post?.youtubeId ? `https://www.youtube.com/watch?v=${post.youtubeId}` : "");
  const [videoLength, setVideoLength] = useState(post?.videoLength ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [readMinutes, setReadMinutes] = useState(String(post?.readMinutes ?? ""));
  const [categoryId, setCategoryId] = useState(post?.categoryId ?? "");
  const [authorId, setAuthorId] = useState(post?.authorId ?? "");
  const [jsonLd, setJsonLd] = useState(post?.jsonLd ?? "");
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [newsletterPopup, setNewsletterPopup] = useState(post?.newsletterPopup ?? false);
  const [published, setPublished] = useState(post?.published ?? true);
  const [publishedAt, setPublishedAt] = useState(toLocalInput(post?.publishedAt ?? new Date().toISOString()));

  const [categories, setCategories] = useState<Option[]>([]);
  const [authors, setAuthors] = useState<Option[]>([]);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState("");
  const [inserting, setInserting] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const nlOrigin = useNlOrigin();

  useEffect(() => {
    adminApi<{ data: Option[] }>("/categories/admin").then((r) => setCategories(r.data)).catch(() => {});
    adminApi<{ data: Option[] }>("/authors").then((r) => setAuthors(r.data)).catch(() => {});
  }, []);

  const c = copy[lang];
  const en = copy.en;
  const setC = <K extends keyof Copy>(k: K, v: Copy[K]) => {
    setCopy((all) => ({ ...all, [lang]: { ...all[lang], [k]: v } }));
    setDirty(true);
    setSaved("");
    if (lang === "en" && k === "title" && !slugTouched) setSlug(slugify(v as string));
  };
  const touch = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    setDirty(true);
    setSaved("");
  };

  const youtubeId = parseYoutubeId(youtube);
  const preview = useMemo(() => (tab === "preview" ? renderMarkdown(c.body || (lang === "nl" ? en.body : "")).html : ""), [tab, c.body, lang, en.body]);

  /** Dutch status: complete, partly done (falls back to English per field), or not started */
  const nl = copy.nl;
  const nlState = !nl.title ? "missing" : (en.body && !nl.body) || (en.excerpt && !nl.excerpt) ? "partial" : "ok";

  const save = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (youtube && !youtubeId) {
        setErrors({ youtube: ["Not a valid YouTube link"] });
        return;
      }
      if (jsonLd.trim()) {
        try {
          JSON.parse(jsonLd);
        } catch {
          setErrors({ jsonLd: ["Not valid JSON"] });
          setError("The JSON-LD is not valid JSON.");
          return;
        }
      }
      if (!copy.en.title.trim()) {
        setLang("en");
        setErrors({ title: ["The English title is required"] });
        setError("The English title is required.");
        return;
      }
      setBusy(true);
      setError("");
      setErrors({});
      setSaved("");
      const { en, nl } = copy;
      const payload = {
        slug: slug || slugify(en.title),
        title: en.title,
        titleNl: nl.title,
        excerpt: en.excerpt,
        excerptNl: nl.excerpt,
        body: en.body,
        bodyNl: nl.body,
        transcript: en.transcript,
        transcriptNl: nl.transcript,
        faqs: cleanFaqs(en.faqs),
        faqsNl: cleanFaqs(nl.faqs),
        tags: splitTags(en.tags),
        tagsNl: splitTags(nl.tags),
        seoTitle: en.seoTitle,
        seoTitleNl: nl.seoTitle,
        seoDescription: en.seoDescription,
        seoDescriptionNl: nl.seoDescription,
        jsonLd,
        youtube: youtube.trim() || null,
        videoLength,
        coverImage,
        categoryId: categoryId || null,
        authorId: authorId || null,
        featured,
        newsletterPopup,
        readMinutes: Number(readMinutes) || estimateMinutes(`${en.body} ${en.transcript}`),
        published,
        publishedAt: new Date(publishedAt).toISOString(),
      };
      try {
        if (isNew) {
          const r = await adminApi<{ data: AdminPost }>("/posts", { method: "POST", json: payload });
          setDirty(false);
          router.replace(`/admin/posts/${r.data.id}?created=1`);
        } else {
          const r = await adminApi<{ data: AdminPost }>(`/posts/${post.id}`, { method: "PATCH", json: payload });
          setSlug(r.data.slug);
          setReadMinutes(String(r.data.readMinutes));
          setDirty(false);
          setSaved(`${published ? "Saved. The post is live" : "Saved as a draft"} · ${new Date().toLocaleTimeString()}`);
        }
      } catch (err) {
        const e = err as AdminError;
        setErrors(e.details ?? {});
        setError(e.message);
      } finally {
        setBusy(false);
      }
    },
    [copy, slug, jsonLd, youtube, youtubeId, videoLength, coverImage, categoryId, authorId, featured, newsletterPopup, readMinutes, published, publishedAt, isNew, post, router],
  );

  // Ctrl/⌘+S saves; warn before leaving with unsaved changes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => dirty && e.preventDefault();
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [save, dirty]);

  async function remove() {
    if (!post) return;
    if (!(await confirm({ title: "Delete this post?", message: `"${post.title}" will be removed from the blog in both languages.` }))) return;
    try {
      await adminApi(`/posts/${post.id}`, { method: "DELETE" });
      setDirty(false);
      router.replace("/admin/posts");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  /** Fill the empty Dutch fields with the English text, as a starting point for translating */
  function startFromEnglish() {
    setCopy((all) => {
      const n = { ...all.nl };
      (Object.keys(n) as (keyof Copy)[]).forEach((k) => {
        const empty = k === "faqs" ? !n.faqs.length : !n[k];
        if (empty) (n as Record<keyof Copy, unknown>)[k] = k === "faqs" ? all.en.faqs.map((f) => ({ ...f })) : all.en[k];
      });
      return { ...all, nl: n };
    });
    setDirty(true);
  }

  function insertImage(url: string, alt: string) {
    const el = bodyRef.current;
    const snippet = `![${alt || "Image"}](${url})`;
    const at = el?.selectionStart ?? c.body.length;
    const end = el?.selectionEnd ?? at;
    const before = c.body.slice(0, at);
    const pad = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
    setC("body", `${before}${pad}${snippet}\n\n${c.body.slice(end)}`);
    setInserting(false);
  }

  const fieldErr = (k: string) => errors[k]?.[0] && <span className="ad-field__err">{errors[k]![0]}</span>;
  const liveUrl = `/blog/${slug || slugify(en.title)}`;
  /** Placeholder in Dutch fields: the English text that shows while the Dutch one is empty */
  const fallback = (k: "title" | "excerpt" | "seoTitle" | "seoDescription" | "tags") => (lang === "nl" && en[k] ? `${en[k]}` : undefined);

  const langSwitch = (
    <div className="ad-lang" role="group" aria-label="Language">
      {(["en", "nl"] as Lang[]).map((l) => (
        <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
          {l === "nl" && <span className={`ad-lang__dot${nlState === "ok" ? " ad-lang__dot--ok" : ""}`} aria-hidden />}
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );

  return (
    <form onSubmit={save}>
      <div className="ad-head">
        <div>
          <h1>{isNew ? "New blog post" : en.title || "Edit post"}</h1>
          <p>
            <Link href="/admin/posts">← All posts</Link>
            {!isNew && post.published && (
              <>
                {" · "}
                <a href={liveUrl} target="_blank" rel="noreferrer">
                  View English ↗
                </a>
                {" · "}
                <a href={`${nlOrigin}${liveUrl}`} target="_blank" rel="noreferrer">
                  View Nederlands ↗
                </a>
              </>
            )}
          </p>
        </div>
        <div className="ad-savebar">
          {dirty && <span className="ad-hint">Unsaved changes</span>}
          {!isNew && (
            <button type="button" className="ad-btn ad-btn--danger" onClick={remove}>
              Delete
            </button>
          )}
          <button className="ad-btn ad-btn--primary" disabled={busy}>
            {busy ? "Saving…" : isNew ? (published ? "Publish" : "Save draft") : "Save changes"}
          </button>
        </div>
      </div>
      {saved && <p className="ad-ok">{saved}</p>}
      {error && <p className="ad-error">{error}</p>}

      <div className="ad-editor">
        <div className="ad-form">
          <section className="ad-panel">
            <div className="ad-panel__head">
              {langSwitch}
              {lang === "nl" && (
                <button type="button" className="ad-btn ad-btn--sm" onClick={startFromEnglish} title="Copies the English text into the Dutch fields that are still empty">
                  Fill empty fields from English
                </button>
              )}
            </div>
            {lang === "nl" && nlState !== "ok" && (
              <p className="ad-fallback">
                {nlState === "missing"
                  ? "No Dutch version yet. Until you add a Dutch title, nl.finloa.com shows the English text with a note that it isn't translated."
                  : "Some Dutch fields are empty. Those parts show in English on nl.finloa.com."}
              </p>
            )}
            <label className="ad-field">
              <span>Title ({LANG_LABEL[lang]})</span>
              <input
                value={c.title}
                onChange={(e) => setC("title", e.target.value)}
                required={lang === "en"}
                maxLength={200}
                placeholder={fallback("title") ?? "Samsung Business Intro: devices, displays and security for companies."}
                aria-invalid={!!errors[lang === "en" ? "title" : "titleNl"]}
              />
              {fieldErr(lang === "en" ? "title" : "titleNl")}
            </label>
            {lang === "en" && (
              <label className="ad-field">
                <span>URL (same in both languages)</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="ad-hint" style={{ whiteSpace: "nowrap" }}>
                    /blog/
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(slugify(e.target.value));
                      setDirty(true);
                    }}
                    placeholder="samsung-business-intro"
                    aria-invalid={!!errors.slug}
                  />
                </div>
                {fieldErr("slug")}
              </label>
            )}
            <label className="ad-field">
              <span>Intro ({LANG_LABEL[lang]})</span>
              <textarea
                rows={2}
                value={c.excerpt}
                onChange={(e) => setC("excerpt", e.target.value)}
                maxLength={400}
                placeholder={fallback("excerpt") ?? "One or two sentences shown under the title, on cards and in search results."}
              />
            </label>
          </section>

          <section className="ad-panel">
            <h2>YouTube video</h2>
            <div className="ad-row" style={{ gridTemplateColumns: "minmax(0,1fr) 260px", alignItems: "start" }}>
              <div className="ad-form">
                <label className="ad-field">
                  <span>YouTube link</span>
                  <input
                    value={youtube}
                    onChange={(e) => touch(setYoutube)(e.target.value)}
                    placeholder="https://youtu.be/… or https://www.youtube.com/watch?v=…"
                    aria-invalid={(!!youtube && !youtubeId) || !!errors.youtube}
                  />
                  {youtube && !youtubeId ? <span className="ad-field__err">That doesn&apos;t look like a YouTube link.</span> : fieldErr("youtube")}
                  <small>Shown at the top of the post in both languages. Leave empty for a text-only post.</small>
                </label>
                <label className="ad-field">
                  <span>Video length</span>
                  <input value={videoLength} onChange={(e) => touch(setVideoLength)(e.target.value)} placeholder="2:48" maxLength={20} style={{ maxWidth: 140 }} />
                </label>
              </div>
              <div className="ad-video-preview">
                {youtubeId ? (
                  <iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`} title="Preview" allow="encrypted-media; picture-in-picture" allowFullScreen />
                ) : (
                  "NO VIDEO"
                )}
              </div>
            </div>
          </section>

          <section className="ad-panel">
            <div className="ad-panel__head">
              <h2>Article ({LANG_LABEL[lang]})</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tab === "write" && (
                  <button type="button" className="ad-btn ad-btn--sm" onClick={() => setInserting(true)}>
                    + Image
                  </button>
                )}
                <div className="ad-seg">
                  <button type="button" aria-pressed={tab === "write"} onClick={() => setTab("write")}>
                    Write
                  </button>
                  <button type="button" aria-pressed={tab === "preview"} onClick={() => setTab("preview")}>
                    Preview
                  </button>
                </div>
              </div>
            </div>
            {tab === "write" ? (
              <label className="ad-field">
                <span className="sr-only">Article body</span>
                <textarea
                  ref={bodyRef}
                  className="ad-mono"
                  rows={22}
                  value={c.body}
                  onChange={(e) => setC("body", e.target.value)}
                  placeholder={
                    lang === "nl" && en.body
                      ? "Leave empty to show the English article, or write the Dutch version here."
                      : "Opening paragraph…\n\n## First section\n\nText with a [link](https://example.com).\n\n### A sub-heading\n\n- A list item\n\n> A quote"
                  }
                />
                <small>
                  Markdown: <code>## Heading</code> (adds it to the contents list), <code>### Sub-heading</code>, <code>**bold**</code>,{" "}
                  <code>[link](https://…)</code>, <code>![alt](image URL)</code>, <code>- list</code>, <code>&gt; quote</code>. Ctrl/⌘+S saves.
                </small>
              </label>
            ) : (
              <>
                {lang === "nl" && !c.body && en.body && <p className="ad-fallback">No Dutch text yet: showing the English article.</p>}
                <div className="post-body" style={{ border: "1px solid var(--a-line)", borderRadius: 10, padding: "8px 20px", minHeight: 200 }} dangerouslySetInnerHTML={{ __html: preview }} />
              </>
            )}
          </section>

          <section className="ad-panel">
            <div className="ad-panel__head">
              <h2>FAQ ({LANG_LABEL[lang]})</h2>
              <button type="button" className="ad-btn ad-btn--sm" onClick={() => setC("faqs", [...c.faqs, { q: "", a: "" }])}>
                + Add question
              </button>
            </div>
            {c.faqs.length === 0 && (
              <p className="ad-hint">
                {lang === "nl" && en.faqs.length
                  ? `No Dutch questions: the ${en.faqs.length} English ones are shown on nl.finloa.com.`
                  : "Optional. Questions appear at the end of the post and in Google's FAQ data."}
              </p>
            )}
            {c.faqs.map((f, i) => (
              <div key={i} className="ad-faq">
                <input
                  className="ad-input"
                  value={f.q}
                  placeholder={lang === "nl" ? (en.faqs[i]?.q ?? "Vraag") : "Question"}
                  aria-label={`Question ${i + 1}`}
                  onChange={(e) => setC("faqs", c.faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))}
                />
                <button type="button" className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => setC("faqs", c.faqs.filter((_, j) => j !== i))}>
                  Remove
                </button>
                <textarea
                  className="ad-input"
                  rows={2}
                  value={f.a}
                  placeholder={lang === "nl" ? (en.faqs[i]?.a ?? "Antwoord") : "Answer"}
                  aria-label={`Answer ${i + 1}`}
                  onChange={(e) => setC("faqs", c.faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))}
                />
              </div>
            ))}
          </section>

          <section className="ad-panel">
            <label className="ad-field">
              <span>Video transcript ({LANG_LABEL[lang]})</span>
              <textarea
                rows={6}
                value={c.transcript}
                onChange={(e) => setC("transcript", e.target.value)}
                placeholder={
                  lang === "nl" && en.transcript
                    ? "Leave empty to show the English transcript."
                    : "Optional. Paste the full transcript; search engines index it and it makes the video accessible."
                }
              />
            </label>
          </section>

          <section className="ad-panel">
            <h2>SEO ({LANG_LABEL[lang]})</h2>
            <label className="ad-field">
              <span>SEO title</span>
              <input
                value={c.seoTitle}
                onChange={(e) => setC("seoTitle", e.target.value)}
                maxLength={200}
                placeholder={`${(c.title || en.title || "Post title").replace(/\.$/, "")} | Finloa Blog`}
              />
              <small>{c.seoTitle.length}/60 characters recommended. Empty uses the title.</small>
            </label>
            <label className="ad-field">
              <span>Meta description</span>
              <textarea rows={2} value={c.seoDescription} onChange={(e) => setC("seoDescription", e.target.value)} maxLength={400} placeholder={c.excerpt || fallback("seoDescription") || "Empty uses the intro."} />
              <small>{c.seoDescription.length}/155 characters recommended.</small>
            </label>
            <label className="ad-field">
              <span>Extra structured data (JSON-LD, both languages)</span>
              <textarea
                className="ad-mono"
                rows={5}
                value={jsonLd}
                onChange={(e) => touch(setJsonLd)(e.target.value)}
                placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "HowTo",\n  …\n}'}
                aria-invalid={!!errors.jsonLd}
              />
              {fieldErr("jsonLd")}
              <small>Optional. BlogPosting, VideoObject, Breadcrumb and FAQ data are generated automatically; add anything extra here.</small>
            </label>
          </section>
        </div>

        <aside className="ad-editor__side">
          <section className="ad-panel">
            <h2>Publish</h2>
            <label className="ad-check">
              <input type="checkbox" checked={published} onChange={(e) => touch(setPublished)(e.target.checked)} />
              Published on the blog
            </label>
            <label className="ad-field">
              <span>Publish date</span>
              <input type="datetime-local" value={publishedAt} onChange={(e) => touch(setPublishedAt)(e.target.value)} required />
              <small>A future date schedules the post.</small>
            </label>
            <label className="ad-check">
              <input type="checkbox" checked={featured} onChange={(e) => touch(setFeatured)(e.target.checked)} />
              Featured (large, first on /blog)
            </label>
            <label className="ad-check">
              <input type="checkbox" checked={newsletterPopup} onChange={(e) => touch(setNewsletterPopup)(e.target.checked)} />
              Newsletter popup (after 35% scroll)
            </label>
            <div className="ad-hint">
              Dutch:{" "}
              <span className={`ad-pill ${nlState === "ok" ? "ad-pill--published" : "ad-pill--nl"}`}>
                {nlState === "ok" ? "Translated" : nlState === "partial" ? "Partly translated" : "Not translated"}
              </span>
            </div>
            <button className="ad-btn ad-btn--primary" disabled={busy}>
              {busy ? "Saving…" : isNew ? (published ? "Publish" : "Save draft") : "Save changes"}
            </button>
          </section>

          <section className="ad-panel">
            <h2>Details</h2>
            <label className="ad-field">
              <span>Category</span>
              <select value={categoryId} onChange={(e) => touch(setCategoryId)(e.target.value)} aria-invalid={!!errors.categoryId}>
                <option value="">—</option>
                {categories.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              {fieldErr("categoryId")}
              <small>
                <Link href="/admin/categories">Manage categories</Link>
              </small>
            </label>
            <label className="ad-field">
              <span>Author</span>
              <select value={authorId} onChange={(e) => touch(setAuthorId)(e.target.value)}>
                <option value="">—</option>
                {authors.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              <small>
                <Link href="/admin/authors">Manage authors</Link>
              </small>
            </label>
            <label className="ad-field">
              <span>Tags ({LANG_LABEL[lang]})</span>
              <input value={c.tags} onChange={(e) => setC("tags", e.target.value)} placeholder={fallback("tags") ?? "Company intro, Samsung, Technology"} />
              <small>Comma-separated.</small>
            </label>
            <label className="ad-field">
              <span>Read time (minutes)</span>
              <div style={{ display: "flex", gap: 6 }}>
                <input type="number" min={1} max={120} value={readMinutes} onChange={(e) => touch(setReadMinutes)(e.target.value)} placeholder="Auto" />
                <button type="button" className="ad-btn ad-btn--sm" onClick={() => touch(setReadMinutes)(String(estimateMinutes(`${en.body} ${en.transcript}`)))}>
                  Estimate
                </button>
              </div>
            </label>
          </section>

          <section className="ad-panel">
            <ImageField
              label="Cover image"
              value={coverImage}
              onChange={touch(setCoverImage)}
              error={errors.coverImage?.[0]}
              hint="Optional. Posts with a video use its YouTube thumbnail when there's no cover."
            />
          </section>
        </aside>
      </div>

      {inserting && <MediaPicker title="Insert an image" onClose={() => setInserting(false)} onPick={(m) => insertImage(m.url, m.alt)} />}
    </form>
  );
}
