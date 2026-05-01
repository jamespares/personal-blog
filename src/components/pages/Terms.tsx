/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout } from "../Layout";

export const Terms: FC = () => (
  <Layout pageTitle="Terms of Service" metaDescription="Terms of Service for all EduConnect Asia Ltd products and services.">
    <article class="legal-page">
      <h1>Terms of Service</h1>
      <p class="legal-updated">Last Updated: April 2026</p>
      <p>These Terms of Service ("Terms") govern your access to and use of all websites, applications, products, and services (collectively, the "Services") operated by <strong>EduConnect Asia Ltd</strong> ("we", "us", or "our"), a company registered in England and Wales (company number pending) with its registered office at 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.</p>
      <p>By accessing or using any of our Services — including but not limited to <a href="https://www.lastminutelessons.com" target="_blank" rel="noopener noreferrer">Last Minute Lessons</a> and <a href="https://thedalfdojo.com" target="_blank" rel="noopener noreferrer">The DALF Dojo</a> — you agree to be bound by these Terms. If you do not agree, you must not use our Services.</p>
      <h2>1. Services Overview</h2>
      <p>We provide AI-powered educational tools and SaaS products. Our Services generate educational content (presentations, audio, worksheets, exam materials) using third-party AI providers. All AI-generated outputs are provided on an "as is" basis for educational assistance only.</p>
      <h2>2. Accounts & Eligibility</h2>
      <p>To access certain features, you must register for an account. You agree to provide accurate information and keep it up to date. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 18 years old to use our Services.</p>
      <h2>3. Subscriptions, Billing & Refunds</h2>
      <p>Certain Services require payment of fees. All payments are processed securely via <strong>Stripe</strong>. By subscribing, you authorise us to charge your payment method on a recurring basis until you cancel.</p>
      <ul>
        <li><strong>Cancellation:</strong> You may cancel your subscription at any time through your account dashboard or by contacting us. Cancellation takes effect at the end of the current billing period.</li>
        <li><strong>Refunds:</strong> We offer a 14-day cooling-off period for new subscriptions. If you are dissatisfied, contact us within 14 days of your first payment for a full refund. After this period, fees are non-refundable except where required by UK law.</li>
        <li><strong>Price Changes:</strong> We may adjust pricing with 30 days' advance notice.</li>
      </ul>
      <h2>4. AI-Generated Content Disclaimer</h2>
      <p>Our Services use artificial intelligence (OpenAI GPT-4o, DALL-E 3, TTS) to generate educational materials. <strong>We make no guarantee</strong> that AI-generated content is accurate, complete, or suitable for any specific purpose. For exam preparation tools (e.g., The DALF Dojo), AI-generated marking and feedback are <strong>indicative only</strong> and do not guarantee success in official examinations.</p>
      <p>Our Services are <strong>not affiliated with, endorsed by, or connected to</strong> any official examination body, including France Éducation International or the French Ministry of Education.</p>
      <h2>5. Intellectual Property</h2>
      <p>All software, designs, branding, and underlying technology remain the exclusive property of EduConnect Asia Ltd. AI-generated content delivered to you through our Services is licensed to you for personal, non-commercial educational use only. You may not resell, redistribute, or commercially exploit outputs without our prior written consent.</p>
      <h2>6. Data Processing & Security</h2>
      <p>We process and store user data using industry-standard services:</p>
      <ul>
        <li><strong>Cloudflare D1</strong> — SQLite edge database for user accounts, session data, and application records.</li>
        <li><strong>Cloudflare R2</strong> — Object storage for generated files (presentations, audio, worksheets, images).</li>
        <li><strong>Stripe</strong> — Payment processing. We do not store full card details.</li>
        <li><strong>OpenAI</strong> — Content generation via API. User prompts and generated outputs may be processed by OpenAI in accordance with their <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.</li>
      </ul>
      <p>We implement reasonable technical and organisational measures to protect your data. However, no internet transmission is completely secure, and we cannot guarantee absolute security.</p>
      <h2>7. User Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use our Services for any unlawful purpose or in violation of any applicable law.</li>
        <li>Attempt to gain unauthorised access to our systems or other users' accounts.</li>
        <li>Interfere with or disrupt the integrity or performance of the Services.</li>
        <li>Reverse engineer, decompile, or disassemble any part of the Services.</li>
        <li>Submit content that is illegal, harmful, threatening, abusive, or infringing.</li>
      </ul>
      <h2>8. Termination</h2>
      <p>We may suspend or terminate your access to the Services at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Services ceases immediately.</p>
      <h2>9. Limitation of Liability</h2>
      <p>To the maximum extent permitted by UK law, EduConnect Asia Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of the Services.</p>
      <p>Our total liability for any claim arising under these Terms shall not exceed the amount you paid us in the 12 months preceding the claim, or £100 if you have not made any payments.</p>
      <p>Nothing in these Terms excludes or limits our liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded under UK law.</p>
      <h2>10. Changes to These Terms</h2>
      <p>We reserve the right to modify these Terms at any time. If we make material changes, we will provide at least 30 days' notice via email or a prominent notice on our Services before the changes take effect. Your continued use of the Services after changes constitutes acceptance.</p>
      <h2>11. Governing Law & Jurisdiction</h2>
      <p>These Terms shall be governed by and construed in accordance with the laws of <strong>England and Wales</strong>. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
      <h2>12. Contact</h2>
      <p>For questions about these Terms, contact us at:</p>
      <p><strong>EduConnect Asia Ltd</strong><br/>71-75 Shelton Street, Covent Garden<br/>London, WC2H 9JQ, United Kingdom<br/>Email: <a href="mailto:hello@educonnect.asia">hello@educonnect.asia</a></p>
    </article>
  </Layout>
);
