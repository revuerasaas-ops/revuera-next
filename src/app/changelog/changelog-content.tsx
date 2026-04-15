"use client";

import { motion } from "framer-motion";
import { Sparkles, Shield, ArrowUp } from "lucide-react";

const ENTRIES = [
  { date: "March 2026", title: "Annual pricing — save up to 26%", tag: "New", desc: "All plans now offer annual billing. Ecommerce $7/mo ($84/yr), Starter $15/mo ($180/yr). Toggle between monthly and annual on the pricing page." },
  { date: "March 2026", title: "Email verification on signup", tag: "Security", desc: "New accounts now verify their email with a 6-digit code before accessing the dashboard. Prevents fake accounts and improves deliverability." },
  { date: "March 2026", title: "19 ecommerce platforms supported", tag: "New", desc: "Expanded from 4 to 19 platforms including Stripe, PayPal, Wix, Squarespace, Ecwid, Lemon Squeezy, Paddle, and more. Each with step-by-step setup instructions." },
  { date: "March 2026", title: "Smart onboarding emails", tag: "New", desc: "Plan-specific onboarding emails guide you through setup. Ecommerce users get store connection tips. Starter users get SMS sending tips." },
  { date: "March 2026", title: "CSV export + account self-service", tag: "New", desc: "Download your customer data as CSV from any dashboard. Plus self-service account deletion with Stripe subscription cancellation." },
  { date: "March 2026", title: "Account lockout protection", tag: "Security", desc: "After 5 failed login attempts, accounts are temporarily locked for 15 minutes. Protects against credential stuffing." },
  { date: "February 2026", title: "47 CRM integrations with trigger explanations", tag: "New", desc: "Each CRM now shows exactly when review requests are triggered. \"When a job is marked Completed\", \"When an appointment ends\", etc." },
  { date: "February 2026", title: "Dashboard charts and sparklines", tag: "Improvement", desc: "All dashboards now show SVG trend charts, rating distribution bars, and inline sparklines on stat cards. Real weekly data tracked over time." },
];

const TAG_CONFIG: Record<string, { icon: typeof Sparkles; className: string }> = {
  New:         { icon: Sparkles, className: "bg-brand-50 text-brand-700 border-brand-200" },
  Security:    { icon: Shield,   className: "bg-amber-50 text-amber-700 border-amber-200" },
  Improvement: { icon: ArrowUp,  className: "bg-stone-100 text-stone-600 border-stone-200" },
};

const grouped = ENTRIES.reduce<Record<string, typeof ENTRIES>>((acc, e) => {
  if (!acc[e.date]) acc[e.date] = [];
  acc[e.date].push(e);
  return acc;
}, {});

export function ChangelogContent() {
  return (
    <div className="section-container max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.span initial={{ opacity: 0, filter: "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">
          What&apos;s new
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-3 text-display-md text-stone-900">
          Changelog
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-3 text-body-md text-stone-500">
          Everything we ship, in order.
        </motion.p>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[7px] md:left-[11px] top-2 bottom-2 w-px bg-stone-200" />

        <div className="space-y-10">
          {Object.entries(grouped).map(([date, entries], gi) => (
            <div key={date}>
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: gi * 0.05 }}
                className="flex items-center gap-4 mb-5"
              >
                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-brand-600 border-4 border-cream z-10 shrink-0" />
                <span className="text-[13px] font-bold text-stone-500 uppercase tracking-wider">{date}</span>
              </motion.div>

              <div className="ml-8 md:ml-12 space-y-4">
                {entries.map((entry, i) => {
                  const cfg = TAG_CONFIG[entry.tag] || TAG_CONFIG.New;
                  const TagIcon = cfg.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-white rounded-2xl border border-stone-200 p-5 card-hover"
                    >
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.className}`}>
                          <TagIcon className="h-3 w-3" />
                          {entry.tag}
                        </span>
                      </div>
                      <h3 className="text-heading-sm text-stone-900 mb-2">{entry.title}</h3>
                      <p className="text-body-sm text-stone-500 leading-relaxed">{entry.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
