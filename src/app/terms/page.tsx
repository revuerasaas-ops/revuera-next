import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Revuera",
  description: "Terms of Service for Revuera review management software. ABN 23 308 272 266.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="py-20 md:py-28 bg-cream">
        <div className="section-container max-w-3xl mx-auto">
          <h1 className="text-display-md text-stone-900 mb-2">Terms of Service</h1>
          <p className="text-body-sm text-stone-400 mb-10">Last updated: 16 April 2026 · Effective: 16 April 2026</p>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8 md:p-10 space-y-8 [&_h2]:text-heading-lg [&_h2]:text-stone-900 [&_h2]:mb-3 [&_h2]:mt-2 [&_p]:text-body-md [&_p]:text-stone-600 [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:text-body-md [&_ul]:text-stone-600 [&_ul]:space-y-1.5 [&_ul]:mb-3 [&_li]:pl-4 [&_li]:relative [&_li]:before:content-['·'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-stone-400">

            <div>
              <h2>1. About These Terms</h2>
              <p>These Terms of Service (&quot;Terms&quot;) form a legally binding agreement between you (&quot;you&quot;, &quot;your&quot;, &quot;Subscriber&quot;) and Revuera Pty Ltd (ABN 23 308 272 266) (&quot;Revuera&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a company registered in New South Wales, Australia.</p>
              <p>By creating an account, accessing, or using Revuera (&quot;the Service&quot;), you confirm you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>. If you do not agree, you must not use the Service.</p>
              <p>If you are accepting these Terms on behalf of a business or organisation, you represent and warrant that you have authority to bind that entity.</p>
            </div>

            <div>
              <h2>2. The Service</h2>
              <p>Revuera provides review management software that allows businesses to:</p>
              <ul>
                <li>Send SMS review requests to their customers</li>
                <li>Route positive customer experiences toward public Google reviews</li>
                <li>Capture private feedback from customers who had a poor experience</li>
                <li>Manage review funnels via a branded web page linked to a unique shortcode</li>
                <li>Integrate with ecommerce platforms via webhooks to automate the review request process</li>
              </ul>
              <p>We reserve the right to modify, suspend, or discontinue any part of the Service at any time. We will provide reasonable notice of material changes where practicable.</p>
            </div>

            <div>
              <h2>3. Eligibility and Account Registration</h2>
              <p>You must be at least 18 years old and a resident or registered business in Australia (or operating lawfully in Australia) to use the Service. The Service is intended for business use only — not for personal or consumer purposes.</p>
              <p>You agree to provide accurate, current, and complete information during registration and to keep your account details up to date. You are solely responsible for all activities that occur under your account. You must keep your password confidential and notify us immediately if you suspect unauthorised access.</p>
              <p>We reserve the right to refuse registration or terminate accounts at our discretion, including if we believe information provided is false or if you violate these Terms.</p>
            </div>

            <div>
              <h2>4. Your Obligations — SMS and Customer Data</h2>
              <p>By using the SMS review request features, you agree that:</p>
              <ul>
                <li><strong>Consent:</strong> You have obtained appropriate consent from each customer whose phone number you upload, in accordance with the <em>Spam Act 2003</em> (Cth). Consent must be explicit, informed, and freely given. Purchasing from your business alone does not constitute consent to receive SMS marketing.</li>
                <li><strong>Opt-out:</strong> You will honour any customer request to stop receiving messages and will not re-add numbers after they have opted out.</li>
                <li><strong>Accuracy:</strong> Phone numbers you upload belong to real customers who have had a genuine interaction with your business.</li>
                <li><strong>No fake reviews:</strong> You will not use Revuera to generate, solicit, or facilitate fake, incentivised, or misleading Google reviews. Doing so may violate Google&apos;s policies and Australian Consumer Law.</li>
                <li><strong>No spam:</strong> You will not use the Service to send unsolicited commercial messages or to harass any person.</li>
                <li><strong>Business purposes only:</strong> You will only send review requests to genuine customers of your business.</li>
              </ul>
              <p>You are the data controller for your customer data. We process it on your behalf. You must have a lawful basis for uploading personal data to Revuera.</p>
            </div>

            <div>
              <h2>5. Prohibited Uses</h2>
              <p>You must not use Revuera to:</p>
              <ul>
                <li>Violate any applicable law, including the <em>Spam Act 2003</em>, <em>Privacy Act 1988</em>, <em>Telecommunications Act 1997</em>, or Australian Consumer Law</li>
                <li>Send messages to numbers you have purchased, scraped, or obtained without direct consent</li>
                <li>Impersonate another business or person</li>
                <li>Upload malware, viruses, or malicious code</li>
                <li>Attempt to gain unauthorised access to our systems or any other user&apos;s account</li>
                <li>Reverse engineer, decompile, or copy any part of the Service</li>
                <li>Resell or white-label the Service without our written permission</li>
                <li>Use the Service in any way that damages our reputation or that of any third party</li>
              </ul>
            </div>

            <div>
              <h2>6. Pricing, Billing and GST</h2>
              <p>All prices are in Australian Dollars (AUD) and are exclusive of Goods and Services Tax (GST). GST (10%) is added at checkout where applicable under the <em>A New Tax System (Goods and Services Tax) Act 1999</em>.</p>
              <p>Subscriptions are billed monthly or annually in advance. You authorise us to charge your nominated payment method on each renewal date. Payments are processed securely by Stripe. We do not store your card details.</p>
              <p>We may change pricing with 30 days&apos; written notice to your registered email address. Continued use after the effective date constitutes acceptance of the new pricing.</p>
              <p>Contact limits (the number of SMS review requests you can send per month) reset on the first day of each billing period.</p>
            </div>

            <div>
              <h2>7. Free Trial</h2>
              <p>We offer a 7-day free trial. No payment method is required to start a trial. At the end of the trial period, your account will be restricted unless you subscribe to a paid plan. Trial accounts are subject to these Terms in full.</p>
            </div>

            <div>
              <h2>8. Cancellation and Refunds</h2>
              <p>You may cancel your subscription at any time from your dashboard under Settings. Cancellation takes effect at the end of your current paid billing period — you retain full access until then.</p>
              <p>We do not provide pro-rata refunds for partial billing periods. If you cancel and then resubscribe, you will be charged at the current rate.</p>
              <p>Under the Australian Consumer Law, we provide remedies if the Service has a major failure. For minor failures we will remedy the issue within a reasonable time. These Terms do not exclude any rights you have under the Australian Consumer Law that cannot be excluded by contract.</p>
              <p>Refund requests based on dissatisfaction will be considered on a case-by-case basis. Contact hello@revuera.com.au.</p>
            </div>

            <div>
              <h2>9. Your Data and Intellectual Property</h2>
              <p>You retain all ownership of your business data, including customer names, phone numbers, and feedback you collect through the Service. By using Revuera, you grant us a limited licence to process this data solely to provide the Service to you.</p>
              <p>All intellectual property in the Revuera platform, including software, branding, and content, is owned by Revuera Pty Ltd. You may not copy, reproduce, or create derivative works from any part of the Service.</p>
              <p>We may use aggregated, anonymised, non-identifiable data (such as platform-wide metrics) for product improvement and marketing purposes.</p>
            </div>

            <div>
              <h2>10. Third-Party Services</h2>
              <p>Revuera integrates with third-party services including Twilio (SMS delivery), Stripe (payments), Supabase (data storage), Resend (email delivery), Cloudflare (hosting), and Google (review links). Your use of these services through Revuera is also subject to their respective terms of service. We are not responsible for the availability or actions of third-party services.</p>
            </div>

            <div>
              <h2>11. Disclaimer of Warranties</h2>
              <p>The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the maximum extent permitted by Australian law, we make no representations or warranties of any kind, express or implied, including that the Service will be error-free, uninterrupted, or meet your specific requirements.</p>
              <p>We do not guarantee that using Revuera will result in an increase in Google reviews, star rating, or business revenue.</p>
            </div>

            <div>
              <h2>12. Limitation of Liability</h2>
              <p>To the maximum extent permitted by the Australian Consumer Law and other applicable law, our total liability for any claims arising from or relating to these Terms or the Service is limited to the amount you paid us in the 3 months immediately preceding the claim.</p>
              <p>We are not liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, loss of data, or loss of business opportunity, even if we have been advised of the possibility of such damages.</p>
              <p>Nothing in these Terms limits our liability for fraud, death or personal injury caused by our negligence, or any liability that cannot be excluded under the Australian Consumer Law.</p>
            </div>

            <div>
              <h2>13. Indemnification</h2>
              <p>You agree to indemnify and hold harmless Revuera Pty Ltd and its officers, employees, and contractors from any claims, losses, damages, costs (including legal costs on a solicitor-client basis), or liabilities arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any law or the rights of any third party; or (d) the data you upload to the Service.</p>
            </div>

            <div>
              <h2>14. Suspension and Termination</h2>
              <p>We may suspend or terminate your account immediately if: (a) you breach these Terms; (b) we are required to do so by law; (c) we believe your use poses a risk to the Service or other users; or (d) you fail to pay applicable fees.</p>
              <p>Upon termination, your right to use the Service ceases. We will retain your data for 90 days after termination, after which it will be deleted. You may request earlier deletion via hello@revuera.com.au.</p>
            </div>

            <div>
              <h2>15. Governing Law and Disputes</h2>
              <p>These Terms are governed by and construed in accordance with the laws of New South Wales, Australia. Each party irrevocably submits to the exclusive jurisdiction of the courts of New South Wales and the Federal Court of Australia.</p>
              <p>Before commencing any legal proceedings, you agree to contact us at hello@revuera.com.au to attempt to resolve the dispute informally within 30 days.</p>
            </div>

            <div>
              <h2>16. Changes to These Terms</h2>
              <p>We may update these Terms at any time. We will notify you by email at least 14 days before material changes take effect. Continued use of the Service after the effective date constitutes your acceptance of the updated Terms.</p>
            </div>

            <div>
              <h2>17. Contact</h2>
              <p>For questions about these Terms:</p>
              <ul>
                <li>Email: hello@revuera.com.au</li>
                <li>Website: <Link href="/contact" className="text-brand-600 hover:underline">revuera.com.au/contact</Link></li>
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
