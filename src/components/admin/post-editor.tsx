"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { adminApi, parseYoutubeId, type AdminError } from "@/lib/admin-client";
import type { Faq } from "@/lib/api";
import { renderMarkdown } from "@/lib/markdown";

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  excerpt: string | null;
  coverImage: string | null;
  readMinutes: number;
  body: string;
  youtubeId: string | null;
  videoLength: string | null;
  transcript: string | null;
  faqs: Faq[];
  tags: string[];
  authorName: string | null;
  authorRole: string | null;
  authorBio: string | null;
  published: boolean;
  publishedAt: string;
};

const TOPICS = ["Company Intro", "Video", "SEO", "AI Marketing", "Content Marketing", "Paid Media", "Website Design", "Creators", "Businesses"];

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

export function PostEditor({ post }: { post?: AdminPost }) {
  const router = useRouter();
  const confirm = useConfirm();
  const isNew = !post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [topic, setTopic] = useState(post?.topic ?? "Company Intro");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [youtube, setYoutube] = useState(post?.youtubeId ? `https://www.youtube.com/watch?v=${post.youtubeId}` : "");
  const [videoLength, setVideoLength] = useState(post?.videoLength ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [faqs, setFaqs] = useState<Faq[]>(post?.faqs ?? []);
  const [transcript, setTranscript] = useState(post?.transcript ?? "");
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [authorName, setAuthorName] = useState(post?.authorName ?? "");
  const [authorRole, setAuthorRole] = useState(post?.authorRole ?? "");
  const [authorBio, setAuthorBio] = useState(post?.authorBio ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [readMinutes, setReadMinutes] = useState(String(post?.readMinutes ?? ""));
  const [published, setPublished] = useState(post?.published ?? true);
  const [publishedAt, setPublishedAt] = useState(toLocalInput(post?.publishedAt ?? new Date().toISOString()));

  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState("");

  const youtubeId = parseYoutubeId(youtube);
  const preview = useMemo(() => (tab === "preview" ? renderMarkdown(body).html : ""), [tab, body]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (youtube && !youtubeId) {
      setErrors({ youtube: ["Not a valid YouTube link"] });
      return;
    }
    setBusy(true);
    setError("");
    setErrors({});
    setSaved("");
    const payload = {
      title,
      slug: slug || slugify(title),
      topic,
      excerpt,
      youtube: youtube.trim() || null,
      videoLength,
      body,
      faqs: faqs.filter((f) => f.q.trim() && f.a.trim()),
      transcript,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      authorName,
      authorRole,
      authorBio,
      coverImage,
      readMinutes: Number(readMinutes) || estimateMinutes(`${body} ${transcript}`),
      published,
      publishedAt: new Date(publishedAt).toISOString(),
    };
    try {
      if (isNew) {
        const r = await adminApi<{ data: AdminPost }>("/posts", { method: "POST", json: payload });
        router.replace(`/admin/posts/${r.data.id}?created=1`);
      } else {
        const r = await adminApi<{ data: AdminPost }>(`/posts/${post.id}`, { method: "PATCH", json: payload });
        setSlug(r.data.slug);
        setReadMinutes(String(r.data.readMinutes));
        setSaved(published ? "Saved. The post is live." : "Saved as a draft.");
      }
    } catch (err) {
      const e = err as AdminError;
      setErrors(e.details ?? {});
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!post) return;
    if (!(await confirm({ title: "Delete this post?", message: `"${post.title}" will be removed from the blog.` }))) return;
    try {
      await adminApi(`/posts/${post.id}`, { method: "DELETE" });
      router.replace("/admin/posts");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const fieldErr = (k: string) => errors[k]?.[0] && <span className="ad-field__err">{errors[k]![0]}</span>;
  const liveUrl = `/blog/${slug || slugify(title)}`;

  return (
    <form onSubmit={save}>
      <div className="ad-head">
        <div>
          <h1>{isNew ? "New blog post" : "Edit post"}</h1>
          <p>
            <Link href="/admin/posts">← All posts</Link>
            {!isNew && post.published && (
              <>
                {" · "}
                <a href={liveUrl} target="_blank" rel="noreferrer">
                  View on site ↗
                </a>
              </>
            )}
          </p>
        </div>
        <div className="ad-savebar">
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
            <label className="ad-field">
              <span>Title</span>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                required
                maxLength={200}
                placeholder="Samsung Business Intro: devices, displays and security for companies."
                aria-invalid={!!errors.title}
              />
              {fieldErr("title")}
            </label>
            <label className="ad-field">
              <span>URL</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="ad-hint" style={{ whiteSpace: "nowrap" }}>
                  finloa.com/blog/
                </span>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="samsung-business-intro"
                  aria-invalid={!!errors.slug}
                />
              </div>
              {fieldErr("slug")}
            </label>
            <label className="ad-field">
              <span>Intro</span>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={400}
                placeholder="One or two sentences shown under the title and in search results."
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
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtu.be/… or https://www.youtube.com/watch?v=…"
                    aria-invalid={(!!youtube && !youtubeId) || !!errors.youtube}
                  />
                  {youtube && !youtubeId ? <span className="ad-field__err">That doesn&apos;t look like a YouTube link.</span> : fieldErr("youtube")}
                  <small>Shown at the top of the post. Leave empty for a text-only post.</small>
                </label>
                <label className="ad-field">
                  <span>Video length</span>
                  <input value={videoLength} onChange={(e) => setVideoLength(e.target.value)} placeholder="2:48" maxLength={20} style={{ maxWidth: 140 }} />
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h2>Article</h2>
              <div className="ad-seg">
                <button type="button" aria-pressed={tab === "write"} onClick={() => setTab("write")}>
                  Write
                </button>
                <button type="button" aria-pressed={tab === "preview"} onClick={() => setTab("preview")}>
                  Preview
                </button>
              </div>
            </div>
            {tab === "write" ? (
              <label className="ad-field">
                <span className="sr-only">Article body</span>
                <textarea className="ad-mono" rows={22} value={body} onChange={(e) => setBody(e.target.value)} placeholder={"Opening paragraph…\n\n## First section\n\nText with a [link](https://example.com).\n\n### A sub-heading\n\n- A list item\n\n> A quote"} />
                <small>
                  Markdown: <code>## Heading</code> (adds it to the contents list), <code>### Sub-heading</code>, <code>**bold**</code>,{" "}
                  <code>[link](https://…)</code>, <code>- list</code>, <code>&gt; quote</code>.
                </small>
              </label>
            ) : (
              <div className="post-body" style={{ border: "1px solid var(--a-line)", borderRadius: 10, padding: "8px 20px", minHeight: 200 }} dangerouslySetInnerHTML={{ __html: preview }} />
            )}
          </section>

          <section className="ad-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>FAQ</h2>
              <button type="button" className="ad-btn ad-btn--sm" onClick={() => setFaqs((f) => [...f, { q: "", a: "" }])}>
                + Add question
              </button>
            </div>
            {faqs.length === 0 && <p className="ad-hint">Optional. Questions appear at the end of the post and in Google&apos;s FAQ data.</p>}
            {faqs.map((f, i) => (
              <div key={i} className="ad-faq">
                <input
                  className="ad-input"
                  value={f.q}
                  placeholder="Question"
                  aria-label={`Question ${i + 1}`}
                  onChange={(e) => setFaqs((all) => all.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))}
                />
                <button type="button" className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => setFaqs((all) => all.filter((_, j) => j !== i))}>
                  Remove
                </button>
                <textarea
                  className="ad-input"
                  rows={2}
                  value={f.a}
                  placeholder="Answer"
                  aria-label={`Answer ${i + 1}`}
                  onChange={(e) => setFaqs((all) => all.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))}
                />
              </div>
            ))}
          </section>

          <section className="ad-panel">
            <label className="ad-field">
              <span>Video transcript</span>
              <textarea rows={6} value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Optional. Paste the full transcript; search engines index it and it makes the video accessible." />
            </label>
          </section>
        </div>

        <aside className="ad-editor__side">
          <section className="ad-panel">
            <h2>Publish</h2>
            <label className="ad-check">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Published on the blog
            </label>
            <label className="ad-field">
              <span>Publish date</span>
              <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} required />
              <small>A future date schedules the post.</small>
            </label>
            <button className="ad-btn ad-btn--primary" disabled={busy}>
              {busy ? "Saving…" : isNew ? (published ? "Publish" : "Save draft") : "Save changes"}
            </button>
          </section>

          <section className="ad-panel">
            <h2>Details</h2>
            <label className="ad-field">
              <span>Topic</span>
              <input list="ad-topics" value={topic} onChange={(e) => setTopic(e.target.value)} required maxLength={60} aria-invalid={!!errors.topic} />
              <datalist id="ad-topics">
                {TOPICS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
              {fieldErr("topic")}
            </label>
            <label className="ad-field">
              <span>Tags</span>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Company intro, Samsung, Technology" />
              <small>Comma-separated.</small>
            </label>
            <label className="ad-field">
              <span>Read time (minutes)</span>
              <div style={{ display: "flex", gap: 6 }}>
                <input type="number" min={1} max={120} value={readMinutes} onChange={(e) => setReadMinutes(e.target.value)} placeholder="Auto" />
                <button type="button" className="ad-btn ad-btn--sm" onClick={() => setReadMinutes(String(estimateMinutes(`${body} ${transcript}`)))}>
                  Estimate
                </button>
              </div>
            </label>
            <label className="ad-field">
              <span>Cover image URL</span>
              <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://…" aria-invalid={!!errors.coverImage} />
              {fieldErr("coverImage")}
              <small>Optional. Posts with a video use its YouTube thumbnail.</small>
            </label>
          </section>

          <section className="ad-panel">
            <h2>Author</h2>
            <label className="ad-field">
              <span>Name</span>
              <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} maxLength={80} />
            </label>
            <label className="ad-field">
              <span>Role</span>
              <input value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} maxLength={120} placeholder="Head of Growth at Finloa" />
            </label>
            <label className="ad-field">
              <span>Short bio</span>
              <textarea rows={3} value={authorBio} onChange={(e) => setAuthorBio(e.target.value)} maxLength={600} />
            </label>
          </section>
        </aside>
      </div>
    </form>
  );
}
