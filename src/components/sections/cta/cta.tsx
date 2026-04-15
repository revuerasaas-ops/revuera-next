"use client";

import { ArrowRight } from "lucide-react";
import { SmartCta } from "@/components/ui/smart-cta";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fafdf7 0%, #f0f9eb 50%, #fdf8f0 100%)" }}>
      {/* Subtle green glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(22,163,74,0.08) 0%, transparent 70%)" }}
        />
      </div>
      {/* Dot grid — brand-green tinted */}
      <div className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(22,163,74,0.12) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative section-container text-center">
        <motion.div
          initial={{ opacity: 0, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 border border-brand-200 text-brand-700 text-[11px] font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            7-day free trial
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="text-display-md md:text-display-lg text-stone-900 tracking-tight"
        >
          Ready to protect your
          <br />
          <span className="text-brand-600">Google rating?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className="mt-4 text-body-lg text-stone-500"
        >
          Start free. Cancel anytime.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.24 }}
          className="mt-8"
        >
          <SmartCta className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white h-[52px] px-8 rounded-2xl text-[15px] font-semibold shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30 transition-all duration-300 active:scale-[0.97]">
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </SmartCta>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.32 }}
          className="mt-4 text-[12px] text-stone-400"
        >
          7-day free trial · Plans from $9/mo · No lock-in
        </motion.p>
      </div>
    </section>
  );
}
