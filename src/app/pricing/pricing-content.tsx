"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, ArrowRight, Clock, RefreshCw, XCircle, ChevronDown, ShoppingBag, MessageSquare, Star } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { SmartCta } from "@/components/ui/smart-cta";
import { subscription, ApiError } from "@/lib/api/client";

const COMPARE_FEATURES = [
  { name: "Review funnel page", ecom: true, starter: true },
  { name: "Custom URL", ecom: true, starter: true },
  { name: "Google redirect", ecom: true, starter: true },
  { name: "Private feedback", ecom: true, starter: true },
  { name: "Analytics", ecom: true, starter: true },
  { name: "SMS review requests", ecom: false, starter: true },
  { name: "Customer tracking", ecom: false, starter: true },
  { name: "Monthly contacts", ecom: "—", starter: "300" },
];

const FAQS = [
  { q: "What happens when my trial ends?", a: "After 7 days, you'll be charged the plan price. We send a reminder 24 hours before — and you can cancel any time before that with no charge." },
  { q: "Are there any setup fees?", a: "None. Zero setup costs, zero hidden fees. You pay the monthly plan price and nothing else." },
  { q: "Can I switch plans later?", a: "Yes — upgrade or downgrade any time from your account settings. Changes take effect at the next billing cycle." },
  { q: "Does it work outside Australia?", a: "Revuera is built for Australian businesses and the Australian Google ecosystem. International plans are on our roadmap." },
  { q: "What is smart filtering exactly?", a: "When a customer rates 4–5 stars, they're sent directly to your Google review page. If they rate 1–3 stars, they're taken to a private feedback form — which arrives in your inbox, not on Google." },
  { q: "What happens if I cancel?", a: "You keep full access until the end of your billing period. Your data is retained for 90 days, so you can reactivate with everything intact." },
];

const INDUSTRIES = ["Trades", "Salons", "Clinics", "Restaurants", "Physios", "Dentists", "Lawyers", "Cafes", "Mechanics", "Cleaners", "Plumbers", "Electricians"];

export default function PricingContent() {
  const searchParams = useSearchParams();
  const highlightPlan = searchParams.get("plan");
  const { isAuthenticated } = useAuth();
  const [annual, setAnnual] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (highlightPlan) {
      const el = document.getElementById(`plan-${highlightPlan}`);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
    }
  }, [highlightPlan]);

  async function handleCheckout(planName: string) {
    if (!isAuthenticated) return;
    setLoadingPlan(planName);
    try {
      const billingType = annual ? "annual" : "monthly";
      const data = await subscription.createCheckout(planName, billingType);
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to start checkout.");
    } finally {
      setLoadingPlan(null);
    }
  }

  const starterPrice = annual ? "$15" : "$19";
  const ecomPrice = annual ? "$7" : "$9";

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-20 bg-cream text-center">
        <div className="section-container">
          <motion.span initial={{ opacity: 0, filter: "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">
            Pricing
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-3 text-display-md md:text-display-lg text-stone-900">
            Simple pricing for every business
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-3 text-body-md text-stone-500">
            Start with a 7-day free trial. No lock-in contracts. Cancel anytime.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-5 flex flex-wrap items-center justify-center gap-5 text-[13px] text-stone-400">
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand-500" />7-day free trial</span>
            <span className="flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5 text-brand-500" />Switch anytime</span>
            <span className="flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5 text-brand-500" />Cancel anytime</span>
          </motion.div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="pb-10">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
            <p className="text-[12px] text-stone-400 mb-3 uppercase tracking-[0.12em] font-semibold">Trusted across Australia by</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {INDUSTRIES.map((ind) => (
                <span key={ind} className="px-3 py-1 bg-white border border-stone-200 rounded-full text-[12px] text-stone-500 font-medium">
                  {ind}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              <span className="text-[12px] text-stone-400 ml-2">4.8 average · 500+ businesses</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Billing toggle + Plans side-by-side */}
      <section className="pb-16">
        <div className="section-container max-w-5xl mx-auto">
          {/* Toggle */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mb-8">
            <span className={`text-[14px] font-semibold transition-colors ${!annual ? "text-stone-900" : "text-stone-400"}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} className={`relative w-[52px] h-7 rounded-full transition-colors duration-300 ${annual ? "bg-brand-600" : "bg-stone-300"}`}>
              <div className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-sm transition-transform duration-300 ${annual ? "translate-x-[22px]" : ""}`} />
            </button>
            <span className={`text-[14px] font-semibold transition-colors ${annual ? "text-stone-900" : "text-stone-400"}`}>
              Annual <span className="bg-brand-600 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">Save up to 26%</span>
            </span>
          </motion.div>

          {/* Side-by-side plans */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Starter — left, Most Popular */}
            <motion.div
              id="plan-starter"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`relative bg-white rounded-3xl border-2 p-8 flex flex-col ${
                highlightPlan === "starter"
                  ? "border-brand-400 ring-4 ring-brand-400/20 shadow-glow-green-lg"
                  : "border-brand-300 shadow-glow-green"
              }`}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 text-white text-[11px] font-bold rounded-full tracking-wide whitespace-nowrap">
                Most Popular
              </div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-heading-md text-stone-900">Starter</h3>
                  <p className="text-[12px] text-stone-400">SMS reviews · local businesses</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-1">
                <AnimatePresence mode="wait">
                  <motion.span key={starterPrice} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="text-[44px] font-extrabold text-stone-900 tracking-tight">
                    {starterPrice}
                  </motion.span>
                </AnimatePresence>
                <span className="text-body-sm text-stone-400">/month</span>
              </div>
              {annual && (
                <p className="text-[12px] text-stone-400 mb-1">
                  <s>$19/mo</s>
                  <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded ml-1.5 font-bold">Save 21%</span>
                </p>
              )}
              <p className="text-[12px] text-stone-500 mb-6">300 contacts per month</p>

              <Link
                href={isAuthenticated ? "#" : "/signup?plan=starter"}
                onClick={(e) => { if (isAuthenticated) { e.preventDefault(); handleCheckout("Starter"); } }}
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white h-12 px-6 rounded-xl text-[14px] font-semibold shadow-sm shadow-brand-600/20 transition-all active:scale-[0.97] mb-6"
              >
                {loadingPlan === "Starter" ? "Redirecting..." : <>Start Free Trial <ArrowRight className="h-4 w-4" /></>}
              </Link>

              <ul className="space-y-3 flex-1">
                {[
                  { text: "Everything in Ecommerce", bold: false },
                  { text: "Automated SMS review requests", bold: false },
                  { text: "Smart filtering — 4–5★ → Google · 1–3★ → private inbox", bold: true },
                  { text: "Customer list & contact tracking", bold: false },
                  { text: "Review analytics dashboard", bold: false },
                  { text: "Auto-reply SMS templates", bold: false },
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[13px] text-stone-600">
                    <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                    <span className={f.bold ? "font-semibold text-stone-800" : ""}>{f.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Ecommerce — right */}
            <motion.div
              id="plan-ecommerce"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className={`relative bg-white rounded-3xl border-2 p-8 flex flex-col ${
                highlightPlan === "ecommerce"
                  ? "border-brand-400 ring-4 ring-brand-400/20 shadow-glow-green-lg"
                  : "border-stone-200 shadow-card"
              }`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-stone-600" />
                </div>
                <div>
                  <h3 className="text-heading-md text-stone-900">Ecommerce</h3>
                  <p className="text-[12px] text-stone-400">Review funnel · online stores</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-1">
                <AnimatePresence mode="wait">
                  <motion.span key={ecomPrice} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="text-[44px] font-extrabold text-stone-900 tracking-tight">
                    {ecomPrice}
                  </motion.span>
                </AnimatePresence>
                <span className="text-body-sm text-stone-400">/month</span>
              </div>
              {annual && (
                <p className="text-[12px] text-stone-400 mb-1">
                  <s>$9/mo</s>
                  <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded ml-1.5 font-bold">Save 22%</span>
                </p>
              )}
              <p className="text-[12px] text-stone-500 mb-6">No SMS — branded funnel page only</p>

              <Link
                href={isAuthenticated ? "#" : "/signup?plan=ecommerce"}
                onClick={(e) => { if (isAuthenticated) { e.preventDefault(); handleCheckout("Ecommerce"); } }}
                className="inline-flex items-center justify-center gap-2 border-2 border-stone-200 hover:border-brand-300 text-stone-700 hover:text-brand-700 h-12 px-6 rounded-xl text-[14px] font-semibold transition-all active:scale-[0.97] mb-6"
              >
                {loadingPlan === "Ecommerce" ? "Redirecting..." : <>Start Free Trial <ArrowRight className="h-4 w-4" /></>}
              </Link>

              <ul className="space-y-3 flex-1">
                {[
                  { text: "Custom branded review funnel page", bold: false },
                  { text: "Unique URL (go.revuera.com.au/yourstore)", bold: false },
                  { text: "Smart filtering — 4–5★ → Google · 1–3★ → private inbox", bold: true },
                  { text: "Private feedback capture form", bold: false },
                  { text: "19 ecommerce platform integrations", bold: false },
                  { text: "Funnel analytics dashboard", bold: false },
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[13px] text-stone-600">
                    <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                    <span className={f.bold ? "font-semibold text-stone-800" : ""}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <p className="text-[11px] text-stone-400 mt-4 pt-4 border-t border-stone-100">
                Works with Shopify, WooCommerce, BigCommerce, and 16 more.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="section-container"><div className="h-px bg-stone-200 max-w-2xl mx-auto" /></div>

      {/* Compare plans table */}
      <section className="py-14">
        <div className="section-container max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, filter: "blur(6px)" }} whileInView={{ opacity: 1, filter: "blur(0px)" }} viewport={{ once: true }} className="text-display-sm text-stone-900 text-center mb-8">Compare plans</motion.h2>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/50">
                    <th className="text-left px-5 py-3 text-body-sm font-semibold text-stone-700" style={{ width: "40%" }}>Feature</th>
                    <th className="text-center px-5 py-3 text-body-sm font-semibold text-stone-600">Ecommerce<br /><span className="font-normal text-brand-600 text-[11px]">{ecomPrice}/mo</span></th>
                    <th className="text-center px-5 py-3 text-body-sm font-semibold text-stone-700">Starter<br /><span className="font-normal text-brand-600 text-[11px]">{starterPrice}/mo</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {COMPARE_FEATURES.map((f, i) => (
                    <tr key={i} className="hover:bg-stone-50/50">
                      <td className="px-5 py-3 text-body-sm text-stone-600">{f.name}</td>
                      <td className="px-5 py-3 text-center">{f.ecom === true ? <Check className="h-4 w-4 text-brand-500 mx-auto" /> : f.ecom === false ? <Minus className="h-4 w-4 text-stone-300 mx-auto" /> : <span className="text-body-sm text-stone-500">{f.ecom}</span>}</td>
                      <td className="px-5 py-3 text-center">{f.starter === true ? <Check className="h-4 w-4 text-brand-500 mx-auto" /> : f.starter === false ? <Minus className="h-4 w-4 text-stone-300 mx-auto" /> : <span className="text-body-sm font-semibold text-stone-700">{f.starter}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-container"><div className="h-px bg-stone-200 max-w-2xl mx-auto" /></div>

      {/* Which plan */}
      <section className="py-14">
        <div className="section-container max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, filter: "blur(6px)" }} whileInView={{ opacity: 1, filter: "blur(0px)" }} viewport={{ once: true }} className="text-display-sm text-stone-900 text-center mb-8">Which plan is right for you?</motion.h2>
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SmartCta plan="ecommerce" className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-stone-200 hover:border-brand-300 hover:shadow-card transition-all group active:scale-[0.99]">
                <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0 group-hover:bg-brand-100"><ShoppingBag className="h-5 w-5 text-brand-600" /></div>
                <div className="flex-1"><h4 className="text-heading-sm text-stone-900">I run an online store</h4><p className="text-body-sm text-stone-500">Shopify, WooCommerce, or any ecommerce platform</p></div>
                <div className="text-heading-md text-brand-600 whitespace-nowrap">{ecomPrice}<span className="text-[12px] text-stone-500 font-medium">/mo</span></div>
              </SmartCta>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <SmartCta plan="starter" className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-stone-200 hover:border-brand-300 hover:shadow-card transition-all group active:scale-[0.99]">
                <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0 group-hover:bg-brand-100"><MessageSquare className="h-5 w-5 text-brand-600" /></div>
                <div className="flex-1"><h4 className="text-heading-sm text-stone-900">I see customers in person</h4><p className="text-body-sm text-stone-500">Trades, clinics, salons, restaurants — any local business</p></div>
                <div className="text-heading-md text-brand-600 whitespace-nowrap">{starterPrice}<span className="text-[12px] text-stone-500 font-medium">/mo</span></div>
              </SmartCta>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="section-container"><div className="h-px bg-stone-200 max-w-2xl mx-auto" /></div>

      {/* FAQ — expanded to 6 */}
      <section className="py-14">
        <div className="section-container max-w-2xl mx-auto">
          <motion.h2 initial={{ opacity: 0, filter: "blur(6px)" }} whileInView={{ opacity: 1, filter: "blur(0px)" }} viewport={{ once: true }} className="text-display-sm text-stone-900 text-center mb-8">Common questions</motion.h2>
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-container"><div className="h-px bg-stone-200 max-w-2xl mx-auto" /></div>

      {/* Bottom CTA */}
      <section className="py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(22,163,74,.04), transparent 70%)" }} />
        <div className="relative section-container">
          <motion.h2 initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-display-sm md:text-display-md text-stone-900">
            Still not sure?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-3 text-body-md text-stone-500 max-w-[380px] mx-auto">
            Start with any plan. Switch or cancel anytime.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-7">
            <SmartCta className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white h-[52px] px-8 rounded-2xl text-[15px] font-semibold shadow-lg shadow-brand-600/20 transition-all active:scale-[0.97]">
              Start Free Trial <ArrowRight className="h-4.5 w-4.5" />
            </SmartCta>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-3 text-[12px] text-stone-400">
            7-day free trial · Cancel anytime · Plans from $9/mo
          </motion.p>
        </div>
      </section>
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left group hover:bg-stone-50/60 transition-colors">
        <span className="text-[14px] font-medium text-stone-800 group-hover:text-brand-700 transition-colors pr-4">{q}</span>
        <ChevronDown className={`h-4 w-4 text-stone-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <p className="px-5 pb-4 text-[13px] text-stone-500 leading-[1.75]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
