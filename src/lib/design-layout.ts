/**
 * Hiding and reordering the blocks of a designed page (Admin → Pages). The blocks are the children of <main>;
 * what Admin → Pages adds is marked `.fl-x`, so block "b3" is `main > :nth-child(4 of :not(.fl-x))`. The order is set
 * with CSS (`main` is a flex column), so the coded design and its forms keep working. Used by the site and by the
 * admin preview, so both place things the same way.
 */

export type DesignLayout = { order: string[]; hidden: string[]; htmlAfter?: string };
/** One added section (or the hand-written HTML) and the block it follows */
export type DesignPart = { id: string; after: string | null; html: string };

const block = (id: string) => `main > :nth-child(${Number(id.slice(1)) + 1} of :not(.fl-x))`;
const isBlock = (id: string) => /^b\d{1,3}$/.test(id);

/** Classes of the wrapper around one added section (kept here so Tailwind sees them) */
export const partClass = "fl-x fl-x-sec px-6 py-[clamp(40px,5vw,64px)]";
export const partInnerClass = (sections: boolean) => `mx-auto flex max-w-[820px] flex-col gap-4 ${sections ? "post-body" : "content-page__body"}`;

/** CSS that hides and orders the blocks and places the added sections between them. "" keeps the coded order. */
export function layoutCss(layout: DesignLayout | null, parts: DesignPart[]) {
  if (!layout) return "";
  const order = layout.order.filter(isBlock);
  const pos = new Map(order.map((id, i) => [id, (i + 1) * 100]));
  const end = (order.length + 1) * 100;
  // blocks that are new in the code (not in the saved order) go to the end
  const rules = [`main > :not(.fl-x) { order: ${end}; }`];
  for (const [id, o] of pos) rules.push(`${block(id)} { order: ${o}; }`);
  for (const id of layout.hidden.filter(isBlock)) rules.push(`${block(id)} { display: none !important; }`);
  const count = new Map<number, number>();
  for (const p of parts) {
    const base = p.after === "start" ? 0 : p.after && pos.has(p.after) ? pos.get(p.after)! : end;
    const n = (count.get(base) ?? 0) + 1;
    count.set(base, n);
    rules.push(`main > [data-part="${p.id.replace(/[^\w-]/g, "")}"] { order: ${base + Math.min(n, 99)}; }`);
  }
  return rules.join("\n");
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
/** The added sections as HTML (admin preview; the site renders the same markup with React) */
export const partsHtml = (parts: DesignPart[], sections: boolean) =>
  parts.map((p) => `<section class="${partClass}" data-part="${esc(p.id)}"><div class="${partInnerClass(sections)}">${p.html}</div></section>`).join("");
