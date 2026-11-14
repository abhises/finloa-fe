"use client";

import { useId, useState } from "react";
import { useT } from "@/i18n/client";
import { SectionHeading } from "./ui";

export type FaqItem = [question: string, answer: string];

export function FaqSection({ title, items }: { title: string; items: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  const baseId = useId();
  const t = useT();

  return (
    <section id="faq" className="scroll-mt-20 border-t border-line px-6 py-[72px]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-12">
        <SectionHeading
          eyebrow={t("FAQ", "Veelgestelde vragen")}
          title={title}
          className=""
          intro={
            <p className="text-[15px] text-muted-2">
              {t("Still unsure? Email", "Nog vragen? Mail naar")}{" "}
              <a href={`mailto:${t("info@finloa.com", "info@finloa.com")}`} className="text-brand hover:text-brand-hover">
                {t("info@finloa.com", "info@finloa.com")}
              </a>
            </p>
          }
        />
        <div className="flex flex-col border-t border-line-2">
          {items.map(([q, a], i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-${i}`;
            return (
              <div key={q} className="border-b border-line-2">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-[16.5px] font-medium text-ink"
                  >
                    {q}
                    <span className="text-xl text-subtle" aria-hidden>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div id={panelId} hidden={!isOpen}>
                  <p className="max-w-[620px] pb-5 text-[15px] leading-[1.6] text-muted">{a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
