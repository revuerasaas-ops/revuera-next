"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Phone, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { publicApi } from "@/lib/api/client";

const STORAGE_KEY = "rv_lead_captured";

type LeadCaptureGateProps = {
  children: React.ReactNode;
  toolName?: string;
  onUnlock?: () => void;
};

export function LeadCaptureGate({ children, toolName = "this tool", onUnlock }: LeadCaptureGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setUnlocked(true);
      }
    } catch {}
    setChecked(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!businessName.trim() || !phone.trim()) {
      setError("Please enter your business name and phone number.");
      return;
    }
    setLoading(true);
    try {
      await publicApi.leadCapture({
        businessName: businessName.trim(),
        phone: phone.trim(),
        source: toolName,
      });
    } catch {
      // Don't block unlock on API error — lead capture is best-effort
    } finally {
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
      setUnlocked(true);
      onUnlock?.();
      setLoading(false);
    }
  }

  // Don't render until we've checked sessionStorage (prevents flash)
  if (!checked) return null;

  if (unlocked) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred result behind */}
      <div className="blur-[8px] opacity-40 pointer-events-none select-none" aria-hidden>
        {children}
      </div>

      {/* Gate overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl border border-stone-200 shadow-floating p-7 w-full max-w-sm"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mb-5 shadow-lg shadow-brand-600/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h3 className="text-heading-md text-stone-900 mb-1">Your results are ready</h3>
            <p className="text-body-sm text-stone-500 mb-5">
              Enter your details to unlock — free, no spam, no commitment.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                  className="pl-10 h-11"
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="pl-10 h-11"
                  required
                />
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] text-red-600">
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-[14px] font-semibold mt-1 active:scale-[0.97]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Show my result <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </form>

            <p className="mt-4 text-[11px] text-stone-400 text-center">
              No spam. We may reach out to see if we can help.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
