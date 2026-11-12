"use client";

import { useEffect, useRef, useState } from "react";
import { MediaPicker } from "@/components/admin/media-library";
import { adminApi } from "@/lib/admin-client";
import { emptyData, fillLabel, type FieldDef } from "@/lib/sections";

type Data = Record<string, unknown>;

/** A form generated from a section type's fields. Used by the post editor and the section-type editor (sample data). */
export function SectionForm({ fields, value, onChange }: { fields: FieldDef[]; value: Data; onChange: (v: Data) => void }) {
  if (!fields.length) return <p className="ad-hint">This section has no settings.</p>;
  return (
    <div className="sf">
      {fields.map((f) => (
        <FieldInput key={f.key} field={f} value={value?.[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
      ))}
    </div>
  );
}

function FieldInput({ field: f, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const str = typeof value === "string" || typeof value === "number" ? String(value) : "";
  const label = (
    <span>
      {f.label}
      {f.required && (
        <span className="sf-req" title="Required">
          {" "}
          *
        </span>
      )}
    </span>
  );
  const help = f.help ? <span className="ad-hint">{f.help}</span> : null;

  switch (f.type) {
    case "toggle":
      return (
        <label className="ad-check">
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
          {label}
        </label>
      );
    case "select":
      return (
        <label>
          {label}
          <select value={str || String(f.default ?? "")} onChange={(e) => onChange(e.target.value)}>
            {(f.options ?? []).map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {help}
        </label>
      );
    case "number":
      return (
        <label>
          {label}
          <input type="number" step="any" value={str} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
          {help}
        </label>
      );
    case "textarea":
      return (
        <label>
          {label}
          <textarea className="sf-text" value={str} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
          {help}
        </label>
      );
    case "markdown":
    case "code":
      return (
        <label>
          {label}
          <textarea className={`sf-code${f.type === "markdown" ? " sf-code--md" : ""}`} spellCheck={f.type === "markdown"} value={str} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
          {help}
        </label>
      );
    case "richtext":
      return (
        <div className="sf-field">
          <span className="sf-label">{label}</span>
          <RichText value={str} onChange={onChange} placeholder={f.placeholder} />
          {help}
        </div>
      );
    case "image":
      return (
        <div className="sf-field">
          <span className="sf-label">{label}</span>
          <ImageInput value={str} onChange={onChange} />
          {help}
        </div>
      );
    case "post":
      return (
        <div className="sf-field">
          <span className="sf-label">{label}</span>
          <PostPicker value={str} onChange={onChange} />
          {help}
        </div>
      );
    case "list":
      return (
        <div className="sf-field">
          <span className="sf-label">{label}</span>
          {help}
          <ListInput field={f} value={Array.isArray(value) ? (value as Data[]) : []} onChange={onChange} />
        </div>
      );
    case "cells":
      return (
        <label>
          {label}
          <input className="sf-mono" value={str} placeholder={f.placeholder ?? "value | value | value"} onChange={(e) => onChange(e.target.value)} />
          {help}
        </label>
      );
    default: // text, link
      return (
        <label>
          {label}
          <input
            type="text"
            inputMode={f.type === "link" ? "url" : undefined}
            value={str}
            placeholder={f.placeholder ?? (typeof f.default === "string" ? f.default : undefined)}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </label>
      );
  }
}

function ListInput({ field, value, onChange }: { field: FieldDef; value: Data[]; onChange: (v: Data[]) => void }) {
  const [open, setOpen] = useState<number | null>(value.length ? 0 : null);
  const sub = field.fields ?? [];
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const n = [...value];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
    setOpen(j);
  };
  const singular = field.label.replace(/s$/, "").toLowerCase() || "item";
  return (
    <div className="sf-list">
      {value.map((item, i) => (
        <div key={i} className={`sf-item${open === i ? " is-open" : ""}`}>
          <div className="sf-item__head">
            <button type="button" className="sf-item__toggle" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
              <span className="sf-item__n">{i + 1}</span>
              {fillLabel(field.itemLabel, item, `${field.label.replace(/s$/, "")} ${i + 1}`)}
            </button>
            <span className="sf-item__ops">
              <button type="button" aria-label="Move up" title="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                ↑
              </button>
              <button type="button" aria-label="Move down" title="Move down" onClick={() => move(i, 1)} disabled={i === value.length - 1}>
                ↓
              </button>
              <button
                type="button"
                aria-label="Duplicate"
                title="Duplicate"
                onClick={() => {
                  const n = [...value];
                  n.splice(i + 1, 0, structuredClone(item));
                  onChange(n);
                  setOpen(i + 1);
                }}
              >
                ⧉
              </button>
              <button
                type="button"
                aria-label="Remove"
                title="Remove"
                onClick={() => {
                  onChange(value.filter((_, k) => k !== i));
                  setOpen(null);
                }}
              >
                ×
              </button>
            </span>
          </div>
          {open === i && (
            <div className="sf-item__body">
              <SectionForm fields={sub} value={item} onChange={(v) => onChange(value.map((x, k) => (k === i ? v : x)))} />
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        className="ad-btn ad-btn--sm sf-add"
        onClick={() => {
          onChange([...value, emptyData(sub)]);
          setOpen(value.length);
        }}
      >
        + Add {singular}
      </button>
    </div>
  );
}

function RichText({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [linking, setLinking] = useState<{ a: number; b: number; url: string } | null>(null);
  const wrap = (open: string, close: string, a: number, b: number) => {
    const el = ref.current;
    onChange(value.slice(0, a) + open + value.slice(a, b) + close + value.slice(b));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(a + open.length, b + open.length);
    });
  };
  const sel = () => ({ a: ref.current?.selectionStart ?? value.length, b: ref.current?.selectionEnd ?? value.length });
  return (
    <div className="sf-rich">
      <div className="sf-rich__bar">
        <button type="button" title="Bold" onClick={() => { const { a, b } = sel(); wrap("<strong>", "</strong>", a, b); }}>
          <b>B</b>
        </button>
        <button type="button" title="Italic" onClick={() => { const { a, b } = sel(); wrap("<em>", "</em>", a, b); }}>
          <i>I</i>
        </button>
        <button type="button" title="Link" onClick={() => setLinking({ ...sel(), url: "https://" })}>
          Link
        </button>
        <span className="ad-hint">Empty line = new paragraph</span>
      </div>
      {linking && (
        <div className="sf-rich__link">
          <input
            autoFocus
            value={linking.url}
            aria-label="Link address"
            placeholder="https://… or /blog/…"
            onChange={(e) => setLinking({ ...linking, url: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                wrap(`<a href="${linking.url.replace(/"/g, "%22")}">`, "</a>", linking.a, linking.b);
                setLinking(null);
              }
              if (e.key === "Escape") setLinking(null);
            }}
          />
          <button
            type="button"
            className="ad-btn ad-btn--sm"
            onClick={() => {
              wrap(`<a href="${linking.url.replace(/"/g, "%22")}">`, "</a>", linking.a, linking.b);
              setLinking(null);
            }}
          >
            Add link
          </button>
          <button type="button" className="ad-btn ad-btn--sm" onClick={() => setLinking(null)}>
            Cancel
          </button>
        </div>
      )}
      <textarea ref={ref} className="sf-text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [picking, setPicking] = useState(false);
  return (
    <div className="sf-image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value ? <img src={value} alt="" /> : <span className="sf-image__empty" />}
      <div style={{ display: "flex", gap: 6, flex: 1, minWidth: 0 }}>
        <input value={value} placeholder="Image URL" onChange={(e) => onChange(e.target.value)} />
        <button type="button" className="ad-btn ad-btn--sm" onClick={() => setPicking(true)}>
          Pick
        </button>
        {value && (
          <button type="button" className="ad-btn ad-btn--sm" onClick={() => onChange("")}>
            Clear
          </button>
        )}
      </div>
      {picking && (
        <MediaPicker
          onPick={(m) => {
            onChange(m.url);
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  );
}

type PostRow = { id: string; slug: string; title: string; coverImage: string | null; youtubeId: string | null; published: boolean };
let postsCache: Promise<PostRow[]> | null = null;
const loadPosts = () => (postsCache ??= adminApi<{ data: PostRow[] }>("/posts/admin/all").then((r) => r.data).catch(() => ((postsCache = null), [])));
const thumb = (p: PostRow) => p.coverImage ?? (p.youtubeId ? `https://i.ytimg.com/vi/${p.youtubeId}/default.jpg` : null);

/** Search-and-pick a blog post. Stores the id; also accepts a slug typed by automation. */
function PostPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [posts, setPosts] = useState<PostRow[] | null>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    loadPosts().then(setPosts);
  }, []);
  const current = posts?.find((p) => p.id === value || p.slug === value);
  const rows = (posts ?? []).filter((p) => `${p.title} ${p.slug}`.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  const row = (p: PostRow) => (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {thumb(p) ? <img src={thumb(p)!} alt="" /> : <span className="sf-image__empty" />}
      <span>
        <b>{p.title}</b>
        <small>
          /blog/{p.slug}
          {p.published ? "" : " · draft"}
        </small>
      </span>
    </>
  );

  if (value && !open)
    return (
      <div className="sf-ref__row">
        {current ? row(current) : (<><span className="sf-image__empty" /><span><b>{value}</b><small>{posts ? "Post not found" : "Loading…"}</small></span></>)}
        <span style={{ display: "flex", gap: 4 }}>
          <button type="button" className="ad-btn ad-btn--sm" onClick={() => setOpen(true)}>
            Change
          </button>
          <button type="button" className="ad-btn ad-btn--sm" aria-label="Clear" onClick={() => onChange("")}>
            ×
          </button>
        </span>
      </div>
    );
  if (!open)
    return (
      <button type="button" className="ad-btn ad-btn--sm" style={{ alignSelf: "flex-start" }} onClick={() => setOpen(true)}>
        Choose a post
      </button>
    );
  return (
    <div className="sf-ref__search">
      <div style={{ display: "flex", gap: 6 }}>
        <input autoFocus value={q} placeholder="Search posts" onChange={(e) => setQ(e.target.value)} />
        <button type="button" className="ad-btn ad-btn--sm" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
      <div className="sf-ref__results">
        {posts === null ? (
          <span className="ad-hint">Loading…</span>
        ) : rows.length === 0 ? (
          <span className="ad-hint">No posts found.</span>
        ) : (
          rows.map((p) => (
            <button
              type="button"
              key={p.id}
              className="sf-ref__row"
              onClick={() => {
                onChange(p.id);
                setOpen(false);
              }}
            >
              {row(p)}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
