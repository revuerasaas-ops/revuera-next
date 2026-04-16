import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Revuera",
  description: "Privacy Policy for Revuera. How we collect, use, and protect your personal information under the Australian Privacy Act 1988.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="py-20 md:py-28 bg-cream">
        <div className="section-container max-w-3xl mx-auto">
          <h1 className="text-display-md text-stone-900 mb-2">Privacy Policy</h1>
          <p className="text-body-sm text-stone-400 mb-10">Last updated: 16 April 2026 · Effective: 16 April 2026</p>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8 md:p-10 space-y-8 [&_h2]:text-heading-lg [&_h2]:text-stone-900 [&_h2]:mb-3 [&_h2]:mt-2 [&_h3]:text-heading-sm [&_h3]:text-stone-800 [&_h3]:mb-2 [&_h3]:mt-3 [&_p]:text-body-md [&_p]:text-stone-600 [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:text-body-md [&_ul]:text-stone-600 [&_ul]:space-y-1.5 [&_ul]:mb-3 [&_li]:pl-4 [&_li]:relative [&_li]:before:content-['·'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-stone-400">

            <div>
              <h2>1. Introduction</h2>
              <p>Revuera Pty Ltd (ABN 23 308 272 266) (&quot;Revuera&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, hold, use, and disclose personal information in accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles (APPs).</p>
              <p>This policy applies to all personal information we handle — both for our customers (&quot;Subscribers&quot;) who use Revuera, and for end customers (&quot;End Customers&quot;) whose information our Subscribers upload to the platform.</p>
              <p>By using Revuera, you consent to the practices described in this policy. If you do not agree, please do not use the Service.</p>
            </div>

            <div>
              <h2>2. What Personal Information We Collect</h2>

              <h3>From Subscribers (business users of Revuera)</h3>
              <ul>
                <li><strong>Account information:</strong> Business name, full name, email address, phone number, business address, country</li>
                <li><strong>Billing information:</strong> Payment method details processed and stored by Stripe. We do not store your card number.</li>
                <li><strong>Business settings:</strong> Google review link, SMS templates, brand colour, logo URL, reply templates</li>
                <li><strong>Usage data:</strong> Login timestamps, feature usage, dashboard activity</li>
                <li><strong>Communications:</strong> Emails or messages you send to us</li>
              </ul>

              <h3>From End Customers (uploaded by Subscribers)</h3>
              <ul>
                <li><strong>Contact details:</strong> Customer name and mobile phone number</li>
                <li><strong>Interaction data:</strong> SMS delivery status, star rating given (1–5), private feedback text, Google review link click</li>
                <li><strong>Source data:</strong> Whether the interaction came from manual entry or an ecommerce platform (e.g. Shopify order)</li>
              </ul>
              <p><strong>Important:</strong> Revuera acts as a data processor for End Customer data. The Subscriber (the business using Revuera) is the data controller for their customers&apos; data and is responsible for having a lawful basis to upload that data.</p>

              <h3>Automatically collected</h3>
              <ul>
                <li>IP addresses (used for rate limiting and security)</li>
                <li>Device and browser information</li>
                <li>Cloudflare analytics and security logs</li>
              </ul>
            </div>

            <div>
              <h2>3. How We Collect Personal Information</h2>
              <p>We collect personal information:</p>
              <ul>
                <li>Directly from you when you sign up, fill out forms, or contact us</li>
                <li>When Subscribers upload customer data (names and phone numbers) to the platform</li>
                <li>Automatically through system logs, Cloudflare, and usage tracking</li>
                <li>Via Stripe when you make a payment</li>
              </ul>
            </div>

            <div>
              <h2>4. Why We Collect and Use Personal Information</h2>
              <p>We collect and use personal information for the following purposes:</p>

              <h3>For Subscribers</h3>
              <ul>
                <li>Creating and managing your account</li>
                <li>Providing and improving the Service</li>
                <li>Processing payments and sending invoices</li>
                <li>Sending service-related emails (account verification, trial reminders, billing notices)</li>
                <li>Responding to support requests</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h3>For End Customers</h3>
              <ul>
                <li>Sending SMS review request messages on behalf of the Subscriber</li>
                <li>Processing and storing the End Customer&apos;s rating and feedback</li>
                <li>Showing the Subscriber their customer feedback in the dashboard</li>
              </ul>
              <p>We will not use End Customer data for any purpose other than providing the Service to the Subscriber who uploaded that data.</p>
            </div>

            <div>
              <h2>5. Disclosure of Personal Information</h2>
              <p>We do not sell your personal information. We share personal information only with the following categories of third-party service providers, and only to the extent necessary to provide the Service:</p>
              <ul>
                <li><strong>Stripe</strong> — payment processing. <Link href="https://stripe.com/au/privacy" className="text-brand-600 hover:underline" target="_blank">stripe.com/au/privacy</Link></li>
                <li><strong>Twilio</strong> — SMS delivery. End Customer phone numbers are transmitted to Twilio to send SMS messages. <Link href="https://www.twilio.com/en-us/legal/privacy" className="text-brand-600 hover:underline" target="_blank">twilio.com/legal/privacy</Link></li>
                <li><strong>Supabase</strong> — database hosting. Your account and customer data is stored on Supabase servers. <Link href="https://supabase.com/privacy" className="text-brand-600 hover:underline" target="_blank">supabase.com/privacy</Link></li>
                <li><strong>Resend</strong> — transactional email delivery (account verification, billing emails). <Link href="https://resend.com/privacy" className="text-brand-600 hover:underline" target="_blank">resend.com/privacy</Link></li>
                <li><strong>Cloudflare</strong> — hosting, DDoS protection, and DNS. <Link href="https://www.cloudflare.com/en-au/privacypolicy/" className="text-brand-600 hover:underline" target="_blank">cloudflare.com/privacypolicy</Link></li>
              </ul>
              <p>We may also disclose information if required by law, court order, or government authority, or to protect the rights, property, or safety of Revuera, our users, or the public.</p>
            </div>

            <div>
              <h2>6. Overseas Disclosure (APP 8)</h2>
              <p>Some of the third-party service providers listed above are based overseas, including in the United States. This means your personal information — and End Customer data — may be stored or processed in the United States.</p>
              <p>Specifically:</p>
              <ul>
                <li><strong>Twilio:</strong> United States — processes SMS messages including phone numbers</li>
                <li><strong>Supabase:</strong> Data hosted in the AWS ap-southeast-2 (Sydney) region by default</li>
                <li><strong>Stripe:</strong> United States — processes payment data</li>
                <li><strong>Resend:</strong> United States — processes email addresses</li>
                <li><strong>Cloudflare:</strong> Global CDN — processes request metadata</li>
              </ul>
              <p>Before disclosing your personal information to overseas recipients, we take reasonable steps to ensure those recipients handle it in a way that is consistent with the Australian Privacy Principles. By using Revuera, you consent to these overseas disclosures.</p>
            </div>

            <div>
              <h2>7. Data Security</h2>
              <p>We take reasonable steps to protect personal information from misuse, interference, loss, and unauthorised access. Our security measures include:</p>
              <ul>
                <li>TLS/SSL encryption for all data in transit</li>
                <li>PBKDF2 password hashing — passwords are never stored in plain text</li>
                <li>Session tokens hashed with SHA-256 before database storage</li>
                <li>Account lockout after 5 failed login attempts</li>
                <li>Rate limiting on all API endpoints</li>
                <li>Data isolation — each business account can only access its own customer data</li>
                <li>All API endpoints require authenticated sessions</li>
              </ul>
              <p>Despite these measures, no system is completely secure. If you believe your account has been compromised, contact us immediately at hello@revuera.com.au.</p>
            </div>

            <div>
              <h2>8. Data Retention</h2>
              <p>We retain personal information for as long as necessary to provide the Service and for legitimate business purposes, including:</p>
              <ul>
                <li><strong>Active accounts:</strong> For the duration of your subscription</li>
                <li><strong>After cancellation:</strong> 90 days, then permanently deleted</li>
                <li><strong>Billing records:</strong> 7 years, as required by Australian tax law</li>
                <li><strong>End Customer data:</strong> Retained as long as the Subscriber&apos;s account is active, then deleted with the account</li>
              </ul>
              <p>You may request earlier deletion of your data (excluding legally required records) by emailing hello@revuera.com.au or using the account deletion feature in your dashboard settings.</p>
            </div>

            <div>
              <h2>9. Your Rights Under the Privacy Act 1988</h2>
              <p>Under the Australian Privacy Principles, you have the right to:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or outdated information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal retention obligations)</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing emails at any time</li>
                <li><strong>Complaints:</strong> Lodge a complaint with us, and if unresolved, with the Office of the Australian Information Commissioner (OAIC)</li>
              </ul>
              <p>To exercise these rights, email hello@revuera.com.au. We will respond within 30 days.</p>
            </div>

            <div>
              <h2>10. End Customers — Your Rights</h2>
              <p>If you received an SMS from a business using Revuera and want to know how your data is handled, or want it deleted, you may:</p>
              <ul>
                <li>Contact the business that sent you the message directly</li>
                <li>Contact us at hello@revuera.com.au and we will assist where possible</li>
              </ul>
              <p>We will delete End Customer data associated with a specific phone number upon verified request.</p>
            </div>

            <div>
              <h2>11. Cookies and Tracking</h2>
              <p>We use the following cookies and tracking technologies:</p>
              <ul>
                <li><strong>Essential cookies:</strong> Required for authentication and session management. Cannot be disabled without breaking the Service.</li>
                <li><strong>Analytics:</strong> We may use privacy-respecting analytics (such as PostHog or Cloudflare Analytics) to understand how the Service is used. These do not identify individuals.</li>
              </ul>
              <p>You can control or delete cookies through your browser settings. Disabling essential cookies will prevent you from logging in.</p>
            </div>

            <div>
              <h2>12. Children&apos;s Privacy</h2>
              <p>The Service is not directed at children under 18. We do not knowingly collect personal information from anyone under 18. If you believe a child has provided us with personal information, contact us at hello@revuera.com.au and we will delete it promptly.</p>
            </div>

            <div>
              <h2>13. Spam Act 2003 Compliance</h2>
              <p>Revuera is a tool for businesses to request reviews from their own customers. Our platform requires Subscribers to confirm they have consent from each customer before sending SMS messages. We prohibit the use of Revuera for unsolicited commercial messages and will terminate accounts found in breach of the <em>Spam Act 2003</em> (Cth).</p>
              <p>All SMS messages sent through Revuera identify the sending business. Recipients can opt out by replying STOP. We honour all opt-out requests.</p>
            </div>

            <div>
              <h2>14. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of material changes by email at least 14 days before they take effect. The current version will always be available at revuera.com.au/privacy.</p>
            </div>

            <div>
              <h2>15. Complaints</h2>
              <p>If you have a complaint about how we have handled your personal information, please contact us first:</p>
              <ul>
                <li>Email: hello@revuera.com.au</li>
                <li>We will acknowledge your complaint within 5 business days and aim to resolve it within 30 days.</li>
              </ul>
              <p>If you are not satisfied with our response, you may lodge a complaint with the <strong>Office of the Australian Information Commissioner (OAIC)</strong>:</p>
              <ul>
                <li>Website: <Link href="https://www.oaic.gov.au/privacy/privacy-complaints" className="text-brand-600 hover:underline" target="_blank">oaic.gov.au/privacy/privacy-complaints</Link></li>
                <li>Phone: 1300 363 992</li>
              </ul>
            </div>

            <div>
              <h2>16. Contact Us</h2>
              <p>For all privacy enquiries:</p>
              <ul>
                <li>Email: hello@revuera.com.au</li>
                <li>Contact form: <Link href="/contact" className="text-brand-600 hover:underline">revuera.com.au/contact</Link></li>
              </ul>
              <p className="mt-4 text-stone-500">Revuera Pty Ltd · ABN 23 308 272 266 · Sydney, New South Wales, Australia</p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
