"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { CATALOG, designedPages } from "@/components/admin/design-page-editor";
import { adminApi, useNlOrigin, when } from "@/lib/admin-client";

type ContentRow = {
  id: string;
  slug: string;
  title: string;
  titleNl: string;
  translated: boolean;
  published: boolean;
  sortOrder: number;
  updatedAt: string;
  builtWith: "sections" | "html";
};

/** One row of the list: a designed page (coded layout, texts editable) or a content page (sections / HTML) */
type Row = {
  key: string;
  title: string;
  sub?: string;
  path: string;
  editHref: string;
  kind: "Front page" | "Design" | "Sections" | "HTML";
  published: boolean;
  translated: boolean;
  updatedAt?: string;
  content?: ContentRow;
};

const KIND_PILL: Record<Row["kind"], string> = { "Front page": "design", Design: "design", Sections: "sections", HTML: "html" };
type Filter = "all" | "design" | "content";

export default function PagesPage() {
  const confirm = useConfirm();
  const [pages, setPages] = useState<ContentRow[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const nlOrigin = useNlOrigin();

  const load = useCallback(() => {
    adminApi<{ data: ContentRow[] }>("/pages/admin/all")
      .then((r) => setPages(r.data))
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  async function remove(p: ContentRow) {
    if (!(await confirm({ title: `Delete "${p.title}"?`, message: `/${p.slug} will show “page not found” in both languages. Links to it (e.g. in the footer) will break.` }))) return;
    try {
      await adminApi(`/pages/${p.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const designed: Row[] = designedPages().map((s) => {
    const home = s.id === "home";
    return {
      key: `design:${s.id}`,
      title: home ? "Front page" : s.label,
      sub: home ? "Home page" : `${s.texts.length} texts`,
      path: s.path!,
      editHref: home ? "/admin/front-page" : `/admin/pages/design/${s.id.split("/").map(encodeURIComponent).join("/")}`,
      kind: home ? "Front page" : "Design",
      published: true,
      translated: true,
    };
  });
  designed.sort((a, b) => (a.kind === "Front page" ? -1 : b.kind === "Front page" ? 1 : a.title.localeCompare(b.title)));
  const content: Row[] = (pages ?? []).map((p) => ({
    key: p.id,
    title: p.title,
    sub: p.titleNl || undefined,
    path: `/${p.slug}`,
    editHref: `/admin/pages/${p.id}`,
    kind: p.builtWith === "sections" ? "Sections" : "HTML",
    published: p.published,
    translated: p.translated,
    updatedAt: p.updatedAt,
    content: p,
  }));

  const all = [...(filter !== "content" ? designed : []), ...(filter !== "design" ? content : [])];
  const shown = all.filter((r) => !q || `${r.title} ${r.sub ?? ""} ${r.path}`.toLowerCase().includes(q.toLowerCase()));
  const total = designed.length + (pages?.length ?? 0);

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>Pages {pages && <span className="ad-hint">({total})</span>}</h1>
          <p>
            Every page of finloa.com and nl.finloa.com. <strong>Design</strong> pages keep their coded layout: you edit their texts in English and Dutch
            beside a live preview. Pages you add (Terms, Privacy…) are built with sections, like blog posts, or HTML.
          </p>
        </div>
        <Link href="/admin/pages/new" className="ad-btn ad-btn--primary">
          + Add new page
        </Link>
      </div>
      {error && <p className="ad-error">{error}</p>}

      <div className="ad-filters">
        <input className="ad-input" style={{ maxWidth: 260 }} type="search" placeholder="Search pages" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="ad-input" style={{ maxWidth: 200 }} value={filter} onChange={(e) => setFilter(e.target.value as Filter)} aria-label="Show">
          <option value="all">All pages</option>
          <option value="design">Designed pages ({designed.length})</option>
          <option value="content">Added pages ({pages?.length ?? "…"})</option>
        </select>
      </div>

      {!pages && !error ? (
        <p className="ad-hint">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="ad-hint">{q ? "No pages match." : "No pages yet."}</p>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Title</th>
                <th className="ad-hide-sm">URL</th>
                <th>Built with</th>
                <th>Status</th>
                <th className="ad-hide-sm">Languages</th>
                <th className="ad-hide-sm">Last updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.key}>
                  <td>
                    <Link href={r.editHref} className="ad-title-cell">
                      {r.title}
                    </Link>
                    {r.sub && <div className="ad-hint">{r.sub}</div>}
                  </td>
                  <td className="ad-hide-sm">{r.path}</td>
                  <td>
                    <span className={`ad-pill ad-pill--${KIND_PILL[r.kind]}`}>{r.kind}</span>
                  </td>
                  <td>
                    <span className={`ad-pill ad-pill--${r.published ? "published" : "draft"}`}>{r.published ? "Published" : "Draft"}</span>
                  </td>
                  <td className="ad-hide-sm">
                    <span className="ad-pill ad-pill--published">EN</span>{" "}
                    <span
                      className={`ad-pill ${r.translated ? "ad-pill--published" : "ad-pill--nl"}`}
                      title={r.translated ? "Dutch version added" : "No Dutch body yet: nl.finloa.com shows the English"}
                    >
                      NL{r.translated ? "" : " ✕"}
                    </span>
                  </td>
                  <td className="ad-hide-sm ad-hint">{r.updatedAt ? when(r.updatedAt) : "—"}</td>
                  <td>
                    <div className="ad-actions">
                      <Link href={r.editHref} className="ad-btn ad-btn--sm">
                        Edit
                      </Link>
                      {r.published && (
                        <>
                          <a href={r.path} target="_blank" rel="noreferrer" className="ad-btn ad-btn--sm">
                            View ↗
                          </a>
                          <a href={`${nlOrigin}${r.path}`} target="_blank" rel="noreferrer" className="ad-btn ad-btn--sm">
                            NL ↗
                          </a>
                        </>
                      )}
                      {r.content && (
                        <button type="button" className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => remove(r.content!)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="ad-hint" style={{ marginTop: 12 }}>
        Texts shared by several pages (header, footer, contact form, pricing…): <Link href="/admin/texts">Site texts</Link>. The blog itself is under{" "}
        <Link href="/admin/posts">Blog posts</Link>. {CATALOG.sections.filter((s) => s.group === "shared").length} shared parts.
      </p>
    </>
  );
}
