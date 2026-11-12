"use client";

import { css as cssLang } from "@codemirror/lang-css";
import { html as htmlLang } from "@codemirror/lang-html";
import { json as jsonLang } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { MediaPicker } from "@/components/admin/media-library";
import { PostPreview, PreviewFrame, type PreviewAuthor } from "@/components/admin/post-preview";
import { cloneDoc, SectionsEditor, starterDoc } from "@/components/admin/sections-editor";
import { adminApi, parseYoutubeId, useNlOrigin, type AdminError } from "@/lib/admin-client";
import type { Faq } from "@/lib/api";
import { newId, type SectionsDoc, type SectionType } from "@/lib/sections";

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
  html: string;
  htmlNl: string;
  sections: SectionsDoc | null;
  sectionsNl: SectionsDoc | null;
  css: string;
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
const LANGS: Lang[] = ["en", "nl"];
/** The text fields that exist in both languages */
type Copy = { title: string; excerpt: string; transcript: string; faqs: Faq[]; tags: string; seoTitle: string; seoDescription: string };
type Category = { id: string; name: string; nameNl?: string };
type Author = PreviewAuthor & { id: string };
type Tab = "sections" | "html" | "css" | "jsonld" | "faq" | "transcript" | "preview";

const emptyCopy: Copy = { title: "", excerpt: "", transcript: "", faqs: [], tags: "", seoTitle: "", seoDescription: "" };

const copyFrom = (p: AdminPost | undefined, lang: Lang): Copy =>
  !p
    ? emptyCopy
    : lang === "en"
      ? {
          title: p.title,
          excerpt: p.excerpt ?? "",
          transcript: p.transcript ?? "",
          faqs: p.faqs,
          tags: p.tags.join(", "),
          seoTitle: p.seoTitle ?? "",
          seoDescription: p.seoDescription ?? "",
        }
      : {
          title: p.titleNl,
          excerpt: p.excerptNl ?? "",
          transcript: p.transcriptNl ?? "",
          faqs: p.faqsNl,
          tags: p.tagsNl.join(", "),
          seoTitle: p.seoTitleNl ?? "",
          seoDescription: p.seoDescriptionNl ?? "",
        };

/**
 * Content of one language when the editor opens: its sections, or hand-written HTML (sections = null).
 * Older posts written in Markdown become one "Text (Markdown)" section, so they look the same.
 */
function contentFrom(p: AdminPost | undefined, lang: Lang): { sections: SectionsDoc | null; html: string } {
  // a new post is built from sections (the starter sections are added once the types have loaded)
  if (!p) return { sections: lang === "en" ? { layout: "toc", items: [] } : null, html: "" };
  const [sections, html, body] = lang === "en" ? [p.sections, p.html, p.body] : [p.sectionsNl, p.htmlNl, p.bodyNl];
  if (sections) return { sections, html };
  if (html) return { sections: null, html };
  if (body.trim()) return { sections: { layout: "toc", items: [{ id: newId(), type: "markdown", data: { text: body } }] }, html: "" };
  return { sections: null, html: "" };
}

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
const textOf = (html: string) => html.replace(/<[^>]+>/g, " ");

type Errors = Record<string, string[] | undefined>;

const LANG_LABEL: Record<Lang, string> = { en: "English", nl: "Nederlands" };

export function PostEditor({ post }: { post?: AdminPost }) {
  const router = useRouter();
  const confirm = useConfirm();
  const isNew = !post;

  const [lang, setLang] = useState<Lang>("en");
  const [copy, setCopy] = useState<Record<Lang, Copy>>({ en: copyFrom(post, "en"), nl: copyFrom(post, "nl") });
  const [sections, setSectionsState] = useState<Record<Lang, SectionsDoc | null>>(() => ({ en: contentFrom(post, "en").sections, nl: contentFrom(post, "nl").sections }));
  const [html, setHtmlState] = useState<Record<Lang, string>>(() => ({ en: contentFrom(post, "en").html, nl: contentFrom(post, "nl").html }));
  const [css, setCss] = useState(post?.css ?? "");
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
  /** New posts start as drafts, like BrasQ */
  const [published, setPublished] = useState(post?.published ?? false);
  const [publishedAt, setPublishedAt] = useState(toLocalInput(post?.publishedAt ?? new Date().toISOString()));

  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [types, setTypes] = useState<SectionType[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  /** HTML generated from each language's sections (live, before saving) + CSS of the custom section types used */
  const [rendered, setRendered] = useState<Record<Lang, { html: string; css: string; error: string }>>({
    en: { html: post?.sections ? post.html : "", css: "", error: "" },
    nl: { html: post?.sectionsNl ? post.htmlNl : "", css: "", error: "" },
  });
  const [tab, setTab] = useState<Tab>(sections.en || isNew ? "sections" : "html");
  const [split, setSplit] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [picker, setPicker] = useState<null | "insert" | "cover">(null);
  const [codeView, setCodeView] = useState<EditorView | null>(null);
  const nlOrigin = useNlOrigin();

  useEffect(() => {
    adminApi<{ data: Category[] }>("/categories/admin").then((r) => setCategories(r.data)).catch(() => {});
    adminApi<{ data: Author[] }>("/authors").then((r) => setAuthors(r.data)).catch(() => {});
    adminApi<{ data: SectionType[] }>("/section-types")
      .then((r) => {
        setTypes(r.data);
        // a new post starts from a few sections
        if (isNew) setSectionsState((s) => (s.en && !s.en.items.length ? { ...s, en: starterDoc(r.data) } : s));
      })
      .catch((e: Error) => setMsg({ ok: false, text: `Could not load the section types: ${e.message}` }));
  }, [isNew]);

  const c = copy[lang];
  const en = copy.en;
  const nl = copy.nl;
  const doc = sections[lang];
  /** The Dutch article hasn't been started: nl.finloa.com shows the English one */
  const nlEmpty = sections.nl === null && !html.nl.trim();
  const usesSections = doc !== null || (lang === "nl" && nlEmpty);
  const changed = () => {
    setDirty(true);
    setMsg(null);
  };
  const setC = <K extends keyof Copy>(k: K, v: Copy[K]) => {
    setCopy((all) => ({ ...all, [lang]: { ...all[lang], [k]: v } }));
    changed();
    if (lang === "en" && k === "title" && !slugTouched) setSlug(slugify(v as string));
  };
  const touch =
    <T,>(fn: (v: T) => void) =>
    (v: T) => {
      fn(v);
      changed();
    };
  const setDoc = (d: SectionsDoc | null, l: Lang = lang) => {
    setSectionsState((s) => ({ ...s, [l]: d }));
    changed();
  };
  const setHtml = (v: string, l: Lang = lang) => {
    setHtmlState((h) => ({ ...h, [l]: v }));
    changed();
  };

  // Render the sections into HTML on the server (same templates as the live site), debounced so typing stays smooth
  const previewInput = { slug: slug || "preview", excerpt: c.excerpt, coverImage: coverImage || null, categoryId: categoryId || null, authorId: authorId || null };
  const renderKey = JSON.stringify([sections, en.title, nl.title, previewInput]);
  useEffect(() => {
    const t = setTimeout(() => {
      for (const l of LANGS) {
        const d = sections[l];
        if (!d) continue;
        adminApi<{ html: string; css: string }>("/posts/preview", {
          method: "POST",
          json: { ...previewInput, sections: d, lang: l, title: copy[l].title || en.title },
        })
          .then((r) => setRendered((all) => ({ ...all, [l]: { html: r.html, css: r.css, error: "" } })))
          .catch((e: Error) => setRendered((all) => ({ ...all, [l]: { ...all[l], error: e.message } })));
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderKey]);

  const youtubeId = parseYoutubeId(youtube);
  const articleOf = (l: Lang) => (sections[l] ? rendered[l].html : html[l]);
  /** Dutch status: complete, partly done (falls back to English per field), or not started */
  const nlState = !nl.title ? "missing" : nlEmpty || (en.excerpt && !nl.excerpt) ? "partial" : "ok";

  const save = useCallback(
    async (override?: { published?: boolean }) => {
      const pub = override?.published ?? published;
      if (youtube && !youtubeId) {
        setErrors({ youtube: ["Not a valid YouTube link"] });
        setMsg({ ok: false, text: "The YouTube link is not valid" });
        return;
      }
      if (jsonLd.trim()) {
        try {
          JSON.parse(jsonLd);
        } catch {
          setErrors({ jsonLd: ["Not valid JSON"] });
          setMsg({ ok: false, text: "JSON-LD is not valid JSON" });
          setTab("jsonld");
          return;
        }
      }
      if (!copy.en.title.trim()) {
        setLang("en");
        setErrors({ title: ["The English title is required"] });
        setMsg({ ok: false, text: "Title is required" });
        return;
      }
      setSaving(true);
      setMsg(null);
      setErrors({});
      const { en, nl } = copy;
      const payload = {
        slug: slug || slugify(en.title),
        title: en.title,
        titleNl: nl.title,
        excerpt: en.excerpt,
        excerptNl: nl.excerpt,
        // the article: sections (the server renders them) or hand-written HTML; Markdown bodies are converted
        sections: sections.en,
        sectionsNl: sections.nl,
        html: sections.en ? "" : html.en,
        htmlNl: sections.nl ? "" : html.nl,
        body: "",
        bodyNl: "",
        css,
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
        readMinutes: Number(readMinutes) || estimateMinutes(`${textOf(sections.en ? rendered.en.html : html.en)} ${en.transcript}`),
        published: pub,
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
          setPublished(r.data.published);
          setDirty(false);
          setMsg({ ok: true, text: `Saved ${new Date().toLocaleTimeString()}` });
        }
      } catch (err) {
        const e = err as AdminError;
        setErrors(e.details ?? {});
        setMsg({ ok: false, text: e.message });
      } finally {
        setSaving(false);
      }
    },
    [copy, sections, html, css, rendered, slug, jsonLd, youtube, youtubeId, videoLength, coverImage, categoryId, authorId, featured, newsletterPopup, readMinutes, published, publishedAt, isNew, post, router],
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
    if (!(await confirm({ title: `Delete "${post.title}"?`, message: "The post is removed from the blog in both languages. This cannot be undone." }))) return;
    try {
      await adminApi(`/posts/${post.id}`, { method: "DELETE" });
      setDirty(false);
      router.replace("/admin/posts");
    } catch (err) {
      setMsg({ ok: false, text: (err as Error).message });
    }
  }

  /** Fill the empty Dutch fields (and an empty Dutch article) with the English content, as a starting point for translating */
  function startFromEnglish() {
    setCopy((all) => {
      const n = { ...all.nl };
      (Object.keys(n) as (keyof Copy)[]).forEach((k) => {
        const empty = k === "faqs" ? !n.faqs.length : !n[k];
        if (empty) (n as Record<keyof Copy, unknown>)[k] = k === "faqs" ? all.en.faqs.map((f) => ({ ...f })) : all.en[k];
      });
      return { ...all, nl: n };
    });
    if (nlEmpty) {
      if (sections.en) setDoc(cloneDoc(sections.en), "nl");
      else setHtml(html.en, "nl");
    }
    changed();
  }

  /** Hand-written HTML -> sections: the current HTML becomes one Custom HTML section, so the page looks the same. */
  async function useSectionsMode() {
    if (
      !(await confirm({
        title: "Edit this article with sections?",
        message: "The current HTML becomes one “Custom HTML” section, so the page looks the same. You can then add sections around it, or rebuild it section by section.",
        confirmLabel: "Use sections",
      }))
    )
      return;
    const items = html[lang].trim() ? [{ id: newId(), type: "custom-html", data: { html: html[lang] } }] : [];
    setDoc({ layout: "toc", items });
    setSelected(items[0]?.id ?? null);
    setTab("sections");
  }

  /** Sections -> hand-written HTML, starting from the HTML the sections produce now. */
  async function useHtmlMode() {
    if (
      !(await confirm({
        title: "Edit the HTML by hand?",
        message: `The ${LANG_LABEL[lang]} article stops using sections. You keep the HTML they produce now and edit it directly.`,
        confirmLabel: "Edit HTML",
      }))
    )
      return;
    setHtml(rendered[lang].html);
    setDoc(null);
    setTab("html");
  }

  function onPicked(url: string, alt: string) {
    if (picker === "cover") touch(setCoverImage)(url);
    else {
      const snippet = tab === "css" ? `url("${url}")` : `<img src="${url}" alt="${alt.replace(/"/g, "&quot;")}" loading="lazy">`;
      const view = codeView;
      if (view && (tab === "html" || tab === "css")) {
        const { from, to } = view.state.selection.main;
        view.dispatch({ changes: { from, to, insert: snippet }, selection: { anchor: from + snippet.length } });
        view.focus();
      } else if (tab === "css") touch(setCss)(`${css}\n${snippet}`);
      else setHtml(`${html[lang]}\n${snippet}`);
    }
    setPicker(null);
  }

  const extensions = useMemo(
    () => ({ html: [htmlLang(), EditorView.lineWrapping], css: [cssLang()], json: [jsonLang()], text: [EditorView.lineWrapping] }),
    [],
  );

  // Preview: the post as it renders on the site, in the language being edited (Dutch falls back to English)
  const category = categories.find((x) => x.id === categoryId);
  const author = authors.find((x) => x.id === authorId) ?? null;
  const pick = <T,>(nlValue: T, enValue: T, empty: (v: T) => boolean) => (lang === "nl" && !empty(nlValue) ? nlValue : enValue);
  const previewLang: Lang = lang === "nl" && !nlEmpty ? "nl" : "en";
  const previewPost = useDeferredValue({
    lang,
    title: pick(c.title, en.title, (v) => !v),
    excerpt: pick(c.excerpt, en.excerpt, (v) => !v),
    html: articleOf(previewLang),
    layout: sections[previewLang]?.layout ?? "toc",
    css: [rendered[previewLang].css, css].filter(Boolean).join("\n"),
    faqs: cleanFaqs(pick(c.faqs, en.faqs, (v) => !v.length)),
    transcript: pick(c.transcript, en.transcript, (v) => !v),
    tags: splitTags(pick(c.tags, en.tags, (v) => !v)),
    youtubeId,
    videoLength,
    coverImage,
    readMinutes: Number(readMinutes) || estimateMinutes(`${textOf(articleOf("en"))} ${en.transcript}`),
    topic: (lang === "nl" ? category?.nameNl || category?.name : category?.name) ?? "",
    author,
    publishedAt,
    translated: lang === "en" || !!nl.title,
  });

  const fieldErr = (k: string) => errors[k]?.[0] && <span className="ad-field__err">{errors[k]![0]}</span>;
  const path = `/blog/${slug || slugify(en.title) || "…"}`;
  /** Placeholder in Dutch fields: the English text that shows while the Dutch one is empty */
  const fallback = (k: "title" | "excerpt" | "seoTitle" | "seoDescription" | "tags") => (lang === "nl" && en[k] ? en[k] : undefined);

  const code = (value: string, onChange: ((v: string) => void) | null, ext: keyof typeof extensions, placeholder?: string, trackView = false) => (
    <div className="ad-code">
      <CodeMirror
        value={value}
        extensions={extensions[ext]}
        onChange={onChange ?? undefined}
        readOnly={!onChange}
        editable={!!onChange}
        placeholder={placeholder}
        onCreateEditor={trackView ? setCodeView : undefined}
        basicSetup={{ foldGutter: true, highlightActiveLine: !!onChange }}
      />
    </div>
  );

  const preview = (
    <PreviewFrame mobile={mobile} selected={tab === "sections" ? selected : null}>
      <PostPreview post={previewPost} />
    </PreviewFrame>
  );

  const faqPane = (
    <div className="ad-pane">
      <div className="ad-panel__head">
        <span className="ad-hint">
          {c.faqs.length === 0
            ? lang === "nl" && en.faqs.length
              ? `No Dutch questions: the ${en.faqs.length} English ones are shown on nl.finloa.com.`
              : "Optional. Questions appear at the end of the post and in Google's FAQ data."
            : `${c.faqs.length} question${c.faqs.length === 1 ? "" : "s"} (${LANG_LABEL[lang]})`}
        </span>
        <button type="button" className="ad-btn ad-btn--sm" onClick={() => setC("faqs", [...c.faqs, { q: "", a: "" }])}>
          + Add question
        </button>
      </div>
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
            rows={3}
            value={f.a}
            placeholder={lang === "nl" ? (en.faqs[i]?.a ?? "Antwoord") : "Answer"}
            aria-label={`Answer ${i + 1}`}
            onChange={(e) => setC("faqs", c.faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))}
          />
        </div>
      ))}
    </div>
  );

  /** Dutch article not started yet: start it from the English one or empty */
  const nlStart = (
    <div className="ad-pane ad-pane--center">
      <h2>No Dutch article yet</h2>
      <p className="ad-hint">Until you add one, nl.finloa.com shows the English article. The preview shows it too.</p>
      <div className="ad-quick">
        <button type="button" className="ad-btn ad-btn--primary" onClick={() => (sections.en ? setDoc(cloneDoc(sections.en)) : setHtml(html.en))}>
          Start from the English {sections.en ? "sections" : "HTML"}
        </button>
        <button type="button" className="ad-btn" onClick={() => setDoc({ layout: sections.en?.layout ?? "toc", items: [] })}>
          Start empty
        </button>
      </div>
    </div>
  );

  const effectiveTab: Tab = tab === "sections" && !usesSections ? "html" : tab;
  let work: React.ReactNode;
  if (effectiveTab === "preview") work = preview;
  else if (effectiveTab === "faq") work = faqPane;
  else if (effectiveTab === "transcript")
    work = code(
      c.transcript,
      (v) => setC("transcript", v),
      "text",
      lang === "nl" && en.transcript ? "Leave empty to show the English transcript." : "Optional. Paste the full video transcript; search engines index it and it makes the video accessible.",
    );
  else if (effectiveTab === "jsonld") work = code(jsonLd, touch(setJsonLd), "json", '{\n  "@context": "https://schema.org",\n  "@type": "HowTo",\n  …\n}');
  else if (effectiveTab === "css")
    work = code(css, touch(setCss), "css", "/* CSS for this post, in both languages. E.g. */\n.post-body h2 { color: #2f6bff; }", true);
  else if (effectiveTab === "sections")
    work = doc ? <SectionsEditor doc={doc} onChange={(d) => setDoc(d)} selected={selected} onSelect={setSelected} types={types} /> : nlStart;
  else if (doc)
    work = (
      <div className="ad-code-wrap">
        <div className="se-htmlbar">
          <span className="ad-hint">
            Generated from the sections. {rendered[lang].error && <span className="ad-field__err">{rendered[lang].error}</span>}
          </span>
          <button type="button" className="ad-btn ad-btn--sm" onClick={useHtmlMode}>
            Edit HTML by hand
          </button>
        </div>
        {code(rendered[lang].html, null, "html")}
      </div>
    );
  else
    work = code(
      html[lang],
      (v) => setHtml(v),
      "html",
      lang === "nl" ? "Leave empty to show the English article, or write the Dutch HTML here." : "<p>Opening paragraph…</p>\n\n<h2>First section</h2>\n<p>…</p>",
      true,
    );

  const L = lang.toUpperCase();
  const tabs: [Tab, string][] = [
    ...(usesSections ? ([["sections", `Sections (${L})`]] as [Tab, string][]) : []),
    ["html", `HTML (${L})`],
    ["css", "CSS"],
    ["jsonld", "JSON-LD"],
    ["faq", `FAQ (${L})`],
    ["transcript", `Transcript (${L})`],
    ...(split ? [] : ([["preview", "Preview"]] as [Tab, string][])),
  ];

  return (
    <>
      <div className="ad-head">
        <h1>{isNew ? "New post" : en.title || "Untitled"}</h1>
        <div className="ad-savebar">
          {msg && <span className={msg.ok ? "ad-msg-ok" : "ad-msg-error"}>{msg.text}</span>}
          {dirty && !msg && <span className="ad-hint">Unsaved changes</span>}
          {!isNew && post.published && slug && (
            <>
              <a className="ad-btn" href={path} target="_blank" rel="noreferrer">
                Open on site ↗
              </a>
              <a className="ad-btn" href={`${nlOrigin}${path}`} target="_blank" rel="noreferrer">
                NL ↗
              </a>
            </>
          )}
          {!isNew && (
            <button type="button" className="ad-btn ad-btn--danger" onClick={remove}>
              Delete
            </button>
          )}
          {published ? (
            <>
              <button type="button" className="ad-btn" disabled={saving} onClick={() => save({ published: false })}>
                Unpublish
              </button>
              <button type="button" className="ad-btn ad-btn--primary" disabled={saving} onClick={() => save()}>
                {isNew ? "Publish" : "Update"}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="ad-btn" disabled={saving} onClick={() => save({ published: false })}>
                Save draft
              </button>
              <button type="button" className="ad-btn ad-btn--primary" disabled={saving} onClick={() => save({ published: true })}>
                Publish
              </button>
            </>
          )}
        </div>
      </div>

      <div className="ad-editor">
        <div className="ad-editor__meta">
          <div className="ad-panel__head">
            <div className="ad-lang" role="group" aria-label="Language">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => {
                    setLang(l);
                    setSelected(null);
                  }}
                >
                  {l === "nl" && <span className={`ad-lang__dot${nlState === "ok" ? " ad-lang__dot--ok" : ""}`} aria-hidden />}
                  {LANG_LABEL[l]}
                </button>
              ))}
            </div>
            {lang === "nl" && (
              <button type="button" className="ad-btn ad-btn--sm" onClick={startFromEnglish} title="Copies the English text into the Dutch fields that are still empty">
                Fill from English
              </button>
            )}
          </div>
          {lang === "nl" && nlState !== "ok" && (
            <p className="ad-fallback">
              {nlState === "missing"
                ? "No Dutch version yet. Until you add a Dutch title, nl.finloa.com shows the English text with a note that it isn't translated."
                : "Some Dutch parts are empty. Those parts show in English on nl.finloa.com."}
            </p>
          )}

          <label>
            Title ({LANG_LABEL[lang]})
            <input
              value={c.title}
              onChange={(e) => setC("title", e.target.value)}
              maxLength={200}
              placeholder={fallback("title")}
              aria-invalid={!!errors[lang === "en" ? "title" : "titleNl"]}
            />
            {fieldErr(lang === "en" ? "title" : "titleNl")}
          </label>
          <div className="ad-2">
            <label>
              Status
              <select value={published ? "published" : "draft"} onChange={(e) => touch(setPublished)(e.target.value === "published")}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label>
              Read time
              <input type="number" min={1} max={120} value={readMinutes} onChange={(e) => touch(setReadMinutes)(e.target.value)} placeholder="Auto" />
            </label>
          </div>
          <label>
            Publish date
            <input type="datetime-local" value={publishedAt} onChange={(e) => touch(setPublishedAt)(e.target.value)} required />
            <span className="ad-hint">A future date schedules the post.</span>
          </label>
          <label>
            Slug
            <input
              value={slug}
              placeholder="from title"
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
                changed();
              }}
              aria-invalid={!!errors.slug}
            />
            {fieldErr("slug")}
            <span className="ad-hint">{path} · same in both languages</span>
          </label>
          <label>
            Excerpt ({LANG_LABEL[lang]})
            <textarea value={c.excerpt} onChange={(e) => setC("excerpt", e.target.value)} maxLength={400} placeholder={fallback("excerpt")} />
            <span className="ad-hint">Shown under the title, on cards, in search and as fallback meta description.</span>
          </label>
          <div className="ad-2">
            <label>
              Category
              <select value={categoryId} onChange={(e) => touch(setCategoryId)(e.target.value)} aria-invalid={!!errors.categoryId}>
                <option value="">—</option>
                {categories.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              {fieldErr("categoryId")}
            </label>
            <label>
              Author
              <select value={authorId} onChange={(e) => touch(setAuthorId)(e.target.value)}>
                <option value="">—</option>
                {authors.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Cover image
            <div style={{ display: "flex", gap: 6 }}>
              <input value={coverImage} onChange={(e) => touch(setCoverImage)(e.target.value)} aria-invalid={!!errors.coverImage} />
              <button type="button" className="ad-btn ad-btn--sm" onClick={() => setPicker("cover")}>
                Pick
              </button>
            </div>
            {fieldErr("coverImage")}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {coverImage && <img src={coverImage} alt="" className="ad-meta__img" />}
          </label>

          <fieldset>
            <legend>Video</legend>
            <label>
              YouTube link
              <input
                value={youtube}
                onChange={(e) => touch(setYoutube)(e.target.value)}
                placeholder="https://youtu.be/…"
                aria-invalid={(!!youtube && !youtubeId) || !!errors.youtube}
              />
              {youtube && !youtubeId ? <span className="ad-field__err">That doesn&apos;t look like a YouTube link.</span> : fieldErr("youtube")}
            </label>
            <label>
              Video length
              <input value={videoLength} onChange={(e) => touch(setVideoLength)(e.target.value)} placeholder="2:48" maxLength={20} />
            </label>
            <span className="ad-hint">Shown at the top of the post in both languages. Without a cover image, the YouTube thumbnail is used.</span>
          </fieldset>

          <fieldset>
            <legend>Card details</legend>
            <label>
              Tags ({LANG_LABEL[lang]})
              <input value={c.tags} onChange={(e) => setC("tags", e.target.value)} placeholder={fallback("tags") ?? "Comma-separated"} />
            </label>
            <label className="ad-check">
              <input type="checkbox" checked={featured} onChange={(e) => touch(setFeatured)(e.target.checked)} />
              Featured (large, first on /blog)
            </label>
          </fieldset>

          <fieldset>
            <legend>SEO ({LANG_LABEL[lang]})</legend>
            <label>
              SEO title
              <input
                value={c.seoTitle}
                onChange={(e) => setC("seoTitle", e.target.value)}
                maxLength={200}
                placeholder={`${(c.title || en.title || "Post title").replace(/\.$/, "")} | Finloa Blog`}
              />
              <span className="ad-hint">{c.seoTitle.length}/60 characters recommended.</span>
            </label>
            <label>
              Meta description
              <textarea
                value={c.seoDescription}
                onChange={(e) => setC("seoDescription", e.target.value)}
                maxLength={400}
                placeholder={c.excerpt || fallback("seoDescription") || "Empty uses the excerpt."}
              />
              <span className="ad-hint">{c.seoDescription.length}/155 characters recommended.</span>
            </label>
            <span className="ad-hint">Structured data (JSON-LD) is edited in its own tab.</span>
          </fieldset>

          <fieldset>
            <legend>Conversion</legend>
            <label className="ad-check">
              <input type="checkbox" checked={newsletterPopup} onChange={(e) => touch(setNewsletterPopup)(e.target.checked)} />
              Newsletter popup (after 35% scroll)
            </label>
          </fieldset>
        </div>

        <div className="ad-editor__work">
          <div className="ad-tabs" role="tablist">
            {tabs.map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={effectiveTab === k} onClick={() => setTab(k)}>
                {l}
              </button>
            ))}
            <span className="ad-tabs__spacer" />
            {!usesSections && (
              <button type="button" onClick={useSectionsMode} title="Build this article from sections">
                Use sections
              </button>
            )}
            {(effectiveTab === "css" || (effectiveTab === "html" && !doc)) && (
              <button type="button" onClick={() => setPicker("insert")} title="Upload or pick an image and insert it at the cursor">
                + Image
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSplit(!split);
                if (tab === "preview") setTab(usesSections ? "sections" : "html");
              }}
            >
              {split ? "Full-width editor" : "Side-by-side preview"}
            </button>
            <button type="button" aria-pressed={mobile} onClick={() => setMobile(!mobile)}>
              {mobile ? "Mobile" : "Desktop"} preview
            </button>
          </div>
          {errors.jsonLd && effectiveTab === "jsonld" && <span className="ad-field__err">{errors.jsonLd[0]}</span>}
          <div className={`ad-split${split ? " ad-split--side" : ""}`}>
            {work}
            {split && preview}
          </div>
          <p className="ad-hint">
            The article is rendered in the site&apos;s blog layout (hero, contents list, FAQ and author box come from the post settings). Every{" "}
            <code>&lt;h2&gt;</code> is listed in the contents. The CSS applies to this post in both languages. Ctrl/⌘+S saves.{" "}
            <Link href="/admin/sections">Section types</Link> · <Link href="/admin/automation">Automation API</Link>
          </p>
        </div>
      </div>

      {picker && <MediaPicker title={picker === "cover" ? "Choose a cover image" : "Insert an image"} onClose={() => setPicker(null)} onPick={(m) => onPicked(m.url, m.alt)} />}
    </>
  );
}
