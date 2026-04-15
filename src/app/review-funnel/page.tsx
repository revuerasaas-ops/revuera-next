"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmartCta } from "@/components/ui/smart-cta";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight, ChevronDown, Link2, Star, Shield, Code,
  BarChart2, Palette, Play, CheckCircle, ThumbsUp, ThumbsDown,
  Search, X,
} from "lucide-react";

// ── Counter ────────────────────────────────────────────────────────────────
function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick); else setVal(to);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);
  return <div ref={ref}>{val}{suffix}</div>;
}

function Reveal({ children, delay = 0, className = "", direction = "up" }: {
  children: React.ReactNode; delay?: number; className?: string; direction?: "up" | "left" | "right";
}) {
  const x = direction === "left" ? -32 : direction === "right" ? 32 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x, y: direction === "up" ? 24 : 0, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Interactive funnel mockup ──────────────────────────────────────────────
function FunnelMockup({ voted, onVote }: { voted: "positive" | "negative" | null; onVote: (v: "positive" | "negative") => void }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-[0_20px_60px_rgba(0,0,0,.12)] bg-white w-full">
      <div className="bg-stone-100 px-4 py-2.5 flex items-center gap-3 border-b border-stone-200">
        <div className="flex gap-1.5">
          {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
        </div>
        <div className="flex-1 bg-white/80 rounded-md px-2.5 py-1 text-[10px] text-stone-400 font-mono truncate">
          go.revuera.com.au/smith-plumbing
        </div>
      </div>
      <div className="relative bg-[#FFFBF5] px-6 py-8 flex flex-col items-center min-h-[280px]">
        <AnimatePresence>
          {voted === "positive" && (
            <motion.div key="pos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-brand-50/80 to-transparent pointer-events-none" />
          )}
          {voted === "negative" && (
            <motion.div key="neg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-stone-50 to-transparent pointer-events-none" />
          )}
        </AnimatePresence>

        <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-[15px] mb-4 shadow-md shadow-brand-600/30 relative z-10">SP</div>
        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2 relative z-10">Smith Plumbing</p>
        <h3 className="text-[16px] font-extrabold text-stone-900 text-center leading-tight mb-1 relative z-10">How was your experience?</h3>
        <p className="text-[11px] text-stone-400 text-center mb-6 relative z-10">Your feedback helps us improve</p>

        <div className="flex items-center gap-5 relative z-10">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => onVote("positive")} className="flex flex-col items-center gap-2">
            <motion.div animate={{ backgroundColor: voted === "positive" ? "#16A34A" : "#fff", borderColor: voted === "positive" ? "#16A34A" : "#E8E6DF", scale: voted === "positive" ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="w-14 h-14 rounded-xl border-2 flex items-center justify-center shadow-sm">
              <ThumbsUp className="w-6 h-6" style={{ color: voted === "positive" ? "white" : "#A8A49A" }} />
            </motion.div>
            <motion.span animate={{ color: voted === "positive" ? "#16A34A" : "#A8A49A" }} className="text-[11px] font-semibold">
              {voted === "positive" ? "To Google →" : "Great!"}
            </motion.span>
          </motion.button>

          <div className="w-px h-10 bg-stone-200" />

          <motion.button whileTap={{ scale: 0.9 }} onClick={() => onVote("negative")} className="flex flex-col items-center gap-2">
            <motion.div animate={{ backgroundColor: voted === "negative" ? "#1A1714" : "#fff", borderColor: voted === "negative" ? "#1A1714" : "#E8E6DF", scale: voted === "negative" ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="w-14 h-14 rounded-xl border-2 flex items-center justify-center shadow-sm">
              <ThumbsDown className="w-6 h-6" style={{ color: voted === "negative" ? "white" : "#A8A49A" }} />
            </motion.div>
            <motion.span animate={{ color: voted === "negative" ? "#54504A" : "#A8A49A" }} className="text-[11px] font-semibold text-stone-400">
              {voted === "negative" ? "Noted." : "Not great"}
            </motion.span>
          </motion.button>
        </div>

        <AnimatePresence>
          {voted === "positive" && (
            <motion.div initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="mt-5 w-full bg-brand-600 rounded-xl px-4 py-3 text-center relative z-10">
              <div className="flex items-center justify-center gap-2">
                <Star className="h-4 w-4 fill-white text-white" />
                <p className="text-[12px] font-bold text-white">Redirecting to Google…</p>
              </div>
              <p className="text-[10px] text-brand-200 mt-0.5">Builds your public rating</p>
            </motion.div>
          )}
          {voted === "negative" && (
            <motion.div initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="mt-5 w-full bg-stone-800 rounded-xl px-4 py-3 text-center relative z-10">
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-4 w-4 text-stone-400" />
                <p className="text-[12px] font-bold text-white">Private feedback</p>
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">Sent to your inbox only</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 flex items-center gap-1 opacity-30 relative z-10">
          <div className="w-3 h-3 rounded-sm bg-brand-600" />
          <span className="text-[9px] text-stone-400 font-medium">Powered by Revuera</span>
        </div>
      </div>
    </div>
  );
}

// ── Scroll-linked How It Works + Two Outcomes ──────────────────────────────
const FLOW_STEPS = [
  {
    step: 1,
    title: "Customer completes purchase",
    desc: "After checkout, they're redirected to your branded Revuera page automatically. No extra work on your end.",
    outcome: null,
  },
  {
    step: 2,
    title: "One simple question",
    desc: "They tap thumbs up or thumbs down. That's it. Two seconds. No forms, no star sliders, no friction.",
    outcome: null,
  },
  {
    step: 3,
    title: "Happy customer",
    desc: "4-5★ means they're routed straight to your Google review page. One tap. New public review added to your rating.",
    outcome: "positive",
  },
  {
    step: 4,
    title: "Unhappy customer",
    desc: "1-3★ means private feedback sent directly to your inbox — and only your inbox. It never appears publicly on Google.",
    outcome: "negative",
  },
];

function ScrollOutcomeSection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Smooth viewport-centre tracking — same approach as SMS features section
    const update = () => {
      const viewMid = window.innerHeight / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elMid = rect.top + rect.height / 2;
        const dist = Math.abs(elMid - viewMid);
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      });
      setActiveStep(bestIdx);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const activeOutcome = FLOW_STEPS[activeStep]?.outcome ?? null;

  return (
    <section className="bg-white border-t border-b border-stone-200">
      <div className="section-container max-w-6xl mx-auto">
        <Reveal className="text-center py-16 pb-8">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">How it works</span>
          <h2 className="mt-3 text-display-sm md:text-display-md text-stone-900">From purchase to review in seconds</h2>
          <p className="mt-3 text-body-sm text-stone-400 max-w-md mx-auto">
            Scroll through to see what happens for each type of customer.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-16 pb-0">
          {/* LEFT: scrollable steps */}
          <div className="pb-16">
            {FLOW_STEPS.map((s, i) => (
              <div
                key={i}
                ref={el => { stepRefs.current[i] = el; }}
                className="py-12 border-b border-stone-100 last:border-0"
              >
                <motion.div
                  animate={{
                    opacity: activeStep === i ? 1 : 0.5,
                    x: activeStep === i ? 0 : -6,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{
                        backgroundColor: activeStep === i
                          ? s.outcome === "positive" ? "#16A34A"
                          : s.outcome === "negative" ? "#1A1714"
                          : "#F0FDF6"
                          : "#F8F7F4",
                        borderColor: activeStep === i
                          ? s.outcome === "positive" ? "#16A34A"
                          : s.outcome === "negative" ? "#1A1714"
                          : "#86EFAC"
                          : "#E8E6DF",
                        scale: activeStep === i ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-extrabold border-2 shrink-0"
                      style={{
                        color: activeStep === i
                          ? (s.outcome === "positive" || s.outcome === "negative") ? "white" : "#16A34A"
                          : "#A8A49A"
                      }}
                    >
                      {s.step}
                    </motion.div>
                    <motion.h3
                      animate={{ color: activeStep === i ? "#1A1714" : "#7A7670" }}
                      transition={{ duration: 0.4 }}
                      className="text-[17px] font-bold"
                    >
                      {s.title}
                    </motion.h3>
                    {activeStep === i && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`ml-auto w-2 h-2 rounded-full shrink-0 ${
                          s.outcome === "positive" ? "bg-brand-500"
                          : s.outcome === "negative" ? "bg-stone-600"
                          : "bg-brand-400"
                        }`}
                      />
                    )}
                  </div>

                  <p className={`text-[14px] leading-[1.75] ml-12 transition-colors duration-400 ${
                    activeStep === i ? "text-stone-600" : "text-stone-400"
                  }`}>{s.desc}</p>

                  {s.outcome && activeStep === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="ml-12 mt-4"
                    >
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${
                        s.outcome === "positive"
                          ? "bg-brand-50 text-brand-600 border-brand-200"
                          : "bg-stone-100 text-stone-600 border-stone-200"
                      }`}>
                        {s.outcome === "positive"
                          ? <><Star className="h-3.5 w-3.5 fill-brand-500 text-brand-500" /> Public Google review</>
                          : <><Shield className="h-3.5 w-3.5" /> Private — your inbox only</>
                        }
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>

          {/* RIGHT: sticky — stays pinned while left side scrolls */}
          <div className="hidden lg:block">
            <div className="sticky top-24 py-8">
              {/* Image container — sized to 4:3, images use object-contain so none are cropped */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-[0_16px_60px_rgba(0,0,0,.09)] bg-stone-50" style={{aspectRatio: "4/3"}}>
                {/* Default / neutral state — ecommerce funnel preview */}
                <motion.div
                  animate={{ opacity: activeOutcome === null ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <img
                    src="https://res.cloudinary.com/ddwysmpli/image/upload/q_auto/f_auto/v1776229879/Screenshot_2026-04-15_at_2.57.17_pm_ml4c4b.png"
                    alt="Revuera review funnel"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                {/* Positive outcome */}
                <motion.div
                  animate={{ opacity: activeOutcome === "positive" ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src="https://res.cloudinary.com/ddwysmpli/image/upload/q_auto/f_auto/v1776230187/Screenshot_2026-04-15_at_3.16.00_pm_jtb6g0.png"
                    alt="Positive funnel outcome"
                    className="w-full h-full object-contain"
                  />
                </motion.div>

                {/* Negative outcome */}
                <motion.div
                  animate={{ opacity: activeOutcome === "negative" ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src="https://res.cloudinary.com/ddwysmpli/image/upload/q_auto/f_auto/v1776230197/Screenshot_2026-04-15_at_3.15.30_pm_erp9ey.png"
                    alt="Negative funnel outcome"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>

              {/* Step progress */}
              <div className="mt-5 flex gap-1.5">
                {FLOW_STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      flex: activeStep === i ? 4 : 1,
                      opacity: activeStep === i ? 1 : 0.25,
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-1.5 rounded-full ${
                      FLOW_STEPS[activeStep]?.outcome === "positive" ? "bg-brand-600"
                      : FLOW_STEPS[activeStep]?.outcome === "negative" ? "bg-red-400"
                      : "bg-brand-500"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-stone-400 text-center mt-3">
                Step {activeStep + 1} of {FLOW_STEPS.length} — {FLOW_STEPS[activeStep]?.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Searchable integrations ────────────────────────────────────────────────
const ALL_PLATFORMS = [
  { name: "Shopify", category: "ecommerce", featured: true },
  { name: "WooCommerce", category: "ecommerce", featured: true },
  { name: "BigCommerce", category: "ecommerce", featured: true },
  { name: "Square", category: "pos", featured: true },
  { name: "Squarespace", category: "website", featured: true },
  { name: "Wix", category: "website", featured: false },
  { name: "Etsy", category: "marketplace", featured: false },
  { name: "Magento", category: "ecommerce", featured: false },
  { name: "PrestaShop", category: "ecommerce", featured: false },
  { name: "Kajabi", category: "course", featured: false },
  { name: "Gumroad", category: "marketplace", featured: false },
  { name: "Bold Commerce", category: "ecommerce", featured: false },
  { name: "Lightspeed", category: "pos", featured: false },
  { name: "Vend", category: "pos", featured: false },
  { name: "Stripe", category: "payments", featured: false },
  { name: "Thinkific", category: "course", featured: false },
  { name: "Teachable", category: "course", featured: false },
  { name: "Webflow", category: "website", featured: false },
  { name: "Custom URL", category: "custom", featured: false },
];

function SearchableIntegrations() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const featured = ALL_PLATFORMS.filter(p => p.featured);
  const results = query.length > 0
    ? ALL_PLATFORMS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <section className="py-20 bg-white border-t border-b border-stone-200">
      <div className="section-container max-w-3xl mx-auto">
        <Reveal className="text-center mb-10">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">Integrations</span>
          <h2 className="mt-3 text-display-sm text-stone-900">Works with every platform</h2>
          <p className="mt-3 text-body-sm text-stone-400 max-w-md mx-auto">
            Search your platform — if we support it, it'll appear. If you can redirect a customer to a URL, you can use Revuera.
          </p>
        </Reveal>

        {/* Search input */}
        <Reveal>
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setSearched(true); }}
              placeholder="Search your platform…"
              className="w-full pl-11 pr-10 h-12 rounded-xl border border-stone-200 bg-white text-[14px] text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all shadow-sm"
            />
            {query && (
              <button onClick={() => { setQuery(""); setSearched(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </Reveal>

        {/* Search results */}
        <AnimatePresence mode="wait">
          {query.length > 0 ? (
            <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {results.map((p, i) => (
                    <motion.div key={p.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 px-4 py-3 bg-brand-50 border border-brand-200 rounded-xl">
                      <CheckCircle className="h-4 w-4 text-brand-600 shrink-0" />
                      <div>
                        <div className="text-[13px] font-semibold text-stone-800">{p.name}</div>
                        <div className="text-[10px] text-stone-400 capitalize">{p.category}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <div className="text-[14px] text-stone-500 mb-2">
                    <span className="font-semibold text-stone-700">&ldquo;{query}&rdquo;</span> isn&apos;t in our list yet
                  </div>
                  <p className="text-[13px] text-stone-400">
                    But if your platform can redirect to a URL after checkout, you can still use Revuera.{" "}
                    <Link href="/contact" className="text-brand-600 hover:underline">Contact us</Link> to request an integration.
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="featured" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {featured.map((p, i) => (
                  <Reveal key={p.name} delay={i * 0.06}>
                    <motion.div whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,.07)" }} transition={{ duration: 0.2 }}
                      className="bg-white border border-stone-200 rounded-xl py-4 px-3 text-center cursor-default">
                      <div className="text-[13px] font-semibold text-stone-700">{p.name}</div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
              <p className="text-center text-[12px] text-stone-400 mt-4">
                Showing 5 featured platforms · Search to find more
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Features ───────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Link2, title: "Branded URL", desc: "Your own page at go.revuera.com.au/your-store. Share anywhere — email, SMS, QR code, post-checkout redirect." },
  { icon: Star, title: "Smart star routing", desc: "4-5★ → Google review. 1-3★ → private feedback. Automatically. Every single customer, every single order." },
  { icon: Shield, title: "Reputation protection", desc: "Unhappy customers send feedback privately. You resolve it. It never appears publicly on Google." },
  { icon: Code, title: "Works with any platform", desc: "Shopify redirect, WooCommerce hook, BigCommerce webhook, or a simple link on any thank-you page." },
  { icon: BarChart2, title: "Funnel analytics", desc: "See how many customers land, rate positive vs negative, and convert. Track your positive rate week over week." },
  { icon: Palette, title: "Full brand customisation", desc: "Upload your logo. Set your brand colour. Customise the question and button text. Looks like yours, not ours." },
];

// ── FAQ ────────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left group">
        <span className="text-[14px] font-medium text-stone-900 group-hover:text-brand-600 transition-colors pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-stone-400 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <p className="pb-4 text-[13px] text-stone-600 leading-[1.7]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FAQS = [
  { q: "How do I set this up?", a: "Create your account, enter your Google Review Link, customise your funnel page, then redirect customers to your unique URL after checkout. Takes about 3 minutes." },
  { q: "Does it work with Shopify?", a: "Yes. Redirect customers to your Revuera page after checkout using Shopify's order confirmation redirect, or trigger via webhook for automatic timing." },
  { q: "Can I embed it on my thank-you page?", a: "Yes. Your Revuera funnel URL is a standalone page — just redirect to it or add a button. No embed code required." },
  { q: "Is there a limit on reviews?", a: "No. Unlimited page views, unlimited review routing, unlimited private feedback. $9/month covers everything." },
  { q: "What happens to negative feedback?", a: "It's sent as a private notification to your dashboard and email. You can respond directly. It never appears on Google." },
];

export default function ReviewFunnelPage() {
  const [heroVoted, setHeroVoted] = useState<"positive" | "negative" | null>(null);

  // Auto-cycle hero mockup
  useEffect(() => {
    let cancelled = false;
    const cycle = async () => {
      while (!cancelled) {
        await new Promise(r => setTimeout(r, 2000));
        if (cancelled) break;
        setHeroVoted("positive");
        await new Promise(r => setTimeout(r, 2500));
        if (cancelled) break;
        setHeroVoted(null);
        await new Promise(r => setTimeout(r, 800));
        setHeroVoted("negative");
        await new Promise(r => setTimeout(r, 2500));
        if (cancelled) break;
        setHeroVoted(null);
        await new Promise(r => setTimeout(r, 1500));
      }
    };
    cycle();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Header />
      <main>
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative py-20 md:py-28 bg-cream overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute inset-0 gradient-mesh-strong" />
          <div className="relative section-container">
            <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <div>
                <motion.div initial={{ opacity: 0, filter: "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }}>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] font-semibold mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                    For Online Stores
                  </span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="text-display-md md:text-display-lg text-stone-900">
                  Turn every purchase into a<span className="text-brand-600"> 5-star review</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="mt-5 text-body-md text-stone-500 leading-relaxed max-w-[460px]">
                  After checkout, customers land on your branded review page. Happy customers go to Google. Unhappy ones send you private feedback. No app installs, no friction.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mt-8">
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-[44px] font-extrabold text-stone-900 tracking-tight leading-none">$9</span>
                    <span className="text-body-md text-stone-400">/month</span>
                    <span className="ml-2 text-[12px] text-stone-400 line-through">$119+ elsewhere</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <SmartCta plan="ecommerce" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white h-12 px-7 rounded-xl text-[14px] font-semibold shadow-lg shadow-brand-600/20 transition-all">
                      Start Free Trial <ArrowRight className="h-4 w-4" />
                    </SmartCta>
                    <Link href="/pricing" className="inline-flex items-center h-12 px-6 rounded-xl border border-stone-300 bg-white/60 text-stone-600 hover:bg-white text-[14px] font-medium transition-all">
                      Compare Plans
                    </Link>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4">
                    {["7-day free trial", "No credit card", "5-min setup"].map(t => (
                      <span key={t} className="flex items-center gap-1.5 text-[12px] text-stone-400">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-500" />{t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-72 h-72 rounded-full bg-brand-400/10 blur-3xl" />
                </div>
                <div className="relative">
                  <FunnelMockup voted={heroVoted} onVote={setHeroVoted} />
                  <p className="text-center text-[11px] text-stone-400 mt-3">Click the thumbs to try it</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────────────────────── */}
        <section className="bg-white border-t border-b border-stone-200 py-12">
          <div className="section-container max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-8 divide-x divide-stone-200">
              {[
                { to: 94, suffix: "%", label: "Positive routing rate across stores" },
                { to: 53, suffix: "+", label: "New reviews per 100 orders on average" },
                { to: 4.9, suffix: "★", label: "Average resulting Google rating" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.1} className="text-center px-4">
                  <div className="text-[40px] font-extrabold text-brand-600 leading-none tracking-tight">
                    <Counter to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="text-[12px] text-stone-400 mt-2 leading-tight">{s.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SCROLL-LINKED HOW IT WORKS + FUNNEL ───────────────────────── */}
        <ScrollOutcomeSection />

        {/* ── FEATURES ──────────────────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="section-container max-w-5xl mx-auto">
            <Reveal className="text-center mb-12">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">Features</span>
              <h2 className="mt-3 text-display-sm md:text-display-md text-stone-900">Everything you need</h2>
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feat, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <motion.div whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,.07)" }} transition={{ duration: 0.25 }}
                    className="p-6 bg-white border border-stone-200/60 rounded-2xl cursor-default h-full">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center mb-4">
                      <feat.icon className="h-4 w-4 text-brand-600" />
                    </div>
                    <h4 className="text-[14px] font-semibold text-stone-900 mb-2">{feat.title}</h4>
                    <p className="text-[13px] text-stone-500 leading-[1.6]">{feat.desc}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEARCHABLE INTEGRATIONS ───────────────────────────────────── */}
        <SearchableIntegrations />

        {/* ── VIDEO DEMO ────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="section-container max-w-[700px] mx-auto">
            <Reveal className="text-center mb-8">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">Demo</span>
              <h2 className="mt-3 text-display-sm text-stone-900">See the full flow</h2>
            </Reveal>
            <Reveal>
              <div className="rounded-2xl border border-stone-200 overflow-hidden shadow-card bg-gradient-to-br from-stone-50 to-stone-100 aspect-video flex items-center justify-center group cursor-pointer hover:shadow-elevated transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-600/10 border-2 border-brand-200 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-600/20 group-hover:scale-110 transition-all duration-300">
                    <Play className="h-7 w-7 text-brand-600 fill-brand-600/40" />
                  </div>
                  <p className="text-[14px] font-semibold text-stone-600">Video demo</p>
                  <p className="text-[12px] text-stone-400 mt-1">Placeholder — replace with video URL</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── PRICING CTA ───────────────────────────────────────────────── */}
        <section className="py-16 bg-brand-50 border-t border-b border-brand-100">
          <div className="section-container max-w-lg mx-auto text-center">
            <Reveal>
              <h2 className="text-display-sm text-stone-900 mb-2">Ecommerce Plan — $9/month</h2>
              <p className="text-body-sm text-stone-500 mb-6">Unlimited reviews · 7-day free trial · No credit card required</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <SmartCta plan="ecommerce" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white h-11 px-7 rounded-xl text-[14px] font-semibold shadow-lg shadow-brand-600/20 transition-all">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </SmartCta>
                <Link href="/pricing" className="inline-flex items-center h-11 px-5 rounded-xl border border-brand-200 text-brand-700 hover:bg-brand-100 text-[13px] font-medium transition-all">
                  See full pricing
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="section-container max-w-2xl mx-auto">
            <Reveal className="text-center mb-10">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">FAQ</span>
              <h2 className="mt-3 text-display-sm text-stone-900">Common questions</h2>
            </Reveal>
            <Reveal>{FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}</Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
