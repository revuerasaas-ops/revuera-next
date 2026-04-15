import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="py-20 md:py-28 bg-cream">
        <div className="section-container max-w-3xl mx-auto">
          <h1 className="text-display-md text-stone-900 mb-2">Terms of Service</h1>
          <p className="text-body-sm text-stone-400 mb-10">Last updated: 1 March 2026</p>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8 md:p-10 space-y-8 [&_h2]:text-heading-lg [&_h2]:text-stone-900 [&_h2]:mb-3 [&_p]:text-body-md [&_p]:text-stone-600 [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:text-body-md [&_ul]:text-stone-600 [&_ul]:space-y-1 [&_ul]:mb-3 [&_li]:pl-4 [&_li]:relative [&_li]:before:content-['·'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-stone-400">
            <div><h2>1. Acceptance</h2><p>By using Revuera (&quot;the Service&quot;), operated by Revuera Pty Ltd (ABN 23 308 272 266), you agree to these Terms. If you do not agree, please do not use the Service.</p></div>
            <div><h2>2. Service Description</h2><p>Revuera provides automated review management tools including review funnels, SMS review requests, and CRM integrations.</p></div>
            <div><h2>3. Account Registration</h2><p>You must provide accurate information when creating an account. You are responsible for all activities under your account. Keep your credentials secure.</p></div>
            <div><h2>4. Pricing &amp; Billing</h2><p>Plans are billed monthly in Australian Dollars (AUD), exclusive of GST. We may change pricing with 30 days written notice. Payments processed securely by Stripe.</p></div>
            <div><h2>5. Cancellation</h2><p>Cancel anytime from your dashboard. Cancellation takes effect at the end of your current billing period. Data is retained for 90 days after cancellation.</p></div>
            <div><h2>6. Acceptable Use</h2><p>You agree not to:</p><ul><li>Send unsolicited messages or spam</li><li>Violate the Australian Spam Act 2003</li><li>Generate fake or misleading reviews</li><li>Interfere with the operation of the Service</li></ul></div>
            <div><h2>7. Intellectual Property</h2><p>Revuera and its content are owned by Revuera Pty Ltd, protected by copyright and trademark laws.</p></div>
            <div><h2>8. Limitation of Liability</h2><p>To the maximum extent permitted by law, Revuera shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p></div>
            <div><h2>9. Privacy</h2><p>Use of the Service is subject to our <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>.</p></div>
            <div><h2>10. Governing Law</h2><p>These Terms are governed by the laws of New South Wales, Australia.</p></div>
            <div><h2>11. Contact</h2><p>Questions? Visit our <Link href="/contact" className="text-brand-600 hover:underline">contact page</Link> or email hello@revuera.com.au</p><p>Revuera Pty Ltd · ABN 23 308 272 266 · Sydney, Australia</p></div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
