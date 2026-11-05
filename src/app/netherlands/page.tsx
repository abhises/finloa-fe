import type { Metadata } from "next";
import { Channels, DutchSearch, DutchVideo, LanguageSwitchHero, NlContact, Route, SpotTheTranslation } from "@/components/netherlands";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Launch in the Netherlands — Dutch localisation | Finloa",
  description:
    "We rebuild what already works in English for the Netherlands: website, Dutch SEO, ads, social and video. Written by native speakers, run by one team.",
  alternates: { canonical: "https://finloa.com/netherlands" },
};

export default function NetherlandsPage() {
  return (
    <PageShell brandHeader ctaLabel="Plan Your Growth" ctaHref="#contact">
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
