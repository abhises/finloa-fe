"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { TextOverrides } from "@/i18n/config";
import catalog from "@/i18n/texts.json";
import { adminApi, useNlOrigin } from "@/lib/admin-client";

type Text = { key: string; en: string; nl: string };
type Section = { id: string; group: "page" | "shared"; label: string; path: string | null; file: string; texts: Text[]; includes?: string[] };
type Catalog = { sections: Section[]; usedIn: Record<string, string[]> };

const { sections, usedIn } = catalog as Catalog;
const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
const defaults: Record<string, Text> = {};
for (const s of sections) for (const t of s.texts) defaults[t.key] ??= t;

type Draft = { en: string; nl: string };
const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const isHtml = (s: string) => /^\s*<[a-z]/i.test(s);
const norm = (s: string) => s.replace(/\r\n/g, "\n");

export default function PagesPage() {
  const [overrides, setOverrides] = useState<TextOverrides | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  // The open page lives in the URL hash (#seo), so a reload or shared link opens the same page
  const hash = useSyncExternalStore(subscribeHash, () => decodeURIComponent(window.location.hash.slice(1)), () => "");
  const current = byId[hash] ? hash : (sections[0]?.id ?? "");
  const [q, setQ] = useState("");
  const [onlyEdited, setOnlyEdited] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const nlOrigin = useNlOrigin();

  const load = useCallback(
    () =>
      adminApi<{ data: TextOverrides }>("/texts")
        .then((r) => setOverrides(r.data))
        .catch((e: Error) => setMsg({ ok: false, text: e.message })),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);

  const dirtyKeys = Object.keys(drafts);
  useEffect(() => {
    if (!dirtyKeys.length) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirtyKeys.length]);

  /** What the site shows now (edited text or the default from the code) */
  const saved = useCallback(
    (key: string): Draft => ({ en: overrides?.[key]?.en ?? defaults[key].en, nl: overrides?.[key]?.nl ?? defaults[key].nl }),
    [overrides],
  );
  const value = (key: string) => drafts[key] ?? saved(key);
  const isEdited = (key: string) => !!overrides?.[key];

  function change(key: string, lang: "en" | "nl", v: string) {
    setMsg(null);
    setDrafts((d) => {
      const next = { ...(d[key] ?? saved(key)), [lang]: v };
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

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      // Same as the default → store null, so later code changes to that text still show up
      const items = dirtyKeys.map((key) => {
        const d = defaults[key];
        const v = drafts[key];
        return { key, en: norm(v.en) === norm(d.en) ? null : v.en, nl: norm(v.nl) === norm(d.nl) ? null : v.nl };
      });
      await adminApi("/texts", { method: "PUT", json: { items } });
      await load();
      setDrafts({});
      setMsg({ ok: true, text: `Saved ${items.length} ${items.length === 1 ? "text" : "texts"}. The live site updates within a few seconds.` });
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  function open(id: string) {
    setQ("");
    window.history.pushState(null, "", `#${encodeURIComponent(id)}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    window.scrollTo({ top: 0 });
  }

  const section = byId[current];
  const query = q.trim().toLowerCase();
  const shown: { section: Section; texts: Text[] }[] = useMemo(() => {
    const filter = (t: Text) => {
      if (onlyEdited && !overrides?.[t.key] && !drafts[t.key]) return false;
      if (!query) return true;
      const v = drafts[t.key] ?? { en: overrides?.[t.key]?.en ?? t.en, nl: overrides?.[t.key]?.nl ?? t.nl };
      return `${t.en}\n${t.nl}\n${v.en}\n${v.nl}`.toLowerCase().includes(query);
    };
    // Searching looks through every page; otherwise just the open one
    const list = query ? sections : section ? [section] : [];
    return list.map((s) => ({ section: s, texts: s.texts.filter(filter) })).filter((s) => s.texts.length);
  }, [query, section, onlyEdited, overrides, drafts]);

  const editedIn = (s: Section) => s.texts.filter((t) => overrides?.[t.key]).length;
  const dirtyIn = (s: Section) => s.texts.filter((t) => drafts[t.key]).length;

  const navGroup = (group: Section["group"], title: string) => (
    <>
      <h3>{title}</h3>
      {sections
        .filter((s) => s.group === group)
        .map((s) => {
          const edited = overrides ? editedIn(s) : 0;
          const dirty = dirtyIn(s);
          return (
            <button key={s.id} type="button" aria-current={s.id === current && !query} onClick={() => open(s.id)}>
              <span>{s.label}</span>
              <small>
                {dirty ? `${dirty}● ` : ""}
                {edited ? `${edited}/` : ""}
                {s.texts.length}
              </small>
            </button>
          );
        })}
    </>
  );

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>Pages</h1>
          <p>Every text on the website, in English and Dutch. Changes go live on finloa.com and nl.finloa.com right after you save.</p>
        </div>
        <div className="ad-filters" style={{ margin: 0 }}>
          <input className="ad-input" style={{ width: 280 }} type="search" placeholder="Search all pages (EN or NL)" value={q} onChange={(e) => setQ(e.target.value)} />
          <label className="ad-check">
            <input type="checkbox" checked={onlyEdited} onChange={(e) => setOnlyEdited(e.target.checked)} />
            Only edited
          </label>
        </div>
      </div>
      {msg && <p className={msg.ok ? "ad-ok" : "ad-error"}>{msg.text}</p>}

      <div className="ad-texts">
        <nav className="ad-texts__nav" aria-label="Pages">
          {navGroup("page", "Pages")}
          {navGroup("shared", "Shared on several pages")}
        </nav>

        <div className="ad-form" style={{ gap: 12 }}>
          {!overrides ? (
            <p className="ad-hint">Loading…</p>
          ) : (
            <>
              {!query && section && (
                <section className="ad-panel">
                  <div className="ad-panel__head">
                    <h2>{section.label}</h2>
                    {section.path && (
                      <div className="ad-quick">
                        <a className="ad-btn ad-btn--sm" href={section.path} target="_blank" rel="noreferrer">
                          View English ↗
                        </a>
                        <a className="ad-btn ad-btn--sm" href={`${nlOrigin}${section.path}`} target="_blank" rel="noreferrer">
                          View Nederlands ↗
                        </a>
                      </div>
                    )}
                  </div>
                  {section.group === "shared" ? (
                    <p className="ad-hint">
                      This part appears on several pages. A change here shows everywhere it&apos;s used
                      {(() => {
                        const pages = sections.filter((s) => s.includes?.includes(section.id)).map((s) => s.label);
                        return pages.length ? `: ${pages.join(", ")}.` : ".";
                      })()}
                    </p>
                  ) : (
                    section.includes &&
                    section.includes.length > 0 && (
                      <p className="ad-hint">
                        Texts below are specific to this page. It also shows these shared parts:{" "}
                        {section.includes.map((id, i) => (
                          <span key={id}>
                            {i > 0 && ", "}
                            <a href={`#${id}`} onClick={(e) => (e.preventDefault(), open(id))}>
                              {byId[id]?.label}
                            </a>
                          </span>
                        ))}
                        .
                      </p>
                    )
                  )}
                  {section.id === "blog/[slug]" && (
                    <p className="ad-hint">The labels around every blog post. The articles themselves are edited under Blog posts.</p>
                  )}
                </section>
              )}

              {shown.length === 0 && <p className="ad-hint">{query ? "No texts match your search." : "No edited texts on this page yet."}</p>}

              {shown.map(({ section: s, texts }) => (
                <div key={s.id} className="ad-form" style={{ gap: 10 }}>
                  {query && (
                    <h2 style={{ margin: "8px 0 0", fontSize: 15 }}>
                      <a href={`#${s.id}`} onClick={(e) => (e.preventDefault(), open(s.id))}>
                        {s.label}
                      </a>{" "}
                      <span className="ad-hint">· {texts.length}</span>
                    </h2>
                  )}
                  {texts.map((t) => {
                    const v = value(t.key);
                    const sv = saved(t.key);
                    const html = isHtml(t.en);
                    const elsewhere = (usedIn[t.key] ?? []).filter((id) => id !== s.id).map((id) => byId[id]?.label);
                    const changedEn = norm(v.en) !== norm(t.en);
                    const changedNl = norm(v.nl) !== norm(t.nl);
                    return (
                      <div key={t.key} className={`ad-text${drafts[t.key] ? " ad-text--dirty" : isEdited(t.key) ? " ad-text--edited" : ""}`}>
                        <label>
                          ENGLISH
                          <textarea
                            className={`${html ? "ad-mono" : ""}${v.en !== sv.en ? " is-changed" : ""}`}
                            rows={html ? 18 : 1}
                            value={v.en}
                            onChange={(e) => change(t.key, "en", e.target.value)}
                          />
                          {changedEn && !html && <span className="ad-text__default">Default: {t.en}</span>}
                        </label>
                        <label>
                          NEDERLANDS
                          <textarea
                            className={`${html ? "ad-mono" : ""}${v.nl !== sv.nl ? " is-changed" : ""}`}
                            rows={html ? 18 : 1}
                            value={v.nl}
                            onChange={(e) => change(t.key, "nl", e.target.value)}
                          />
                          {changedNl && !html && <span className="ad-text__default">Standaard: {t.nl}</span>}
                        </label>
                        {(elsewhere.length > 0 || changedEn || changedNl || html) && (
                          <div className="ad-text__meta">
                            <span>
                              {html && "HTML: use <h2>, <h3>, <p>, <ul><li>, <strong> and <a href>. "}
                              {elsewhere.length > 0 && `Also used on: ${elsewhere.join(", ")}.`}
                            </span>
                            {(changedEn || changedNl) && (
                              <button type="button" className="ad-btn ad-btn--sm" onClick={() => reset(t.key)}>
                                Reset to default
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}

          {dirtyKeys.length > 0 && (
            <div className="ad-sticky-save">
              <span>
                {dirtyKeys.length} unsaved {dirtyKeys.length === 1 ? "change" : "changes"}
              </span>
              <div className="ad-savebar">
                <button type="button" className="ad-btn" onClick={() => setDrafts({})} disabled={busy}>
                  Discard
                </button>
                <button type="button" className="ad-btn ad-btn--primary" onClick={save} disabled={busy}>
                  {busy ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
