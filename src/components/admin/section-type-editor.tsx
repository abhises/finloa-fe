"use client";

import { css as cssLang } from "@codemirror/lang-css";
import { html as htmlLang } from "@codemirror/lang-html";
import CodeMirror from "@uiw/react-codemirror";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { SectionPreview } from "@/components/admin/post-preview";
import { SectionForm } from "@/components/admin/section-form";
import { adminApi } from "@/lib/admin-client";
import { emptyData, FIELD_TYPE_LABEL, type FieldDef, type FieldType, type SectionType } from "@/lib/sections";

type Draft = Pick<SectionType, "key" | "name" | "group" | "description" | "fields" | "template" | "css" | "sample">;
const BLANK: Draft = {
  key: "",
  name: "",
  group: "Highlights",
  description: "",
  css: ".box {\n  background: #fff;\n  border: 1px solid #e4e8f0;\n  border-radius: 14px;\n  padding: 20px 24px;\n}",
  fields: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Text", type: "richtext" },
  ],
  template: '<div class="box">\n  {{#heading}}<h2>{{heading}}</h2>{{/heading}}\n  {{{body}}}\n</div>',
  sample: { heading: "Example heading", body: "Example text for the preview." },
};
const GROUPS = ["Text", "Media", "Layout", "Data", "Highlights", "Advanced", "Other"];
type Tab = "fields" | "template" | "css" | "sample";
type UsedBy = { id: string; title: string }[];

export function SectionTypeEditor({ typeKey }: { typeKey?: string }) {
  const router = useRouter();
  const confirm = useConfirm();
  const isNew = !typeKey;
  const [draft, setDraft] = useState<Draft | null>(isNew ? BLANK : null);
  const [meta, setMeta] = useState<{ builtIn: boolean; usedBy: UsedBy }>({ builtIn: false, usedBy: [] });
  const [tab, setTab] = useState<Tab>("fields");
  const [preview, setPreview] = useState({ html: "", css: "", error: "" });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const locked = meta.builtIn;

  useEffect(() => {
    if (!typeKey) return;
    adminApi<{ data: SectionType; usedBy: UsedBy }>(`/section-types/${typeKey}`)
      .then((d) => {
        const t = d.data;
        setDraft({ key: t.key, name: t.name, group: t.group, description: t.description, fields: t.fields, template: t.template, css: t.css, sample: t.sample });
        setMeta({ builtIn: t.builtIn, usedBy: d.usedBy });
      })
      .catch((e: Error) => setMsg({ ok: false, text: e.message }));
  }, [typeKey]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setDraft((d) => (d ? { ...d, [k]: v } : d));
    setDirty(true);
    setMsg(null);
  };

  // live preview of unsaved changes
  useEffect(() => {
    if (!draft) return;
    const t = setTimeout(() => {
      adminApi<{ html: string; css: string }>("/section-types/preview", {
        method: "POST",
        json: { key: draft.key || draft.name || "new-type", data: draft.sample, type: { fields: draft.fields, template: draft.template, css: draft.css } },
      })
        .then((r) => setPreview({ html: r.html, css: r.css, error: "" }))
        .catch((e: Error) => setPreview((p) => ({ ...p, error: e.message })));
    }, 350);
    return () => clearTimeout(t);
  }, [draft]);

  const save = useCallback(async () => {
    if (!draft || locked) return;
    if (!draft.name.trim()) {
      setMsg({ ok: false, text: "Give the section type a name" });
      return;
    }
    const n = meta.usedBy.length;
    if (
      !isNew &&
      n &&
      !(await confirm({ title: `Update ${n} ${n === 1 ? "post" : "posts"}?`, message: "Every post that uses this section type is rebuilt with the new template.", confirmLabel: "Save and update" }))
    )
      return;
    try {
      if (isNew) {
        const { data } = await adminApi<{ data: SectionType }>("/section-types", { method: "POST", json: draft });
        setDirty(false);
        router.replace(`/admin/sections/${data.key}`);
      } else {
        const r = await adminApi<{ rerendered: number }>(`/section-types/${typeKey}`, { method: "PATCH", json: { ...draft, key: undefined } });
        setDirty(false);
        setMsg({ ok: true, text: `Saved${r.rerendered ? ` · ${r.rerendered} ${r.rerendered === 1 ? "post" : "posts"} updated` : ""}` });
      }
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    }
  }, [draft, locked, isNew, meta.usedBy.length, confirm, router, typeKey]);

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

  const duplicate = async () => {
    try {
      const { data } = await adminApi<{ data: SectionType }>(`/section-types/${typeKey}/duplicate`, { method: "POST" });
      router.push(`/admin/sections/${data.key}`);
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    }
  };
  const remove = async () => {
    if (!(await confirm({ title: `Delete "${draft?.name}"?`, message: "This cannot be undone." }))) return;
    try {
      await adminApi(`/section-types/${typeKey}`, { method: "DELETE" });
      setDirty(false);
      router.push("/admin/sections");
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    }
  };

  const ext = useMemo(() => ({ html: [htmlLang()], css: [cssLang()] }), []);
  if (!draft) return <p className="ad-hint">{msg?.text ?? "Loading…"}</p>;
  const key = draft.key || "key";

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>{isNew ? "New section type" : draft.name}</h1>
          <p>
            {locked
              ? "Built-in and locked. Duplicate it to make an editable copy."
              : isNew
                ? "Name it, add fields, write the template and check the preview."
                : `Custom section type · key ${draft.key}`}
            {!isNew && ` · ${meta.usedBy.length ? `used in ${meta.usedBy.length} ${meta.usedBy.length === 1 ? "post" : "posts"}` : "not used yet"}`}
          </p>
        </div>
        <div className="ad-savebar">
          {msg && <span className={msg.ok ? "ad-msg-ok" : "ad-msg-error"}>{msg.text}</span>}
          {dirty && !msg && <span className="ad-hint">Unsaved changes</span>}
          <Link className="ad-btn" href="/admin/sections">
            Library
          </Link>
          {!isNew && (
            <button type="button" className="ad-btn" onClick={duplicate}>
              Duplicate
            </button>
          )}
          {!isNew && !locked && (
            <button type="button" className="ad-btn ad-btn--danger" onClick={remove}>
              Delete
            </button>
          )}
          {!locked && (
            <button type="button" className="ad-btn ad-btn--primary" onClick={save}>
              {isNew ? "Create section type" : "Save"}
            </button>
          )}
        </div>
      </div>

      <div className="st-editor">
        <div className="st-panel">
          <div className="ad-tabs" role="tablist">
            {(
              [
                ["fields", "Settings & fields"],
                ["template", "Template"],
                ["css", "CSS"],
                ["sample", "Sample data"],
              ] as [Tab, string][]
            ).map(([k, l]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
                {l}
              </button>
            ))}
          </div>
          <fieldset className="st-body" disabled={locked}>
            {tab === "fields" && (
              <div className="sf">
                <div className="ad-2">
                  <label>
                    Name
                    <input value={draft.name} placeholder="e.g. Savings tip" onChange={(e) => set("name", e.target.value)} />
                  </label>
                  <label>
                    Group
                    <select value={draft.group} onChange={(e) => set("group", e.target.value)}>
                      {[...new Set([...GROUPS, draft.group])].map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </label>
                </div>
                {isNew && (
                  <label>
                    Key
                    <input value={draft.key} placeholder="from the name" onChange={(e) => set("key", e.target.value)} />
                    <span className="ad-hint">
                      Used in the CSS class <code>.fl-sec--{key}</code>. Can&apos;t be changed later.
                    </span>
                  </label>
                )}
                <label>
                  Description
                  <input value={draft.description} placeholder="One line, shown in the library" onChange={(e) => set("description", e.target.value)} />
                </label>
                <FieldsBuilder fields={draft.fields} onChange={(f) => set("fields", f)} />
              </div>
            )}
            {tab === "template" && (
              <div className="sf">
                <div className="st-code">
                  <CodeMirror value={draft.template} extensions={ext.html} readOnly={locked} onChange={(v) => set("template", v)} basicSetup={{ foldGutter: true }} />
                </div>
                <TemplateHelp fields={draft.fields} />
              </div>
            )}
            {tab === "css" && (
              <div className="sf">
                <div className="st-code">
                  <CodeMirror value={draft.css} extensions={ext.css} readOnly={locked} onChange={(v) => set("css", v)} basicSetup={{ foldGutter: true }} />
                </div>
                <span className="ad-hint">
                  {locked ? (
                    "Built-in types are styled in globals.css."
                  ) : (
                    <>
                      Every rule is limited to this section automatically, so <code>.box {"{…}"}</code> becomes <code>.fl-sec--{key} .box {"{…}"}</code>. Use{" "}
                      <code>:scope</code> to style the section itself. The site&apos;s colour variables such as <code>var(--color-brand)</code> work here.
                    </>
                  )}
                </span>
              </div>
            )}
            {tab === "sample" && (
              <div>
                <p className="ad-hint" style={{ marginTop: 0 }}>
                  Example content used for the preview and the library thumbnail.
                </p>
                <SectionForm fields={draft.fields} value={draft.sample} onChange={(v) => set("sample", v)} />
                {!locked && (
                  <button type="button" className="ad-btn ad-btn--sm" style={{ marginTop: 10 }} onClick={() => set("sample", emptyData(draft.fields))}>
                    Reset sample
                  </button>
                )}
              </div>
            )}
          </fieldset>
          {!isNew && meta.usedBy.length > 0 && (
            <details className="st-used">
              <summary>
                Used in {meta.usedBy.length} {meta.usedBy.length === 1 ? "post" : "posts"}
              </summary>
              <ul>
                {meta.usedBy.map((p) => (
                  <li key={p.id}>
                    <Link href={`/admin/posts/${p.id}`}>{p.title}</Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
        <div className="st-preview">
          <div className="st-preview__head">
            <span>Preview with sample data</span>
            {preview.error && <span className="ad-field__err">{preview.error}</span>}
          </div>
          <SectionPreview html={preview.html} css={preview.css} minHeight={300} />
        </div>
      </div>
    </>
  );
}

function TemplateHelp({ fields }: { fields: FieldDef[] }) {
  const show = (fs: FieldDef[]): string[] =>
    fs.flatMap((f) =>
      f.type === "list"
        ? [`{{#${f.key}}} … {{/${f.key}}}  (each item: ${(f.fields ?? []).map((s) => s.key).join(", ")})`]
        : f.type === "richtext" || f.type === "code" || f.type === "markdown"
          ? [`{{{${f.key}}}}`]
          : f.type === "cells"
            ? [`{{#${f.key}}}{{value}}{{/${f.key}}}  ({{#best}} marks a value ending in *)`]
            : f.type === "post"
              ? [`{{${f.key}.title}} {{${f.key}.url}} {{${f.key}.coverImage}} {{${f.key}.excerpt}}`]
              : [`{{${f.key}}}`],
    );
  return (
    <div className="st-help">
      <strong>Your fields</strong>
      <code>{show(fields).join("\n")}</code>
      <strong>Also available</strong>
      <code>{"{{post.title}} {{post.url}} {{post.author.name}} {{post.category.name}} {{post.lang}}\n{{^field}}shown when empty{{/field}}   {{@number}} {{@n}} inside a list"}</code>
      <span className="ad-hint">
        Use <code>&lt;h2&gt;</code> for headings that belong in the contents list. Scripts aren&apos;t allowed.
      </span>
    </div>
  );
}

const TYPES = Object.keys(FIELD_TYPE_LABEL) as FieldType[];
const keyOf = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)?/g, (_, c: string) => (c ? c.toUpperCase() : ""))
    .replace(/^[^a-z]+/, "") || "field";

function FieldsBuilder({ fields, onChange, nested = false }: { fields: FieldDef[]; onChange: (f: FieldDef[]) => void; nested?: boolean }) {
  const update = (i: number, patch: Partial<FieldDef>) => onChange(fields.map((f, k) => (k === i ? { ...f, ...patch } : f)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= fields.length) return;
    const n = [...fields];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div className={`fb${nested ? " fb--nested" : ""}`}>
      {!nested && <div className="fb__title">Fields</div>}
      {fields.map((f, i) => (
        <div key={i} className="fb__row">
          <div className="fb__line">
            <input
              aria-label="Field label"
              value={f.label}
              placeholder="Label"
              onChange={(e) => update(i, { label: e.target.value, ...(f.key === keyOf(f.label) || !f.key ? { key: keyOf(e.target.value) } : {}) })}
            />
            <input aria-label="Field key" className="fb__key" value={f.key} placeholder="key" onChange={(e) => update(i, { key: e.target.value.replace(/[^a-zA-Z0-9_]/g, "") })} />
            <select
              aria-label="Field type"
              value={f.type}
              onChange={(e) => update(i, { type: e.target.value as FieldType, ...(e.target.value === "list" && !f.fields ? { fields: [{ key: "text", label: "Text", type: "text" }] } : {}) })}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {FIELD_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
            <span className="fb__ops">
              <button type="button" aria-label="Move up" onClick={() => move(i, -1)}>
                ↑
              </button>
              <button type="button" aria-label="Move down" onClick={() => move(i, 1)}>
                ↓
              </button>
              <button type="button" aria-label={`Remove ${f.label}`} onClick={() => onChange(fields.filter((_, k) => k !== i))}>
                ×
              </button>
            </span>
          </div>
          <div className="fb__line fb__line--extra">
            <label className="ad-check">
              <input type="checkbox" checked={!!f.required} onChange={(e) => update(i, { required: e.target.checked })} />
              Required
            </label>
            <input aria-label="Help text" value={f.help ?? ""} placeholder="Help text (optional)" onChange={(e) => update(i, { help: e.target.value || undefined })} />
            {f.type === "select" && (
              <input
                aria-label="Choices"
                value={(f.options ?? []).join(", ")}
                placeholder="Choices, separated by commas"
                onChange={(e) =>
                  update(i, {
                    options: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            )}
            {f.type === "list" && (
              <input aria-label="Item label" value={f.itemLabel ?? ""} placeholder="Item label, e.g. {{title}}" onChange={(e) => update(i, { itemLabel: e.target.value || undefined })} />
            )}
          </div>
          {f.type === "list" && <FieldsBuilder nested fields={f.fields ?? []} onChange={(sub) => update(i, { fields: sub })} />}
        </div>
      ))}
      <button
        type="button"
        className="ad-btn ad-btn--sm"
        style={{ alignSelf: "flex-start" }}
        onClick={() => onChange([...fields, { key: `field${fields.length + 1}`, label: `Field ${fields.length + 1}`, type: "text" }])}
      >
        + Add {nested ? "field to each item" : "field"}
      </button>
    </div>
  );
}
