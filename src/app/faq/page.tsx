"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CTA } from "@/components/sections/cta/cta";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  { q: "How does Revuera work?", a: "After each customer interaction, Revuera asks one question: \"How was your experience?\" Customers who rate 4-5 stars are redirected to your Google review page. Customers who rate 1-3 stars are asked for private feedback instead — keeping negative reviews off Google." },
  { q: "How quickly will I see results?", a: "Most businesses see their first reviews within 24-48 hours. Within 30 days, you'll typically see a noticeable improvement in your Google rating and review count." },
  { q: "Do I need technical skills?", a: "Not at all. Setup takes 2-5 minutes. If you can copy and paste a URL, you can use Revuera." },
  { q: "Is there a free trial?", a: "Yes. All plans include a 7-day free trial. Credit card required to start. Cancel anytime during the trial and you won't be charged." },
  { q: "Which plan is right for me?", a: "Online store? Ecommerce ($9/mo). See customers in person or want SMS reviews? Starter ($19/mo)." },
  { q: "Can I change plans later?", a: "Yes. Upgrade or downgrade anytime from your dashboard. Changes take effect on your next billing cycle." },
  { q: "What happens when I cancel?", a: "You keep access until the end of your current period. Your data is preserved for 90 days if you decide to come back." },
  { q: "Does it work with Google Business Profile?", a: "Yes. Revuera redirects happy customers directly to your Google Business Profile review page." },
  { q: "Can I customise the review page?", a: "Yes. Add your business name, logo, and custom colours to your branded review page." },
  { q: "How do SMS credits work?", a: "Starter includes 300 contacts/month. SMS are sent to Australian mobile numbers. Each contact gets an initial message plus one follow-up if needed." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted with 256-bit SSL. We comply with the Australian Privacy Act 1988." },
  { q: "Do you share customer data?", a: "Never. Customer data is only used to send review requests on your behalf. We never sell or share it." },
];

function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.03 }}
      className="border-b border-stone-200 last:border-0"
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="text-[15px] font-medium text-stone-900 group-hover:text-brand-600 transition-colors pr-4">{q}</span>
        <ChevronDown className={`h-4 w-4 text-stone-400 shrink-0 transition-transform duration-250 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="pb-5 text-[14px] text-stone-500 leading-[1.7]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqPage() {
  return (
    <>
      <Header />
      <main>
        <section className="py-20 md:py-28 bg-cream">
          <div className="section-container max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-display-md md:text-display-lg text-stone-900">Frequently asked questions</motion.h1>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 text-body-lg text-stone-500">Everything you need to know about Revuera.</motion.p>
            </div>
            <div className="bg-white rounded-3xl border border-stone-200 shadow-card px-8">
              {FAQS.map((faq, i) => <FaqItem key={i} i={i} {...faq} />)}
            </div>
          </div>
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
