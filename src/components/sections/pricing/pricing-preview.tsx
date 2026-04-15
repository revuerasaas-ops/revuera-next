"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS, type PlanKey } from "@/lib/constants";

export function PricingPreview() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-caption font-semibold mb-4">
            Pricing
          </span>
          <h2 className="text-display-md md:text-display-lg text-stone-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-body-lg text-stone-500">
            7-day free trial on all plans. No lock-in contracts. Cancel anytime.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-stone-100 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-body-sm font-medium transition-all ${!annual ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-body-sm font-medium transition-all ${annual ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
            >
              Annual
              <span className="ml-1.5 text-brand-600 text-caption font-bold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {(Object.entries(PLANS) as [PlanKey, (typeof PLANS)[PlanKey]][]).map(([key, plan], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                "popular" in plan && plan.popular
                  ? "border-brand-300 bg-brand-50/30 shadow-glow-green"
                  : "border-stone-200 bg-white hover:border-brand-200"
              }`}
            >
              {"popular" in plan && plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white hover:bg-brand-600">
                  Most Popular
                </Badge>
              )}
              <div className="mb-6">
                <h3 className="text-heading-lg text-stone-900">{plan.name}</h3>
                <p className="text-body-sm text-stone-500 mt-1">{plan.tagline}</p>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-display-md text-stone-900">
                  ${annual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-body-sm text-stone-400">/mo</span>
                {annual && (
                  <span className="ml-2 text-caption text-brand-600 font-medium">
                    billed ${plan.annualTotal}/yr
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-body-sm text-stone-600">
                    <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`w-full h-12 text-base font-semibold ${"popular" in plan && plan.popular
                  ? "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/20"
                  : "bg-stone-900 hover:bg-stone-800 text-white"
                }`}
              >
                <Link href={`/signup?plan=${key}`}>
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
