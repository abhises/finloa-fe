import type { Metadata } from "next";
import { BlogList } from "@/components/blog-list";
import { ContactSection } from "@/components/contact-section";
import { PageShell } from "@/components/page-shell";
import { getPosts } from "@/lib/data";
import { EmailSignup } from "@/components/email-signup";
import { getLocale, getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/blog",
    ["Blog — Finloa", "Blog — Finloa"],
    [
      "Practical guides on marketing, AI, video and new income streams for creators and businesses.",
      "Praktische gidsen over marketing, AI, video en nieuwe inkomstenbronnen voor creators en bedrijven.",
    ],
  );
}

export default async function BlogPage() {
  const locale = await getLocale();
  const [posts, t] = await Promise.all([getPosts(locale), getT()]);

  return (
    <PageShell ctaHref="#contact">
      <section className="bg-grid px-6 pt-[clamp(28px,5vw,64px)] pb-24">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-[22px]">
          <div className="font-mono text-[13px] tracking-[0.08em] text-brand">{t("FINLOA BLOG", "FINLOA BLOG")}</div>
          <h1 className="text-[clamp(40px,6.4vw,76px)] leading-[1.04] font-bold tracking-[-0.045em] text-balance">
            {t("Ideas to grow", "Ideeën om te laten groeien")}{" "}
            <span className="text-brand">{t("what you've built.", "wat je hebt opgebouwd.")}</span>
          </h1>
          <p className="max-w-[640px] text-lg leading-[1.55] text-pretty text-muted">
            {t(
              "Practical guides on marketing, AI, video and new income streams for creators and businesses.",
              "Praktische gidsen over marketing, AI, video en nieuwe inkomstenbronnen voor creators en bedrijven.",
            )}
          </p>
          <EmailSignup source="blog" cta={t("Subscribe →", "Abonneren →")} align="start" />
          <BlogList posts={posts} />
        </div>
      </section>
      <ContactSection
        source="blog"
        intro={t(
          "Want help putting these ideas to work? Tell us about your goals and we'll come back with next steps.",
          "Hulp nodig om deze ideeën in de praktijk te brengen? Vertel ons over je doelen, dan komen we terug met de volgende stappen.",
        )}
        fourthField={{ name: "website", placeholder: t("Website", "Website") }}
      />
    </PageShell>
  );
}
