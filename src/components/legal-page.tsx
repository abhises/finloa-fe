import type { ReactNode } from "react";
import { ContactSection } from "./contact-section";
import { PageShell } from "./page-shell";

/** Shared layout for Privacy and Terms. Children use plain h2/h3/p/ul, styled here. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <PageShell ctaHref="#contact">
      <section className="px-6 pt-[clamp(28px,5vw,64px)] pb-24">
        <article className="mx-auto flex max-w-[820px] flex-col gap-4 [&_a]:text-brand [&_a:hover]:text-brand-hover [&_h2]:mt-6 [&_h2]:text-[clamp(24px,2.6vw,30px)] [&_h2]:leading-[1.15] [&_h2]:font-bold [&_h2]:tracking-[-0.03em] [&_h3]:mt-2 [&_h3]:text-[19px] [&_h3]:font-semibold [&_h3]:tracking-[-0.02em] [&_li]:pl-1 [&_p]:text-base [&_p]:leading-[1.65] [&_p]:text-pretty [&_p]:text-[oklch(0.35_0.02_265)] [&_strong]:text-ink [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6 [&_ul]:text-base [&_ul]:leading-[1.6] [&_ul]:text-[oklch(0.35_0.02_265)] [&_ul]:marker:text-brand">
          <div className="font-mono text-[13px] tracking-[0.08em] text-brand">LEGAL</div>
          <h1 className="text-[clamp(38px,5.4vw,60px)] leading-[1.05] font-bold tracking-[-0.045em]">{title}</h1>
          <p className="text-[14.5px]! text-subtle!">Last updated {updated}</p>
          <div className="mt-4 h-px bg-line" />
          {children}
        </article>
      </section>
      <ContactSection
        source="legal"
        intro="Questions about this policy, or ready to grow? Send us a message and we'll reply within two working days."
        fourthField={{ name: "website", placeholder: "Website" }}
      />
    </PageShell>
  );
}
