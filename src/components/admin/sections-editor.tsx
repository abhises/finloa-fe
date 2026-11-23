"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { SectionForm } from "@/components/admin/section-form";
import { byGroup, emptyData, fillLabel, newId, type SectionItem, type SectionsDoc, type SectionType } from "@/lib/sections";

/** The sections a new post starts with (keys of built-in section types + starting values). */
const STARTER: [string, Record<string, unknown>?][] = [["text"], ["text"], ["callout"], ["cta"]];

export function starterDoc(types: SectionType[]): SectionsDoc {
  const byKey = new Map(types.map((t) => [t.key, t]));
  return {
    layout: "toc",
    items: STARTER.filter(([k]) => byKey.has(k)).map(([k, extra]) => ({ id: newId(), type: k, data: { ...emptyData(byKey.get(k)!.fields), ...extra } })),
  };
}

/** A copy of a doc with new section ids (e.g. Dutch sections started from the English ones). */
export const cloneDoc = (doc: SectionsDoc): SectionsDoc => ({ ...structuredClone(doc), items: doc.items.map((s) => ({ ...structuredClone(s), id: newId() })) });

const LAYOUTS: [SectionsDoc["layout"], string][] = [
  ["toc", "With contents list"],
  ["wide", "Without contents list"],
];

/** A block of a coded design (designed pages): its layout is fixed, but it can be hidden and moved; `body` is its editor. */
export type FixedBlock = { id: string; name: string; sub?: string; body: ReactNode; hidden?: boolean };

type Row = { kind: "fixed"; f: FixedBlock } | { kind: "item"; s: SectionItem };

export function SectionsEditor({
  doc,
  onChange,
  selected,
  onSelect,
  types,
  fixed,
  onFixed,
  defaultAfter,
  itemsNote,
}: {
  doc: SectionsDoc;
  onChange: (d: SectionsDoc) => void;
  selected: string | null;
  onSelect: (id: string | null) => void;
  types: SectionType[];
  /** Designed blocks, in page order. Your sections are placed between them with their `after` anchor. */
  fixed?: FixedBlock[];
  /** The designed blocks were moved or hidden */
  onFixed?: (next: { order: string[]; hidden: string[] }) => void;
  /** Block a section without (a valid) anchor follows */
  defaultAfter?: string;
  /** Shown instead of the editable sections (e.g. the extra content is hand-written HTML) */
  itemsNote?: ReactNode;
}) {
  const [adding, setAdding] = useState(false);
  const byKey = useMemo(() => new Map(types.map((t) => [t.key, t])), [types]);
  const items = doc.items;
  const sel = items.find((s) => s.id === selected) ?? null;
  const selType = sel ? byKey.get(sel.type) : undefined;
  const blocks = fixed ?? [];
  const designed = blocks.length > 0;
  const selFixed = blocks.find((f) => f.id === selected) ?? null;
  const fixedIds = new Set(blocks.map((f) => f.id));
  const fallback = defaultAfter && fixedIds.has(defaultAfter) ? defaultAfter : (blocks.at(-1)?.id ?? "start");
  const anchorOf = (s: SectionItem) => (s.after && (s.after === "start" || fixedIds.has(s.after)) ? s.after : fallback);

  /** Everything in page order: designed blocks with the sections that follow each of them */
  const shownItems = itemsNote ? [] : items;
  const rows: Row[] = designed
    ? [
        ...shownItems.filter((s) => anchorOf(s) === "start").map((s) => ({ kind: "item" as const, s })),
        ...blocks.flatMap((f) => [{ kind: "fixed" as const, f }, ...shownItems.filter((s) => anchorOf(s) === f.id).map((s) => ({ kind: "item" as const, s }))]),
      ]
    : shownItems.map((s) => ({ kind: "item" as const, s }));

  const setItems = (next: SectionItem[]) => onChange({ ...doc, items: next });
  const update = (id: string, patch: Partial<SectionItem>) => setItems(items.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const hiddenIds = () => blocks.filter((f) => f.hidden).map((f) => f.id);
  /** New page order → designed block order + each section's anchor + section order */
  const applyRows = (next: Row[]) => {
    if (!designed) return setItems(next.map((r) => (r as { s: SectionItem }).s));
    let anchor = "start";
    const order: string[] = [];
    const nextItems: SectionItem[] = [];
    for (const r of next) {
      if (r.kind === "fixed") {
        order.push(r.f.id);
        anchor = r.f.id;
      } else nextItems.push({ ...r.s, after: anchor });
    }
    if (order.join() !== blocks.map((f) => f.id).join()) onFixed?.({ order, hidden: hiddenIds() });
    setItems([...nextItems, ...items.filter((s) => !nextItems.some((n) => n.id === s.id))]);
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const n = [...rows];
    [n[i], n[j]] = [n[j], n[i]];
    applyRows(n);
  };
  const add = (t: SectionType) => {
    const item: SectionItem = { id: newId(), type: t.key, data: emptyData(t.fields) };
    if (designed) {
      // right after the selected block or section, otherwise after the default block
      const anchor = selFixed ? selFixed.id : sel ? anchorOf(sel) : fallback;
      item.after = anchor;
      const at = sel ? items.findIndex((s) => s.id === sel.id) + 1 : selFixed ? items.findIndex((s) => anchorOf(s) === anchor) : -1;
      const pos = at < 0 ? items.length : at;
      setItems([...items.slice(0, pos), item, ...items.slice(pos)]);
    } else {
      const at = sel ? items.findIndex((s) => s.id === sel.id) + 1 : items.length;
      setItems([...items.slice(0, at), item, ...items.slice(at)]);
    }
    onSelect(item.id);
    setAdding(false);
  };
  const toggleFixed = (f: FixedBlock) => {
    const hidden = hiddenIds().filter((id) => id !== f.id);
    onFixed?.({ order: blocks.map((b) => b.id), hidden: f.hidden ? hidden : [...hidden, f.id] });
  };
  const label = (s: SectionItem) => {
    const t = byKey.get(s.type);
    const d = s.data ?? {};
    const text = (v: unknown) => (typeof v === "string" ? v.replace(/<[^>]+>/g, "").slice(0, 80) : "");
    const sub = s.tocLabel || text(d.heading) || text(d.title) || text(d.text) || fillLabel("{{caption}}", d, "");
    return { name: t?.name ?? `Unknown type "${s.type}"`, sub };
  };

  const ops = (i: number, name: string) => (
    <span className="se-item__ops">
      <button type="button" title="Move up" aria-label={`Move ${name} up`} onClick={() => move(i, -1)} disabled={i === 0}>
        ↑
      </button>
      <button type="button" title="Move down" aria-label={`Move ${name} down`} onClick={() => move(i, 1)} disabled={i === rows.length - 1}>
        ↓
      </button>
    </span>
  );

  return (
    <div className="se">
      <div className="se-outline">
        <div className="se-outline__head">
          <span>{designed ? "Page blocks" : "Sections"}</span>
          {!designed && (
            <select aria-label="Page layout" value={doc.layout} onChange={(e) => onChange({ ...doc, layout: e.target.value as SectionsDoc["layout"] })}>
              {LAYOUTS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          )}
        </div>
        {rows.length === 0 && (
          <p className="ad-hint" style={{ padding: 10, margin: 0 }}>
            No sections yet. Add the first one below.
          </p>
        )}
        {rows.map((r, i) => {
          if (r.kind === "fixed") {
            const f = r.f;
            return (
              <div key={f.id} className={`se-item se-item--fixed${f.id === selected ? " is-selected" : ""}${f.hidden ? " is-hidden" : ""}`}>
                <button type="button" className="se-item__main" onClick={() => onSelect(f.id === selected ? null : f.id)} aria-pressed={f.id === selected}>
                  <b>
                    {f.name} <span className="se-item__lock">Design</span>
                  </b>
                  {f.sub && <small>{f.sub}</small>}
                  {f.hidden && <small className="se-item__flag">Hidden</small>}
                </button>
                {onFixed && ops(i, f.name)}
              </div>
            );
          }
          const s = r.s;
          const l = label(s);
          return (
            <div key={s.id} className={`se-item${s.id === selected ? " is-selected" : ""}${s.hidden ? " is-hidden" : ""}`}>
              <button type="button" className="se-item__main" onClick={() => onSelect(s.id === selected ? null : s.id)} aria-pressed={s.id === selected}>
                <b>{l.name}</b>
                {l.sub && <small>{l.sub}</small>}
                {s.hidden && <small className="se-item__flag">Hidden</small>}
              </button>
              {ops(i, l.name)}
            </div>
          );
        })}
        {itemsNote ? (
          <div className="ad-hint" style={{ padding: 10 }}>
            {itemsNote}
          </div>
        ) : (
          <button type="button" className="se-add" onClick={() => setAdding(true)}>
            + Add section{designed && (selFixed || sel) ? " here" : ""}
          </button>
        )}
      </div>

      <div className="se-form">
        {selFixed ? (
          <>
            <div className="se-form__head">
              <strong>
                {selFixed.name} <span className="se-item__lock">Design</span>
              </strong>
              {onFixed && (
                <span className="se-form__ops">
                  <button type="button" className="ad-btn ad-btn--sm" onClick={() => toggleFixed(selFixed)}>
                    {selFixed.hidden ? "Show" : "Hide"}
                  </button>
                </span>
              )}
            </div>
            {selFixed.hidden && <p className="ad-fallback">This block is hidden on the site (both languages). Its texts are kept.</p>}
            {selFixed.body}
          </>
        ) : !sel ? (
          <p className="ad-hint">Select a section on the left to edit it, or add a new one.</p>
        ) : (
          <>
            <div className="se-form__head">
              <strong>{selType?.name ?? sel.type}</strong>
              <span className="se-form__ops">
                <button type="button" className="ad-btn ad-btn--sm" onClick={() => update(sel.id, { hidden: !sel.hidden })}>
                  {sel.hidden ? "Show" : "Hide"}
                </button>
                <button
                  type="button"
                  className="ad-btn ad-btn--sm"
                  onClick={() => {
                    const at = items.findIndex((s) => s.id === sel.id);
                    const copy = { ...structuredClone(sel), id: newId() };
                    setItems([...items.slice(0, at + 1), copy, ...items.slice(at + 1)]);
                    onSelect(copy.id);
                  }}
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  className="ad-btn ad-btn--sm ad-btn--danger"
                  onClick={() => {
                    setItems(items.filter((s) => s.id !== sel.id));
                    onSelect(null);
                  }}
                >
                  Remove
                </button>
                {selType && (
                  <Link className="ad-btn ad-btn--sm" href={`/admin/sections/${selType.key}`} target="_blank">
                    Type ↗
                  </Link>
                )}
              </span>
            </div>
            {selType?.description && <p className="ad-hint" style={{ margin: "0 0 10px" }}>{selType.description}</p>}
            <details className="se-adv">
              <summary>Contents list</summary>
              <div className="sf" style={{ marginTop: 8 }}>
                <label>
                  Name in the contents list
                  <input
                    value={sel.tocLabel ?? ""}
                    disabled={sel.tocLabel === ""}
                    placeholder={sel.tocLabel === "" ? "Not in the contents list" : "From the heading"}
                    onChange={(e) => update(sel.id, { tocLabel: e.target.value === "" ? undefined : e.target.value })}
                  />
                </label>
                <label className="ad-check">
                  <input type="checkbox" checked={sel.tocLabel === ""} onChange={(e) => update(sel.id, { tocLabel: e.target.checked ? "" : undefined })} />
                  Leave this section out of the contents list
                </label>
              </div>
            </details>
            {selType ? (
              <SectionForm fields={selType.fields} value={sel.data ?? {}} onChange={(data) => update(sel.id, { data })} />
            ) : (
              <p className="ad-error">This section type no longer exists. Remove the section or recreate the type &ldquo;{sel.type}&rdquo;.</p>
            )}
          </>
        )}
      </div>

      {adding && <AddSection types={types} onPick={add} onClose={() => setAdding(false)} />}
    </div>
  );
}

function AddSection({ types, onPick, onClose }: { types: SectionType[]; onPick: (t: SectionType) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const list = types.filter((t) => `${t.name} ${t.description} ${t.group}`.toLowerCase().includes(q.toLowerCase()));
  const groups = [...new Set(list.map((t) => t.group))].sort(byGroup);
  return (
    <div className="ad-modal" onClick={onClose}>
      <div className="ad-modal__box ad-modal__box--wide" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Add a section">
        <div className="ad-panel__head">
          <h2>Add a section</h2>
          <button type="button" className="ad-btn" onClick={onClose}>
            Close
          </button>
        </div>
        <input
          className="ad-input"
          autoFocus
          placeholder="Search sections"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && list[0]) onPick(list[0]);
          }}
        />
        {groups.map((g) => (
          <div key={g} className="se-pick">
            <div className="se-pick__group">{g}</div>
            <div className="se-pick__grid">
              {list
                .filter((t) => t.group === g)
                .map((t) => (
                  <button key={t.key} type="button" onClick={() => onPick(t)}>
                    <strong>{t.name}</strong>
                    <span>{t.description}</span>
                    {!t.builtIn && <span className="ad-pill ad-pill--custom">Custom</span>}
                  </button>
                ))}
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p>
            No sections match.{" "}
            <Link href="/admin/sections/new" target="_blank">
              Create a new section type
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
