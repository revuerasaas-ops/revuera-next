"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Step = { t: string; p: string };

const TABS: Record<string, { steps: Step[]; link: string; label: string }> = {
  ecom: {
    steps: [
      { t: "Customer buys", p: "After checkout, they're redirected to your branded review page at go.revuera.com.au/your-business" },
      { t: "Quick question", p: "Thumbs up or thumbs down — takes 2 seconds flat" },
      { t: "Smart routing", p: "Happy → Google review. Unhappy → private feedback to you." },
    ],
    link: "/review-funnel",
    label: "View Ecommerce Product",
  },
  sms: {
    steps: [
      { t: "Job completed", p: "After you finish a job, Revuera sends your customer an SMS asking them to rate 1-5." },
      { t: "Customer replies", p: "They text back a number.\n\n4-5★ → Google review link.\n1-3★ → Private feedback to your inbox." },
      { t: "Reviews stack up", p: "Automatic follow-ups for non-responders. Reviews grow on autopilot." },
    ],
    link: "/sms-reviews",
    label: "View SMS Product",
  },
};

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<string>("ecom");
  const tab = TABS[activeTab];

  return (
    <section className="py-20 md:py-28 bg-white" id="hiw">
      <div className="section-container max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">
            How It Works
          </span>
          <h2 className="mt-3 text-display-md text-stone-900">
            Setup takes minutes. Reviews take care of themselves.
          </h2>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          {Object.entries(TABS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative px-6 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300 ${
                activeTab === key
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
              }`}
            >
              {key === "ecom" ? "Ecommerce" : "SMS"}
            </button>
          ))}
        </motion.div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-0">
              {tab.steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-6 relative"
                >
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0 z-10 ${
                      i < 2
                        ? "bg-brand-600 text-white"
                        : "bg-brand-100 text-brand-700"
                    }`}>
                      {i + 1}
                    </div>
                    {i < tab.steps.length - 1 && (
                      <div className="w-[2px] flex-1 bg-stone-200 my-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-10">
                    <h4 className="text-heading-md text-stone-900">{step.t}</h4>
                    <p className="mt-2 text-body-md text-stone-500 whitespace-pre-line leading-relaxed">
                      {step.p}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Product link */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-center"
            >
              <Link
                href={tab.link}
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                {tab.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
