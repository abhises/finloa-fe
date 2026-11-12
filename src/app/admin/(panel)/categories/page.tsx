"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { adminApi, type AdminError } from "@/lib/admin-client";

type Category = { id: string; slug: string; name: string; nameNl: string; intro: string; introNl: string; sortOrder: number; _count: { posts: number } };
type Edit = Omit<Category, "_count">;

const blank: Edit = { id: "", slug: "", name: "", nameNl: "", intro: "", introNl: "", sortOrder: 0 };

export default function CategoriesPage() {
  const confirm = useConfirm();
  const [rows, setRows] = useState<Category[] | null>(null);
  const [edit, setEdit] = useState<Edit | null>(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  const load = useCallback(
    () =>
      adminApi<{ data: Category[] }>("/categories/admin")
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
      await adminApi(id ? `/categories/${id}` : "/categories", { method: id ? "PATCH" : "POST", json: body });
      setEdit(null);
      load();
    } catch (err) {
      setErrors((err as AdminError).details ?? {});
      setError((err as Error).message);
    }
  }

  async function remove(c: Category) {
    if (!(await confirm({ title: `Delete "${c.name}"?`, message: `Its ${c._count.posts} posts will be left without a category.` }))) return;
    await adminApi(`/categories/${c.id}`, { method: "DELETE" }).catch((e: Error) => setError(e.message));
    load();
  }

  const f = (k: keyof Edit) => ({
    value: String(edit![k]),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEdit({ ...edit!, [k]: e.target.value }),
  });

  return (
    <>
      <div className="ad-head">
        <div>
          <h1>Categories</h1>
          <p>Blog topics. Shown on post cards, in the topic filter on /blog and in each post header.</p>
        </div>
        <button className="ad-btn ad-btn--primary" onClick={() => setEdit({ ...blank, sortOrder: rows?.length ?? 0 })}>
          + New category
        </button>
      </div>
      {error && <p className="ad-error">{error}</p>}

      {edit && (
        <form className="ad-card ad-form" style={{ maxWidth: 820 }} onSubmit={save}>
          <h2 style={{ margin: 0, fontSize: 17 }}>{edit.id ? `Edit "${edit.name}"` : "New category"}</h2>
          <div className="ad-row">
            <label className="ad-field">
              <span>Name (English)</span>
              <input required maxLength={80} {...f("name")} aria-invalid={!!errors.name} />
            </label>
            <label className="ad-field">
              <span>Name (Nederlands)</span>
              <input maxLength={80} placeholder={edit.name || "Same as English"} {...f("nameNl")} />
            </label>
          </div>
          <div className="ad-row">
            <label className="ad-field">
              <span>Intro (English)</span>
              <textarea rows={3} {...f("intro")} />
            </label>
            <label className="ad-field">
              <span>Intro (Nederlands)</span>
              <textarea rows={3} {...f("introNl")} />
            </label>
          </div>
          <div className="ad-row">
            <label className="ad-field">
              <span>Slug</span>
              <input placeholder="from the English name" {...f("slug")} aria-invalid={!!errors.slug} />
              {errors.slug && <span className="ad-field__err">{errors.slug[0]}</span>}
              <small>Used by the Automation API (&quot;categorySlug&quot;).</small>
            </label>
            <label className="ad-field">
              <span>Sort order</span>
              <input type="number" value={edit.sortOrder} onChange={(e) => setEdit({ ...edit, sortOrder: Number(e.target.value) })} />
            </label>
          </div>
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
                <th className="ad-hide-sm">#</th>
                <th>Name</th>
                <th className="ad-hide-sm">Nederlands</th>
                <th className="ad-hide-sm">Slug</th>
                <th>Posts</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td className="ad-hide-sm ad-hint">{c.sortOrder}</td>
                  <td>
                    <strong>{c.name}</strong>
                    {c.intro && <div className="ad-hint">{c.intro}</div>}
                  </td>
                  <td className="ad-hide-sm">{c.nameNl || <span className="ad-pill ad-pill--nl">Not translated</span>}</td>
                  <td className="ad-hide-sm ad-hint">{c.slug}</td>
                  <td>{c._count.posts}</td>
                  <td>
                    <div className="ad-actions">
                      <button className="ad-btn ad-btn--sm" onClick={() => setEdit({ id: c.id, slug: c.slug, name: c.name, nameNl: c.nameNl, intro: c.intro, introNl: c.introNl, sortOrder: c.sortOrder })}>
                        Edit
                      </button>
                      <button className="ad-btn ad-btn--sm ad-btn--danger" onClick={() => remove(c)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="ad-hint">
                    No categories yet.
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
