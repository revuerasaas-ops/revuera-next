"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIAL = {
  quote: "Only paying $19 a month and it's bringing in new clients worth thousands. The ROI is insane. Reviews just keep coming.",
  name: "Arrow Air Conditioning",
  stars: 5,
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignup = pathname === "/signup";

  // Panel — always same content, just repositioned
  const Panel = (
    <div className="hidden lg:flex w-[46%] xl:w-[44%] relative overflow-hidden flex-col">
      {/* Light green background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7]" />

      {/* Subtle gradient orbs on light bg */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)", top: "-10%", right: "-10%" }}
        animate={{ x: [0, 30, -10, 0], y: [0, -20, 30, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)", bottom: "5%", left: "-15%" }}
        animate={{ x: [0, -20, 25, 0], y: [0, 25, -15, 0], scale: [1, 0.92, 1.06, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(22,163,74,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.8) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      {/* Content */}
      <div className="relative z-10 px-12 xl:px-14 flex flex-col justify-center h-full">
        {/* Trust badge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="mb-12">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-brand-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[12px] font-semibold text-brand-800 tracking-wide">Trusted by 500+ businesses</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="mb-10">
          <h2 className="text-[1.9rem] xl:text-[2.25rem] font-extrabold text-[#0f1a0f] leading-[1.1] tracking-[-0.03em] mb-4">
            Your Google rating<br />
            <span className="text-brand-600">works for you.</span>
          </h2>
          <p className="text-[14px] text-stone-600 leading-relaxed max-w-xs">
            Smart review filtering. Bad ones go to your inbox. Good ones go to Google.
          </p>
        </motion.div>

        {/* Testimonial card — solid white on light bg */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative bg-white border border-brand-100 rounded-2xl p-6 shadow-lg">
            {/* Stars */}
            <div className="flex gap-1 mb-3">
              {[...Array(TESTIMONIAL.stars)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-[13.5px] text-stone-700 leading-[1.7] mb-4">
              &ldquo;{TESTIMONIAL.quote}&rdquo;
            </p>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-brand-700">{TESTIMONIAL.name.charAt(0)}</span>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-stone-900">{TESTIMONIAL.name}</div>
                <div className="text-[11px] text-stone-400">Verified customer</div>
              </div>
            </div>

            {/* Google pill */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-full px-2.5 py-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-[10px] font-semibold text-stone-600">Google Reviews</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-8 flex gap-8">
          {[{ val: "340%", label: "more reviews" }, { val: "4.9★", label: "avg. rating" }, { val: "$9/mo", label: "starting at" }].map((s) => (
            <div key={s.val}>
              <div className="text-[17px] font-extrabold text-brand-600 tracking-tight">{s.val}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );

  // Form panel — always same content
  const FormPanel = (
    <div className="flex-1 flex flex-col bg-cream min-h-screen">
      <header className="flex items-center px-8 py-6 shrink-0">
        <Link href="/" className="flex items-center gap-0 group">
          <span className="text-xl font-extrabold text-stone-900 group-hover:text-stone-700 transition-colors">Revuera</span>
          <span className="text-xl font-extrabold text-brand-600">.</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: isSignup ? 18 : -18, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: isSignup ? -18 : 18, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-md mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="px-8 py-5 shrink-0">
        <p className="text-[11px] text-stone-400">
          © {new Date().getFullYear()} Revuera Pty Ltd · ABN 23 308 272 266
        </p>
      </footer>
    </div>
  );

  return (
    <motion.div
      className="min-h-screen flex"
      layout
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isSignup ? (
          // Signup: Panel LEFT, Form RIGHT
          <motion.div
            key="signup-layout"
            className="min-h-screen flex w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {Panel}
            {FormPanel}
          </motion.div>
        ) : (
          // Login/verify: Form LEFT, Panel RIGHT
          <motion.div
            key="login-layout"
            className="min-h-screen flex w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {FormPanel}
            {Panel}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
