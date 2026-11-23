"use client";

import { css as cssLang } from "@codemirror/lang-css";
import { html as htmlLang } from "@codemirror/lang-html";
import { json as jsonLang } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { MediaPicker } from "@/components/admin/media-library";
import { cloneDoc, SectionsEditor, type FixedBlock } from "@/components/admin/sections-editor";
import type { TextOverrides } from "@/i18n/config";
import catalog from "@/i18n/texts.json";
import { adminApi, useNlOrigin } from "@/lib/admin-client";
import { layoutCss, partsHtml, type DesignLayout, type DesignPart } from "@/lib/design-layout";
import { newId, type SectionsDoc, type SectionType } from "@/lib/sections";

/**
 * Editor for a designed page (the front page, /seo, /videos …), laid out like the content page editor:
 * page settings on the left, then Sections / HTML / CSS / JSON-LD tabs beside a preview.
 *
 * - Sections: the page's designed blocks come first. Their layout is coded, their texts are edited here in English
 *   and Dutch (stored as site texts). Below them you can add your own sections, shown under the design, above the
 *   contact form.
 * - HTML: the HTML of those added sections (generated), or hand-written HTML instead.
 * - CSS / JSON-LD: extra CSS and structured data for this page.
 */

export type CatalogText = { key: string; en: string; nl: string; seo?: "title" | "description" };
export type CatalogSection = { id: string; group: "page" | "shared"; label: string; path: string | null; file: string; texts: CatalogText[]; includes?: string[] };
type Catalog = { sections: CatalogSection[]; usedIn: Record<string, string[]> };

export const CATALOG = catalog as Catalog;
const byId = Object.fromEntries(CATALOG.sections.map((s) => [s.id, s]));
const defaults: Record<string, CatalogText> = {};
for (const s of CATALOG.sections) for (const t of s.texts) defaults[t.key] ??= t;

/** The designed pages that have their own URL */
export const designedPages = () => CATALOG.sections.filter((s) => s.group === "page" && s.path);

/** A block of the design, top to bottom. `keys` are text keys; texts not listed go to "Other texts". */
export type TextGroup = { title: string; hint?: string; keys: string[]; extra?: ReactNode };

type Lang = "en" | "nl";
const LANGS: Lang[] = ["en", "nl"];
const LANG_LABEL: Record<Lang, string> = { en: "English", nl: "Nederlands" };
type Draft = { en: string; nl: string };
type Tab = "sections" | "html" | "css" | "jsonld" | "preview";
const isHtml = (s: string) => /^\s*<[a-z]/i.test(s);
const norm = (s: string) => s.replace(/\r\n/g, "\n");

/** What the page has on top of its design (a Page row with designKey) */
type Extras = { sections: Record<Lang, SectionsDoc | null>; html: Record<Lang, string>; css: string; jsonLd: string; layout: DesignLayout | null };
type ExtrasRow = {
  sections: SectionsDoc | null;
  sectionsNl: SectionsDoc | null;
  html: string;
  htmlNl: string;
  css: string;
  jsonLd: string | null;
  layout: DesignLayout | null;
} | null;
/** A top-level block of the live page (a child of <main>), found in the preview */
type PageBlock = { id: string; name: string; keys: string[]; contact: boolean };
const EMPTY_DOC: SectionsDoc = { layout: "wide", items: [] };
const extrasFrom = (r: ExtrasRow): Extras => ({
  // the English extras are sections unless they were written as HTML by hand
  sections: { en: r ? (r.sections ?? (r.html.trim() ? null : EMPTY_DOC)) : EMPTY_DOC, nl: r?.sectionsNl ?? null },
  html: { en: r && !r.sections ? r.html : "", nl: r && !r.sectionsNl ? r.htmlNl : "" },
  css: r?.css ?? "",
  jsonLd: r?.jsonLd ?? "",
  layout: r?.layout ?? null,
});
const extrasKey = (e: Extras) => JSON.stringify(e);

/** Where new sections go by default: right before the contact form, otherwise after the last block */
function defaultAnchor(blocks: PageBlock[] | null, layout: DesignLayout | null) {
  if (!blocks?.length) return undefined;
  const order = layout?.order ?? blocks.map((b) => b.id);
  const contact = blocks.find((b) => b.contact)?.id;
  const at = contact ? order.indexOf(contact) : -1;
  return at > 0 ? order[at - 1] : order.at(-1);
}

export function DesignPageEditor({ sectionId, title, intro, groups }: { sectionId: string; title?: string; intro?: ReactNode; groups?: TextGroup[] }) {
  const section = byId[sectionId];
  const confirm = useConfirm();
  const [overrides, setOverrides] = useState<TextOverrides | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [extras, setExtras] = useState<Extras | null>(null);
  const [savedExtras, setSavedExtras] = useState("");
  const [rendered, setRendered] = useState<Record<Lang, { html: string; css: string; error: string }>>({
    en: { html: "", css: "", error: "" },
    nl: { html: "", css: "", error: "" },
  });
  const [types, setTypes] = useState<SectionType[]>([]);
  const [lang, setLang] = useState<Lang>("en");
  const [tab, setTab] = useState<Tab>("sections");
  const [split, setSplit] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [picker, setPicker] = useState(false);
  const [codeView, setCodeView] = useState<EditorView | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  /** What was last put into each preview document (kept out of its DOM so React's hydration isn't disturbed) */
  const paintedParts = useRef(new WeakMap<Document, string>());
  /** The preview page has hydrated: only then is it safe to change its DOM */
  const [frameReady, setFrameReady] = useState(0);
  /** The blocks of the page, in the coded order (found in the English preview) */
  const [pageBlocks, setPageBlocks] = useState<PageBlock[] | null>(null);
  const nlOrigin = useNlOrigin();

  const loadTexts = useCallback(
    () =>
      adminApi<{ data: TextOverrides }>("/texts")
        .then((r) => setOverrides(r.data))
        .catch((e: Error) => setMsg({ ok: false, text: e.message })),
    [],
  );
  useEffect(() => {
    loadTexts();
    adminApi<{ data: ExtrasRow }>(`/pages/admin/design/${encodeURIComponent(sectionId)}`)
      .then((r) => {
        const e = extrasFrom(r.data);
        setExtras(e);
        setSavedExtras(extrasKey(e));
        if (r.data?.sections) setRendered((all) => ({ ...all, en: { ...all.en, html: r.data!.html } }));
        if (r.data?.sectionsNl) setRendered((all) => ({ ...all, nl: { ...all.nl, html: r.data!.htmlNl } }));
      })
      .catch((e: Error) => setMsg({ ok: false, text: e.message }));
    adminApi<{ data: SectionType[] }>("/section-types")
      .then((r) => setTypes(r.data))
      .catch(() => {});
  }, [loadTexts, sectionId]);

  // Other parts of the screen (e.g. the video pickers) ask for a fresh preview after saving
  useEffect(() => {
    const reload = () => setReloadKey((k) => k + 1);
    window.addEventListener("fl:preview-reload", reload);
    return () => window.removeEventListener("fl:preview-reload", reload);
  }, []);

  const dirtyTexts = Object.keys(drafts);
  const extrasDirty = !!extras && extrasKey(extras) !== savedExtras;
  const dirtyCount = dirtyTexts.length + (extrasDirty ? 1 : 0);
  const path = section?.path ?? "/";
  const pageTitle = title ?? section?.label ?? sectionId;

  // ---- texts of the design ----
  const saved = useCallback(
    (key: string): Draft => ({ en: overrides?.[key]?.en ?? defaults[key].en, nl: overrides?.[key]?.nl ?? defaults[key].nl }),
    [overrides],
  );
  const value = (key: string) => drafts[key] ?? saved(key);
  function change(key: string, l: Lang | "both", v: string) {
    setMsg(null);
    setDrafts((d) => {
      const next = l === "both" ? { en: v, nl: v } : { ...(d[key] ?? saved(key)), [l]: v };
      const s = saved(key);
      const copy = { ...d };
      if (norm(next.en) === norm(s.en) && norm(next.nl) === norm(s.nl)) delete copy[key];
      else copy[key] = next;
      return copy;
    });
  }
  function reset(key: string) {
    const d = defaults[key];
    setDrafts((all) => {
      const copy = { ...all };
      const s = saved(key);
      if (s.en === d.en && s.nl === d.nl) delete copy[key];
      else copy[key] = { en: d.en, nl: d.nl };
      return copy;
    });
  }

  // ---- extras: sections / HTML / CSS / JSON-LD ----
  const patchExtras = (fn: (e: Extras) => Extras) => {
    setExtras((e) => (e ? fn(e) : e));
    setMsg(null);
  };
  const setDoc = (d: SectionsDoc | null, l: Lang = lang) => patchExtras((e) => ({ ...e, sections: { ...e.sections, [l]: d } }));
  const setHtml = (v: string, l: Lang = lang) => patchExtras((e) => ({ ...e, html: { ...e.html, [l]: v } }));
  const doc = extras?.sections[lang] ?? null;
  /** The Dutch extras haven't been started: nl.finloa.com shows the English ones */
  const nlEmpty = !!extras && extras.sections.nl === null && !extras.html.nl.trim();
  const usesSections = doc !== null || (lang === "nl" && nlEmpty);

  // Render the added sections on the server (same templates as the live site), debounced
  const renderKey = JSON.stringify([extras?.sections, pageTitle]);
  useEffect(() => {
    if (!extras) return;
    const t = setTimeout(() => {
      for (const l of LANGS) {
        const d = extras.sections[l];
        if (!d) continue;
        if (!d.items.length) {
          setRendered((all) => ({ ...all, [l]: { html: "", css: "", error: "" } }));
          continue;
        }
        adminApi<{ html: string; css: string }>("/pages/preview", { method: "POST", json: { sections: d, lang: l, slug: sectionId, title: pageTitle } })
          .then((r) => setRendered((all) => ({ ...all, [l]: { html: r.html, css: r.css, error: "" } })))
          .catch((e: Error) => setRendered((all) => ({ ...all, [l]: { ...all[l], error: e.message } })));
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderKey]);

  const save = useCallback(async () => {
    if (!dirtyCount || !extras) return;
    if (extras.jsonLd.trim()) {
      try {
        JSON.parse(extras.jsonLd);
      } catch {
        setMsg({ ok: false, text: "JSON-LD is not valid JSON" });
        setTab("jsonld");
        return;
      }
    }
    setBusy(true);
    setMsg(null);
    try {
      if (dirtyTexts.length) {
        // Same as the default → store null, so later code changes to that text still show up
        const items = dirtyTexts.map((key) => {
          const d = defaults[key];
          const v = drafts[key];
          return { key, en: norm(v.en) === norm(d.en) ? null : v.en, nl: norm(v.nl) === norm(d.nl) ? null : v.nl };
        });
        await adminApi("/texts", { method: "PUT", json: { items } });
        await loadTexts();
        setDrafts({});
      }
      if (extrasDirty) {
        // once the blocks are known, always store the full order (so section anchors work)
        const saveLayout = pageBlocks
          ? { order: extras.layout?.order ?? pageBlocks.map((b) => b.id), hidden: extras.layout?.hidden ?? [], htmlAfter: defaultAnchor(pageBlocks, extras.layout) }
          : extras.layout;
        await adminApi(`/pages/admin/design/${encodeURIComponent(sectionId)}`, {
          method: "PUT",
          json: {
            title: pageTitle,
            sections: extras.sections.en,
            sectionsNl: extras.sections.nl,
            html: extras.html.en,
            htmlNl: extras.html.nl,
            css: extras.css,
            jsonLd: extras.jsonLd,
            layout: saveLayout,
          },
        });
        setSavedExtras(extrasKey(extras));
      }
      setMsg({ ok: true, text: `Saved ${new Date().toLocaleTimeString()}. Live on both sites.` });
      setReloadKey((k) => k + 1);
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }, [dirtyCount, extras, extrasDirty, dirtyTexts, drafts, loadTexts, sectionId, pageTitle, pageBlocks]);

  // Ctrl/⌘+S saves; warn before leaving with unsaved changes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => dirtyCount && e.preventDefault();
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [save, dirtyCount]);

  async function useSectionsMode() {
    if (
      !(await confirm({
        title: "Use sections?",
        message: "The current HTML becomes one “Custom HTML” section, so the page looks the same. You can then add sections around it.",
        confirmLabel: "Use sections",
      }))
    )
      return;
    const h = extras?.html[lang] ?? "";
    const items = h.trim() ? [{ id: newId(), type: "custom-html", data: { html: h } }] : [];
    setDoc({ layout: "wide", items });
    setHtml("");
    setSelected(items[0]?.id ?? null);
    setTab("sections");
  }
  async function useHtmlMode() {
    if (
      !(await confirm({
        title: "Edit the HTML by hand?",
        message: `Your ${LANG_LABEL[lang]} sections become HTML you edit directly. The designed blocks stay as they are.`,
        confirmLabel: "Edit HTML",
      }))
    )
      return;
    setHtml(rendered[lang].html);
    setDoc(null);
    setTab("html");
  }

  function onPicked(url: string, alt: string) {
    const snippet = tab === "css" ? `url("${url}")` : `<img src="${url}" alt="${alt.replace(/"/g, "&quot;")}" loading="lazy">`;
    if (codeView) {
      const { from, to } = codeView.state.selection.main;
      codeView.dispatch({ changes: { from, to, insert: snippet }, selection: { anchor: from + snippet.length } });
      codeView.focus();
    } else if (tab === "css") patchExtras((e) => ({ ...e, css: `${e.css}\n${snippet}` }));
    else setHtml(`${extras?.html[lang] ?? ""}\n${snippet}`);
    setPicker(false);
  }

  // ---- preview: the real page in an iframe; unsaved extras and CSS are filled in live (English, same origin) ----
  const previewLang: Lang = lang === "nl" && !nlEmpty ? "nl" : "en";
  const extrasCss = extras ? [rendered[previewLang].css, extras.css].filter(Boolean).join("\n") : "";
  /** The added sections one by one (split from the rendered HTML), each with the block it follows */
  const previewParts: DesignPart[] = useMemo(() => {
    if (!extras) return [];
    const d = extras.sections[previewLang];
    if (!d) {
      const h = extras.html[previewLang];
      return h.trim() ? [{ id: "html", after: extras.layout?.htmlAfter ?? null, html: h }] : [];
    }
    if (typeof document === "undefined") return [];
    const tpl = document.createElement("template");
    tpl.innerHTML = rendered[previewLang].html;
    return [...tpl.content.children].map((el) => {
      const id = el.getAttribute("data-section") ?? "";
      return { id, after: d.items.find((i) => i.id === id)?.after ?? null, html: el.outerHTML };
    });
  }, [extras, rendered, previewLang]);
  const frameDoc = () => {
    try {
      return frame.current?.contentDocument ?? null;
    } catch {
      return null;
    }
  };
  const paintPreview = useCallback(() => {
    const d = frameDoc();
    const main = d?.querySelector("main");
    if (!d || !main || !extras || !frameReady) return;
    const style = d.getElementById("fl-design-css");
    if (style) style.textContent = extrasCss;
    const layout = extras.layout ?? (pageBlocks ? { order: pageBlocks.map((b) => b.id), hidden: [] } : null);
    const layoutStyle = d.getElementById("fl-design-layout");
    if (layoutStyle) layoutStyle.textContent = layoutCss(layout, previewParts);
    const html = partsHtml(previewParts, !!extras.sections[previewLang]);
    if (paintedParts.current.get(d) !== html) {
      paintedParts.current.set(d, html);
      main.querySelectorAll(":scope > .fl-x-sec").forEach((el) => el.remove());
      (layoutStyle ?? main.lastElementChild)?.insertAdjacentHTML("afterend", html);
    }
    d.querySelectorAll(".fl-sec.is-selected, .fl-x-selected").forEach((el) => el.classList.remove("is-selected", "fl-x-selected"));
    if (selected) d.querySelector(`[data-section="${CSS.escape(selected)}"]`)?.classList.add("is-selected");
  }, [extras, extrasCss, previewParts, previewLang, selected, pageBlocks, frameReady]);
  useEffect(paintPreview, [paintPreview]);

  /** Scroll the preview to a text or an added section and flash it */
  function locate(target: { text?: string; section?: string; block?: string }) {
    const d = frameDoc();
    if (!d) return;
    let el: Element | null = null;
    if (target.block) el = d.querySelector(`main > :nth-child(${Number(target.block.slice(1)) + 1} of :not(.fl-x))`);
    else if (target.section) el = d.querySelector(`[data-section="${CSS.escape(target.section)}"]`);
    else if (target.text) {
      const needle = target.text.replace(/<[^>]+>|\[\[|\]\]/g, "").trim().slice(0, 40);
      if (needle.length < 2) return;
      const walker = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const p = n.parentElement;
        if (n.textContent?.includes(needle) && p && !p.closest("[aria-hidden='true'], style, script")) {
          el = p;
          break;
        }
      }
    }
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    (el as HTMLElement).animate?.([{ outline: "3px solid #2f6bff", outlineOffset: "4px" }, { outline: "3px solid transparent", outlineOffset: "4px" }], { duration: 1600 });
  }

  // ---- designed blocks ----
  const texts = useMemo(() => section?.texts ?? [], [section]);

  /** Finds the page's blocks (children of <main>) and which texts are in each, named by their heading */
  const detectBlocks = useCallback(() => {
    if (pageBlocks) return;
    const main = frameDoc()?.querySelector("main");
    if (!main) return;
    const tops = [...main.querySelectorAll(":scope > :not(.fl-x)")] as HTMLElement[];
    if (!tops.length) return;
    const plain = (s: string) => s.replace(/<[^>]+>|\[\[|\]\]/g, "").replace(/\s+/g, " ").trim();
    const content = tops.map((el) => plain(`${el.textContent ?? ""} ${el.getAttribute("aria-label") ?? ""}`));
    const keys: string[][] = tops.map(() => []);
    for (const t of texts) {
      if (t.seo) continue;
      const needle = plain(overrides?.[t.key]?.en ?? t.en).slice(0, 40);
      if (needle.length < 2) continue;
      const i = content.findIndex((c) => c.includes(needle));
      if (i >= 0) keys[i].push(t.key);
    }
    setPageBlocks(
      tops.map((el, i) => {
        // from the markup, so line breaks count as spaces even when the block is hidden
        const h = el.querySelector("h1, h2, h3")?.innerHTML.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
        const contact = el.id === "contact";
        const name = contact ? "Contact" : h ? (h.length > 42 ? `${h.slice(0, 40)}…` : h) : (el.getAttribute("aria-label") ?? `Block ${i + 1}`);
        return { id: `b${i}`, name, keys: keys[i], contact };
      }),
    );
  }, [pageBlocks, texts, overrides]);
  const seoKeys = texts.filter((t) => t.seo).map((t) => t.key);
  /** Each block with its texts; the front page passes its own names, hints and extras (same order as the blocks) */
  const blocks: (TextGroup & { id: string })[] = useMemo(() => {
    if (!pageBlocks) return [];
    const own = new Set(texts.filter((t) => !t.seo).map((t) => t.key));
    const manual = groups?.length === pageBlocks.length ? groups : null;
    const used = new Set<string>();
    return pageBlocks.map((b, i) => {
      const g = manual?.[i];
      const keys = (g ? g.keys : b.keys).filter((k) => own.has(k) && !used.has(k) && (used.add(k), true));
      return { id: b.id, title: g?.title ?? b.name, hint: g?.hint, extra: g?.extra, keys };
    });
  }, [pageBlocks, texts, groups]);
  /** Texts not seen in any block (screen-reader labels, placeholders, messages…) */
  const otherKeys = useMemo(() => {
    const used = new Set(blocks.flatMap((b) => b.keys));
    return texts.filter((t) => !t.seo && !used.has(t.key)).map((t) => t.key);
  }, [blocks, texts]);
  const defaultAfter = defaultAnchor(pageBlocks, extras?.layout ?? null);

  const query = q.trim().toLowerCase();
  const matches = (key: string) => {
    if (!query) return true;
    const v = value(key);
    return `${v.en}\n${v.nl}`.toLowerCase().includes(query);
  };

  const textCard = (key: string) => {
    const t = defaults[key];
    if (!t || !matches(key)) return null;
    const v = value(key);
    const sv = saved(key);
    const html = isHtml(t.en);
    const both = t.en === t.nl && v.en === v.nl;
    const l: Lang | "both" = both ? "both" : lang;
    const shown = both ? v.en : v[lang];
    const def = both ? t.en : t[lang];
    const changed = norm(shown) !== norm(def);
    const elsewhere = (CATALOG.usedIn[key] ?? []).filter((id) => id !== sectionId).map((id) => byId[id]?.label);
    return (
      <div key={key} className={`ad-text ad-text--one${drafts[key] ? " ad-text--dirty" : overrides?.[key] ? " ad-text--edited" : ""}`}>
        <label>
          {both ? "BOTH SITES (EN + NL)" : lang === "en" ? "ENGLISH" : "NEDERLANDS"}
          <textarea
            className={`${html ? "ad-mono" : ""}${shown !== (both ? sv.en : sv[lang]) ? " is-changed" : ""}`}
            rows={html ? 12 : 1}
            value={shown}
            onFocus={() => locate({ text: shown })}
            onChange={(e) => change(key, l, e.target.value)}
          />
          {changed && !html && <span className="ad-text__default">{lang === "nl" && !both ? "Standaard" : "Default"}: {def}</span>}
        </label>
        {(elsewhere.length > 0 || changed || html || t.en.includes("[[")) && (
          <div className="ad-text__meta">
            <span>
              {html && "HTML: use <h2>, <h3>, <p>, <ul><li>, <strong> and <a href>. "}
              {t.en.includes("[[") && "Text inside [[ ]] gets the red wavy underline. "}
              {elsewhere.length > 0 && `Also used on: ${elsewhere.join(", ")}.`}
            </span>
            {changed && (
              <button type="button" className="ad-btn ad-btn--sm" onClick={() => reset(key)}>
                Reset to default
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const layoutNow = extras?.layout ?? (pageBlocks ? { order: pageBlocks.map((b) => b.id), hidden: [] } : null);
  const byBlock = new Map(blocks.map((b) => [b.id, b]));
  const orderedBlocks = layoutNow ? [...layoutNow.order.map((id) => byBlock.get(id)).filter((b) => !!b), ...blocks.filter((b) => !layoutNow.order.includes(b.id))] : blocks;
  const fixed: FixedBlock[] = orderedBlocks.map((b) => {
    const cards = b.keys.map(textCard).filter(Boolean);
    const dirty = b.keys.filter((k) => drafts[k]).length;
    return {
      id: b.id,
      name: b.title,
      hidden: !!layoutNow?.hidden.includes(b.id),
      sub: `${dirty ? `${dirty} unsaved · ` : ""}${b.keys.length ? `${b.keys.length} ${b.keys.length === 1 ? "text" : "texts"}` : "no texts"}${query && b.keys.length ? ` · ${cards.length} match` : ""}`,
      body: (
        <div className="fp-block__body" style={{ padding: 0 }}>
          {b.hint && <p className="ad-hint">{b.hint}</p>}
          {b.extra}
          {cards.length ? cards : <p className="ad-hint">{b.keys.length ? "No texts match your search." : "This block has no editable texts. You can still hide or move it."}</p>}
        </div>
      ),
    };
  });

  const select = (id: string | null) => {
    setSelected(id);
    if (!id) return;
    if (byBlock.has(id)) locate({ block: id });
    else locate({ section: id });
  };

  // ---- layout ----
  const extensions = useMemo(() => ({ html: [htmlLang(), EditorView.lineWrapping], css: [cssLang()], json: [jsonLang()] }), []);
  const code = (val: string, onChange: ((v: string) => void) | null, ext: keyof typeof extensions, placeholder = "", trackView = false) => (
    <div className="ad-code">
      <CodeMirror
        value={val}
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

  if (!section) return <p className="ad-error">Unknown page “{sectionId}”.</p>;
  if (!extras || !overrides) return <p className="ad-hint">{msg?.text ?? "Loading…"}</p>;

  const previewUrl = `${previewLang === "nl" ? nlOrigin : ""}${path}`;
  const preview = (
    <div className="fp-editor__preview" style={{ position: "static" }}>
      <div className={`ad-preview${mobile ? " ad-preview--mobile" : ""}`}>
        {(previewLang === "en" || nlOrigin) && (
          <iframe ref={frame} key={`${reloadKey}-${previewLang}`} title="Preview" src={previewUrl} onLoad={() => {
              detectBlocks();
              setFrameReady(0);
              // let the page hydrate before changing it
              const win = frame.current?.contentWindow;
              const ready = () => setFrameReady((n) => n + 1);
              if (win && "requestIdleCallback" in win) win.requestIdleCallback(ready, { timeout: 1500 });
              else setTimeout(ready, 800);
            }} />
        )}
      </div>
      <span className="ad-hint">
        {previewLang === "nl"
          ? "Dutch preview (nl.finloa.com): shows the saved page; save to see changes."
          : dirtyTexts.length
            ? "Text changes show in the preview after you save. Added sections, HTML and CSS update live."
            : "Added sections, HTML and CSS update live. Click a text to find it in the preview."}{" "}
        <button type="button" className="ad-link" onClick={() => setReloadKey((k) => k + 1)}>
          Reload
        </button>
      </span>
    </div>
  );

  const nlStartNote = (
    <>
      No Dutch sections yet: nl.finloa.com shows the English ones.{" "}
      <button type="button" className="ad-link" onClick={() => (extras.sections.en ? setDoc(cloneDoc(extras.sections.en)) : setHtml(extras.html.en))}>
        Start from the English
      </button>{" "}
      ·{" "}
      <button type="button" className="ad-link" onClick={() => setDoc({ layout: "wide", items: [] })}>
        Start empty
      </button>
    </>
  );

  const effectiveTab: Tab = tab;
  let work: ReactNode;
  if (effectiveTab === "preview") work = preview;
  else if (effectiveTab === "sections")
    work = (
      <SectionsEditor
        doc={doc ?? EMPTY_DOC}
        onChange={(d) => setDoc(d)}
        selected={selected}
        onSelect={select}
        types={types}
        fixed={fixed}
        onFixed={(next) => patchExtras((e) => ({ ...e, layout: { ...e.layout, order: next.order, hidden: next.hidden } }))}
        defaultAfter={defaultAfter}
        itemsNote={
          lang === "nl" && nlEmpty ? nlStartNote : !doc ? (
            <>
              Written as HTML.{" "}
              <button type="button" className="ad-link" onClick={() => setTab("html")}>
                Open the HTML tab
              </button>{" "}
              or{" "}
              <button type="button" className="ad-link" onClick={useSectionsMode}>
                use sections
              </button>
              .
            </>
          ) : undefined
        }
      />
    );
  else if (effectiveTab === "css")
    work = code(extras.css, (v) => patchExtras((e) => ({ ...e, css: v })), "css", `/* CSS for ${path}, in both languages. E.g. */\nmain h2 { letter-spacing: -0.04em; }`, true);
  else if (effectiveTab === "jsonld")
    work = code(extras.jsonLd, (v) => patchExtras((e) => ({ ...e, jsonLd: v })), "json", '{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  …\n}');
  else if (doc)
    work = (
      <div className="ad-code-wrap">
        <div className="se-htmlbar">
          <span className="ad-hint">
            Generated from your sections (shown below the design). {rendered[lang].error && <span className="ad-field__err">{rendered[lang].error}</span>}
          </span>
          <button type="button" className="ad-btn ad-btn--sm" onClick={useHtmlMode}>
            Edit HTML by hand
          </button>
        </div>
        {code(rendered[lang].html, null, "html")}
      </div>
    );
  else if (lang === "nl" && nlEmpty)
    work = (
      <div className="ad-pane ad-pane--center">
        <h2>No Dutch content yet</h2>
        <p className="ad-hint">{nlStartNote}</p>
      </div>
    );
  else
    work = code(
      extras.html[lang],
      (v) => setHtml(v),
      "html",
      "<!-- HTML shown below the designed blocks, above the contact form -->\n<h2>…</h2>\n<p>…</p>",
      true,
    );

  const L = lang.toUpperCase();
  const tabs: [Tab, string][] = [
    ["sections", `Sections (${L})`],
    ["html", `HTML (${L})`],
    ["css", "CSS"],
    ["jsonld", "JSON-LD"],
    ...(split ? [] : ([["preview", "Preview"]] as [Tab, string][])),
  ];
  const shared = (section.includes ?? []).filter((id) => byId[id]?.texts.length);

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>{pageTitle}</h1>
          {intro && (
            <p className="ad-hint" style={{ margin: "4px 0 0" }}>
              {intro}
            </p>
          )}
        </div>
        <div className="ad-savebar">
          {msg && <span className={msg.ok ? "ad-msg-ok" : "ad-msg-error"}>{msg.text}</span>}
          {dirtyCount > 0 && !msg && <span className="ad-hint">Unsaved changes</span>}
          <a className="ad-btn" href={path} target="_blank" rel="noreferrer">
            Open on site ↗
          </a>
          <a className="ad-btn" href={`${nlOrigin}${path}`} target="_blank" rel="noreferrer">
            NL ↗
          </a>
          {dirtyCount > 0 && (
            <button
              type="button"
              className="ad-btn"
              disabled={busy}
              onClick={() => {
                setDrafts({});
                setExtras(JSON.parse(savedExtras) as Extras);
              }}
            >
              Discard
            </button>
          )}
          <button type="button" className="ad-btn ad-btn--primary" disabled={busy || !dirtyCount} onClick={save}>
            {busy ? "Saving…" : "Update"}
          </button>
        </div>
      </div>

      <div className="ad-editor">
        <div className="ad-editor__meta">
          <div className="ad-panel__head">
            <div className="ad-lang" role="group" aria-label="Language">
              {LANGS.map((l) => (
                <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
                  {LANG_LABEL[l]}
                </button>
              ))}
            </div>
          </div>
          <label>
            Title
            <input value={pageTitle} readOnly disabled />
          </label>
          <div className="ad-2">
            <label>
              Status
              <select value="published" disabled>
                <option value="published">Published</option>
              </select>
            </label>
            <label>
              Built with
              <input value="Design" readOnly disabled />
            </label>
          </div>
          <label>
            URL
            <input value={path} readOnly disabled />
            <span className="ad-hint">A designed page: its URL and layout are fixed in the code. Same path on nl.finloa.com.</span>
          </label>
          <label>
            Find a text ({LANG_LABEL[lang]})
            <input type="search" value={q} placeholder="Search this page's texts" onChange={(e) => setQ(e.target.value)} />
          </label>

          {seoKeys.length > 0 && (
            <fieldset>
              <legend>SEO ({LANG_LABEL[lang]})</legend>
              {seoKeys.map((key) => {
                const t = defaults[key];
                const v = value(key);
                const both = t.en === t.nl && v.en === v.nl;
                const shown = both ? v.en : v[lang];
                return (
                  <label key={key}>
                    {t.seo === "title" ? "SEO title" : "Meta description"}
                    {both && <span className="ad-hint">Same on both sites</span>}
                    {t.seo === "title" ? (
                      <input value={shown} onChange={(e) => change(key, both ? "both" : lang, e.target.value)} />
                    ) : (
                      <textarea value={shown} onChange={(e) => change(key, both ? "both" : lang, e.target.value)} />
                    )}
                    <span className="ad-hint">
                      {shown.length}/{t.seo === "title" ? 60 : 155} characters recommended.
                      {norm(shown) !== norm(both ? t.en : t[lang]) && (
                        <>
                          {" "}
                          <button type="button" className="ad-link" onClick={() => reset(key)}>
                            Reset
                          </button>
                        </>
                      )}
                    </span>
                  </label>
                );
              })}
              <span className="ad-hint">Structured data (JSON-LD) is edited in its own tab.</span>
            </fieldset>
          )}

          {otherKeys.length > 0 && (
            <details className="fp-other">
              <summary>
                Other texts ({otherKeys.filter((k) => drafts[k]).length ? `${otherKeys.filter((k) => drafts[k]).length} unsaved · ` : ""}
                {otherKeys.length})
              </summary>
              <span className="ad-hint">Not shown as such on the page: labels for screen readers, placeholders, messages…</span>
              {otherKeys.map(textCard)}
            </details>
          )}

          {shared.length > 0 && (
            <fieldset>
              <legend>Shared parts</legend>
              <span className="ad-hint">Also on other pages; a change shows everywhere.</span>
              <div className="ad-quick">
                {shared.map((id) => (
                  <Link key={id} className="ad-btn ad-btn--sm" href={`/admin/texts#${encodeURIComponent(id)}`}>
                    {byId[id].label}
                  </Link>
                ))}
              </div>
            </fieldset>
          )}
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
              <button type="button" onClick={useSectionsMode} title="Build the added content from sections">
                Use sections
              </button>
            )}
            {((effectiveTab === "html" && !doc && !(lang === "nl" && nlEmpty)) || effectiveTab === "css") && (
              <button type="button" onClick={() => setPicker(true)} title="Upload or pick an image and insert it at the cursor">
                + Image
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSplit(!split);
                if (tab === "preview") setTab("sections");
              }}
            >
              {split ? "Full-width editor" : "Side-by-side preview"}
            </button>
            <button type="button" aria-pressed={mobile} onClick={() => setMobile(!mobile)}>
              {mobile ? "Mobile" : "Desktop"} preview
            </button>
          </div>
          <div className={`ad-split${split ? " ad-split--side" : ""}`}>
            {work}
            {split && effectiveTab !== "preview" && preview}
          </div>
          <p className="ad-hint">
            The designed blocks keep their layout; edit their texts in English and Dutch. Sections or HTML you add appear below them, above the contact
            form. The CSS and JSON-LD apply to this page in both languages. Ctrl/⌘+S saves. <Link href="/admin/sections">Section types</Link> ·{" "}
            <Link href="/admin/texts">Site texts</Link>
          </p>
        </div>
      </div>

      {picker && <MediaPicker title="Insert an image" onClose={() => setPicker(false)} onPick={(m) => onPicked(m.url, m.alt)} />}
    </>
  );
}
