"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/use-auth";
import { auth as authApi, ApiError } from "@/lib/api/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const expired = searchParams.get("expired") === "1";

  // Clear any stale session data on mount when ?expired=1 is present.
  // This ensures a clean slate so the next login attempt doesn't inherit bad state.
  useEffect(() => {
    if (expired) {
      localStorage.removeItem("rv_company");
      localStorage.removeItem("rv_session");
    }
  }, [expired]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      if (data.success && data.sessionToken) {
        const c = data.company as Record<string, unknown>;

        // Store session BEFORE redirect — clears any expired state
        login(data.sessionToken, {
          id: String(c.id || ""),
          name: String(c.name || c.company || ""),
          email: String(c.email || email),
          phone: String(c.phone || ""),
          plan: String(c.plan || "Starter"),
          subscriptionStatus: String(c.subscriptionStatus || c.subscription_status || ""),
          googleReviewLink: String(c.googleReviewLink || c.google_review_link || ""),
          shortcode: String(c.shortcode || ""),
          contactLimit: Number(c.contactLimit || c.contact_limit || 200),
          contactsUsed: Number(c.contactsUsed || c.contacts_this_month || 0),
          trialEnd: String(c.trialEnd || c.trial_end || ""),
          verified: c.verified === true || c.verified === "true",
        });

        const dest = String(c.plan || "Starter") === "Ecommerce"
          ? "/dashboard/ecommerce"
          : "/dashboard/starter";

        // Use replace so the login page isn't in browser history — 
        // pressing Back doesn't loop back to the login page.
        router.replace(dest);
      }
    } catch (err) {
      // Show the actual error — never show "Session expired" on the login page
      // because that phrase is confusing when you're trying to log in fresh.
      const msg = err instanceof ApiError ? err.message : "Connection error. Please try again.";
      // Don't show the session expired message on the login form — show a clean error instead
      setError(msg.includes("Session expired") ? "Login failed. Please try again." : msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotError("");
    if (!forgotEmail) { setForgotError("Please enter your email."); return; }
    setForgotLoading(true);
    try {
      await authApi.requestPasswordReset(forgotEmail);
      setForgotSent(true);
    } catch (err) {
      setForgotError(err instanceof ApiError ? err.message : "Connection error.");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8 md:p-10">
        {!showForgot ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-display-sm text-stone-900">Welcome back</h1>
              <p className="mt-2 text-body-sm text-stone-500">Log in to your Revuera dashboard</p>
              {expired && (
                <p className="mt-3 text-body-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Your session expired. Please log in again.
                </p>
              )}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-body-sm font-medium text-stone-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@business.com.au"
                    className="pl-10 h-11"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-body-sm font-medium text-stone-700">Password</label>
                  <button
                    type="button"
                    onClick={() => { setShowForgot(true); setForgotEmail(email); }}
                    className="text-caption text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-body-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-base font-semibold mt-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Log In <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </form>

            <p className="mt-6 text-center text-body-sm text-stone-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-brand-600 hover:text-brand-700 font-semibold">
                Start free trial
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-display-sm text-stone-900">Reset password</h1>
              <p className="mt-2 text-body-sm text-stone-500">
                {forgotSent ? "Check your email for a reset link." : "Enter your email and we'll send a reset link."}
              </p>
            </div>

            {!forgotSent ? (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-body-sm font-medium text-stone-700 mb-1.5">Email</label>
                  <Input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="you@business.com.au"
                    className="h-11"
                    required
                  />
                </div>
                {forgotError && (
                  <p className="text-body-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{forgotError}</p>
                )}
                <Button type="submit" disabled={forgotLoading} className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-base font-semibold">
                  {forgotLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-7 w-7 text-brand-600" />
                </div>
                <p className="text-body-sm text-stone-500">
                  If an account exists for <strong>{forgotEmail}</strong>, you&apos;ll receive a reset email shortly.
                </p>
              </div>
            )}

            <button
              onClick={() => { setShowForgot(false); setForgotSent(false); setForgotError(""); }}
              className="mt-4 w-full text-center text-body-sm text-stone-500 hover:text-stone-700"
            >
              ← Back to login
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
