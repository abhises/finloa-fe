"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { adminApi, useNlOrigin, when } from "@/lib/admin-client";

type Row = { id: string; slug: string; title: string; titleNl: string; translated: boolean; published: boolean; sortOrder: number; updatedAt: string };

export default function PagesPage() {
  const confirm = useConfirm();
  const [pages, setPages] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const nlOrigin = useNlOrigin();

  const load = useCallback(() => {
    adminApi<{ data: Row[] }>("/pages/admin/all")
      .then((r) => setPages(r.data))
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  async function remove(p: Row) {
    if (!(await confirm({ title: `Delete "${p.title}"?`, message: `/${p.slug} will show “page not found” in both languages. Links to it (e.g. in the footer) will break.` }))) return;
    try {
      await adminApi(`/pages/${p.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const shown = (pages ?? []).filter((p) => !q || `${p.title} ${p.titleNl} ${p.slug}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>Pages {pages && <span className="ad-hint">({pages.length})</span>}</h1>
          <p>
            Pages such as Terms and Privacy, written as HTML in English and Dutch. The texts of the designed pages (home, videos, services…) are
            under <Link href="/admin/texts">Site texts</Link>.
          </p>
        </div>
        <Link href="/admin/pages/new" className="ad-btn ad-btn--primary">
          + Add new page
        </Link>
      </div>
      {error && <p className="ad-error">{error}</p>}

      <div className="ad-filters">
        <input className="ad-input" style={{ maxWidth: 260 }} type="search" placeholder="Search pages" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {!pages ? (
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
                <th>Status</th>
                <th>Languages</th>
                <th className="ad-hide-sm">Last updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/pages/${p.id}`} className="ad-title-cell">
                      {p.title}
                    </Link>
                    {p.titleNl && <div className="ad-hint">{p.titleNl}</div>}
                  </td>
                  <td className="ad-hide-sm">/{p.slug}</td>
                  <td>
                    <span className={`ad-pill ad-pill--${p.published ? "published" : "draft"}`}>{p.published ? "Published" : "Draft"}</span>
                  </td>
                  <td>
                    <span className="ad-pill ad-pill--published">EN</span>{" "}
                    <span className={`ad-pill ${p.translated ? "ad-pill--published" : "ad-pill--nl"}`} title={p.translated ? "Dutch version added" : "No Dutch HTML yet: nl.finloa.com shows the English"}>
                      NL{p.translated ? "" : " ✕"}
                    </span>
                  </td>
                  <td className="ad-hide-sm ad-hint">{when(p.updatedAt)}</td>
                  <td>
                    <div className="ad-actions">
                      <Link href={`/admin/pages/${p.id}`} className="ad-btn ad-btn--sm">
                        Edit
                      </Link>
                      {p.published && (
                        <>
                          <a href={`/${p.slug}`} target="_blank" rel="noreferrer" className="ad-btn ad-btn--sm">
                            View ↗
                          </a>
                          <a href={`${nlOrigin}/${p.slug}`} target="_blank" rel="noreferrer" className="ad-btn ad-btn--sm">
                            NL ↗
                          </a>
                        </>
                      )}
                      <button type="button" className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => remove(p)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
