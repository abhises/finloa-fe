/** Section system shared by the admin (see finloa-be/src/lib/sections). */
export type FieldType = "text" | "textarea" | "richtext" | "markdown" | "number" | "image" | "link" | "select" | "toggle" | "list" | "post" | "cells" | "code";
export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  default?: unknown;
  options?: string[];
  fields?: FieldDef[];
  itemLabel?: string;
}
export interface SectionType {
  id: string;
  key: string;
  name: string;
  group: string;
  description: string;
  fields: FieldDef[];
  template: string;
  css: string;
  sample: Record<string, unknown>;
  builtIn: boolean;
  version: number;
  updatedAt: string;
  uses?: number;
  previewHtml?: string;
  previewCss?: string;
}
export interface SectionItem {
  id: string;
  type: string;
  data: Record<string, unknown>;
  hidden?: boolean;
  /** Name of the section's heading in the contents list; "" leaves it out */
  tocLabel?: string;
}
export interface SectionsDoc {
  layout: "toc" | "wide";
  items: SectionItem[];
}

/** Short random id for a new section or list item. */
export const newId = () => Math.random().toString(36).slice(2, 10);

/** Starting values for a new section or list item, from the fields' defaults. */
export function emptyData(fields: FieldDef[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.default !== undefined) out[f.key] = f.default;
    else if (f.type === "list") out[f.key] = [];
    else if (f.type === "toggle") out[f.key] = false;
    else out[f.key] = "";
  }
  return out;
}

/** "{{title}} · {{value}}" with an item's values, for list rows in the form. */
export function fillLabel(tpl: string | undefined, item: Record<string, unknown>, fallback: string) {
  if (!tpl) return fallback;
  const s = tpl
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k: string) => {
      const v = item[k];
      return typeof v === "string" || typeof v === "number" ? String(v).replace(/<[^>]+>/g, "") : "";
    })
    .replace(/^[\s·|-]+|[\s·|-]+$/g, "")
    .trim();
  return s ? (s.length > 70 ? s.slice(0, 68) + "…" : s) : fallback;
}

export const FIELD_TYPE_LABEL: Record<FieldType, string> = {
  text: "Text",
  textarea: "Long text",
  richtext: "Rich text",
  markdown: "Markdown",
  number: "Number",
  image: "Image",
  link: "Link",
  select: "Choice",
  toggle: "Toggle",
  list: "List",
  post: "Blog post",
  cells: "Table cells",
  code: "HTML code",
};

/** Order of the section groups in the library and the "Add a section" dialog */
const GROUP_ORDER = ["Text", "Media", "Layout", "Data", "Highlights", "Advanced"];
export const byGroup = (a: string, b: string) => {
  const ia = GROUP_ORDER.indexOf(a), ib = GROUP_ORDER.indexOf(b);
  return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
};
