"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionPreview } from "@/components/admin/post-preview";
import { adminApi } from "@/lib/admin-client";
import { byGroup, type SectionType } from "@/lib/sections";

export default function SectionsLibraryPage() {
  const [types, setTypes] = useState<SectionType[] | null>(null);
  const [group, setGroup] = useState("All");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi<{ data: SectionType[] }>("/section-types?preview=1")
      .then((d) => setTypes(d.data))
      .catch((e: Error) => setError(e.message));
  }, []);

  const groups = useMemo(() => ["All", ...[...new Set((types ?? []).map((t) => t.group))].sort(byGroup)], [types]);
  const list = (types ?? []).toSorted((a, b) => byGroup(a.group, b.group) || a.name.localeCompare(b.name)).filter((t) => (group === "All" || t.group === group) && `${t.name} ${t.description} ${t.key}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>Sections</h1>
          <p>The building blocks of blog posts. Built-in types are locked; duplicate one to make your own version.</p>
        </div>
        <Link href="/admin/sections/new" className="ad-btn ad-btn--primary">
          + New section type
        </Link>
      </div>
      <div className="ad-filters">
        <input className="ad-input" style={{ maxWidth: 260 }} placeholder="Search sections" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="ad-seg" role="group" aria-label="Group">
          {groups.map((g) => (
            <button key={g} type="button" aria-pressed={g === group} onClick={() => setGroup(g)}>
              {g}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="ad-error">{error}</p>}
      {!types ? (
        <p className="ad-hint">Loading…</p>
      ) : (
        <div className="sl-grid">
          {list.map((t) => (
            <Link key={t.key} href={`/admin/sections/${t.key}`} className="sl-card">
              <SectionPreview html={t.previewHtml ?? ""} css={t.previewCss} scale={0.36} width={900} maxHeight={170} minHeight={170} className="sl-card__thumb" />
              <span className="sl-card__body">
                <strong>{t.name}</strong>
                <span className="sl-card__desc">{t.description}</span>
                <span className="sl-card__meta">
                  <span className={`ad-pill ${t.builtIn ? "" : "ad-pill--custom"}`}>{t.builtIn ? "Built-in" : "Custom"}</span>
                  <span>{t.group}</span>
                  <span>· {t.uses ? `used in ${t.uses} ${t.uses === 1 ? "post" : "posts"}` : "not used yet"}</span>
                </span>
              </span>
            </Link>
          ))}
          {list.length === 0 && (
            <p>
              No section types match. <Link href="/admin/sections/new">Create a new one</Link>.
            </p>
          )}
        </div>
      )}
    </>
  );
}
