import type { Metadata } from "next";
import { Channels, DutchSearch, DutchVideo, LanguageSwitchHero, NlContact, Route, SpotTheTranslation } from "@/components/netherlands";
import { PageShell } from "@/components/page-shell";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/netherlands",
    [
      "Launch in the Netherlands — Dutch localisation | Finloa",
      "Starten in Nederland — Nederlandse lokalisatie | Finloa",
    ],
    [
      "We rebuild what already works in English for the Netherlands: website, Dutch SEO, ads, social and video. Written by native speakers, run by one team.",
      "We bouwen wat in het Engels al werkt opnieuw op voor Nederland: website, Nederlandse SEO, advertenties, social en video. Geschreven door moedertaalsprekers, uitgevoerd door één team.",
    ],
  );
}

export default async function NetherlandsPage() {
  const t = await getT();
  return (
    <PageShell brandHeader ctaLabel={t("Plan Your Growth", "Plan je groei")} ctaHref="#contact">
      <div className="overflow-x-clip bg-[#F4F6FA]">
        <LanguageSwitchHero />
        <SpotTheTranslation />
        <DutchSearch />
        <Channels />
        <Route />
        <DutchVideo />
        <NlContact />
      </div>
    </PageShell>
  );
}
