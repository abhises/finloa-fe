"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi, when } from "@/lib/admin-client";

type Counts = {
  posts: number;
  drafts: number;
  untranslated: number;
  videos: number;
  newLeads: number;
  leads: number;
  subscribers: number;
  media: number;
  categories: number;
  authors: number;
  texts: number;
};
type Stats = {
  counts: Counts;
  recentPosts: { id: string; title: string; slug: string; published: boolean; youtubeId: string | null; hasNl: boolean; updatedAt: string }[];
  recentLeads: { id: string; firstName: string; lastName: string; email: string; source: string; status: string; createdAt: string }[];
  recentSubscribers: { id: string; email: string; source: string; createdAt: string }[];
  storage: "local" | "s3";
};

const GLANCE: [keyof Counts, string, string][] = [
  ["posts", "Published posts", "/admin/posts"],
  ["drafts", "Drafts", "/admin/posts"],
  ["untranslated", "Posts without Dutch", "/admin/posts"],
  ["texts", "Edited page texts", "/admin/pages"],
  ["media", "Media files", "/admin/media"],
  ["categories", "Categories", "/admin/categories"],
  ["authors", "Authors", "/admin/authors"],
  ["videos", "YouTube videos", "/admin/videos"],
  ["newLeads", "New leads", "/admin/leads"],
  ["leads", "All leads", "/admin/leads"],
  ["subscribers", "Subscribers", "/admin/subscribers"],
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi<{ data: Stats }>("/stats")
      .then((r) => setStats(r.data))
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>Dashboard</h1>
          <p>Manage the pages, blog, media, videos and enquiries for finloa.com and nl.finloa.com.</p>
        </div>
      </div>
      {error && <p className="ad-error">{error}</p>}
      <div className="ad-dash">
        <section className="ad-panel">
          <h2>At a glance</h2>
          {!stats ? (
            <p className="ad-hint">Loading…</p>
          ) : (
            <ul className="ad-glance">
              {GLANCE.map(([key, label, href]) => (
                <li key={key}>
                  <Link href={href}>
                    <b>{stats.counts[key]}</b> {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {stats && <p className="ad-hint">Uploads are stored {stats.storage === "s3" ? "in the S3 bucket" : "on the server's disk"}.</p>}
        </section>

        <section className="ad-panel">
          <h2>Create</h2>
          <div className="ad-quick">
            <Link className="ad-btn ad-btn--primary" href="/admin/posts/new">
              + New blog post
            </Link>
            <Link className="ad-btn" href="/admin/pages">
              Edit page texts (EN / NL)
            </Link>
            <Link className="ad-btn" href="/admin/media">
              Upload media
            </Link>
            <Link className="ad-btn" href="/admin/categories">
              + Category
            </Link>
            <Link className="ad-btn" href="/admin/authors">
              + Author
            </Link>
            <Link className="ad-btn" href="/admin/videos">
              + Add YouTube video
            </Link>
          </div>
          <p className="ad-hint">
            Blog posts can have a YouTube video at the top. Videos added under YouTube videos appear in the homepage
            showreel and in &ldquo;Our work&rdquo; on the Video Creation page.
          </p>
        </section>

        <section className="ad-panel">
          <h2>Recently updated posts</h2>
          {!stats ? (
            <p className="ad-hint">Loading…</p>
          ) : stats.recentPosts.length === 0 ? (
            <p className="ad-hint">
              Nothing yet. <Link href="/admin/posts/new">Write your first post</Link>.
            </p>
          ) : (
            <ul className="ad-activity">
              {stats.recentPosts.map((p) => (
                <li key={p.id}>
                  <span className="ad-hint">{when(p.updatedAt)}</span>
                  <span>
                    <Link href={`/admin/posts/${p.id}`}>{p.title}</Link>{" "}
                    {!p.published && <span className="ad-pill ad-pill--draft">Draft</span>}{" "}
                    {p.youtubeId && <span className="ad-pill ad-pill--video">Video</span>}{" "}
                    {!p.hasNl && <span className="ad-pill ad-pill--nl">No NL</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/posts" className="ad-more">
            All posts →
          </Link>
        </section>

        <section className="ad-panel">
          <h2>Latest leads</h2>
          {!stats ? (
            <p className="ad-hint">Loading…</p>
          ) : stats.recentLeads.length === 0 ? (
            <p className="ad-hint">No enquiries yet.</p>
          ) : (
            <ul className="ad-activity">
              {stats.recentLeads.map((l) => (
                <li key={l.id}>
                  <span className="ad-hint">{when(l.createdAt)}</span>
                  <span>
                    {l.firstName} {l.lastName} · <span className="ad-hint">{l.email}</span>{" "}
                    <span className={`ad-pill ad-pill--${l.status.toLowerCase()}`}>{l.status}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/leads" className="ad-more">
            All leads →
          </Link>
        </section>

        <section className="ad-panel">
          <h2>New subscribers</h2>
          {!stats ? (
            <p className="ad-hint">Loading…</p>
          ) : stats.recentSubscribers.length === 0 ? (
            <p className="ad-hint">No subscribers yet.</p>
          ) : (
            <ul className="ad-activity">
              {stats.recentSubscribers.map((s) => (
                <li key={s.id}>
                  <span className="ad-hint">{when(s.createdAt)}</span>
                  <span>
                    {s.email} <span className="ad-hint">· {s.source}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/subscribers" className="ad-more">
            All subscribers →
          </Link>
        </section>
      </div>
    </>
  );
}
