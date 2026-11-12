"use client";

import { useParams } from "next/navigation";
import { SectionTypeEditor } from "@/components/admin/section-type-editor";

export default function EditSectionTypePage() {
  const { key } = useParams<{ key: string }>();
  return <SectionTypeEditor key={key} typeKey={key} />;
}
