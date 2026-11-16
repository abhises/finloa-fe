import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkCards, NumberedCards, PageHero, Section, SectionHeading, StepList, type NumberedItem } from "@/components/ui";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/hosting-maintenance",
    ["Hosting & Maintenance — Finloa", "Hosting & onderhoud — Finloa"],
    [
      "Fast, secure hosting and ongoing maintenance for your website or app, so it stays online and up to date.",
      "Snelle, veilige hosting en doorlopend onderhoud voor je website of app, zodat die online en up-to-date blijft.",
    ],
  );
}

const services = (t: T): NumberedItem[] => [
  {
    title: t("Managed hosting", "Beheerde hosting"),
    body: t(
      "Fast, secure servers set up and managed for you, close to your customers.",
      "Snelle, veilige servers die we voor je inrichten en beheren, dicht bij je klanten.",
    ),
    items: [
      t("SSL, CDN and caching included", "SSL, CDN en caching inbegrepen"),
      t("Daily backups you can restore", "Dagelijkse back-ups die je kunt terugzetten"),
      t("Hosting in the EU", "Hosting in de EU"),
    ],
  },
  {
    title: t("Security and updates", "Beveiliging en updates"),
    body: t(
      "We keep your software, plugins and dependencies up to date and patch issues quickly.",
      "We houden je software, plugins en afhankelijkheden up-to-date en dichten lekken snel.",
    ),
    items: [
      t("Regular security updates", "Regelmatige beveiligingsupdates"),
      t("Malware and vulnerability scans", "Scans op malware en kwetsbaarheden"),
      t("Firewall and spam protection", "Firewall en spambescherming"),
    ],
  },
  {
    title: t("Monitoring and support", "Monitoring en support"),
    body: t(
      "We watch your site around the clock and fix problems before your customers notice.",
      "We houden je site dag en nacht in de gaten en lossen problemen op voordat je klanten ze merken.",
    ),
    items: [
      t("Uptime and performance monitoring", "Monitoring van uptime en snelheid"),
      t("Small content and design changes", "Kleine aanpassingen in content en ontwerp"),
      t("A monthly report in plain language", "Een maandrapport in begrijpelijke taal"),
    ],
  },
];

const why = (t: T): NumberedItem[] => [
  {
    title: t("No more surprises", "Geen verrassingen meer"),
    body: t("Expired certificates, full disks and broken updates get caught early.", "Verlopen certificaten, volle schijven en mislukte updates worden vroeg opgemerkt."),
  },
  {
    title: t("One point of contact", "Eén aanspreekpunt"),
    body: t("No more chasing your host, developer and designer separately.", "Niet meer los achter je hoster, developer en ontwerper aan."),
  },
  {
    title: t("Faster pages", "Snellere pagina's"),
    body: t("A fast site ranks better and converts more visitors into customers.", "Een snelle site rankt beter en maakt van meer bezoekers klanten."),
  },
];

const steps = (t: T): NumberedItem[] => [
  {
    title: t("Health check", "Gezondheidscheck"),
    body: t("We review your current setup, speed and security.", "We bekijken je huidige setup, snelheid en beveiliging."),
  },
  {
    title: t("Migration", "Verhuizing"),
    body: t("We move your site to our hosting without downtime.", "We verhuizen je site zonder downtime naar onze hosting."),
  },
  {
    title: t("Ongoing care", "Doorlopende zorg"),
    body: t("Updates, backups and monitoring, every month.", "Updates, back-ups en monitoring, elke maand."),
  },
  {
    title: t("Improvements", "Verbeteringen"),
    body: t("We suggest and make changes that keep your site fast and useful.", "We stellen verbeteringen voor en voeren ze door, zodat je site snel en nuttig blijft."),
  },
];

const faqs = (t: T): FaqItem[] => [
  [
    t("Can you host a site you didn't build?", "Kunnen jullie een site hosten die jullie niet gebouwd hebben?"),
    t(
      "Yes. We start with a health check, then migrate it and take over the maintenance.",
      "Ja. We beginnen met een gezondheidscheck, verhuizen de site en nemen het onderhoud over.",
    ),
  ],
  [
    t("Will my site go offline during the move?", "Gaat mijn site offline tijdens de verhuizing?"),
    t(
      "No. We test everything on the new server first and switch over when it's ready.",
      "Nee. We testen alles eerst op de nieuwe server en schakelen pas over als het klaar is.",
    ),
  ],
  [
    t("What if something breaks?", "Wat als er iets kapotgaat?"),
    t(
      "Our monitoring alerts us straight away and we restore from backup if needed.",
      "Onze monitoring waarschuwt ons direct en waar nodig zetten we een back-up terug.",
    ),
  ],
  [
    t("Can I cancel?", "Kan ik opzeggen?"),
    t(
      "Yes. If you leave, we hand over your files, database and accounts.",
      "Ja. Als je vertrekt, dragen we je bestanden, database en accounts over.",
    ),
  ],
];

export default async function HostingMaintenancePage() {
  const t = await getT();
  return (
    <PageShell>
      <PageHero
        eyebrow={t("Hosting & Maintenance", "Hosting & onderhoud")}
        title={[t("Your site online, fast", "Je site online, snel"), t("and always up to date.", "en altijd up-to-date.")]}
        intro={t(
          "We host, secure and maintain your website or app, so you can focus on your business instead of servers and updates.",
          "Wij hosten, beveiligen en onderhouden je website of app, zodat jij je kunt richten op je bedrijf in plaats van op servers en updates.",
        )}
        actions={[
          { href: "#contact", label: t("Get a free health check →", "Vraag een gratis check aan →") },
          { href: "/website-design", label: t("Need a new site?", "Nieuwe site nodig?"), variant: "secondary" },
        ]}
      />
      <Section first>
        <SectionHeading
          eyebrow={t("What's included", "Wat je krijgt")}
          title={t("Everything to keep your site running.", "Alles om je site draaiende te houden.")}
        />
        <NumberedCards items={services(t)} min={300} />
      </Section>
      <Section dark>
        <SectionHeading
          dark
          eyebrow={t("Why it matters", "Waarom het telt")}
          title={t("A site nobody looks after slowly breaks.", "Een site waar niemand naar omkijkt, gaat langzaam stuk.")}
        />
        <DarkCards items={why(t)} />
      </Section>
      <Section>
        <StepList eyebrow={t("How it works", "Zo werkt het")} title={t("Switching is simple.", "Overstappen is simpel.")} items={steps(t)} />
      </Section>
      <FaqSection title={t("Questions about hosting.", "Vragen over hosting.")} items={faqs(t)} />
      <ContactSection
        source="hosting-maintenance"
        intro={t(
          "Tell us about your site. We'll run a free health check and suggest the right plan.",
          "Vertel ons over je site. We doen een gratis gezondheidscheck en adviseren het juiste pakket.",
        )}
        fourthField={{ name: "website", placeholder: t("Website", "Website") }}
        messagePlaceholder={t("What do you need help with?", "Waarmee kunnen we helpen?")}
      />
    </PageShell>
  );
}
