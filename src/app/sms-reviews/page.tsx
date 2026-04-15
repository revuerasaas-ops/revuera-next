"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmartCta } from "@/components/ui/smart-cta";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ChevronDown, MessageSquare, GitBranch, Users,
  Shield, Star, BarChart2, Clock, CheckCircle, Play, Smartphone,
  Lock, TrendingUp, RefreshCw,
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

// ── Reveal ─────────────────────────────────────────────────────────────────
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

// ── Live SMS phone mockup ──────────────────────────────────────────────────
const SMS_SEQUENCE = [
  { from: "revuera", text: "Hi Sarah! Thanks for choosing Smith Plumbing. We'd love to hear how your experience was.\n\nPlease reply with a number from 1-5.", delay: 0 },
  { from: "customer", text: "5", delay: 2200 },
  { from: "revuera", text: "Wonderful, thank you! We'd love it if you could share your experience on Google:", delay: 3600, link: true },
];

function PhoneMockup() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [shown, setShown] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    async function run() {
      setShown([]); setTyping(false);
      for (let i = 0; i < SMS_SEQUENCE.length; i++) {
        const msg = SMS_SEQUENCE[i];
        await new Promise(r => setTimeout(r, msg.delay));
        if (cancelled) return;
        if (msg.from === "revuera" && i > 0) {
          setTyping(true);
          await new Promise(r => setTimeout(r, 900));
          if (cancelled) return;
          setTyping(false);
        }
        setShown(s => [...s, i]);
      }
      await new Promise(r => setTimeout(r, 4000));
      if (!cancelled) run();
    }
    run();
    return () => { cancelled = true; };
  }, [inView]);

  return (
    <div ref={ref} className="relative mx-auto" style={{ width: 280 }}>
      <div className="relative bg-stone-900 rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,.35)] overflow-hidden" style={{ aspectRatio: "9/19" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-7 bg-stone-900 rounded-b-2xl z-20" />
        <div className="absolute inset-[3px] rounded-[37px] bg-[#F5F5F5] overflow-hidden">
          <div className="bg-white border-b border-stone-100 px-4 pt-10 pb-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-500">SP</div>
            <div>
              <div className="text-[13px] font-semibold text-stone-900">Smith Plumbing</div>
              <div className="text-[10px] text-stone-400">via Revuera</div>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-3 overflow-hidden">
            <AnimatePresence>
              {SMS_SEQUENCE.map((msg, i) => (
                shown.includes(i) && (
                  <motion.div key={i} initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    className={`flex ${msg.from === "customer" ? "justify-end" : "justify-start"}`}>
                    <div className={`rounded-2xl px-3 py-2 max-w-[85%] ${msg.from === "customer" ? "bg-[#007AFF] text-white rounded-br-sm" : "bg-white text-stone-800 rounded-bl-sm shadow-sm"}`}>
                      <p className="text-[11px] leading-[1.5] whitespace-pre-line">{msg.text}</p>
                      {msg.link && (
                        <div className="mt-1.5 bg-brand-50 rounded-lg px-2 py-1.5 border border-brand-200">
                          <p className="text-[10px] text-brand-600 font-semibold flex items-center gap-1">
                            <Star className="h-3 w-3 fill-brand-600" /> Leave a Google Review
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              ))}
              {typing && (
                <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-2.5 shadow-sm flex gap-1 items-center">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-stone-300"
                        animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Result badge — positioned below the phone, not overlapping */}
      <AnimatePresence>
        {shown.includes(2) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="absolute -right-4 bottom-8 bg-brand-600 text-white rounded-2xl px-4 py-3 shadow-lg shadow-brand-600/30"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
              <Star className="h-3.5 w-3.5 fill-white" />
              New Google review
            </div>
            <div className="flex mt-1 gap-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-white" />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sticky scroll features section ────────────────────────────────────────
const FEATURES = [
  { icon: MessageSquare, title: "Automated SMS", desc: "Review requests sent right after every customer interaction. Set it up once — it runs forever. No manual work, no forgetting." },
  { icon: GitBranch, title: "Smart Routing", desc: "4-5★ → Google review link sent automatically. 1-3★ → private feedback to your inbox. The threshold you control, the routing is instant." },
  { icon: Clock, title: "Perfect Timing", desc: "Messages go out at the right moment — after the job, after the appointment, after delivery. Configurable delay so the experience is still fresh." },
  { icon: Users, title: "Customer Tracking", desc: "Every customer, their rating, whether they reviewed, and their private feedback — all in one clear dashboard. No spreadsheets." },
  { icon: Shield, title: "Duplicate Prevention", desc: "Smart dedup ensures no customer is ever messaged twice within your configured window. Completely automated, completely silent." },
  { icon: BarChart2, title: "Weekly Reports", desc: "See your review velocity, rating trend, and response rate delivered to your inbox every week — without opening a single spreadsheet." },
];

function StickyFeaturesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Use a scroll listener instead of IntersectionObserver for smoother,
    // more controllable activation — fires based on which item's centre
    // is closest to the viewport centre.
    const update = () => {
      const viewMid = window.innerHeight / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      featureRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elMid = rect.top + rect.height / 2;
        const dist = Math.abs(elMid - viewMid);
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      });
      setActiveIdx(bestIdx);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section ref={sectionRef} className="bg-white border-t border-b border-stone-200">
      <div className="section-container max-w-6xl mx-auto">
        <Reveal className="text-center py-16 pb-8">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">Features</span>
          <h2 className="mt-3 text-display-sm md:text-display-md text-stone-900">Everything you need, nothing you don&apos;t</h2>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-0 pb-0">
          {/* LEFT: scrollable feature list */}
          <div className="lg:pr-12 pb-16">
            {FEATURES.map((feat, i) => (
              <div
                key={i}
                ref={el => { featureRefs.current[i] = el; }}
                className="py-12 border-b border-stone-100 last:border-0"
              >
                <motion.div
                  animate={{
                    opacity: activeIdx === i ? 1 : 0.55,
                    x: activeIdx === i ? 0 : -6,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      animate={{
                        backgroundColor: activeIdx === i ? "rgb(240, 253, 246)" : "rgb(248, 247, 244)",
                        borderColor: activeIdx === i ? "rgb(187, 247, 209)" : "rgb(232, 230, 223)",
                        scale: activeIdx === i ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
                    >
                      <feat.icon className="h-4 w-4" style={{ color: activeIdx === i ? "#16A34A" : "#A8A49A" }} />
                    </motion.div>
                    <motion.h3
                      animate={{ color: activeIdx === i ? "#1A1714" : "#7A7670" }}
                      transition={{ duration: 0.4 }}
                      className="text-[16px] font-bold"
                    >
                      {feat.title}
                    </motion.h3>
                    {activeIdx === i && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full bg-brand-500 shrink-0"
                      />
                    )}
                  </div>
                  <p className={`text-[14px] leading-[1.75] ml-[52px] transition-colors duration-400 ${activeIdx === i ? "text-stone-600" : "text-stone-400"}`}>
                    {feat.desc}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>

          {/* RIGHT: sticky — stays pinned while left side scrolls */}
          <div className="hidden lg:block">
            <div className="sticky top-24 py-16">
              <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-[0_16px_60px_rgba(0,0,0,.1)] bg-stone-50" style={{aspectRatio: "2546/1535"}}>
                <img
                  src="https://res.cloudinary.com/ddwysmpli/image/upload/q_auto/f_auto/v1776229887/Screenshot_2026-04-15_at_2.56.30_pm_lkvai3.png"
                  alt="Revuera SMS dashboard"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Active feature progress bar */}
              <div className="mt-5 flex gap-1.5">
                {FEATURES.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      flex: activeIdx === i ? 4 : 1,
                      opacity: activeIdx === i ? 1 : 0.25,
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-1.5 rounded-full ${activeIdx === i ? "bg-brand-600" : "bg-stone-200"}`}
                  />
                ))}
              </div>
              <p className="text-center text-[11px] text-stone-400 mt-3">
                {activeIdx + 1} of {FEATURES.length} — {FEATURES[activeIdx].title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Flow diagram ───────────────────────────────────────────────────────────
function FlowDiagram() {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-6 relative">
        <div className="absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-stone-200 via-brand-300 to-stone-200" />
        {[
          { icon: Users, label: "Customer visits", sub: "After job / appointment" },
          { icon: Smartphone, label: "SMS sent", sub: "Personalised message" },
          { icon: Star, label: "Review posted", sub: "4-5★ → Google public" },
        ].map((step, i) => (
          <Reveal key={i} delay={i * 0.1} className="text-center">
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }} className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-2xl bg-white border border-stone-200 shadow-card flex items-center justify-center hover:shadow-elevated transition-shadow">
                <step.icon className="h-7 w-7 text-brand-600" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-stone-900">{step.label}</div>
                <div className="text-[11px] text-stone-400 mt-0.5">{step.sub}</div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.35} className="mt-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full text-[12px] font-semibold text-stone-600 mb-4">
          <GitBranch className="h-3.5 w-3.5" /> Smart filtering
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 text-center">
            <div className="flex justify-center gap-0.5 mb-2">{[1,2,3,4,5].map(s=><Star key={s} className="h-4 w-4 fill-brand-400 stroke-brand-400"/>)}</div>
            <div className="text-[13px] font-bold text-brand-700">4-5 stars</div>
            <div className="text-[11px] text-brand-600 mt-1">→ Google Review</div>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center mb-2"><Lock className="h-6 w-6 text-stone-400" /></div>
            <div className="text-[13px] font-bold text-stone-700">1-3 stars</div>
            <div className="text-[11px] text-stone-500 mt-1">→ Private Inbox</div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

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
  { q: "How many SMS can I send per month?", a: "The Starter plan includes 300 contacts per month. Each contact gets an initial message plus one follow-up if needed. Resets monthly." },
  { q: "Do my customers need to install an app?", a: "No. It's plain SMS. Works on every phone — Android, iPhone, any carrier. No downloads, no logins, no friction." },
  { q: "Can I customise the message?", a: "Yes. Edit the initial message, follow-up, Google review link text, and low-rating response. Use {name} and {business} as placeholders." },
  { q: "What if a customer replies with something other than a number?", a: "Revuera sends a polite re-prompt asking them to reply 1-5. If they still don't, the contact is marked as unresponsive." },
  { q: "Does it work with my CRM or booking system?", a: "You can add customers manually or import a list. Shopify, WooCommerce, BigCommerce and Square integrations available on the Ecommerce plan." },
];

export default function SmsReviewsPage() {
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
                    For Service Businesses
                  </span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="text-display-md md:text-display-lg text-stone-900">
                  Your happy customers never leave reviews.
                  <span className="text-brand-600"> We ask them for you.</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-5 text-body-md text-stone-500 leading-relaxed max-w-[460px]">
                  After every job, appointment, or visit — Revuera sends a personalised SMS. Happy customers go straight to Google. Unhappy ones send you private feedback.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mt-8">
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-[44px] font-extrabold text-stone-900 tracking-tight leading-none">$19</span>
                    <span className="text-body-md text-stone-400">/month</span>
                    <span className="ml-2 text-[12px] text-stone-400 line-through">$289+ elsewhere</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <SmartCta plan="starter" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white h-12 px-7 rounded-xl text-[14px] font-semibold shadow-lg shadow-brand-600/20 transition-all">
                      Start Free Trial <ArrowRight className="h-4 w-4" />
                    </SmartCta>
                    <Link href="/pricing" className="inline-flex items-center h-12 px-6 rounded-xl border border-stone-300 bg-white/60 text-stone-600 hover:bg-white text-[14px] font-medium transition-all">
                      Compare Plans
                    </Link>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4">
                    {["7-day free trial", "No credit card", "Cancel anytime"].map(t => (
                      <span key={t} className="flex items-center gap-1.5 text-[12px] text-stone-400">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-500" />{t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 rounded-full bg-brand-400/10 blur-3xl" />
                </div>
                <PhoneMockup />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────────────────────── */}
        <section className="bg-white border-t border-b border-stone-200 py-12">
          <div className="section-container max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-8 divide-x divide-stone-200">
              {[
                { to: 340, suffix: "%", label: "More reviews collected on average" },
                { to: 89, suffix: "%", label: "SMS open rate (vs 20% email)" },
                { to: 4.8, suffix: "★", label: "Average resulting Google rating" },
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

        {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-cream">
          <div className="section-container max-w-3xl mx-auto">
            <Reveal className="text-center mb-14">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">How It Works</span>
              <h2 className="mt-3 text-display-sm md:text-display-md text-stone-900">From customer to Google review<br />in three steps</h2>
            </Reveal>
            <FlowDiagram />
          </div>
        </section>

        {/* ── BEFORE / AFTER ────────────────────────────────────────────── */}
        <section className="py-20 bg-white border-t border-b border-stone-200">
          <div className="section-container max-w-4xl mx-auto">
            <Reveal className="text-center mb-12">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">Real Results</span>
              <h2 className="mt-3 text-display-sm md:text-display-md text-stone-900">What happens when you turn it on</h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-5">
              <Reveal direction="left">
                <div className="rounded-2xl border-2 border-stone-200 bg-stone-50 p-7 h-full">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-5">Without Revuera</div>
                  <div className="space-y-3 mb-7">
                    {["Happy customers leave without reviewing","One bad day tanks your rating","Competitors outrank you on Google","No idea what customers really think"].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-500 text-[10px] font-bold">✕</div>
                        <span className="text-[13px] text-stone-500">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-5 border-t border-stone-200 flex items-center gap-3">
                    <div className="text-[26px] font-extrabold text-stone-400">3.8★</div>
                    <div className="text-[12px] text-stone-400">12 reviews · losing enquiries</div>
                  </div>
                </div>
              </Reveal>
              <Reveal direction="right">
                <div className="rounded-2xl border-2 border-brand-300 bg-brand-50 p-7 h-full shadow-[0_0_40px_rgba(22,163,74,.1)]">
                  <div className="text-[11px] font-bold text-brand-600 uppercase tracking-wider mb-5">With Revuera</div>
                  <div className="space-y-3 mb-7">
                    {["Every happy customer asked at the right moment","Unhappy feedback caught privately before Google","Rating climbs — more calls, more jobs","Dashboard shows every customer's journey"].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-brand-200 flex items-center justify-center shrink-0 mt-0.5 text-brand-700 text-[10px] font-bold">✓</div>
                        <span className="text-[13px] text-stone-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-5 border-t border-brand-200 flex items-center gap-3">
                    <div className="text-[26px] font-extrabold text-brand-600">4.9★</div>
                    <div className="text-[12px] text-brand-700">53 reviews · front page of Google</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── STICKY SCROLL FEATURES + DASHBOARD ───────────────────────── */}
        <StickyFeaturesSection />

        {/* ── VIDEO DEMO ────────────────────────────────────────────────── */}
        <section className="py-20">
          <div className="section-container max-w-[700px] mx-auto">
            <Reveal className="text-center mb-8">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">Demo</span>
              <h2 className="mt-3 text-display-sm text-stone-900">See it in action</h2>
            </Reveal>
            <Reveal>
              <div className="rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,.1)] border border-stone-200 aspect-video">
                <iframe
                  src="https://jumpshare.com/embed/aVqIaxC9FQ695RAWpHS3"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                  title="Revuera SMS Reviews Demo"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── PRICING CTA ───────────────────────────────────────────────── */}
        <section className="py-16 bg-brand-50 border-t border-b border-brand-100">
          <div className="section-container max-w-lg mx-auto text-center">
            <Reveal>
              <h2 className="text-display-sm text-stone-900 mb-2">Starter Plan — $19/month</h2>
              <p className="text-body-sm text-stone-500 mb-6">300 contacts/month · 7-day free trial · No credit card required</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <SmartCta plan="starter" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white h-11 px-7 rounded-xl text-[14px] font-semibold shadow-lg shadow-brand-600/20 transition-all">
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
