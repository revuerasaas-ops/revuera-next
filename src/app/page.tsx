import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero/hero";
import { ReviewFunnelMockup } from "@/components/sections/hero/review-funnel-mockup";
import { Problem } from "@/components/sections/problem/problem";
import { HowItWorks } from "@/components/sections/how-it-works/how-it-works";
import { Testimonials } from "@/components/sections/testimonials/testimonials";
import { CTA } from "@/components/sections/cta/cta";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Section 1: Hero */}
        <Hero />
        {/* Section 2: Browser mockup — review funnel preview with scroll perspective */}
        <ReviewFunnelMockup />
        {/* Section 3: Problem — 88% stat + Without/With comparison */}
        <Problem />
        {/* Section 4: How It Works — Ecommerce/SMS tabs with steps */}
        <HowItWorks />
        {/* Section 5: Testimonials — horizontal carousel */}
        <Testimonials />
        {/* Section 6: CTA — "Ready to protect your Google rating?" */}
        <CTA />
      </main>
      <Footer />
    </>
  );
}
