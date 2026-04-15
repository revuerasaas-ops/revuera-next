"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { SmartCta } from "@/components/ui/smart-cta";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream py-14 md:py-20 lg:py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-25" />
      <div className="absolute inset-0 gradient-mesh-strong" />

      <div className="relative section-container">
        <div className="max-w-[780px] mx-auto text-center">
          {/* Badge — original: "Australian owned & built" */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-brand-200/50 text-brand-700 text-[12px] font-semibold mb-8 shadow-soft">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              Australian owned &amp; built
            </span>
          </motion.div>

          {/* H1 — original: "Turn every customer into a 5-star Google review" */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-display-xl text-stone-900"
          >
            Turn every customer into a
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-brand-600">5-star</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="absolute bottom-[4px] left-0 w-full h-[10px] bg-brand-200/40 rounded-sm -z-[1] origin-left"
              />
            </span>{" "}
            Google review
          </motion.h1>

          {/* Sub — original: "Bad reviews go to your inbox. Good ones go to Google." */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-body-lg text-stone-500 max-w-[600px] mx-auto"
          >
            <strong className="text-stone-700">Bad reviews go to your inbox. Good ones go to Google.</strong>
            <br />
            Revuera asks one simple question after every visit — then routes customers to the right place.
          </motion.p>

          {/* CTA — original: "Get Started Free" */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10"
          >
            <SmartCta className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white h-[52px] px-8 rounded-2xl text-[15px] font-semibold shadow-lg shadow-brand-600/20 hover:shadow-xl hover:shadow-brand-600/25 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="h-4.5 w-4.5" />
            </SmartCta>
          </motion.div>

          {/* Trust strip — original: "4.8★ rated · 7-day free trial · No lock-in · From $9/mo" */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-stone-400"
          >
            <span className="flex items-center gap-1">
              <span className="text-amber-500">4.8★</span> rated
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-brand-500" />
              7-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-brand-500" />
              No lock-in
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-brand-500" />
              From $9/mo
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
