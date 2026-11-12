import type { TocItem } from "@/lib/markdown";

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

const attr = (attrs: string, name: string) => attrs.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, "i"))?.[1];
const unescape = (s: string) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

/**
 * Article HTML (sections or hand-written): every <h2> gets an id and is listed in the contents, unless it has
 * data-toc="off". data-toc-label="…" renames it in the contents.
 */
export function prepareHtml(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (whole, attrs: string, inner: string) => {
    if (attr(attrs, "data-toc") === "off") return whole;
    const text = unescape(attr(attrs, "data-toc-label") || inner.replace(/<[^>]+>/g, "")).trim();
    if (!text) return whole;
    let id = attr(attrs, "id") || slug(text);
    while (used.has(id)) id += "-2";
    used.add(id);
    toc.push({ id, text });
    return attr(attrs, "id") ? whole : `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });
  return { html: out, toc };
}

/** Custom CSS for a <style> tag: can't close the tag early. */
export const safeCss = (css: string) => css.replace(/<\/style/gi, "<\\/style");
