/**
 * The body of a content page (Terms, Privacy, pages from Admin → Pages): label, title, "Last updated" and the
 * page HTML. Used by the site and by the admin preview, so both look the same. The HTML uses plain
 * h2/h3/p/ul/a, styled here.
 */
export function ContentArticle({
  eyebrow,
  title,
  updated,
  html,
  css,
  sections = false,
}: {
  eyebrow: string;
  title: string;
  /** e.g. "Last updated 2 November 2026"; empty hides it */
  updated: string;
  html: string;
  css?: string;
  /** The body is built from sections: give it the blog article styles the section types are made for */
  sections?: boolean;
}) {
  return (
    <section className="content-page px-6 pt-[clamp(28px,5vw,64px)] pb-24">
      {css && <style dangerouslySetInnerHTML={{ __html: css.replace(/<\/style/gi, "<\\/style") }} />}
      <article className="mx-auto flex max-w-[820px] flex-col gap-4 [&_a]:text-brand [&_a:hover]:text-brand-hover [&_h2]:mt-6 [&_h2]:text-[clamp(24px,2.6vw,30px)] [&_h2]:leading-[1.15] [&_h2]:font-bold [&_h2]:tracking-[-0.03em] [&_h3]:mt-2 [&_h3]:text-[19px] [&_h3]:font-semibold [&_h3]:tracking-[-0.02em] [&_li]:pl-1 [&_p]:text-base [&_p]:leading-[1.65] [&_p]:text-pretty [&_p]:text-[oklch(0.35_0.02_265)] [&_strong]:text-ink [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6 [&_ul]:text-base [&_ul]:leading-[1.6] [&_ul]:text-[oklch(0.35_0.02_265)] [&_ul]:marker:text-brand [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-6 [&_ol]:text-base [&_ol]:leading-[1.6] [&_ol]:text-[oklch(0.35_0.02_265)] [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl">
        {eyebrow && <div className="font-mono text-[13px] tracking-[0.08em] text-brand">{eyebrow}</div>}
        <h1 className="text-[clamp(38px,5.4vw,60px)] leading-[1.05] font-bold tracking-[-0.045em]">{title}</h1>
        {updated && <p className="text-[14.5px]! text-subtle!">{updated}</p>}
        <div className="mt-4 h-px bg-line" />
        <div className={`content-page__body flex flex-col gap-4${sections ? " post-body" : ""}`} dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </section>
  );
}
