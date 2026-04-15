"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmartCta } from "@/components/ui/smart-cta";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Shield, Zap, Eye, MapPin, Star, TrendingUp, Users, CheckCircle, Lightbulb, Rocket, Target, Lock } from "lucide-react";

// ── Animated number counter ────────────────────────────────────────────────
function Counter({ to, suffix = "", duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(eased * to));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(to);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ── Scroll-reveal wrapper ──────────────────────────────────────────────────
function Reveal({
  children, delay = 0, direction = "up", className = "",
}: {
  children: React.ReactNode; delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}) {
  const x = direction === "left" ? -40 : direction === "right" ? 40 : 0;
  const y = direction === "up" ? 30 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x, y, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Animated star rating ───────────────────────────────────────────────────
function StarRating({ rating, animate = false }: { rating: number; animate?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={animate ? { scale: 0, rotate: -30 } : false}
          animate={animate ? { scale: 1, rotate: 0 } : undefined}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 400, damping: 15 }}
        >
          <Star
            className="h-4 w-4"
            fill={i <= rating ? "#F59E0B" : "none"}
            stroke={i <= rating ? "#F59E0B" : "#D4D1C8"}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ── Timeline data ──────────────────────────────────────────────────────────
const TIMELINE = [
  {
    period: "Mid 2025",
    title: "The moment it clicked",
    body: "Watching a local plumber lose his top Google ranking after one unfair review during a bad week. He had 47 happy customers that month who never said a word online. The asymmetry was infuriating.",
    icon: "lightbulb",
    color: "from-amber-400 to-amber-500",
  },
  {
    period: "Late 2025",
    title: "Nights and weekends",
    body: "Cloudflare Workers, Supabase, Twilio, Stripe — the whole stack wired together by hand. First working SMS review request sent at 2am to a test number. It worked. Immediately started building the dashboard.",
    icon: "zap",
    color: "from-brand-400 to-brand-600",
  },
  {
    period: "Early 2026",
    title: "Real businesses, real data",
    body: "First paying customers: Arrow Air Conditioning, Paynless Dental, Indus Lawyers. Not just validating product-market fit — learning what businesses actually needed vs. what I thought they needed.",
    icon: "rocket",
    color: "from-brand-500 to-brand-700",
  },
  {
    period: "Mid 2026",
    title: "Public launch",
    body: "Ecommerce and Starter plans live. Smart filtering, 19 platform integrations, automated SMS, branded review funnels. Enterprise-grade features. $9/month pricing.",
    icon: "target",
    color: "from-brand-600 to-brand-800",
  },
];

// ── Values ─────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: Shield,
    label: "Fairness first",
    body: "Every business deserves a rating that reflects their actual quality. We don't fake reviews or suppress legitimate complaints. We just make the system work fairly.",
    accent: "#16A34A",
    bg: "bg-brand-50",
    border: "border-brand-200",
  },
  {
    icon: Zap,
    label: "Radical simplicity",
    body: "If it takes more than 5 minutes to set up, we've failed. Every feature passes one test: does this make it simpler for the business owner?",
    accent: "#F59E0B",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    icon: Eye,
    label: "Transparency",
    body: "Clear pricing. No hidden fees. No lock-in contracts. What you see on our pricing page is what you pay. Nothing more, nothing less.",
    accent: "#2563EB",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    icon: MapPin,
    label: "Australian made",
    body: "Built in Sydney for Australian businesses. ABN registered, locally supported, designed for the industries and workflows that make up the Australian small business landscape.",
    accent: "#16A34A",
    bg: "bg-brand-50",
    border: "border-brand-200",
  },
];

// ── Smart Filtering explainer ──────────────────────────────────────────────
function FilterExplainer() {
  const [phase, setPhase] = useState<"idle" | "positive" | "negative">("idle");

  useEffect(() => {
    const seq = async () => {
      await new Promise(r => setTimeout(r, 800));
      setPhase("positive");
      await new Promise(r => setTimeout(r, 2200));
      setPhase("idle");
      await new Promise(r => setTimeout(r, 600));
      setPhase("negative");
      await new Promise(r => setTimeout(r, 2200));
      setPhase("idle");
    };
    seq();
    const id = setInterval(() => { seq(); }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative bg-white rounded-3xl border border-stone-200 shadow-floating p-8 overflow-hidden">
      {/* Background glow */}
      <AnimatePresence>
        {phase === "positive" && (
          <motion.div
            key="pos-glow"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-brand-50 to-transparent rounded-3xl"
          />
        )}
        {phase === "negative" && (
          <motion.div
            key="neg-glow"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent rounded-3xl"
          />
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Customer */}
        <div className="text-center mb-6">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center"><Users className="h-6 w-6 text-stone-400" /></div>
            <span className="text-[12px] font-semibold text-stone-500">Customer rates their experience</span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-8">
          {[
            { stars: 5, label: "Amazing!", active: phase === "positive" },
            { stars: 3, label: "Not great", active: phase === "negative" },
          ].map((opt, i) => (
            <motion.div
              key={i}
              animate={{
                scale: opt.active ? 1.06 : 1,
                boxShadow: opt.active
                  ? i === 0 ? "0 8px 32px rgba(22,163,74,.2)" : "0 8px 32px rgba(245,158,11,.2)"
                  : "0 1px 3px rgba(0,0,0,.04)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`flex-1 rounded-2xl border p-3 text-center transition-colors ${
                opt.active
                  ? i === 0 ? "border-brand-300 bg-brand-50" : "border-amber-300 bg-amber-50"
                  : "border-stone-200 bg-white"
              }`}
            >
              <StarRating rating={opt.stars} />
              <div className={`text-[11px] font-semibold mt-1.5 ${
                opt.active ? (i === 0 ? "text-brand-600" : "text-amber-600") : "text-stone-400"
              }`}>{opt.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Routing arrow */}
        <div className="flex items-center justify-center mb-8">
          <motion.div
            animate={{ opacity: phase === "idle" ? 0.3 : 1 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Smart routing</div>
            <motion.div
              animate={{ y: phase === "idle" ? 0 : [0, 4, 0] }}
              transition={{ duration: 0.6, repeat: phase !== "idle" ? Infinity : 0 }}
            >
              <ArrowRight className="h-5 w-5 text-stone-300 rotate-90" />
            </motion.div>
          </motion.div>
        </div>

        {/* Outcome */}
        <div className="grid grid-cols-2 gap-3">
          {/* Google */}
          <motion.div
            animate={{
              scale: phase === "positive" ? 1 : 0.97,
              opacity: phase === "negative" ? 0.4 : 1,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl bg-brand-600 p-4 text-center"
          >
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-[12px] font-bold text-white">Google Review</div>
            <div className="text-[10px] text-brand-200 mt-0.5">Public · Helps your ranking</div>
          </motion.div>
          {/* Private */}
          <motion.div
            animate={{
              scale: phase === "negative" ? 1 : 0.97,
              opacity: phase === "positive" ? 0.4 : 1,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl bg-stone-800 p-4 text-center"
          >
            <div className="text-2xl mb-1"></div>
            <div className="text-[12px] font-bold text-white">Private Feedback</div>
            <div className="text-[10px] text-stone-400 mt-0.5">Your inbox only · Never public</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Problem section: the asymmetry ────────────────────────────────────────
function TheProblem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-stone-900 relative overflow-hidden">
      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative section-container max-w-5xl mx-auto">
        <Reveal className="text-center mb-16">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-[0.15em]">The Problem</span>
          <h2 className="mt-4 text-display-md md:text-display-lg text-white">
            One bad day can undo<br />
            <span className="text-brand-400">months of great work</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { num: "47", label: "happy customers that month", sub: "Never asked to review", color: "text-brand-400" },
            { num: "1", label: "difficult customer", sub: "Went straight to Google", color: "text-red-400" },
            { num: "−0.4★", label: "rating drop overnight", sub: "Months of damage", color: "text-red-400" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center p-7 rounded-2xl bg-white/[0.04] border border-white/[0.08]"
            >
              <div className={`text-[52px] font-extrabold tracking-tighter leading-none ${stat.color}`}>
                {stat.num}
              </div>
              <div className="text-[14px] font-semibold text-white mt-2">{stat.label}</div>
              <div className="text-[12px] text-stone-500 mt-1">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        <Reveal className="max-w-2xl mx-auto text-center">
          <p className="text-body-lg text-stone-400 leading-relaxed">
            The tools that could fix this cost{" "}
            <span className="text-white font-semibold">$289–$450/month</span>
            {" "}— built for enterprise, priced for enterprise.{" "}
            <span className="text-stone-300">
              Small businesses were left with nothing.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function AboutPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineHeightSpring = useSpring(lineHeight, { stiffness: 100, damping: 30 });

  return (
    <>
      <Header />
      <main>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-[80vh] flex items-center justify-center bg-cream overflow-hidden py-24">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute inset-0 gradient-mesh-strong" />

          {/* Floating orbs */}
          {[
            { size: 320, x: "10%", y: "20%", color: "rgba(22,163,74,0.06)", delay: 0 },
            { size: 200, x: "80%", y: "60%", color: "rgba(134,239,172,0.08)", delay: 1.5 },
            { size: 150, x: "60%", y: "10%", color: "rgba(245,158,11,0.05)", delay: 0.8 },
          ].map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: orb.size, height: orb.size,
                left: orb.x, top: orb.y,
                background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 6 + i, repeat: Infinity, delay: orb.delay, ease: "easeInOut" }}
            />
          ))}

          <div className="relative section-container max-w-4xl mx-auto text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-brand-200/60 text-brand-700 text-[11px] font-bold tracking-wide uppercase shadow-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Our Story
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-display-lg md:text-display-xl text-stone-900"
            >
              Built because{" "}
              <span className="relative">
                <span className="relative z-10 text-brand-600">every business</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-1 left-0 w-full h-[8px] bg-brand-200/50 rounded-full -z-10 origin-left"
                />
              </span>
              <br />deserves a fair shot
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-body-lg text-stone-500 max-w-[600px] mx-auto leading-relaxed"
            >
              We believe every Australian business deserves a Google rating that reflects the quality of their work — not the mood of one bad day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              <SmartCta className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white h-12 px-7 rounded-xl text-[14px] font-semibold shadow-lg shadow-brand-600/20 transition-all">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </SmartCta>
              <Link href="/pricing" className="inline-flex items-center h-12 px-6 rounded-xl border border-stone-300 bg-white/50 text-stone-600 hover:bg-white text-[14px] font-medium transition-all">
                See Pricing
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────────────────── */}
        <section className="bg-white border-t border-b border-stone-200 py-10">
          <div className="section-container max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-stone-200 rounded-2xl overflow-hidden">
              {[
                { val: 200, suffix: "K+", label: "Google reviews posted" },
                { val: 9, suffix: "/mo", prefix: "$", label: "Starting price" },
                { val: 98, suffix: "%", label: "Smart filter accuracy" },
                { val: 100, suffix: "%", label: "Australian built" },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.08} className="bg-white p-6 md:p-8 text-center">
                  <div className="text-[32px] md:text-[40px] font-extrabold text-stone-900 tracking-tight leading-none">
                    {s.prefix}<Counter to={s.val} suffix={s.suffix} />
                  </div>
                  <div className="text-[12px] text-stone-400 mt-2 font-medium">{s.label}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE PROBLEM (dark section) ────────────────────────────────── */}
        <TheProblem />

        {/* ── THE SOLUTION: SMART FILTERING ────────────────────────────── */}
        <section className="py-24 md:py-32 bg-cream">
          <div className="section-container max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <Reveal>
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">Our Solution</span>
                  <h2 className="mt-4 text-display-sm md:text-display-md text-stone-900">
                    One simple question.<br />
                    <span className="text-brand-600">Smart routing.</span>
                  </h2>
                  <p className="mt-5 text-body-md text-stone-500 leading-relaxed">
                    Revuera asks every customer to rate their experience. Happy customers go directly to Google — adding to your public rating. Unhappy customers send private feedback straight to your inbox — never touching Google.
                  </p>
                </Reveal>

                <Reveal delay={0.1} className="mt-8 space-y-4">
                  {[
                    { icon: "star", title: "4–5 stars", desc: "Sent to your Google review page. Builds your public reputation automatically.", color: "bg-brand-50 border-brand-200" },
                    { icon: "lock", title: "1–3 stars", desc: "Private feedback to your inbox only. It never touches Google.", color: "bg-stone-50 border-stone-200" },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${item.color}`}>
                      <span className="shrink-0">{item.icon === "star" ? <Star className="h-6 w-6 fill-amber-400 text-amber-400" /> : <Shield className="h-6 w-6 text-stone-400" />}</span>
                      <div>
                        <div className="text-[14px] font-semibold text-stone-900">{item.title}</div>
                        <div className="text-[13px] text-stone-500 mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </Reveal>
              </div>

              <Reveal delay={0.15} direction="right">
                <FilterExplainer />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FOUNDER STORY ─────────────────────────────────────────────── */}
        <section className="py-24 bg-white border-t border-b border-stone-200">
          <div className="section-container max-w-3xl mx-auto">
            <Reveal className="text-center mb-12">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">The Founder</span>
              <h2 className="mt-4 text-display-sm text-stone-900">Why I built this</h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative">
                {/* Quote mark */}
                <div className="absolute -top-4 -left-4 text-[80px] text-brand-100 font-serif leading-none select-none">&ldquo;</div>
                <div className="relative space-y-5 text-body-md text-stone-600 leading-relaxed pl-4">
                  <p>
                    I&apos;m <strong className="text-stone-900">Pranav Bantaram</strong> — a 21-year-old developer and entrepreneur from Sydney. I kept watching how much Google reviews shaped whether a local business grew or died. One unfair review could tank months of great work, while happy customers walked out the door without ever leaving one.
                  </p>
                  <blockquote className="my-8 pl-6 border-l-[3px] border-brand-400 text-heading-sm text-stone-800 italic font-medium">
                    The review tools that existed cost $300+/month. Too expensive. Too complicated. Not built for the plumber down the road.
                  </blockquote>
                  <p>
                    So I built Revuera. One simple idea: ask every customer one question. Happy? Go to Google. Not happy? Tell us privately. Smart filtering, automated SMS — enterprise power at small business pricing. Australian made, for Australian businesses.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="text-[15px] font-semibold text-stone-900">Pranav Bantaram</div>
                <div className="text-[13px] text-stone-500">Founder & Developer · Sydney, NSW</div>
                <div className="text-[12px] text-stone-400 mt-0.5">ABN 23 308 272 266</div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── TIMELINE ──────────────────────────────────────────────────── */}
        <section className="py-24 md:py-32 bg-cream">
          <div className="section-container max-w-4xl mx-auto">
            <Reveal className="text-center mb-16">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">Our Journey</span>
              <h2 className="mt-4 text-display-sm md:text-display-md text-stone-900">From idea to impact</h2>
            </Reveal>

            <div ref={timelineRef} className="relative">
              {/* Animated line */}
              <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-[2px] bg-stone-200 hidden md:block overflow-hidden">
                <motion.div
                  className="w-full bg-gradient-to-b from-brand-400 to-brand-600 origin-top"
                  style={{ height: lineHeightSpring }}
                />
              </div>

              <div className="space-y-14">
                {TIMELINE.map((item, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                      className={`relative flex flex-col md:flex-row gap-8 items-center ${!isLeft ? "md:flex-row-reverse" : ""}`}
                    >
                      {/* Content */}
                      <div className={`w-full md:w-[46%] ${isLeft ? "md:pr-12" : "md:pl-12"}`}>
                        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-sm`}>
                              {item.icon === "lightbulb" && <Lightbulb className="h-5 w-5 text-white" />}
                              {item.icon === "zap" && <Zap className="h-5 w-5 text-white" />}
                              {item.icon === "rocket" && <Rocket className="h-5 w-5 text-white" />}
                              {item.icon === "target" && <Target className="h-5 w-5 text-white" />}
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-brand-600 uppercase tracking-wider mb-1">{item.period}</div>
                              <h4 className="text-[16px] font-bold text-stone-900 mb-2">{item.title}</h4>
                              <p className="text-[13.5px] text-stone-500 leading-[1.65]">{item.body}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Centre dot */}
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-brand-600 border-4 border-white shadow-md z-10 items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>

                      <div className="hidden md:block w-[46%]" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── VALUES ────────────────────────────────────────────────────── */}
        <section className="py-24 bg-white border-t border-b border-stone-200">
          <div className="section-container max-w-4xl mx-auto">
            <Reveal className="text-center mb-12">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">What We Stand For</span>
              <h2 className="mt-4 text-display-sm text-stone-900">Our values</h2>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-5">
              {VALUES.map((v, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,.07)" }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className={`p-7 bg-white rounded-2xl border ${v.border} cursor-default`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${v.bg} border ${v.border} flex items-center justify-center mb-5`}>
                      <v.icon className="h-5 w-5" style={{ color: v.accent }} />
                    </div>
                    <h4 className="text-[16px] font-bold text-stone-900 mb-2">{v.label}</h4>
                    <p className="text-[13.5px] text-stone-500 leading-[1.65]">{v.body}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── ROI + COMPETITOR COMPARISON ───────────────────────────────── */}
        <section className="py-24 md:py-32 bg-cream">
          <div className="section-container max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left: value prop */}
              <div>
                <Reveal>
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">The ROI</span>
                  <h2 className="mt-4 text-display-sm md:text-display-md text-stone-900">
                    One Google review<br />
                    <span className="text-brand-600">is worth more than you think</span>
                  </h2>
                  <p className="mt-5 text-body-md text-stone-500 leading-relaxed">
                    Research shows that moving from 4.0 to 4.5 stars increases click-through rates by up to 25%. More clicks means more calls. More calls means more jobs.
                  </p>
                </Reveal>

                <Reveal delay={0.1} className="mt-8 space-y-3">
                  {[
                    { icon: TrendingUp, stat: "+25%", desc: "More enquiries with each half-star gained" },
                    { icon: Users, stat: "87%", desc: "Consumers read reviews before choosing a local business" },
                    { icon: Star, stat: "4.5★", desc: "Target rating where trust and conversions peak" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-200">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-brand-600" />
                      </div>
                      <div>
                        <span className="text-[14px] font-bold text-stone-900">{item.stat}</span>
                        <span className="text-[13px] text-stone-500 ml-2">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </Reveal>
              </div>

              {/* Right: competitor comparison */}
              <Reveal delay={0.15} direction="right">
                <div className="bg-white rounded-3xl border border-stone-200 shadow-floating overflow-hidden">
                  <div className="p-6 border-b border-stone-100">
                    <div className="text-[13px] font-semibold text-stone-500">Review management tools</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">Monthly pricing comparison</div>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {[
                      { name: "Birdeye", price: "$299", tag: "Enterprise", ours: false },
                      { name: "Podium", price: "$289", tag: "Enterprise", ours: false },
                      { name: "ReviewTrackers", price: "$119", tag: "Mid-market", ours: false },
                      { name: "Revuera", price: "$9", tag: "Small business", ours: true },
                    ].map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className={`flex items-center justify-between px-6 py-4 ${c.ours ? "bg-brand-50" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          {c.ours
                            ? <CheckCircle className="h-4 w-4 text-brand-600 shrink-0" />
                            : <div className="w-4 h-4 rounded-full border-2 border-stone-200 shrink-0" />
                          }
                          <div>
                            <span className={`text-[14px] font-semibold ${c.ours ? "text-brand-700" : "text-stone-600"}`}>{c.name}</span>
                            <span className="ml-2 text-[11px] text-stone-400">{c.tag}</span>
                          </div>
                        </div>
                        <div className={`text-[16px] font-extrabold ${c.ours ? "text-brand-600" : "text-stone-300 line-through"}`}>
                          {c.price}<span className="text-[11px] font-normal">/mo</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="px-6 py-4 bg-brand-600">
                    <div className="text-[13px] font-semibold text-white">
                      97% cheaper than enterprise alternatives
                    </div>
                    <div className="text-[11px] text-brand-200 mt-0.5">
                      Same smart filtering. Better UX. Built for your scale.
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-stone-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(22,163,74,0.2), transparent 70%)" }}
          />
          <div className="relative section-container max-w-2xl mx-auto text-center">
            <Reveal>
              <h2 className="text-display-sm md:text-display-md text-white">
                Ready to take back control<br />of your reputation?
              </h2>
              <p className="mt-4 text-body-md text-stone-400 max-w-md mx-auto">
                7-day free trial. No credit card required. Setup takes under 5 minutes.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <SmartCta className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white h-13 px-8 rounded-xl text-[15px] font-semibold shadow-lg shadow-brand-600/25 transition-all">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </SmartCta>
                <Link href="/pricing" className="inline-flex items-center h-13 px-7 rounded-xl border border-white/20 text-stone-300 hover:text-white hover:border-white/40 text-[14px] font-medium transition-all">
                  See Pricing
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
