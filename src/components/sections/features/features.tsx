"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  ShoppingBag,
  BarChart3,
  Shield,
  Clock,
  Smartphone,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "SMS Review Requests",
    description: "Send personalised SMS to customers after their visit. They reply with a rating — no apps, no links, no friction.",
    tag: "Starter Plan",
  },
  {
    icon: ShoppingBag,
    title: "Post-Checkout Review Funnel",
    description: "Automatically redirect ecommerce customers to a branded review page after purchase. Works with Shopify, WooCommerce, and more.",
    tag: "Ecommerce Plan",
  },
  {
    icon: Shield,
    title: "Smart Rating Filter",
    description: "4-5★ customers go to Google. 1-3★ send private feedback to your inbox. Your public rating only goes up.",
    tag: "Both Plans",
    highlight: true,
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track sent requests, response rates, rating distribution, and trends — all from your dashboard with real data.",
  },
  {
    icon: Clock,
    title: "24hr Follow-Up",
    description: "Customers who don't respond get a gentle follow-up SMS the next day. Automatic, no manual work.",
  },
  {
    icon: Smartphone,
    title: "Custom Templates",
    description: "Personalise your outbound SMS, positive reply, negative reply, and feedback confirmation messages.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function Features() {
  return (
    <section className="py-24 md:py-32 bg-cream relative">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative section-container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-caption font-semibold mb-4">
            <Zap className="h-3 w-3" />
            Features
          </span>
          <h2 className="text-display-md md:text-display-lg text-stone-900">
            Everything you need to{" "}
            <span className="text-brand-600">grow your reviews</span>
          </h2>
          <p className="mt-4 text-body-lg text-stone-500">
            Whether you run a service business or an online store, Revuera gives you the tools to collect reviews on autopilot.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`group relative rounded-2xl border p-7 transition-all duration-300 ${
                feature.highlight
                  ? "bg-brand-50/40 border-brand-200 shadow-glow-green"
                  : "bg-white border-stone-200 hover:border-brand-200/60 hover:shadow-card"
              }`}
            >
              {feature.tag && (
                <span className={`absolute top-4 right-4 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                  feature.highlight ? "bg-brand-100 text-brand-700" : "bg-stone-100 text-stone-500"
                }`}>
                  {feature.tag}
                </span>
              )}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 ${
                feature.highlight
                  ? "bg-brand-100 text-brand-600"
                  : "bg-stone-100 text-stone-600 group-hover:bg-brand-50 group-hover:text-brand-600"
              }`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-heading-sm text-stone-900">{feature.title}</h3>
              <p className="mt-2.5 text-body-sm text-stone-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
