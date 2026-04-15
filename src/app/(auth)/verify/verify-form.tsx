"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { auth as authApi, ApiError } from "@/lib/api/client";

function VerifyForm() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const code = digits.join("");

  function handleDigit(index: number, val: string) {
    const cleaned = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    setError("");
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
    if (cleaned && index === 5) {
      const fullCode = [...next].join("");
      if (fullCode.length === 6) handleVerify(fullCode);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { if (i < 6) next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) handleVerify(pasted);
  }

  async function handleVerify(overrideCode?: string) {
    const finalCode = overrideCode ?? code;
    if (finalCode.length < 6) { setError("Enter all 6 digits."); return; }
    setError(""); setLoading(true);
    try {
      const data = await authApi.verifyEmail(finalCode);
      if (data.success) {
        const token = localStorage.getItem("rv_session") || "";
        if (user) login(token, { ...user, verified: true });
        router.push(user?.plan === "Ecommerce" ? "/dashboard/ecommerce" : "/dashboard/starter");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid code. Please try again.");
      setShake(true);
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => { setShake(false); inputRefs.current[0]?.focus(); }, 500);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    try { await authApi.resendVerification(); } catch {}
    setResending(false);
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((c) => { if (c <= 1) { clearInterval(interval); return 0; } return c - 1; });
    }, 1000);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-card p-8 md:p-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center">
            <Mail className="h-7 w-7 text-brand-600" />
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-display-sm text-stone-900">Check your email</h1>
          <p className="mt-2 text-body-sm text-stone-500">
            We sent a 6-digit code to{" "}
            <strong className="text-stone-700">{user?.email || "your email"}</strong>
          </p>
        </div>

        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-2.5 justify-center mb-6"
          onPaste={handlePaste}
        >
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              autoFocus={i === 0}
              className={`w-11 h-14 text-center text-xl font-extrabold rounded-xl border-2 font-mono bg-white transition-all outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${
                digit ? "border-brand-400 bg-brand-50/30" : "border-stone-200"
              } ${error ? "border-red-300" : ""}`}
            />
          ))}
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-body-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center mb-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          onClick={() => handleVerify()}
          disabled={loading || code.length < 6}
          className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-[15px] font-semibold active:scale-[0.97]"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Verify Email <ArrowRight className="ml-2 h-4 w-4" /></>}
        </Button>

        <div className="mt-5 text-center">
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            className="text-body-sm text-stone-500 hover:text-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? "Sending…" : resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Didn't get it? Resend code"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyFormWrapper() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-[420px] skeleton rounded-3xl mx-auto" />}>
      <VerifyForm />
    </Suspense>
  );
}
