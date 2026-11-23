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
import { PreviewFrame } from "@/components/admin/post-preview";
import { cloneDoc, SectionsEditor } from "@/components/admin/sections-editor";
import { ContentArticle } from "@/components/content-article";
import { adminApi, useNlOrigin, type AdminError } from "@/lib/admin-client";
import { emptyData, newId, type SectionsDoc, type SectionType } from "@/lib/sections";

export type AdminPage = {
  id: string;
  slug: string;
  title: string;
  titleNl: string;
  eyebrow: string;
  eyebrowNl: string;
  html: string;
  htmlNl: string;
  /** Section-based body per language; null = hand-written HTML */
  sections: SectionsDoc | null;
  sectionsNl: SectionsDoc | null;
  css: string;
  seoTitle: string | null;
  seoTitleNl: string | null;
  seoDescription: string | null;
  seoDescriptionNl: string | null;
  jsonLd: string | null;
  published: boolean;
  sortOrder: number;
  updatedAt: string;
};

type Lang = "en" | "nl";
const LANGS: Lang[] = ["en", "nl"];
const LANG_LABEL: Record<Lang, string> = { en: "English", nl: "Nederlands" };
/** The fields that exist in both languages */
type Copy = { title: string; eyebrow: string; html: string; seoTitle: string; seoDescription: string };
type Tab = "sections" | "html" | "css" | "jsonld" | "preview";

/** The sections a new page starts with */
function pageStarterDoc(types: SectionType[]): SectionsDoc {
  const text = types.find((t) => t.key === "text");
  return { layout: "wide", items: text ? [0, 1].map(() => ({ id: newId(), type: "text", data: emptyData(text.fields) })) : [] };
}

const copyFrom = (p: AdminPage | undefined, lang: Lang): Copy =>
  !p
    ? { title: "", eyebrow: "", html: "", seoTitle: "", seoDescription: "" }
    : lang === "en"
      ? { title: p.title, eyebrow: p.eyebrow, html: p.html, seoTitle: p.seoTitle ?? "", seoDescription: p.seoDescription ?? "" }
      : { title: p.titleNl, eyebrow: p.eyebrowNl, html: p.htmlNl, seoTitle: p.seoTitleNl ?? "", seoDescription: p.seoDescriptionNl ?? "" };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

const fmtDate = (d: Date, lang: Lang) =>
  d.toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function PageEditor({ page }: { page?: AdminPage }) {
  const router = useRouter();
  const confirm = useConfirm();
  const isNew = !page;

  const [lang, setLang] = useState<Lang>("en");
  const [copy, setCopy] = useState<Record<Lang, Copy>>({ en: copyFrom(page, "en"), nl: copyFrom(page, "nl") });
  const [css, setCss] = useState(page?.css ?? "");
  const [jsonLd, setJsonLd] = useState(page?.jsonLd ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [published, setPublished] = useState(page?.published ?? false);
  const [sortOrder, setSortOrder] = useState(String(page?.sortOrder ?? 0));
  const [updatedAt, setUpdatedAt] = useState(page?.updatedAt ?? null);

  /** Body per language: sections (the server turns them into HTML) or null when the HTML is written by hand */
  const [sections, setSectionsState] = useState<Record<Lang, SectionsDoc | null>>(() => ({
    en: page ? page.sections : { layout: "wide", items: [] },
    nl: page?.sectionsNl ?? null,
  }));
  /** HTML generated from each language's sections (live, before saving) + CSS of the custom section types used */
  const [rendered, setRendered] = useState<Record<Lang, { html: string; css: string; error: string }>>({
    en: { html: page?.sections ? page.html : "", css: "", error: "" },
    nl: { html: page?.sectionsNl ? page.htmlNl : "", css: "", error: "" },
  });
  const [types, setTypes] = useState<SectionType[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>(!page || page.sections ? "sections" : "html");
  const [split, setSplit] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [picker, setPicker] = useState(false);
  const [codeView, setCodeView] = useState<EditorView | null>(null);
  const nlOrigin = useNlOrigin();

  useEffect(() => {
    adminApi<{ data: SectionType[] }>("/section-types")
      .then((r) => {
        setTypes(r.data);
        // a new page starts from a few sections
        if (isNew) setSectionsState((s) => (s.en && !s.en.items.length ? { ...s, en: pageStarterDoc(r.data) } : s));
      })
      .catch((e: Error) => setMsg({ ok: false, text: `Could not load the section types: ${e.message}` }));
  }, [isNew]);

  const c = copy[lang];
  const en = copy.en;
  const doc = sections[lang];
  /** The Dutch body hasn't been started: nl.finloa.com shows the English one */
  const nlEmpty = sections.nl === null && !copy.nl.html.trim();
  const usesSections = doc !== null || (lang === "nl" && nlEmpty);
  const changed = () => {
    setDirty(true);
    setMsg(null);
  };
  const setC = <K extends keyof Copy>(k: K, v: Copy[K], l: Lang = lang) => {
    setCopy((all) => ({ ...all, [l]: { ...all[l], [k]: v } }));
    changed();
    if (l === "en" && k === "title" && !slugTouched) setSlug(slugify(v));
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

  // Render the sections into HTML on the server (same templates as the live site), debounced so typing stays smooth
  const renderKey = JSON.stringify([sections, slug, copy.en.title, copy.nl.title]);
  useEffect(() => {
    const t = setTimeout(() => {
      for (const l of LANGS) {
        const d = sections[l];
        if (!d) continue;
        adminApi<{ html: string; css: string }>("/pages/preview", {
          method: "POST",
          json: { sections: d, lang: l, slug: slug || "preview", title: copy[l].title || copy.en.title },
        })
          .then((r) => setRendered((all) => ({ ...all, [l]: { html: r.html, css: r.css, error: "" } })))
          .catch((e: Error) => setRendered((all) => ({ ...all, [l]: { ...all[l], error: e.message } })));
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderKey]);
  const bodyOf = (l: Lang) => (sections[l] ? rendered[l].html : copy[l].html);

  const save = useCallback(
    async (override?: { published?: boolean }) => {
      const pub = override?.published ?? published;
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
        eyebrow: en.eyebrow,
        eyebrowNl: nl.eyebrow,
        // the body: sections (the server renders them into HTML) or hand-written HTML
        sections: sections.en,
        sectionsNl: sections.nl,
        html: sections.en ? rendered.en.html : en.html,
        htmlNl: sections.nl ? rendered.nl.html : nl.html,
        css,
        seoTitle: en.seoTitle,
        seoTitleNl: nl.seoTitle,
        seoDescription: en.seoDescription,
        seoDescriptionNl: nl.seoDescription,
        jsonLd,
        published: pub,
        sortOrder: Number(sortOrder) || 0,
      };
      try {
        if (isNew) {
          const r = await adminApi<{ data: AdminPage }>("/pages", { method: "POST", json: payload });
          setDirty(false);
          router.replace(`/admin/pages/${r.data.id}?created=1`);
        } else {
          const r = await adminApi<{ data: AdminPage }>(`/pages/${page.id}`, { method: "PATCH", json: payload });
          setSlug(r.data.slug);
          setPublished(r.data.published);
          setUpdatedAt(r.data.updatedAt);
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
    [copy, sections, rendered, css, jsonLd, slug, published, sortOrder, isNew, page, router],
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
    if (!page) return;
    if (!(await confirm({ title: `Delete "${page.title}"?`, message: `/${page.slug} will show “page not found” in both languages. This cannot be undone.` }))) return;
    try {
      await adminApi(`/pages/${page.id}`, { method: "DELETE" });
      setDirty(false);
      router.replace("/admin/pages");
    } catch (err) {
      setMsg({ ok: false, text: (err as Error).message });
    }
  }

  /** Fill the empty Dutch fields (and an empty Dutch body) with the English ones, as a starting point for translating */
  function fillFromEnglish() {
    setCopy((all) => {
      const n = { ...all.nl };
      (Object.keys(n) as (keyof Copy)[]).forEach((k) => {
        if (k === "html" && sections.en) return;
        if (!n[k].trim()) n[k] = all.en[k];
      });
      return { ...all, nl: n };
    });
    if (nlEmpty && sections.en) setDoc(cloneDoc(sections.en), "nl");
    changed();
  }

  /** Hand-written HTML -> sections: the current HTML becomes one Custom HTML section, so the page looks the same. */
  async function useSectionsMode() {
    if (
      !(await confirm({
        title: "Edit this page with sections?",
        message: "The current HTML becomes one “Custom HTML” section, so the page looks the same. You can then add sections around it, or rebuild it section by section.",
        confirmLabel: "Use sections",
      }))
    )
      return;
    const items = c.html.trim() ? [{ id: newId(), type: "custom-html", data: { html: c.html } }] : [];
    setDoc({ layout: "wide", items });
    setSelected(items[0]?.id ?? null);
    setTab("sections");
  }

  /** Sections -> hand-written HTML, starting from the HTML the sections produce now. */
  async function useHtmlMode() {
    if (
      !(await confirm({
        title: "Edit the HTML by hand?",
        message: `The ${LANG_LABEL[lang]} page stops using sections. You keep the HTML they produce now and edit it directly.`,
        confirmLabel: "Edit HTML",
      }))
    )
      return;
    setC("html", rendered[lang].html);
    setDoc(null);
    setTab("html");
  }

  function onPicked(url: string, alt: string) {
    const snippet = tab === "css" ? `url("${url}")` : `<img src="${url}" alt="${alt.replace(/"/g, "&quot;")}" loading="lazy">`;
    if (codeView && (tab === "html" || tab === "css")) {
      const { from, to } = codeView.state.selection.main;
      codeView.dispatch({ changes: { from, to, insert: snippet }, selection: { anchor: from + snippet.length } });
      codeView.focus();
    } else if (tab === "css") touch(setCss)(`${css}\n${snippet}`);
    else setC("html", `${c.html}\n${snippet}`);
    setPicker(false);
  }

  const extensions = useMemo(() => ({ html: [htmlLang(), EditorView.lineWrapping], css: [cssLang()], json: [jsonLang()] }), []);

  // Preview: the page as the site renders it, in the language being edited (empty Dutch fields show the English)
  const previewLang: Lang = lang === "nl" && !nlEmpty ? "nl" : "en";
  const pick = (k: keyof Copy) => (lang === "nl" && c[k].trim() ? c[k] : en[k]);
  const preview = useDeferredValue({
    eyebrow: pick("eyebrow"),
    title: pick("title") || "Untitled",
    updated: `${lang === "nl" ? "Laatst bijgewerkt op" : "Last updated"} ${fmtDate(updatedAt && !dirty ? new Date(updatedAt) : new Date(), lang)}`,
    html: bodyOf(previewLang),
    sections: !!sections[previewLang],
    css: [rendered[previewLang].css, css].filter(Boolean).join("\n"),
  });

  const fieldErr = (k: string) => errors[k]?.[0] && <span className="ad-field__err">{errors[k]![0]}</span>;
  const path = `/${slug || slugify(en.title) || "…"}`;
  const fallback = (k: keyof Copy) => (lang === "nl" && en[k] ? en[k] : undefined);

  const code = (value: string, onChange: ((v: string) => void) | null, ext: keyof typeof extensions, placeholder: string, trackView = false) => (
    <div className="ad-code">
      <CodeMirror
        value={value}
        extensions={extensions[ext]}
        onChange={onChange ?? undefined}
        readOnly={!onChange}
        editable={!!onChange}
        placeholder={placeholder}
        onCreateEditor={trackView ? setCodeView : undefined}
        basicSetup={{ foldGutter: true }}
      />
    </div>
  );

  const previewPane = (
    <PreviewFrame mobile={mobile} selected={tab === "sections" ? selected : null}>
      <ContentArticle {...preview} />
    </PreviewFrame>
  );

  /** Dutch body not started yet: start it from the English one or empty */
  const nlStart = (
    <div className="ad-pane ad-pane--center">
      <h2>No Dutch page yet</h2>
      <p className="ad-hint">Until you add one, nl.finloa.com shows the English page. The preview shows it too.</p>
      <div className="ad-quick">
        <button type="button" className="ad-btn ad-btn--primary" onClick={() => (sections.en ? setDoc(cloneDoc(sections.en)) : setC("html", en.html))}>
          Start from the English {sections.en ? "sections" : "HTML"}
        </button>
        <button type="button" className="ad-btn" onClick={() => setDoc({ layout: "wide", items: [] })}>
          Start empty
        </button>
      </div>
    </div>
  );

  const effectiveTab: Tab = tab === "sections" && !usesSections ? "html" : tab;
  let work: React.ReactNode;
  if (effectiveTab === "preview") work = previewPane;
  else if (effectiveTab === "sections")
    work = doc ? <SectionsEditor doc={doc} onChange={(d) => setDoc(d)} selected={selected} onSelect={setSelected} types={types} /> : nlStart;
  else if (effectiveTab === "css") work = code(css, touch(setCss), "css", "/* CSS for this page, in both languages. E.g. */\n.content-page__body h2 { color: #2f6bff; }", true);
  else if (effectiveTab === "jsonld") work = code(jsonLd, touch(setJsonLd), "json", '{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  …\n}');
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
        {code(rendered[lang].html, null, "html", "")}
      </div>
    );
  else
    work = code(
      c.html,
      (v) => setC("html", v),
      "html",
      lang === "nl" ? "Leave empty to show the English page on nl.finloa.com, or write the Dutch HTML here." : "<p>Opening paragraph…</p>\n\n<h2>First section</h2>\n<p>…</p>",
      true,
    );

  const L = lang.toUpperCase();
  const tabs: [Tab, string][] = [
    ...(usesSections ? ([["sections", `Sections (${L})`]] as [Tab, string][]) : []),
    ["html", `HTML (${L})`],
    ["css", "CSS"],
    ["jsonld", "JSON-LD"],
    ...(split ? [] : ([["preview", "Preview"]] as [Tab, string][])),
  ];

  return (
    <>
      <div className="ad-head">
        <h1>{isNew ? "New page" : en.title || "Untitled"}</h1>
        <div className="ad-savebar">
          {msg && <span className={msg.ok ? "ad-msg-ok" : "ad-msg-error"}>{msg.text}</span>}
          {dirty && !msg && <span className="ad-hint">Unsaved changes</span>}
          {!isNew && page.published && slug && (
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
                <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
                  {l === "nl" && <span className={`ad-lang__dot${!nlEmpty && copy.nl.title ? " ad-lang__dot--ok" : ""}`} aria-hidden />}
                  {LANG_LABEL[l]}
                </button>
              ))}
            </div>
            {lang === "nl" && (
              <button type="button" className="ad-btn ad-btn--sm" onClick={fillFromEnglish} title="Copies the English text into the Dutch fields that are still empty">
                Fill from English
              </button>
            )}
          </div>
          {lang === "nl" && nlEmpty && (
            <p className="ad-fallback">No Dutch body yet. Until you add it, nl.finloa.com shows the English page. Empty Dutch fields use the English text.</p>
          )}

          <label>
            Title ({LANG_LABEL[lang]})
            <input value={c.title} onChange={(e) => setC("title", e.target.value)} maxLength={200} placeholder={fallback("title")} aria-invalid={!!errors.title} />
            {fieldErr("title")}
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
              Sort order
              <input type="number" min={0} value={sortOrder} onChange={(e) => touch(setSortOrder)(e.target.value)} />
            </label>
          </div>
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
            Label above the title ({LANG_LABEL[lang]})
            <input value={c.eyebrow} onChange={(e) => setC("eyebrow", e.target.value)} maxLength={60} placeholder={fallback("eyebrow") ?? "e.g. LEGAL (empty hides it)"} />
          </label>

          <fieldset>
            <legend>SEO ({LANG_LABEL[lang]})</legend>
            <label>
              SEO title
              <input value={c.seoTitle} onChange={(e) => setC("seoTitle", e.target.value)} maxLength={200} placeholder={fallback("seoTitle") ?? `${c.title || en.title || "Page title"} — Finloa`} />
              <span className="ad-hint">{c.seoTitle.length}/60 characters recommended.</span>
            </label>
            <label>
              Meta description
              <textarea value={c.seoDescription} onChange={(e) => setC("seoDescription", e.target.value)} maxLength={400} placeholder={fallback("seoDescription")} />
              <span className="ad-hint">{c.seoDescription.length}/155 characters recommended.</span>
            </label>
            <span className="ad-hint">Structured data (JSON-LD) is edited in its own tab.</span>
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
              <button type="button" onClick={useSectionsMode} title="Build this page from sections">
                Use sections
              </button>
            )}
            {((effectiveTab === "html" && !doc) || effectiveTab === "css") && (
              <button type="button" onClick={() => setPicker(true)} title="Upload or pick an image and insert it at the cursor">
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
          {errors.jsonLd && tab === "jsonld" && <span className="ad-field__err">{errors.jsonLd[0]}</span>}
          <div className={`ad-split${split ? " ad-split--side" : ""}`}>
            {work}
            {split && previewPane}
          </div>
          <p className="ad-hint">
            Build the page from sections (the same blocks as the blog posts, see <Link href="/admin/sections">Section types</Link>) or write HTML: use <code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;ul&gt;&lt;li&gt;</code>, <code>&lt;strong&gt;</code> and{" "}
            <code>&lt;a href&gt;</code>; they get the site&apos;s style. The page header, footer and contact form are added around it. The CSS applies to
            this page in both languages. Ctrl/⌘+S saves. <Link href="/admin/texts">Site texts</Link>
          </p>
        </div>
      </div>

      {picker && <MediaPicker title="Insert an image" onClose={() => setPicker(false)} onPick={(m) => onPicked(m.url, m.alt)} />}
    </>
  );
}
