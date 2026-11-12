import { getT } from "@/i18n/server";
import { EmailSignup } from "./email-signup";

export async function Hero() {
  const t = await getT();
  return (
    <section className="bg-grid px-6 pt-[clamp(28px,5vw,64px)] pb-[clamp(20px,3vw,32px)]">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-[26px] text-center">
        <div className="font-mono text-[13px] tracking-[0.08em] text-brand">{t("VIDEO CREATION & SOCIAL GROWTH", "VIDEOPRODUCTIE & SOCIALE GROEI")}</div>
        <h1 className="flex max-w-[980px] flex-col items-center gap-1 text-[clamp(40px,6.4vw,76px)] leading-[1.04] font-bold tracking-[-0.045em] text-balance">
          <span>{t("Affordable videos that", "Betaalbare video's die")}</span>
          <span className="text-brand">{t("grow your audience.", "je publiek laten groeien.")}</span>
        </h1>
        <p className="max-w-[820px] text-lg leading-[1.55] text-balance text-muted">
          {t(
            "Professional videos for YouTube, TikTok, Instagram and LinkedIn at a clear price. We edit, optimise and post so your channels keep growing.",
            "Professionele video's voor YouTube, TikTok, Instagram en LinkedIn voor een heldere prijs. Wij monteren, optimaliseren en posten, zodat je kanalen blijven groeien.",
          )}
        </p>
        <EmailSignup source="video-creation" cta={t("Get my video plan →", "Ontvang mijn videoplan →")} />
      </div>
    </section>
  );
}
