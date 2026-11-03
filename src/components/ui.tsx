import Link from "next/link";
import type { ReactNode } from "react";

/* ---------- Buttons ---------- */

export const btn = {
  primary:
    "inline-flex items-center justify-center whitespace-nowrap rounded-[11px] bg-brand px-[22px] py-3.5 text-[15.5px] font-medium text-white transition-colors hover:bg-brand-hover",
  secondary:
    "inline-flex items-center justify-center whitespace-nowrap rounded-[11px] border border-line-2 bg-white px-[22px] py-3.5 text-[15.5px] font-medium text-body-2 transition-colors hover:text-ink",
  dark: "inline-flex items-center justify-center self-start whitespace-nowrap rounded-[10px] bg-ink px-5 py-[13px] text-[15px] font-medium text-white transition-colors hover:bg-ink-2",
  onDarkPrimary:
    "inline-flex items-center justify-center whitespace-nowrap rounded-[11px] bg-brand px-[22px] py-3.5 text-[15.5px] font-medium text-white transition-colors hover:bg-brand-light",
  onDarkOutline:
    "inline-flex items-center justify-center whitespace-nowrap rounded-[11px] border border-[oklch(0.45_0.02_265)] px-[22px] py-3.5 text-[15.5px] font-medium text-white transition-colors hover:border-white",
};

/** Internal routes use next/link, anchors and mailto use <a>. */
export function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

/* ---------- Layout ---------- */

export function Section({
  id,
  dark,
  first,
  className = "",
  innerClassName = "flex flex-col gap-11",
  children,
}: {
  id?: string;
  dark?: boolean;
  /** No top border (section directly after the hero) */
  first?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  const base = dark
    ? "bg-ink px-6 py-[110px] text-white"
    : `px-6 py-[72px] ${first ? "" : "border-t border-line"}`;
  return (
    <section id={id} className={`scroll-mt-20 ${base} ${className}`}>
      <div className={`mx-auto max-w-[1180px] ${innerClassName}`}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children, dark, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return <div className={`eyebrow ${dark ? "text-brand-soft!" : ""} ${className}`}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark,
  className = "max-w-[720px]",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2 className="text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance">{title}</h2>
      {intro && (
        <div className={`text-base leading-[1.55] text-pretty ${dark ? "text-on-ink-muted" : "text-muted"}`}>{intro}</div>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  actions,
}: {
  eyebrow: string;
  title: [string, string];
  intro: string;
  actions?: { href: string; label: string; variant?: "primary" | "secondary" }[];
}) {
  return (
    <section className="bg-grid px-6 pt-[clamp(28px,5vw,64px)] pb-[clamp(56px,8vw,96px)]">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-[26px] text-center">
        <div className="font-mono text-[13px] tracking-[0.08em] text-brand uppercase">{eyebrow}</div>
        <h1 className="flex max-w-[980px] flex-col items-center gap-1 text-[clamp(40px,6.4vw,76px)] leading-[1.04] font-bold tracking-[-0.045em] text-balance">
          <span>{title[0]}</span>
          <span className="text-brand">{title[1]}</span>
        </h1>
        <p className="max-w-[720px] text-lg leading-[1.55] text-balance text-muted">{intro}</p>
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {actions.map((a) => (
              <SmartLink key={a.label} href={a.href} className={a.variant === "secondary" ? btn.secondary : btn.primary}>
                {a.label}
              </SmartLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Content blocks ---------- */

export type NumberedItem = { title: string; body: string; items?: string[]; href?: string };

export function Check({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className="flex gap-2.5 text-[14.5px] leading-[1.45]">
      <span className={dark ? "text-brand-pale" : "text-brand"} aria-hidden>
        ✓
      </span>
      <span>{children}</span>
    </span>
  );
}

const num = (i: number) => String(i + 1).padStart(2, "0");

/** White cards with a mono number, title, body and optional checklist. */
export function NumberedCards({
  items,
  min = 260,
  titleSize = "text-[20px]",
}: {
  items: NumberedItem[];
  min?: number;
  titleSize?: string;
}) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${min}px),1fr))` }}
    >
      {items.map((it, i) => (
        <div key={it.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-7">
          <span className="font-mono text-[13px] text-subtle">{num(i)}</span>
          <h3 className={`${titleSize} font-semibold tracking-[-0.02em]`}>{it.title}</h3>
          <p className="text-[15px] leading-[1.55] text-muted">{it.body}</p>
          {it.items && (
            <div className="flex flex-col gap-[9px] pt-1">
              {it.items.map((x) => (
                <Check key={x}>{x}</Check>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/** Dark cards (on a dark section), optionally as links. */
export function DarkCards({ items, min = 300 }: { items: NumberedItem[]; min?: number }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${min}px),1fr))` }}>
      {items.map((it, i) => {
        const inner = (
          <>
            <span className="font-mono text-[13px] text-brand-soft">{num(i)}</span>
            <h3 className="text-[17px] font-semibold">{it.title}</h3>
            <p className="text-[14.5px] leading-normal text-[#A3ABBF]">{it.body}</p>
            {it.items && (
              <div className="flex flex-col gap-2 pt-1.5 text-[oklch(0.88_0.01_265)]">
                {it.items.map((x) => (
                  <Check key={x} dark>
                    {x}
                  </Check>
                ))}
              </div>
            )}
            {it.href && <span className="mt-1 text-[14.5px] font-medium text-brand-pale">Learn more →</span>}
          </>
        );
        const cls =
          "flex flex-col gap-2.5 rounded-2xl border border-ink-line-2 bg-ink p-[30px] text-white transition-colors";
        return it.href ? (
          <SmartLink key={it.title} href={it.href} className={`${cls} hover:border-brand`}>
            {inner}
          </SmartLink>
        ) : (
          <div key={it.title} className={cls}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/** Dark grid of steps separated by 1px lines. */
export function DarkStepGrid({ items }: { items: NumberedItem[] }) {
  return (
    <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-px overflow-hidden rounded-[18px] border border-ink-line-2 bg-ink-line-2">
      {items.map((s, i) => (
        <li key={s.title} className="flex flex-col gap-2.5 bg-ink p-[30px]">
          <span className="font-mono text-[13px] text-brand-soft">{num(i)}</span>
          <h3 className="text-[17px] font-semibold">{s.title}</h3>
          <p className="text-[14.5px] leading-normal text-[#A3ABBF]">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** Heading on the left, numbered rows on the right. */
export function StepList({
  eyebrow,
  title,
  items,
  stickyHeading,
}: {
  eyebrow: string;
  title: string;
  items: NumberedItem[];
  stickyHeading?: boolean;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-12">
      <div className={stickyHeading ? "md:sticky md:top-24" : ""}>
        <SectionHeading eyebrow={eyebrow} title={title} />
      </div>
      <ol className="flex flex-col border-t border-line-2">
        {items.map((s, i) => (
          <li key={s.title} className="flex gap-6 border-b border-line-2 py-[26px]">
            <span className="w-7 flex-none pt-1 font-mono text-[13px] text-brand">{num(i)}</span>
            <div className="flex flex-col gap-2">
              <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{s.title}</h3>
              <p className="text-[15px] leading-[1.55] text-pretty text-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Rows with a short mono tag and a line of text (used on the services landing). */
export function TagList({ rows, tagWidth = "w-10" }: { rows: [string, string][]; tagWidth?: string }) {
  return (
    <ul className="flex flex-col border-t border-line-2">
      {rows.map(([tag, text]) => (
        <li key={text} className="flex gap-[18px] border-b border-line-2 py-5">
          <span className={`${tagWidth} flex-none font-mono text-[13px] text-brand`}>{tag}</span>
          <span className="text-[15.5px] leading-normal">{text}</span>
        </li>
      ))}
    </ul>
  );
}

export function CtaBand({
  title,
  actions,
}: {
  title: string;
  actions: { href: string; label: string; variant?: "primary" | "outline" }[];
}) {
  return (
    <section className="bg-ink px-6 py-[clamp(72px,10vw,110px)] text-white">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-end justify-between gap-7">
        <h2 className="max-w-[720px] text-[clamp(32px,4.4vw,54px)] leading-[1.06] font-bold tracking-[-0.04em] text-balance">
          {title}
        </h2>
        <div className="flex flex-wrap gap-3">
          {actions.map((a) => (
            <SmartLink
              key={a.label}
              href={a.href}
              className={a.variant === "outline" ? btn.onDarkOutline : btn.onDarkPrimary}
            >
              {a.label}
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}
