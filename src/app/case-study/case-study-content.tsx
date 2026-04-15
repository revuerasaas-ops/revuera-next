"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Shield, Zap, TrendingUp, MapPin, Building2, Tag, CreditCard } from "lucide-react";
import { CTA } from "@/components/sections/cta/cta";

// Animated counter hook
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function AnimatedStat({ target, suffix, label, delay }: { target: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCounter(target, 1600, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center p-6 bg-white rounded-2xl border border-stone-200 shadow-card"
    >
      <div className="text-[36px] font-extrabold text-brand-600 tracking-tight leading-none mb-1">
        {count}{suffix}
      </div>
      <div className="text-[12px] text-stone-400 font-medium">{label}</div>
    </motion.div>
  );
}

const SECTIONS = [
  {
    icon: Shield,
    color: "brand",
    title: "The Problem",
    body: "Arrow Air Conditioning had been operating in Sydney for over 10 years. Despite consistently excellent work, their Google rating sat at 3.8 stars with only 12 reviews — most old complaints that no longer reflected their service quality. New customers were choosing competitors with higher ratings. The owner knew happy customers existed. They just never left reviews.",
  },
  {
    icon: Zap,
    color: "amber",
    title: "The Solution",
    body: "Arrow signed up for Revuera Starter at $19/month. After each job, the technician added the customer's name and phone number to the dashboard. Revuera handled the rest — sending an SMS asking them to rate their experience from 1 to 5. Customers who rated 4–5 stars received a direct link to Arrow's Google review page. Those who rated 1–3 stars were asked for private feedback that went straight to the owner's inbox.",
  },
  {
    icon: TrendingUp,
    color: "brand",
    title: "Key Takeaway",
    body: "Smart filtering works. By catching unhappy customers before they reach Google and directing happy ones to leave public reviews, Arrow transformed their online reputation in under 3 months — for $19/month. Two customers who had issues gave private feedback which was resolved directly, preventing what could have been damaging public reviews.",
  },
];

export function CaseStudyContent() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="relative section-container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] font-semibold mb-5">
                Case Study
              </span>
              <h1 className="text-display-md md:text-display-lg text-stone-900 mb-4">
                How Arrow Air Conditioning grew their Google reviews
              </h1>
              <p className="text-body-lg text-stone-500 max-w-lg">
                From 3.8★ and 12 reviews to 4.9★ and 53 reviews — in 90 days, at $19/month.
              </p>
            </div>

            {/* Before / After rating badges — D7 Q1: styled text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 shrink-0"
            >
              {/* Before */}
              <div className="text-center px-5 py-4 bg-white rounded-2xl border-2 border-stone-200 shadow-card">
                <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">Before</div>
                <div className="text-[32px] font-extrabold text-stone-400 tracking-tight leading-none">3.8★</div>
                <div className="text-[11px] text-stone-400 mt-1">12 reviews</div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-1">
                <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="text-[9px] font-bold text-brand-600 uppercase tracking-wider">90 days</span>
              </div>

              {/* After */}
              <div className="text-center px-5 py-4 bg-brand-600 rounded-2xl border-2 border-brand-600 shadow-lg shadow-brand-600/25">
                <div className="text-[11px] font-semibold text-brand-200 uppercase tracking-wider mb-1">After</div>
                <div className="text-[32px] font-extrabold text-white tracking-tight leading-none">4.9★</div>
                <div className="text-[11px] text-brand-200 mt-1">53 reviews</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Client info strip */}
      <section className="border-t border-b border-stone-200 bg-white py-4">
        <div className="section-container max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {[
              { icon: Building2, label: "Arrow Air Conditioning" },
              { icon: MapPin, label: "Sydney, NSW" },
              { icon: Tag, label: "HVAC & Air Conditioning" },
              { icon: CreditCard, label: "Starter plan · $19/mo" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px] text-stone-500">
                <item.icon className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story sections with icons */}
      <section className="py-16">
        <div className="section-container max-w-3xl mx-auto space-y-8">
          {SECTIONS.map((sec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-5"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                sec.color === "amber" ? "bg-amber-50 border border-amber-200" : "bg-brand-50 border border-brand-200"
              }`}>
                <sec.icon className={`h-5 w-5 ${sec.color === "amber" ? "text-amber-500" : "text-brand-600"}`} />
              </div>
              <div>
                <h2 className="text-heading-lg text-stone-900 mb-3">{sec.title}</h2>
                <p className="text-body-md text-stone-600 leading-relaxed">{sec.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="py-12 bg-white border-t border-b border-stone-200">
        <div className="section-container max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative px-8 py-2"
          >
            {/* Decorative quotation mark */}
            <div className="absolute -top-2 -left-2 text-[80px] font-extrabold text-brand-200 leading-none select-none pointer-events-none">&ldquo;</div>
            <blockquote className="relative z-10">
              <p className="text-[1.25rem] md:text-[1.4rem] font-semibold text-stone-800 leading-[1.5] tracking-[-0.01em]">
                Only paying $19 a month and it&apos;s bringing in new clients worth thousands. The ROI is insane. Revenue is growing and the reviews just keep coming.
              </p>
              <footer className="mt-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center shrink-0">
                  <span className="text-[12px] font-extrabold text-brand-700">A</span>
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-stone-900">Arrow Air Conditioning</div>
                  <div className="text-[12px] text-stone-400">Sydney, NSW · Verified customer</div>
                </div>
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Animated results counters — D7 Q2: dedicated section */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">The Results</span>
            <h2 className="mt-3 text-display-sm text-stone-900">90 days. Real numbers.</h2>
          </motion.div>
          <div className="grid grid-cols-3 gap-4">
            <AnimatedStat target={340} suffix="%" label="More Google reviews" delay={0} />
            <AnimatedStat target={41} suffix="" label="New 5-star reviews" delay={0.1} />
            <AnimatedStat target={90} suffix=" days" label="To see results" delay={0.2} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="mt-6 text-center text-[13px] text-stone-400"
          >
            Rating improved from <span className="font-semibold text-stone-600">3.8★</span> to <span className="font-semibold text-brand-600">4.9★</span> · 2 negative reviews caught privately · 0 harmful public complaints
          </motion.div>
        </div>
      </section>

      <CTA />
    </main>
  );
}
