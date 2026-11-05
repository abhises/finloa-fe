"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PostEditor, type AdminPost } from "@/components/admin/post-editor";
import { adminApi } from "@/lib/admin-client";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const created = useSearchParams().get("created");
  const [post, setPost] = useState<AdminPost | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi<{ data: AdminPost }>(`/posts/admin/${encodeURIComponent(id)}`)
      .then((r) => setPost(r.data))
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <p className="ad-error">{error}</p>;
  if (!post) return <p className="ad-hint">Loading…</p>;
  return (
    <>
      {created && <p className="ad-ok">Post created{post.published ? " and published" : ""}.</p>}
      <PostEditor key={post.id} post={post} />
    </>
  );
}
