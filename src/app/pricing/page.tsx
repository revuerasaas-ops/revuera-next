import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import PricingContent from "./pricing-content";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div className="py-32 text-center"><div className="w-12 h-12 skeleton rounded-full mx-auto" /></div>}>
          <PricingContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
