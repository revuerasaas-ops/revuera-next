"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const IMAGES = [
  {
    src: "https://res.cloudinary.com/ddwysmpli/image/upload/v1773638793/Screenshot_2026-03-16_at_2.22.38_pm_tnw9t2.png",
    alt: "Revuera Automatic Dashboard",
  },
  {
    src: "https://res.cloudinary.com/ddwysmpli/image/upload/v1771125181/Screenshot_2026-02-15_at_1.50.20_pm_btxt1s.png",
    alt: "Revuera Smart Filtering",
  },
];

export function PhoneMockup() {
  const [activeImg, setActiveImg] = useState(0);

  // Auto-rotate every 4 seconds (matches original crossfade behavior)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-4 md:py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="section-container"
      >
        <div className="relative max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(22,163,74,.1)] border border-stone-200">
          {IMAGES.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className={`w-full block transition-opacity duration-700 ${
                i === 0 ? "relative" : "absolute top-0 left-0"
              }`}
              style={{ opacity: activeImg === i ? 1 : 0 }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
