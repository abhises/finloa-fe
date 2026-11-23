import { getLocale } from "@/i18n/server";
import { getDesignExtras } from "@/lib/data";
import { layoutCss, partClass, partInnerClass } from "@/lib/design-layout";
import { safeCss } from "@/lib/post-html";

/**
 * What Admin → Pages adds to a designed page: hidden / reordered blocks, the added sections (each placed after a
 * block), its CSS and its JSON-LD. Everything rendered here is marked `.fl-x`, so the blocks can be counted.
 */
export async function DesignExtras({ page }: { page: string }) {
  const extras = await getDesignExtras(page, await getLocale());
  let jsonLd: unknown = null;
  try {
    jsonLd = extras.jsonLd ? JSON.parse(extras.jsonLd) : null;
  } catch {}
  return (
    <>
      <style className="fl-x" id="fl-design-css" dangerouslySetInnerHTML={{ __html: safeCss(extras.css) }} />
      <style className="fl-x" id="fl-design-layout" dangerouslySetInnerHTML={{ __html: layoutCss(extras.layout, extras.parts) }} />
      {jsonLd !== null && (
        <script className="fl-x" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
      {extras.parts.map((p) => (
        <section key={p.id} className={partClass} data-part={p.id}>
          <div className={partInnerClass(extras.sections)} dangerouslySetInnerHTML={{ __html: p.html }} />
        </section>
      ))}
    </>
  );
}
