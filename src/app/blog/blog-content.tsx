"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const posts = [
  {
    slug: "how-to-get-more-google-reviews",
    title: "How to Get More Google Reviews in 2026",
    excerpt: "Practical strategies to increase your Google review count without being pushy or awkward. The tactics that actually work for Australian businesses.",
    date: "March 2026",
    tag: "Growth",
    gradient: "from-brand-600 to-brand-800",
    featured: true,
  },
  {
    slug: "google-review-automation",
    title: "Google Review Automation: Put Your Reputation on Autopilot",
    excerpt: "How smart review automation protects your rating while growing your review count — without lifting a finger.",
    date: "February 2026",
    tag: "Automation",
    gradient: "from-stone-700 to-stone-900",
  },
  {
    slug: "negative-reviews-guide",
    title: "The Business Owner's Guide to Handling Negative Reviews",
    excerpt: "Turn negative feedback into an opportunity to improve — before it hits Google.",
    date: "January 2026",
    tag: "Strategy",
    gradient: "from-amber-600 to-amber-800",
  },
];

export function BlogContent() {
  const [featured, ...rest] = posts;

  return (
    <div className="section-container max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <motion.span initial={{ opacity: 0, filter: "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">Blog</motion.span>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-3 text-display-md md:text-display-lg text-stone-900">
          Insights for local business
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-body-lg text-stone-500">
          Tips, guides, and strategies for growing your Google reviews.
        </motion.p>
      </div>

      {/* Featured post — full width */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
        <Link href={`/blog/${featured.slug}`} className="group block relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-card">
          <div className={`h-[200px] md:h-[240px] bg-gradient-to-br ${featured.gradient} relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute top-5 left-6">
              <span className="inline-flex items-center text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white">{featured.tag}</span>
            </div>
            <div className="absolute top-5 right-6">
              <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Featured</span>
            </div>
          </div>
          <div className="p-7 md:p-8">
            <span className="text-caption text-stone-400 font-medium">{featured.date}</span>
            <h2 className="mt-2 text-heading-lg md:text-[1.4rem] text-stone-900 group-hover:text-brand-600 transition-colors leading-snug">{featured.title}</h2>
            <p className="mt-3 text-body-md text-stone-500 max-w-[600px]">{featured.excerpt}</p>
            <span className="mt-5 inline-flex items-center text-body-sm text-brand-600 font-semibold gap-1.5 group-hover:gap-2.5 transition-all">
              Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Grid — remaining posts */}
      <div className="grid md:grid-cols-2 gap-6">
        {rest.map((post, i) => (
          <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
            <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card card-hover h-full">
              <div className={`h-[120px] bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white">{post.tag}</span>
                </div>
              </div>
              <div className="p-5">
                <span className="text-caption text-stone-400 font-medium">{post.date}</span>
                <h2 className="mt-2 text-heading-sm text-stone-900 group-hover:text-brand-600 transition-colors leading-snug">{post.title}</h2>
                <p className="mt-2 text-body-sm text-stone-500 line-clamp-2">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center text-[13px] text-brand-600 font-semibold gap-1.5 group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
