import type { Metadata } from "next";
import { BlogList } from "@/components/blog-list";
import { ContactSection } from "@/components/contact-section";
import { PageShell } from "@/components/page-shell";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog — Finloa",
  description: "Practical guides on marketing, AI, video and new income streams for creators and businesses.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <PageShell ctaHref="#contact">
      <section className="bg-grid px-6 pt-[clamp(28px,5vw,64px)] pb-24">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-[22px]">
          <div className="font-mono text-[13px] tracking-[0.08em] text-brand">FINLOA BLOG</div>
          <h1 className="text-[clamp(40px,6.4vw,76px)] leading-[1.04] font-bold tracking-[-0.045em] text-balance">
            Ideas to grow <span className="text-brand">what you&apos;ve built.</span>
          </h1>
          <p className="max-w-[640px] text-lg leading-[1.55] text-pretty text-muted">
            Practical guides on marketing, AI, video and new income streams for creators and businesses.
          </p>
          <BlogList posts={posts} />
        </div>
      </section>
      <ContactSection
        source="blog"
        intro="Want help putting these ideas to work? Tell us about your goals and we'll come back with next steps."
        fourthField={{ name: "website", placeholder: "Website" }}
      />
    </PageShell>
  );
}
