"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { adminApi } from "@/lib/admin-client";

export type Media = {
  id: string;
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt: string;
  driver: "local" | "s3";
  createdAt: string;
};

type Page = { data: Media[]; page: number; pageSize: number; total: number; storage: "local" | "s3" };

/** Upload (drag & drop, file picker or remote URL) + grid of stored files. With `onPick` it works as a picker. */
export function MediaLibrary({ onPick, accept = "image/*,video/mp4,video/webm,application/pdf" }: { onPick?: (m: Media) => void; accept?: string }) {
  const confirm = useConfirm();
  const [res, setRes] = useState<Page | null>(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");
  const [remote, setRemote] = useState("");
  const [copied, setCopied] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const pageSize = onPick ? 24 : 48;

  const load = useCallback(
    () =>
      adminApi<Page>(`/media?page=${page}&pageSize=${pageSize}${q ? `&q=${encodeURIComponent(q)}` : ""}`)
        .then(setRes)
        .catch((e: Error) => setError(e.message)),
    [page, pageSize, q],
  );
  useEffect(() => {
    const t = setTimeout(load, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  /** Newest first: after an upload show page 1 */
  const reload = () => (page > 1 ? setPage(1) : load());

  async function upload(files: FileList | File[]) {
    setBusy(true);
    setError("");
    try {
      let last: Media | null = null;
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        last = (await adminApi<{ data: Media }>("/media", { method: "POST", body: fd })).data;
      }
      // In the picker, a single upload is picked straight away
      if (onPick && last && files.length === 1) return onPick(last);
      await reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function importUrl() {
    if (!remote) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await adminApi<{ data: Media }>("/media/import", { method: "POST", json: { url: remote } });
      setRemote("");
      if (onPick) return onPick(data);
      await reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(m: Media) {
    if (!(await confirm({ title: `Delete ${m.filename}?`, message: "Pages and posts that use this file will show a broken image." }))) return;
    try {
      await adminApi(`/media/${m.id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function saveAlt(m: Media, alt: string) {
    if (alt === m.alt) return;
    await adminApi(`/media/${m.id}`, { method: "PATCH", json: { alt } }).catch((e: Error) => setError(e.message));
  }

  const pages = res ? Math.max(1, Math.ceil(res.total / res.pageSize)) : 1;

  return (
    <div>
      <div
        className={`ad-drop${over ? " ad-drop--over" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          upload(e.dataTransfer.files);
        }}
      >
        <strong>{busy ? "Uploading…" : "Drop files here or click to upload"}</strong>
        <span className="ad-hint">
          PNG, JPG, WebP, AVIF, GIF, SVG, MP4 or PDF up to 15 MB.{" "}
          {res && (res.storage === "s3" ? "Stored in the S3 bucket." : "Stored on the server's disk.")}
        </span>
        <input ref={input} type="file" multiple accept={accept} hidden onChange={(e) => e.target.files && upload(e.target.files)} />
      </div>
      <div className="ad-filters">
        <input className="ad-input" style={{ flex: "2 1 260px" }} placeholder="…or paste an image URL to import it" value={remote} onChange={(e) => setRemote(e.target.value)} />
        <button type="button" className="ad-btn" disabled={busy || !remote} onClick={importUrl}>
          Import
        </button>
        <input
          className="ad-input"
          style={{ flex: "1 1 180px" }}
          type="search"
          placeholder="Search files"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
      </div>
      {error && <p className="ad-error">{error}</p>}
      {!res ? (
        <p className="ad-hint">Loading…</p>
      ) : res.data.length === 0 ? (
        <p className="ad-hint">{q ? "No files match." : "No files yet. Upload the first one above."}</p>
      ) : (
        <div className="ad-media">
          {res.data.map((m) => (
            <figure key={m.id}>
              <div className="ad-media__img">
                {m.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.alt} loading="lazy" />
                ) : (
                  <span>{m.mimeType}</span>
                )}
              </div>
              <figcaption>
                <span title={m.filename}>
                  {m.filename} · {Math.max(1, Math.round(m.size / 1024))} KB
                </span>
                <input defaultValue={m.alt} placeholder="Alt text" aria-label={`Alt text for ${m.filename}`} onBlur={(e) => saveAlt(m, e.target.value)} />
                <div className="ad-media__actions">
                  {onPick && (
                    <button type="button" className="ad-btn ad-btn--sm ad-btn--primary" onClick={() => onPick(m)}>
                      Use
                    </button>
                  )}
                  <button
                    type="button"
                    className="ad-btn ad-btn--sm"
                    onClick={() => {
                      navigator.clipboard.writeText(m.url);
                      setCopied(m.id);
                    }}
                  >
                    {copied === m.id ? "Copied" : "Copy URL"}
                  </button>
                  {!onPick && (
                    <button type="button" className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => remove(m)}>
                      Delete
                    </button>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {res && pages > 1 && (
        <div className="ad-pager">
          <button type="button" className="ad-btn ad-btn--sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            ← Newer
          </button>
          <span className="ad-hint">
            Page {page} of {pages} · {res.total} files
          </span>
          <button type="button" className="ad-btn ad-btn--sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>
            Older →
          </button>
        </div>
      )}
    </div>
  );
}

export function MediaPicker({ onPick, onClose, title = "Choose an image" }: { onPick: (m: Media) => void; onClose: () => void; title?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="ad-modal" onClick={onClose}>
      <div className="ad-modal__box ad-modal__box--wide" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="ad-head" style={{ marginBottom: 0 }}>
          <h2>{title}</h2>
          <button type="button" className="ad-btn" onClick={onClose}>
            Close
          </button>
        </div>
        <MediaLibrary onPick={onPick} accept="image/*" />
      </div>
    </div>
  );
}

/** URL input with "Choose from Media", a preview and Remove. */
export function ImageField({
  label,
  value,
  onChange,
  hint,
  round,
  error,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  round?: boolean;
  error?: string;
}) {
  const [picking, setPicking] = useState(false);
  return (
    <div className="ad-field ad-image">
      <span>{label}</span>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className={`ad-image__preview${round ? " ad-image__preview--round" : ""}`} />
      )}
      <div className="ad-image__row">
        <input className="ad-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or choose from Media" aria-invalid={!!error} />
      </div>
      <div className="ad-image__row">
        <button type="button" className="ad-btn ad-btn--sm" onClick={() => setPicking(true)}>
          Choose from Media
        </button>
        {value && (
          <button type="button" className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => onChange("")}>
            Remove
          </button>
        )}
      </div>
      {error && <span className="ad-field__err">{error}</span>}
      {hint && <small>{hint}</small>}
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onPick={(m) => {
            onChange(m.url);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}
