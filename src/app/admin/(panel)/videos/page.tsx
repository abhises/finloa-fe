"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { adminApi, parseYoutubeId, type AdminError } from "@/lib/admin-client";
import type { VideoKind } from "@/lib/api";

type Video = {
  id: string;
  niche: string;
  kind: VideoKind;
  youtubeId: string;
  title: string | null;
  sortOrder: number;
  active: boolean;
};

/** Where a video appears on the site. Keep in sync with NICHES in finloa-be/src/routes/videos.ts */
const PLACEMENTS = [
  { value: "showreel", label: "Homepage showreel (top of finloa.com)" },
  { value: "software-learning", label: "Our work · Software & Learning" },
  { value: "property-home", label: "Our work · Property & Home" },
  { value: "health-wellness", label: "Our work · Health & Wellness" },
  { value: "professional-services", label: "Our work · Professional Services" },
  { value: "retail-ecommerce", label: "Our work · Retail & E-commerce" },
  { value: "hospitality-lifestyle", label: "Our work · Hospitality & Lifestyle" },
];
const placementLabel = (v: string) => PLACEMENTS.find((p) => p.value === v)?.label ?? v;

type Draft = { youtube: string; niche: string; kind: VideoKind; title: string; sortOrder: string };
const EMPTY: Draft = { youtube: "", niche: "showreel", kind: "LONG", title: "", sortOrder: "0" };

function VideoForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: Draft;
  submitLabel: string;
  onSubmit: (d: Draft) => Promise<void>;
  onCancel?: () => void;
}) {
  const [d, setD] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const id = parseYoutubeId(d.youtube);
  const set = (patch: Partial<Draft>) => setD((x) => ({ ...x, ...patch }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!id) return setError("Paste a YouTube link (youtube.com/watch?v=…, youtu.be/…, /shorts/…) or the 11-character video ID.");
    setBusy(true);
    setError("");
    try {
      await onSubmit(d);
      if (!onCancel) setD({ ...EMPTY, niche: d.niche, kind: d.kind });
    } catch (err) {
      setError((err as AdminError).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="ad-form" onSubmit={submit}>
      <div className="ad-row" style={{ gridTemplateColumns: "minmax(0,1fr) 220px", alignItems: "start" }}>
        <div className="ad-form">
          <label className="ad-field">
            <span>YouTube link</span>
            <input
              value={d.youtube}
              onChange={(e) => set({ youtube: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=… or https://youtu.be/…"
              aria-invalid={!!d.youtube && !id}
              required
            />
            {d.youtube && !id && <span className="ad-field__err">That doesn&apos;t look like a YouTube link.</span>}
          </label>
          <div className="ad-row">
            <label className="ad-field">
              <span>Show it in</span>
              <select value={d.niche} onChange={(e) => set({ niche: e.target.value, ...(e.target.value === "showreel" && { kind: "LONG" }) })}>
                {PLACEMENTS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="ad-field">
              <span>Format</span>
              <select value={d.kind} onChange={(e) => set({ kind: e.target.value as VideoKind })} disabled={d.niche === "showreel"}>
                <option value="LONG">Long-form (16:9)</option>
                <option value="SHORT">Short (9:16)</option>
              </select>
            </label>
          </div>
          <div className="ad-row">
            <label className="ad-field">
              <span>Title (optional)</span>
              <input value={d.title} onChange={(e) => set({ title: e.target.value })} maxLength={160} placeholder="Shown next to the thumbnail" />
            </label>
            <label className="ad-field">
              <span>Order</span>
              <input type="number" min={0} max={1000} value={d.sortOrder} onChange={(e) => set({ sortOrder: e.target.value })} />
              <small>Lower numbers show first.</small>
            </label>
          </div>
        </div>
        <div className="ad-video-preview">
          {id ? (
            <iframe src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`} title="Preview" allow="encrypted-media; picture-in-picture" allowFullScreen />
          ) : (
            "PREVIEW"
          )}
        </div>
      </div>
      {error && <p className="ad-error">{error}</p>}
      <div className="ad-savebar">
        <button className="ad-btn ad-btn--primary" disabled={busy}>
          {busy ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="ad-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function VideosPage() {
  const confirm = useConfirm();
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Video | null>(null);
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    adminApi<{ data: Video[] }>("/videos/all")
      .then((r) => setVideos(r.data))
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const toBody = (d: Draft) => ({
    youtube: d.youtube,
    niche: d.niche,
    kind: d.niche === "showreel" ? "LONG" : d.kind,
    title: d.title.trim() || undefined,
    sortOrder: Number(d.sortOrder) || 0,
  });

  async function create(d: Draft) {
    await adminApi("/videos", { method: "POST", json: toBody(d) });
    setNotice("Video added. It's live on the site now.");
    load();
  }

  async function update(v: Video, d: Draft) {
    await adminApi(`/videos/${v.id}`, { method: "PATCH", json: toBody(d) });
    setEditing(null);
    setNotice("Video updated.");
    load();
  }

  async function toggle(v: Video) {
    try {
      await adminApi(`/videos/${v.id}`, { method: "PATCH", json: { active: !v.active } });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function remove(v: Video) {
    if (!(await confirm({ title: "Delete this video?", message: v.title ?? `YouTube ${v.youtubeId}` }))) return;
    try {
      await adminApi(`/videos/${v.id}`, { method: "DELETE" });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const shown = (videos ?? []).filter((v) => filter === "all" || v.niche === filter);

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>YouTube videos</h1>
          <p>Embed videos in the homepage showreel and in &ldquo;Our work&rdquo; on the Video Creation page.</p>
        </div>
      </div>
      {notice && <p className="ad-ok">{notice}</p>}
      {error && <p className="ad-error">{error}</p>}

      <section className="ad-panel" style={{ marginBottom: 20 }}>
        <h2>Add a video</h2>
        <VideoForm initial={EMPTY} submitLabel="Add video" onSubmit={create} />
        <p className="ad-hint">
          The homepage shows the first active showreel video. To add a video to a blog post, open the post and paste
          the link there.
        </p>
      </section>

      <div className="ad-filters">
        <label className="ad-field" style={{ flexDirection: "row", alignItems: "center" }}>
          <span>Show</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: "auto" }}>
            <option value="all">All placements</option>
            {PLACEMENTS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!videos ? (
        <p className="ad-hint">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="ad-hint">No videos here yet.</p>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Video</th>
                <th>Placement</th>
                <th className="ad-hide-sm">Format</th>
                <th className="ad-hide-sm">Order</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <a
                        href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`ad-thumb${v.kind === "SHORT" ? " ad-thumb--short" : ""}`}
                        style={{ backgroundImage: `url(https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg)` }}
                        aria-label="Open on YouTube"
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{v.title ?? "Untitled"}</div>
                        <div className="ad-hint">{v.youtubeId}</div>
                      </div>
                    </div>
                  </td>
                  <td>{placementLabel(v.niche)}</td>
                  <td className="ad-hide-sm">{v.kind === "LONG" ? "Long-form" : "Short"}</td>
                  <td className="ad-hide-sm">{v.sortOrder}</td>
                  <td>
                    <span className={`ad-pill ad-pill--${v.active ? "published" : "draft"}`}>{v.active ? "Live" : "Hidden"}</span>
                  </td>
                  <td>
                    <div className="ad-actions">
                      <button type="button" className="ad-btn ad-btn--sm" onClick={() => setEditing(v)}>
                        Edit
                      </button>
                      <button type="button" className="ad-btn ad-btn--sm" onClick={() => toggle(v)}>
                        {v.active ? "Hide" : "Show"}
                      </button>
                      <button type="button" className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => remove(v)}>
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

      {editing && (
        <div className="ad-modal" onClick={() => setEditing(null)}>
          <div className="ad-modal__box" style={{ width: "min(100%, 860px)" }} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2>Edit video</h2>
            <VideoForm
              initial={{
                youtube: editing.youtubeId,
                niche: editing.niche,
                kind: editing.kind,
                title: editing.title ?? "",
                sortOrder: String(editing.sortOrder),
              }}
              submitLabel="Save changes"
              onSubmit={(d) => update(editing, d)}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
