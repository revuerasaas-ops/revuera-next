"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle, X, Check } from "lucide-react";

export function Problem() {
  const [count, setCount] = useState(0);
  const statRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = statRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const target = 88;
        const start = performance.now();
        function animate(now: number) {
          const p = Math.min((now - start) / 1200, 1);
          setCount(Math.floor(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="section-container">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:sticky md:top-32">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">The Problem</span>
            <div ref={statRef} className="mt-4 text-[96px] md:text-[120px] font-extrabold text-stone-900 leading-none tracking-tighter">{count}%</div>
            <p className="mt-3 text-body-lg text-stone-500 max-w-[320px]">of customers trust Google reviews as much as personal recommendations. But most happy customers <strong className="text-stone-700">never leave one</strong>.</p>
          </motion.div>
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-red-200/60 p-6 lg:p-7">
              <h4 className="flex items-center gap-2 text-heading-sm text-stone-900 mb-4"><XCircle className="h-5 w-5 text-red-500" />Without Revuera</h4>
              <div className="space-y-3">
                {["Angry customer posts a 1-star review publicly","You find out days later — damage already done","Happy customers forget to leave reviews","Your rating drops, new leads disappear"].map((t,i)=>(
                  <div key={i} className="flex items-start gap-3 text-body-sm text-stone-600"><X className="h-4 w-4 text-red-400 mt-0.5 shrink-0"/>{t}</div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-brand-200/60 p-6 lg:p-7 shadow-glow-green">
              <h4 className="flex items-center gap-2 text-heading-sm text-stone-900 mb-4"><CheckCircle className="h-5 w-5 text-brand-600" />With Revuera</h4>
              <div className="space-y-3">
                {[
                  <>Unhappy customer sends <strong className="text-stone-900">private</strong> feedback</>,
                  "You resolve it before it ever goes public",
                  "Happy customers redirected straight to Google",
                  "Your rating climbs, more leads come in",
                ].map((t,i)=>(
                  <div key={i} className="flex items-start gap-3 text-body-sm text-stone-600"><Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0"/><span>{t}</span></div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
