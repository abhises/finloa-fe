"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { ImageField } from "@/components/admin/media-library";
import { adminApi, type AdminError } from "@/lib/admin-client";

type Author = {
  id: string;
  slug: string;
  name: string;
  role: string;
  roleNl: string;
  bio: string;
  bioNl: string;
  email: string | null;
  avatarUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  _count: { posts: number };
};
type Edit = { [K in Exclude<keyof Author, "_count" | "sortOrder">]: string } & { sortOrder: number };

const blank: Edit = { id: "", slug: "", name: "", role: "", roleNl: "", bio: "", bioNl: "", email: "", avatarUrl: "", linkedinUrl: "", youtubeUrl: "", websiteUrl: "", sortOrder: 0 };

const toEdit = (a: Author): Edit => ({
  id: a.id,
  slug: a.slug,
  name: a.name,
  role: a.role,
  roleNl: a.roleNl,
  bio: a.bio,
  bioNl: a.bioNl,
  email: a.email ?? "",
  avatarUrl: a.avatarUrl ?? "",
  linkedinUrl: a.linkedinUrl ?? "",
  youtubeUrl: a.youtubeUrl ?? "",
  websiteUrl: a.websiteUrl ?? "",
  sortOrder: a.sortOrder,
});

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function AuthorsPage() {
  const confirm = useConfirm();
  const [rows, setRows] = useState<Author[] | null>(null);
  const [edit, setEdit] = useState<Edit | null>(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  const load = useCallback(
    () =>
      adminApi<{ data: Author[] }>("/authors")
        .then((r) => setRows(r.data))
        .catch((e: Error) => setError(e.message)),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setError("");
    setErrors({});
    const { id, ...body } = edit;
    try {
      await adminApi(id ? `/authors/${id}` : "/authors", { method: id ? "PATCH" : "POST", json: body });
      setEdit(null);
      load();
    } catch (err) {
      setErrors((err as AdminError).details ?? {});
      setError((err as Error).message);
    }
  }

  async function remove(a: Author) {
    if (!(await confirm({ title: `Delete author "${a.name}"?`, message: `Their ${a._count.posts} posts will be left without an author.` }))) return;
    await adminApi(`/authors/${a.id}`, { method: "DELETE" }).catch((e: Error) => setError(e.message));
    load();
  }

  const f = (k: keyof Edit) => ({
    value: String(edit![k]),
    "aria-invalid": !!errors[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEdit({ ...edit!, [k]: e.target.value }),
  });
  const err = (k: string) => errors[k]?.[0] && <span className="ad-field__err">{errors[k]![0]}</span>;

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>Authors</h1>
          <p>Shown in the header and author box of each blog post, and in the article&apos;s structured data.</p>
        </div>
        <button className="ad-btn ad-btn--primary" onClick={() => setEdit({ ...blank, sortOrder: rows?.length ?? 0 })}>
          + New author
        </button>
      </div>
      {error && <p className="ad-error">{error}</p>}

      {edit && (
        <form className="ad-card ad-form" style={{ maxWidth: 860 }} onSubmit={save}>
          <h2 style={{ margin: 0, fontSize: 17 }}>{edit.id ? `Edit ${edit.name}` : "New author"}</h2>
          <div className="ad-row">
            <label className="ad-field">
              <span>Name</span>
              <input required maxLength={80} {...f("name")} />
              {err("name")}
            </label>
            <label className="ad-field">
              <span>Slug</span>
              <input placeholder="from name" {...f("slug")} />
              {err("slug")}
              <small>Used by the Automation API (&quot;authorSlug&quot;).</small>
            </label>
          </div>
          <div className="ad-row">
            <label className="ad-field">
              <span>Role (English)</span>
              <input maxLength={120} placeholder="Head of Growth at Finloa" {...f("role")} />
            </label>
            <label className="ad-field">
              <span>Role (Nederlands)</span>
              <input maxLength={120} placeholder="Head of Growth bij Finloa" {...f("roleNl")} />
            </label>
          </div>
          <div className="ad-row">
            <label className="ad-field">
              <span>Bio (English)</span>
              <textarea rows={4} maxLength={2000} {...f("bio")} />
            </label>
            <label className="ad-field">
              <span>Bio (Nederlands)</span>
              <textarea rows={4} maxLength={2000} {...f("bioNl")} />
            </label>
          </div>
          <div className="ad-row" style={{ alignItems: "start" }}>
            <ImageField label="Photo" round value={edit.avatarUrl} onChange={(url) => setEdit({ ...edit, avatarUrl: url })} error={errors.avatarUrl?.[0]} hint="Square photos look best. Without a photo the initials are shown." />
            <label className="ad-field">
              <span>Email</span>
              <input type="email" {...f("email")} />
              {err("email")}
              <small>Not shown on the site.</small>
            </label>
          </div>
          <div className="ad-row">
            <label className="ad-field">
              <span>LinkedIn</span>
              <input type="url" placeholder="https://www.linkedin.com/in/…" {...f("linkedinUrl")} />
              {err("linkedinUrl")}
            </label>
            <label className="ad-field">
              <span>YouTube</span>
              <input type="url" placeholder="https://www.youtube.com/@…" {...f("youtubeUrl")} />
              {err("youtubeUrl")}
            </label>
            <label className="ad-field">
              <span>Website</span>
              <input type="url" placeholder="https://…" {...f("websiteUrl")} />
              {err("websiteUrl")}
            </label>
          </div>
          <label className="ad-field" style={{ maxWidth: 200 }}>
            <span>Sort order</span>
            <input type="number" value={edit.sortOrder} onChange={(e) => setEdit({ ...edit, sortOrder: Number(e.target.value) })} />
          </label>
          <div className="ad-savebar">
            <button className="ad-btn ad-btn--primary">Save</button>
            <button type="button" className="ad-btn" onClick={() => setEdit(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {!rows ? (
        <p className="ad-hint">Loading…</p>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th />
                <th>Name</th>
                <th className="ad-hide-sm">Role</th>
                <th>Posts</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td style={{ width: 56 }}>
                    {a.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.avatarUrl} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", display: "block" }} />
                    ) : (
                      <span style={{ width: 40, height: 40, borderRadius: "50%", background: "#dce3f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                        {initials(a.name)}
                      </span>
                    )}
                  </td>
                  <td>
                    <strong>{a.name}</strong>
                    <div className="ad-hint">{a.slug}</div>
                  </td>
                  <td className="ad-hide-sm">
                    {a.role}
                    {a.role && !a.roleNl && (
                      <>
                        {" "}
                        <span className="ad-pill ad-pill--nl">NL missing</span>
                      </>
                    )}
                  </td>
                  <td>{a._count.posts}</td>
                  <td>
                    <div className="ad-actions">
                      <button className="ad-btn ad-btn--sm" onClick={() => setEdit(toEdit(a))}>
                        Edit
                      </button>
                      <button className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => remove(a)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="ad-hint">
                    No authors yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
