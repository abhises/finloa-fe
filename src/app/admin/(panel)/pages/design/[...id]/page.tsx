"use client";

import { redirect, useParams } from "next/navigation";
import { DesignPageEditor } from "@/components/admin/design-page-editor";

/** A designed page (/seo, /videos …) from All pages: its texts in English and Dutch beside the live page */
export default function DesignPageRoute() {
  const { id } = useParams<{ id: string[] }>();
  const sectionId = id.map(decodeURIComponent).join("/");
  if (sectionId === "home") redirect("/admin/front-page");
  return <DesignPageEditor key={sectionId} sectionId={sectionId} />;
}
