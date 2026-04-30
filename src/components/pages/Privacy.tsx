/** @jsxImportSource hono/jsx */
import type { FC } from "hono/jsx";
import { Layout, type Dict } from "../Layout";

export const Privacy: FC<{
  currentLang: string;
  baseUrl: string;
  dict: Dict;
}> = ({ currentLang, baseUrl, dict }) => (
  <Layout pageTitle={dict.privacyTitle} metaDescription={`${dict.privacyTitle} for all EduConnect Asia Ltd products and services.`} currentLang={currentLang} dict={dict}>
    <article class="legal-page">
      <h1>Privacy Policy</h1>
      <p class="legal-updated">Last Updated: April 2026</p>
      <p>This Privacy Policy describes how <strong>EduConnect Asia Ltd</strong> ("we", "us", or "our") collects, uses, stores, and protects your personal data when you use our websites, applications, and services (collectively, the "Services"), including <a href="https://teachanythingnow.com" target="_blank" rel="noopener noreferrer">Teach Anything Now</a> and <a href="https://thedalfdojo.com" target="_blank" rel="noopener noreferrer">The DALF Dojo</a>.</p>
      <p>We are committed to protecting your privacy and handling your data transparently, in compliance with the <strong>UK General Data Protection Regulation (UK GDPR)</strong> and the <strong>Data Protection Act 2018</strong>.</p>
      <h2>1. Data Controller</h2>
      <p>The data controller responsible for your personal data is:</p>
      <p><strong>EduConnect Asia Ltd</strong><br/>71-75 Shelton Street, Covent Garden<br/>London, WC2H 9JQ, United Kingdom<br/>Email: <a href="mailto:hello@educonnect.asia">hello@educonnect.asia</a></p>
      <h2>2. What Data We Collect</h2>
      <p>We collect the following categories of personal data:</p>
      <ul>
        <li><strong>Account Information:</strong> Email address, password hash (we never store plaintext passwords).</li>
        <li><strong>Profile Data:</strong> Any information you voluntarily provide in your user profile.</li>
        <li><strong>Usage Data:</strong> Topics you enter, exam attempts, error tracking data, generated content metadata.</li>
        <li><strong>Payment Data:</strong> Billing information processed by Stripe. We do not store full card numbers.</li>
        <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies (see Section 7).</li>
        <li><strong>Communications:</strong> Any correspondence you send us.</li>
      </ul>
      <h2>3. How We Use Your Data</h2>
      <p>We use your personal data for the following lawful purposes:</p>
      <ul>
        <li><strong>To provide the Services:</strong> Creating and managing your account, processing payments, generating and delivering content.</li>
        <li><strong>To improve our Services:</strong> Analysing usage patterns to enhance features and user experience.</li>
        <li><strong>To communicate with you:</strong> Sending service updates, security alerts, and responding to inquiries.</li>
        <li><strong>For legal compliance:</strong> Fulfilling our obligations under applicable law.</li>
      </ul>
      <p>Our legal basis for processing is <strong>contractual necessity</strong> (to provide the Services you request), <strong>legitimate interests</strong> (to improve and secure our Services), and <strong>legal obligation</strong> (where required by law).</p>
      <h2>4. How We Store & Protect Your Data</h2>
      <p>Your data is stored and processed using the following infrastructure:</p>
      <ul>
        <li><strong>Cloudflare D1</strong> — Our primary database, a serverless SQLite database distributed across Cloudflare's global edge network. Data is encrypted at rest and in transit.</li>
        <li><strong>Cloudflare R2</strong> — Object storage for generated files (presentations, audio, worksheets, images). Files are stored in your regional edge location.</li>
        <li><strong>Stripe</strong> — Payment data is processed and stored by Stripe in accordance with PCI-DSS standards.</li>
        <li><strong>OpenAI</strong> — User prompts and generated content are transmitted to OpenAI's API for processing. OpenAI does not use API-submitted data to train its models.</li>
      </ul>
      <p>We implement industry-standard security measures including HTTPS/TLS encryption, secure password hashing (bcrypt), and access controls. However, no system is impenetrable, and we cannot guarantee absolute security.</p>
      <h2>5. Data Retention</h2>
      <p>We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected:</p>
      <ul>
        <li><strong>Account data:</strong> Retained for the duration of your active account plus 12 months after closure, unless you request earlier deletion.</li>
        <li><strong>Generated content:</strong> Retained for 24 months from creation to allow you to access your historical materials.</li>
        <li><strong>Payment records:</strong> Retained for 7 years as required by UK tax law.</li>
        <li><strong>Usage logs:</strong> Retained for 12 months for security and debugging purposes.</li>
      </ul>
      <h2>6. Data Sharing & Third Parties</h2>
      <p>We do not sell your personal data. We share data only with:</p>
      <ul>
        <li><strong>Service providers:</strong> Cloudflare (hosting, database, storage), Stripe (payments), OpenAI (content generation), Resend (email delivery) — all bound by data processing agreements.</li>
        <li><strong>Legal authorities:</strong> When required by law, court order, or to protect our rights and safety.</li>
        <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or asset sale, your data may be transferred to the successor entity.</li>
      </ul>
      <h2>7. Cookies & Analytics</h2>
      <p>We use essential cookies to maintain your session and authentication state. We do not currently use third-party analytics cookies (e.g., Google Analytics). If we add analytics in the future, we will update this Policy and obtain your consent where required.</p>
      <h2>8. Your Rights Under UK GDPR</h2>
      <p>You have the following rights regarding your personal data:</p>
      <ul>
        <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
        <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
        <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
        <li><strong>Right to Restrict Processing:</strong> Request that we limit how we use your data.</li>
        <li><strong>Right to Data Portability:</strong> Request your data in a structured, machine-readable format.</li>
        <li><strong>Right to Object:</strong> Object to processing based on legitimate interests.</li>
        <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you may withdraw it at any time.</li>
      </ul>
      <p>To exercise any of these rights, contact us at <a href="mailto:hello@educonnect.asia">hello@educonnect.asia</a>. We will respond within 30 days.</p>
      <h2>9. International Data Transfers</h2>
      <p>Some of our service providers (including OpenAI and Stripe) may process data outside the UK. Where this occurs, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) or adequacy decisions, to protect your data in accordance with UK GDPR.</p>
      <h2>10. Children's Privacy</h2>
      <p>Our Services are not intended for children under 13. We do not knowingly collect data from children under 13. If you believe we have inadvertently collected such data, contact us immediately and we will delete it.</p>
      <h2>11. Data Breach Notification</h2>
      <p>In the unlikely event of a personal data breach that poses a risk to your rights and freedoms, we will notify the <strong>Information Commissioner's Office (ICO)</strong> within 72 hours and inform affected users without undue delay.</p>
      <h2>12. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email or a prominent notice on our Services at least 30 days before they take effect.</p>
      <h2>13. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy or our data practices, please contact:</p>
      <p><strong>EduConnect Asia Ltd</strong><br/>71-75 Shelton Street, Covent Garden<br/>London, WC2H 9JQ, United Kingdom<br/>Email: <a href="mailto:hello@educonnect.asia">hello@educonnect.asia</a></p>
    </article>
  </Layout>
);
