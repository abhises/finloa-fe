import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions — Finloa",
  description: "The terms that govern your use of the Finloa website and platform.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="2 November 2026">
      <p>These Terms and Conditions (“Terms”) are a legal agreement between you and Finloa (“Finloa”, “we”, “us” or “our”) and govern your use of our website and platform. By using our website, you agree to these Terms. If you do not agree, please do not use the website.</p>
      <h2>Our services</h2>
      <p>Finloa provides marketing, website, content, advertising and growth services for creators and businesses (“Services”). Specific Services are provided under a separate written agreement or proposal.</p>
      <h2>Definitions</h2>
      <p>“You” and “user” mean anyone who visits or uses our website, including people who sign up, contact us or use our platform. “Content” means all text, images, graphics, video and other material on the website.</p>
      <h2>Acceptance of these Terms</h2>
      <p>By accessing or using the website you confirm that you have read, understood and agree to these Terms and our <Link href="/privacy">Privacy Policy</Link>. We may update these Terms at any time. The latest version will always be on this page, and continued use of the website after changes means you accept them.</p>
      <h2>Limited licence</h2>
      <p>We grant you a limited, non-exclusive, non-transferable and revocable licence to use the website for your own lawful, non-commercial purposes, in line with these Terms.</p>
      <h2>Legal compliance</h2>
      <p>You agree to follow all applicable laws and regulations when using the website.</p>
      <h2>Our relationship to you</h2>
      <p>Using the website does not create any partnership, employment, agency or joint venture between you and Finloa.</p>
      <h2>Intellectual property</h2>
      <p>The website, its Content, our name, logo and trademarks belong to Finloa or our licensors and are protected by intellectual property laws. You may not copy, reproduce, distribute or create derivative works from them without our written permission.</p>
      <h2>Copyright complaints</h2>
      <p>We respect the intellectual property of others. If you believe Content on our website infringes your copyright, email <a href="mailto:info@finloa.com">info@finloa.com</a> with:</p>
      <ul><li>A description of the copyrighted work</li><li>Where the infringing material appears on our website</li><li>Your name, address, phone number and email</li><li>A statement that you believe in good faith the use is not authorised</li><li>A statement that the information is accurate and that you own the copyright or are authorised to act for the owner</li><li>Your physical or electronic signature</li></ul>
      <h2>Eligibility and accounts</h2>
      <p>You must be at least 18 years old, or have permission from a parent or guardian, to use the website. If you create an account, you are responsible for keeping your login details secure and for all activity under your account. You agree to give accurate information and keep it up to date. We may suspend or close accounts that break these Terms.</p>
      <h2>Content disclaimer</h2>
      <p>Content on the website is for general information only. We try to keep it accurate and up to date, but we do not guarantee that it is complete, correct or current, and we may change it at any time without notice.</p>
      <h2>Errors, corrections and changes</h2>
      <p>We do not promise that the website will be free of errors or interruptions, or that defects will be corrected. We may change, suspend or discontinue any part of the website at any time.</p>
      <h2>No professional advice</h2>
      <p>Nothing on the website is financial, legal, tax or other professional advice. Examples of results are illustrative and are not a promise of future results. Talk to a qualified professional before making decisions based on information from our website.</p>
      <h2>Third-party offers and advertising</h2>
      <p>The website may mention or link to products, services or offers from third parties. Any dealings you have with them are solely between you and that third party, and we are not responsible for their products, services or terms.</p>
      <h2>Warranty disclaimer</h2>
      <p>The website and its Content are provided “as is” and “as available”, without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose and non-infringement, to the extent permitted by law.</p>
      <h2>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, Finloa is not liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits, revenue, data or goodwill, arising from your use of, or inability to use, the website. Our total liability for any claim related to the website is limited to €100.</p>
      <h2>Privacy and personal data</h2>
      <p>Our <Link href="/privacy">Privacy Policy</Link> explains how we collect and use personal information and forms part of these Terms. Where we process personal data on your behalf as part of our Services, we do so under a separate data processing agreement and only on your documented instructions.</p>
      <h2>Unlawful activity</h2>
      <p>We may investigate any suspected breach of these Terms or unlawful use of the website, and report it to the relevant authorities. You agree not to use the website to send spam, upload malicious code, attempt unauthorised access, or harm Finloa or other users.</p>
      <h2>Linking to our website</h2>
      <p>You may link to our homepage as long as you do so fairly and legally and do not suggest any association, approval or endorsement by Finloa that does not exist. We may withdraw this permission at any time.</p>
      <h2>Links to other websites</h2>
      <p>Our website may contain links to websites we do not control. We are not responsible for their content, policies or practices, and a link does not mean we endorse them.</p>
      <h2>Indemnification</h2>
      <p>You agree to defend, indemnify and hold harmless Finloa and its team from any claims, losses, liabilities and expenses, including reasonable legal fees, arising from your use of the website or your breach of these Terms.</p>
      <h2>Governing law</h2>
      <p>These Terms are governed by the laws of the country in which Finloa is registered, and any disputes will be handled by the courts there, unless local consumer law gives you other rights.</p>
      <h2>Contact</h2>
      <p>Questions about these Terms? Email <a href="mailto:info@finloa.com">info@finloa.com</a>.</p>
    </LegalPage>
  );
}
