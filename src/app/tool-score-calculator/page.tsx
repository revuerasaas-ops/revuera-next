"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CTA } from "@/components/sections/cta/cta";
import { Input } from "@/components/ui/input";
import { Calculator, Star, TrendingUp, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function ScoreCalculatorPage() {
  const [current, setCurrent] = useState({ rating: "4.2", reviews: "25" });
  const [newReviews, setNewReviews] = useState({ five: "10", four: "3", three: "1", two: "0", one: "0" });

  const result = useMemo(() => {
    const r = parseFloat(current.rating) || 0;
    const n = parseInt(current.reviews) || 0;
    const totalExistingScore = r * n;

    const new5 = parseInt(newReviews.five) || 0;
    const new4 = parseInt(newReviews.four) || 0;
    const new3 = parseInt(newReviews.three) || 0;
    const new2 = parseInt(newReviews.two) || 0;
    const new1 = parseInt(newReviews.one) || 0;
    const totalNew = new5 + new4 + new3 + new2 + new1;
    const newScore = new5 * 5 + new4 * 4 + new3 * 3 + new2 * 2 + new1 * 1;

    const finalTotal = n + totalNew;
    const finalRating = finalTotal > 0 ? (totalExistingScore + newScore) / finalTotal : 0;
    const change = finalRating - r;

    return {
      currentRating: r,
      currentReviews: n,
      newReviewCount: totalNew,
      projectedRating: Math.round(finalRating * 100) / 100,
      totalReviews: finalTotal,
      change: Math.round(change * 100) / 100,
    };
  }, [current, newReviews]);

  return (
    <>
      <Header />
      <main>
        <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative section-container max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-caption font-semibold mb-6">
                <Calculator className="h-3.5 w-3.5" />Free Tool
              </span>
              <h1 className="text-display-md md:text-display-lg text-stone-900">Review Score Calculator</h1>
              <p className="mt-4 text-body-lg text-stone-500">See how new reviews will impact your Google rating. Plan your review strategy.</p>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8">
              {/* Current stats */}
              <h3 className="text-heading-sm text-stone-900 mb-4">Your current Google rating</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="text-body-sm font-medium text-stone-700 block mb-1.5">Current rating</label>
                  <Input type="number" value={current.rating} onChange={(e) => setCurrent({ ...current, rating: e.target.value })} min="1" max="5" step="0.1" className="h-11" />
                </div>
                <div>
                  <label className="text-body-sm font-medium text-stone-700 block mb-1.5">Total reviews</label>
                  <Input type="number" value={current.reviews} onChange={(e) => setCurrent({ ...current, reviews: e.target.value })} min="0" className="h-11" />
                </div>
              </div>

              {/* New reviews */}
              <h3 className="text-heading-sm text-stone-900 mb-4">Projected new reviews</h3>
              <div className="grid grid-cols-5 gap-3 mb-8">
                {[
                  { key: "five", label: "5★", stars: 5 },
                  { key: "four", label: "4★", stars: 4 },
                  { key: "three", label: "3★", stars: 3 },
                  { key: "two", label: "2★", stars: 2 },
                  { key: "one", label: "1★", stars: 1 },
                ].map((item) => (
                  <div key={item.key}>
                    <label className="text-caption font-medium text-stone-500 block mb-1.5 text-center">{item.label}</label>
                    <Input type="number" value={newReviews[item.key as keyof typeof newReviews]} onChange={(e) => setNewReviews({ ...newReviews, [item.key]: e.target.value })} min="0" className="h-10 text-center" />
                  </div>
                ))}
              </div>

              {/* Result */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-stone-50 border border-stone-200 p-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    </div>
                    <p className="text-2xl font-extrabold text-stone-900">{result.projectedRating}</p>
                    <p className="text-caption text-stone-400">Projected Rating</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="h-5 w-5 text-brand-600" />
                    </div>
                    <p className={`text-2xl font-extrabold ${result.change >= 0 ? "text-brand-600" : "text-red-600"}`}>
                      {result.change >= 0 ? "+" : ""}{result.change}
                    </p>
                    <p className="text-caption text-stone-400">Rating Change</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="h-5 w-5 text-stone-600" />
                    </div>
                    <p className="text-2xl font-extrabold text-stone-900">{result.totalReviews}</p>
                    <p className="text-caption text-stone-400">Total Reviews</p>
                  </div>
                </div>

                {result.change > 0 && (
                  <p className="mt-4 text-center text-body-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5">
                    With Revuera&apos;s smart filter, most of these {result.newReviewCount} reviews would be 4-5★ on Google — boosting your rating even faster.
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
