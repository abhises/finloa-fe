import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Finloa",
  description: "How Finloa collects, uses and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="2 November 2026">
      <h2>Introduction</h2>
      <p>This Website Privacy Policy explains how Finloa (“Finloa”, “we”, “us” or “our”) collects, uses and protects personal information when you visit our website, use our platform or contact us. By using our website you agree to the practices described in this policy. If you do not agree, please do not use our website.</p>
      <h2>Definitions</h2>
      <p><strong>Personal information</strong> means any information that identifies you or could reasonably be used to identify you, such as your name, email address, phone number, company, channel or website, and online identifiers like your IP address.</p>
      <p><strong>Non-personal information</strong> means information that cannot identify you on its own, such as browser type, device type, pages visited and general usage statistics.</p>
      <h2>Our commitment to your privacy</h2>
      <p>We collect only the information we need to provide our services, and we never sell your personal information. We are committed to keeping your information secure and to being clear about how we use it.</p>
      <h2>Information we collect</h2>
      <h3>Information you provide to us</h3>
      <p>We collect information you give us directly, for example when you sign up, complete onboarding, fill in a contact form, apply for a job or email us. This may include:</p>
      <ul><li>Your name, email address and phone number</li><li>Your company, channel or website, and your niche</li><li>Messages, files and other content you share with us</li><li>Billing details if you buy a service from us</li></ul>
      <h3>Information collected automatically</h3>
      <p>When you visit our website we automatically collect certain information, such as your IP address, browser and device type, referring website, pages viewed and the time and date of your visit.</p>
      <h3>Cookies</h3>
      <p>We use cookies and similar technologies to keep the website working, remember your preferences and understand how visitors use our site. You can control or delete cookies in your browser settings. Some parts of the website may not work properly without them.</p>
      <h3>Analytics</h3>
      <p>We use analytics services such as Google Analytics to understand how visitors use our website. These services may collect information about your visits using cookies. You can opt out of Google Analytics by installing the Google Analytics opt-out browser add-on.</p>
      <h3>Do Not Track signals</h3>
      <p>Some browsers send “Do Not Track” signals. Because there is no common standard for these signals, our website does not currently respond to them.</p>
      <h2>How we use your information</h2>
      <p>We use personal information only when we have a valid reason to do so, including to:</p>
      <ul><li>Provide, run and improve our services and platform</li><li>Respond to your questions and requests</li><li>Prepare proposals and manage our work with you</li><li>Send updates and marketing you have agreed to receive</li><li>Review job applications</li><li>Protect our website, prevent fraud and meet legal obligations</li></ul>
      <h3>Legal bases</h3>
      <p>Depending on where you live, we process personal information because it is needed to perform a contract with you, because you have given consent, because we have a legitimate business interest that does not override your rights, or because we are legally required to.</p>
      <h3>Marketing</h3>
      <p>If you agree to receive marketing emails, we may send you news, guides and offers. You can unsubscribe at any time using the link in any email or by contacting us.</p>
      <h2>Sharing your information</h2>
      <p>We do not sell or rent your personal information. We may share it with trusted service providers who help us run our business, such as hosting, email, analytics and payment providers, only as needed to provide their services and under appropriate confidentiality terms. We may also share information if required by law, or as part of a merger, acquisition or sale of assets, in which case we will tell you if your information becomes subject to a different privacy policy.</p>
      <h2>Accessing, changing or deleting your information</h2>
      <p>You can ask us to access, correct, update or delete the personal information we hold about you, or to stop using it for marketing. To make a request, email <a href="mailto:info@finloa.com">info@finloa.com</a>. We may need to verify your identity before we can act on your request.</p>
      <h2>How long we keep your information</h2>
      <p>We keep personal information only as long as we need it for the purposes described in this policy, including to meet legal, accounting and reporting requirements. When we no longer need it, we delete or anonymise it.</p>
      <h2>Security</h2>
      <p>We use reasonable technical and organisational measures to protect your personal information, including encrypted connections and access controls. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.</p>
      <h2>Limitation of liability</h2>
      <p>You share information through our website at your own risk. To the extent permitted by law, Finloa is not responsible for unauthorised access to information caused by events outside our reasonable control.</p>
      <h2>Children’s privacy</h2>
      <p>Our website and services are not intended for children under 16. We do not knowingly collect personal information from children. If you believe a child has given us personal information, please contact us and we will delete it.</p>
      <h2>Other websites</h2>
      <p>Our website may link to other websites that we do not control. We are not responsible for their content or privacy practices, and we encourage you to read their privacy policies.</p>
      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. When we do, we will change the “Last updated” date at the top of this page. Significant changes will be highlighted on our website.</p>
      <h2>Questions about this policy</h2>
      <p>If you have questions about this Privacy Policy or how we handle your information, contact us at <a href="mailto:info@finloa.com">info@finloa.com</a>.</p>
    </LegalPage>
  );
}
