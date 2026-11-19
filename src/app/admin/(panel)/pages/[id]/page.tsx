"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageEditor, type AdminPage } from "@/components/admin/page-editor";
import { adminApi } from "@/lib/admin-client";

export default function EditPagePage() {
  const { id } = useParams<{ id: string }>();
  const created = useSearchParams().get("created");
  const [page, setPage] = useState<AdminPage | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi<{ data: AdminPage }>(`/pages/admin/${encodeURIComponent(id)}`)
      .then((r) => setPage(r.data))
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <p className="ad-error">{error}</p>;
  if (!page) return <p className="ad-hint">Loading…</p>;
  return (
    <>
      {created && <p className="ad-ok">Page created{page.published ? " and published" : ""}.</p>}
      <PageEditor key={page.id} page={page} />
    </>
  );
}
