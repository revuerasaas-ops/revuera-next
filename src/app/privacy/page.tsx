import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="py-20 md:py-28 bg-cream">
        <div className="section-container max-w-3xl mx-auto">
          <h1 className="text-display-md text-stone-900 mb-2">Privacy Policy</h1>
          <p className="text-body-sm text-stone-400 mb-10">Last updated: 1 March 2026</p>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8 md:p-10 space-y-8 [&_h2]:text-heading-lg [&_h2]:text-stone-900 [&_h2]:mb-3 [&_h3]:text-heading-sm [&_h3]:text-stone-800 [&_h3]:mb-2 [&_p]:text-body-md [&_p]:text-stone-600 [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:text-body-md [&_ul]:text-stone-600 [&_ul]:space-y-1 [&_ul]:mb-3 [&_li]:pl-4 [&_li]:relative [&_li]:before:content-['·'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-stone-400">
            <div><h2>1. Introduction</h2><p>Revuera Pty Ltd (ABN 23 308 272 266) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our review management service.</p></div>
            <div><h2>2. Information We Collect</h2><h3>Information you provide:</h3><p>Account details (name, email, phone, business info), customer data you upload (names, phone numbers for SMS), Google review links, and payment information (processed by Stripe).</p><h3>Automatically collected:</h3><p>Usage data, device information, IP addresses, cookies, and analytics data.</p></div>
            <div><h2>3. How We Use Your Information</h2><ul><li>Operate and maintain the Service</li><li>Send SMS review requests on your behalf</li><li>Process payments via Stripe</li><li>Communicate service updates</li><li>Improve and develop features</li><li>Comply with legal obligations</li></ul></div>
            <div><h2>4. Data Sharing</h2><p>We do not sell your personal information. We share data only with the following service providers who process data on our behalf: Stripe (payments), Supabase (database hosting), Twilio (SMS delivery), Resend (transactional emails), and Cloudflare (hosting and security).</p></div>
            <div><h2>5. Data Security</h2><p>256-bit SSL encryption for all data in transit. Australian-based servers. Regular security audits.</p></div>
            <div><h2>6. Data Retention</h2><p>Data retained for the duration of your subscription plus 90 days. You may request deletion at any time from your dashboard settings.</p></div>
            <div><h2>7. Your Rights</h2><p>Under the Australian Privacy Act 1988, you have the right to access, correct, and delete your personal data. Contact us via our contact page or email hello@revuera.com.au. You may also lodge a complaint with the OAIC at oaic.gov.au.</p></div>
            <div><h2>8. Cookies</h2><p>Essential cookies for authentication. Analytics cookies (Google Analytics) for understanding usage. You can control cookies in your browser settings.</p></div>
            <div><h2>9. Contact</h2><p>Privacy inquiries: hello@revuera.com.au</p><p>Revuera Pty Ltd · ABN 23 308 272 266 · Sydney, Australia</p></div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
