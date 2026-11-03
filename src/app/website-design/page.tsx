import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkCards, PageHero, Section, SectionHeading, StepList, type NumberedItem } from "@/components/ui";

export const metadata: Metadata = {
  title: "Website Design & Development — Finloa",
  description: "Websites designed and built around your customer journey, so more visitors become leads and customers.",
};

const steps: NumberedItem[] = [
  { title: "Defining the customer journey", body: "We map how your buyers find you, what they need at each step and what makes them act, so the site is built around them." },
  { title: "Prioritising user experience", body: "We plan structure, navigation and page layouts that make it easy for visitors to find answers and take the next step." },
  { title: "Messaging and visual design", body: "We write clear messaging and design a look that reflects your brand and builds trust from the first screen." },
  { title: "Code, test and launch", body: "We build a fast, secure and accessible site, test it on every device, and launch without losing your search rankings." },
  { title: "Assess and optimise", body: "After launch we track behaviour and conversions, then keep testing and improving the pages that matter most." },
];

const services: NumberedItem[] = [
  { title: "UI design", body: "Clean, on-brand interfaces that guide visitors toward action.", items: ["Page and component design", "Responsive layouts", "Accessibility built in"] },
  { title: "UX strategy", body: "Research-led structure that makes your site easy to use.", items: ["User journeys and sitemaps", "Wireframes and prototypes", "Conversion planning"] },
  { title: "Design systems", body: "A shared library of components and styles for consistent, faster updates.", items: ["Reusable components", "Typography and colour rules", "Documentation for your team"] },
  { title: "UX copywriting", body: "Words that explain your value clearly and move people to act.", items: ["Messaging and page copy", "Calls to action", "SEO-friendly structure"] },
  { title: "Website development", body: "Fast, secure sites built on the platform that suits you.", items: ["WordPress, Shopify or custom", "Integrations with your tools", "Speed and SEO optimisation"] },
];

const faqs: FaqItem[] = [
  ["How much does a website redesign cost?", "It depends on the number of pages, features and integrations. We offer packages, commission-based and custom plans, and give you a clear quote after a first call."],
  ["How long does a website redesign take?", "Most redesigns take 8–16 weeks from kickoff to launch, depending on scope and how quickly content is approved."],
  ["How do you avoid losing SEO rankings during a redesign?", "We audit your current rankings, keep or redirect every important URL, and check search performance closely after launch."],
  ["Which platforms do you build on?", "WordPress, Shopify and custom builds. We recommend the platform that fits your goals, team and budget."],
  ["What’s included in a website redesign?", "Strategy, UX, copy, design, development, SEO, testing and launch support. You can also add ongoing optimisation."],
  ["Can you refresh our brand and redesign the website at the same time?", "Yes. Doing both together keeps the brand and the site consistent and often saves time."],
  ["How do you make a website generate more leads?", "Clear messaging, simple journeys, strong calls to action and ongoing testing of the pages that drive conversions."],
];

export default function WebsiteDesignPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Website design & development"
        title={["Turn your website into", "a revenue engine."]}
        intro="We design and build websites around your customer journey, with clear messaging, strong SEO and smooth development, so more visitors become leads and customers."
        actions={[{ href: "#contact", label: "Plan your website redesign →" }]}
      />
      <Section>
        <StepList eyebrow="How it works" title="Our website redesign process." items={steps} />
      </Section>
      <Section dark>
        <SectionHeading dark eyebrow="Why Finloa" title="Website design services we provide." />
        <DarkCards items={services} />
      </Section>
      <FaqSection title="Questions about website redesign." items={faqs} />
      <ContactSection
        source="website-design"
        intro="Tell us about your current site and goals. We'll come back with ideas for a website that works harder."
        messagePlaceholder="What should your new website do better?"
      />
    </PageShell>
  );
}
