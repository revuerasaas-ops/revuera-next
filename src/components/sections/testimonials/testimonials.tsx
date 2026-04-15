"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  { quote: "Connected our CRM and forgot about it. Reviews started flowing in automatically — we've grown substantially since. No manual work at all.", name: "Integral Home Care" },
  { quote: "Our Google presence looks completely different now. More presentable, more professional, and we're getting noticeably more enquiries coming through.", name: "Indus Lawyers" },
  { quote: "So simple and so affordable. We had visible new reviews within the first week. It's already bringing in new clients and paying for itself many times over.", name: "Paynless Dental" },
  { quote: "Only paying $19 a month and it's bringing in new clients worth thousands. The ROI is insane. Revenue is growing and the reviews just keep coming.", name: "Arrow Air Conditioning" },
  { quote: "The smart filtering is a game-changer. Bad reviews get caught before they hit Google, and the good ones pour in. We're on the front page of Google now.", name: "MaXim" },
];

// Duplicate for infinite scroll effect (original does this)
const ITEMS = [...TESTIMONIALS, ...TESTIMONIALS];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 md:py-20 overflow-hidden bg-cream">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-[0.15em]">
            Testimonials
          </span>
          <h2 className="mt-3 text-display-sm md:text-display-md text-stone-900">
            Trusted by Australian businesses
          </h2>
        </motion.div>
      </div>

      {/* Horizontal scrolling carousel */}
      <div className="relative max-w-[1200px] mx-auto px-5">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin"
          style={{ scrollBehavior: "smooth" }}
        >
          {ITEMS.map((t, i) => (
            <div
              key={i}
              className="min-w-[340px] max-w-[340px] bg-white border border-stone-200/60 rounded-2xl p-6 flex-shrink-0 snap-center card-hover"
            >
              {/* Stars */}
              <div className="flex gap-[2px] mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[14px] text-stone-600 leading-[1.65] mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Name */}
              <div className="text-[13px] font-semibold text-stone-900">
                {t.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
