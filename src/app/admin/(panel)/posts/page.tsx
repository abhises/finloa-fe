"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { adminApi, when } from "@/lib/admin-client";

type Row = {
  id: string;
  slug: string;
  title: string;
  hasNl: boolean;
  youtubeId: string | null;
  coverImage: string | null;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  category: { id: string; name: string } | null;
  author: { id: string; name: string } | null;
};

type Filter = "all" | "published" | "drafts" | "video" | "untranslated";

export default function PostsPage() {
  const confirm = useConfirm();
  const [posts, setPosts] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [now] = useState(() => Date.now());

  const load = useCallback(() => {
    adminApi<{ data: Row[] }>("/posts/admin/all")
      .then((r) => setPosts(r.data))
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  async function remove(p: Row) {
    if (!(await confirm({ title: "Delete this post?", message: `"${p.title}" will be removed from the blog.` }))) return;
    try {
      await adminApi(`/posts/${p.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const shown = (posts ?? []).filter(
    (p) =>
      (filter === "all" ||
        (filter === "published" && p.published) ||
        (filter === "drafts" && !p.published) ||
        (filter === "video" && p.youtubeId) ||
        (filter === "untranslated" && !p.hasNl)) &&
      (!q || `${p.title} ${p.category?.name ?? ""} ${p.author?.name ?? ""} ${p.slug}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>Blog posts</h1>
          <p>Articles on finloa.com/blog and nl.finloa.com/blog. Each post has an English and a Dutch version.</p>
        </div>
        <Link href="/admin/posts/new" className="ad-btn ad-btn--primary">
          + New post
        </Link>
      </div>
      {error && <p className="ad-error">{error}</p>}

      <div className="ad-filters">
        <div className="ad-seg">
          {(["all", "published", "drafts", "video", "untranslated"] as Filter[]).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {{ all: "All", published: "Published", drafts: "Drafts", video: "With video", untranslated: "Needs Dutch" }[f]}
            </button>
          ))}
        </div>
        <input className="ad-input" style={{ maxWidth: 260 }} type="search" placeholder="Search posts" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {!posts ? (
        <p className="ad-hint">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="ad-hint">No posts found.</p>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Title</th>
                <th className="ad-hide-sm">Category</th>
                <th className="ad-hide-sm">Author</th>
                <th>Status</th>
                <th>Languages</th>
                <th className="ad-hide-sm">Publish date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => {
                const scheduled = p.published && new Date(p.publishedAt).getTime() > now;
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {p.coverImage || p.youtubeId ? (
                          <span
                            className="ad-thumb"
                            style={{ width: 72, backgroundImage: `url(${p.coverImage ?? `https://img.youtube.com/vi/${p.youtubeId}/mqdefault.jpg`})` }}
                          />
                        ) : (
                          <span className="ad-thumb" style={{ width: 72, background: "#eef1f8" }} />
                        )}
                        <div>
                          <Link href={`/admin/posts/${p.id}`} className="ad-title-cell">
                            {p.title}
                          </Link>
                          <div className="ad-hint">/blog/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="ad-hide-sm">{p.category?.name ?? <span className="ad-hint">—</span>}</td>
                    <td className="ad-hide-sm">{p.author?.name ?? <span className="ad-hint">—</span>}</td>
                    <td>
                      <span className={`ad-pill ad-pill--${p.published && !scheduled ? "published" : "draft"}`}>
                        {!p.published ? "Draft" : scheduled ? "Scheduled" : "Published"}
                      </span>{" "}
                      {p.youtubeId && <span className="ad-pill ad-pill--video">Video</span>}{" "}
                      {p.featured && <span className="ad-pill ad-pill--featured">Featured</span>}
                    </td>
                    <td>
                      <span className="ad-pill ad-pill--published">EN</span>{" "}
                      <span className={`ad-pill ${p.hasNl ? "ad-pill--published" : "ad-pill--nl"}`} title={p.hasNl ? "Dutch version added" : "No Dutch version yet"}>
                        NL{p.hasNl ? "" : " ✕"}
                      </span>
                    </td>
                    <td className="ad-hide-sm ad-hint">{when(p.publishedAt)}</td>
                    <td>
                      <div className="ad-actions">
                        <Link href={`/admin/posts/${p.id}`} className="ad-btn ad-btn--sm">
                          Edit
                        </Link>
                        {p.published && !scheduled && (
                          <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="ad-btn ad-btn--sm">
                            View ↗
                          </a>
                        )}
                        <button type="button" className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => remove(p)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
