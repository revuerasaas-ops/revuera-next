"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ArrowRight, ShoppingBag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { NAV_PRODUCTS, NAV_LINKS } from "@/lib/constants/nav";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  // Determine dashboard path from user context.
  // "Ecommerce" plan → ecommerce dashboard, everything else → starter dashboard.
  // "Trial", "Starter", null, undefined all go to starter (correct default).
  const dashboardPath = user?.plan === "Ecommerce" ? "/dashboard/ecommerce" : "/dashboard/starter";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDdOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const iconMap: Record<string, typeof ShoppingBag> = { ShoppingBag, MessageSquare };

  return (
    <>
      {/* Scroll progress bar */}
      <ScrollProgress />

      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-cream/92 backdrop-blur-2xl border-b border-stone-200/50 shadow-soft" : "bg-transparent"
        }`}
      >
        <div className="section-container flex h-[64px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-[20px] font-extrabold text-stone-900 tracking-tighter">Revuera</span>
            <span className="text-[20px] font-extrabold text-brand-600 transition-transform duration-300 group-hover:scale-125">.</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Products dropdown */}
            <div ref={ddRef} className="relative">
              <button
                onClick={() => setDdOpen(!ddOpen)}
                className="flex items-center gap-1 px-3.5 py-2 text-[14px] text-stone-500 hover:text-stone-900 rounded-lg transition-colors font-medium"
              >
                Products
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${ddOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {ddOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-[280px] bg-white rounded-2xl border border-stone-200 shadow-elevated p-2 z-50"
                  >
                    {NAV_PRODUCTS.map((product) => {
                      const Icon = iconMap[product.icon] || ShoppingBag;
                      return (
                        <Link
                          key={product.href}
                          href={product.href}
                          onClick={() => setDdOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors group/item"
                        >
                          <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0 group-hover/item:bg-brand-100 transition-colors">
                            <Icon className="h-4 w-4 text-brand-600" />
                          </div>
                          <div>
                            <div className="text-[14px] font-semibold text-stone-900">{product.label}</div>
                            <div className="text-[12px] text-stone-400 mt-0.5">{product.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Flat nav links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-[14px] text-stone-500 hover:text-stone-900 rounded-lg transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <Button asChild size="sm" className="bg-brand-600 hover:bg-brand-700 h-9 px-5 rounded-full">
                <Link href={dashboardPath}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="h-9 px-4 text-stone-600 rounded-full">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild size="sm" className="bg-brand-600 hover:bg-brand-700 h-9 px-5 rounded-full shadow-sm">
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-stone-100" aria-label="Menu">
            {mobileOpen ? <X className="h-5 w-5 text-stone-600" /> : <Menu className="h-5 w-5 text-stone-600" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-stone-200 bg-cream overflow-hidden"
            >
              <div className="section-container py-4 space-y-1">
                {NAV_PRODUCTS.map((p) => (
                  <Link key={p.href} href={p.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-[15px] text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 font-medium">
                    {p.label} <span className="text-stone-400 text-[13px]">— {p.description}</span>
                  </Link>
                ))}
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-[15px] text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 font-medium">
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-stone-200 space-y-2">
                  {isAuthenticated ? (
                    <Button asChild className="w-full bg-brand-600 hover:bg-brand-700" onClick={() => setMobileOpen(false)}>
                      <Link href={dashboardPath}>Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full" onClick={() => setMobileOpen(false)}>
                        <Link href="/login">Log in</Link>
                      </Button>
                      <Button asChild className="w-full bg-brand-600 hover:bg-brand-700" onClick={() => setMobileOpen(false)}>
                        <Link href="/signup">Start Free Trial</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

// Scroll progress bar — matches original data-r scroll tracking
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0) setProgress((window.scrollY / h) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-[2px] bg-brand-600 z-[9999] transition-[width] duration-100" style={{ width: `${progress}%` }} />
  );
}
