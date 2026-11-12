"use client";

import { useEffect, useState } from "react";
import { useT } from "@/i18n/client";
import { EmailSignup } from "./email-signup";

const KEY = "finloa-nl-popup";

/** Newsletter sign-up that opens once per session after the reader scrolls 35% down the page (Admin → post → Newsletter popup). */
export function NewsletterPopup({ source }: { source: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (seen) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0 && window.scrollY / h > 0.35) {
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div onClick={close} className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(11,16,32,.45)] p-5 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nl-popup-title"
        className="relative flex max-h-[calc(100vh-40px)] w-full max-w-[560px] flex-col gap-4 overflow-auto rounded-[22px] bg-white p-[clamp(22px,4vw,36px)] text-ink shadow-[0_40px_80px_-30px_rgba(5,10,40,.6)]"
      >
        <button
          type="button"
          onClick={close}
          aria-label={t("Close", "Sluiten")}
          className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full border border-line text-lg leading-none hover:border-ink"
        >
          ×
        </button>
        <div className="font-mono text-[12px] tracking-[0.12em] text-brand">{t("FINLOA NEWSLETTER", "FINLOA NIEUWSBRIEF")}</div>
        <h2 id="nl-popup-title" className="text-[clamp(26px,3.4vw,34px)] leading-[1.05] font-bold tracking-[-0.035em]">
          {t("Get the next guide in your inbox", "Ontvang de volgende gids in je inbox")}
        </h2>
        <p className="text-[15.5px] leading-[1.55] text-muted">
          {t(
            "Practical ideas on marketing, AI and video, about twice a month. Unsubscribe in one click.",
            "Praktische ideeën over marketing, AI en video, ongeveer twee keer per maand. Uitschrijven met één klik.",
          )}
        </p>
        <EmailSignup source={source} cta={t("Subscribe", "Abonneren")} align="start" />
        <button type="button" onClick={close} className="cursor-pointer self-start text-[13px] font-semibold text-muted underline">
          {t("No, thanks", "Nee, bedankt")}
        </button>
      </div>
    </div>
  );
}
