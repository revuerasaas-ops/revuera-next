"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, ShoppingCart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth as authApi, subscription, ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/hooks/use-auth";

type Step = "form" | "verify" | "quiz";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const preselectedPlan = searchParams.get("plan") || "";
  const [step, setStep] = useState<Step>("form");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [resending, setResending] = useState(false);
  // Store signup data for post-verification login
  const [signupCompanyId, setSignupCompanyId] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!name||!email||!phone||!password) { setError("Please fill in all required fields."); return; }
    if (password.length<8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      await authApi.checkDuplicate(name, email);
      const data = await authApi.createAccount({ company: name, email, phone, password, plan: preselectedPlan||undefined });
      if (data.success) {
        // Store session token for verification API calls
        if (data.sessionToken) {
          localStorage.setItem("rv_session", data.sessionToken);
        }
        if (data.companyId) setSignupCompanyId(data.companyId);
        setStep("verify");
      }
    } catch (err) { setError(err instanceof ApiError ? err.message : "Connection error."); }
    finally { setLoading(false); }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault(); setVerifyError("");
    if (!code||code.length<4) { setVerifyError("Please enter the verification code."); return; }
    setLoading(true);
    try {
      const data = await authApi.verifyEmail(code);
      if (data.success) {
        // NOW properly log the user into AuthContext so pricing page sees them
        const token = localStorage.getItem("rv_session") || "";
        login(token, {
          id: signupCompanyId,
          name: name,
          email: email,
          phone: phone,
          plan: preselectedPlan || "None",
          subscriptionStatus: "none",
          googleReviewLink: "",
          shortcode: "",
          contactLimit: 0,
          contactsUsed: 0,
          trialEnd: "",
          verified: true,
        });
        
        // Route to pricing for plan selection
        if (preselectedPlan) {
          router.push(`/pricing?plan=${preselectedPlan}`);
        } else {
          setStep("quiz");
        }
      }
    } catch (err) { setVerifyError(err instanceof ApiError ? err.message : "Invalid code."); }
    finally { setLoading(false); }
  }

  async function handleResend() {
    setResending(true);
    try { await authApi.resendVerification(); } catch {}
    setTimeout(()=>setResending(false), 3000);
  }

  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="w-full max-w-md">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8 md:p-10">
        <AnimatePresence mode="wait">
          {step==="form" && (
            <motion.div key="form" initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16}}>
              <div className="text-center mb-8">
                <h1 className="text-display-sm text-stone-900">Create your account</h1>
                <p className="mt-2 text-body-sm text-stone-500">Start your 7-day free trial. No credit card required.</p>
              </div>
              <form onSubmit={handleSignup} className="space-y-4">
                <div><label className="block text-body-sm font-medium text-stone-700 mb-1.5">Business name</label><div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400"/><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Smith Plumbing" className="pl-10 h-11" required/></div></div>
                <div><label className="block text-body-sm font-medium text-stone-700 mb-1.5">Email</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400"/><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@business.com.au" className="pl-10 h-11" required/></div></div>
                <div><label className="block text-body-sm font-medium text-stone-700 mb-1.5">Phone</label><div className="relative"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400"/><Input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0412 345 678" className="pl-10 h-11" required/></div></div>
                <div><label className="block text-body-sm font-medium text-stone-700 mb-1.5">Password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400"/><Input type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 8 characters" className="pl-10 pr-10 h-11" required minLength={8}/><button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">{showPw?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></div>
                {error && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-body-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</motion.p>}
                <Button type="submit" disabled={loading} className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-base font-semibold mt-2">{loading?<Loader2 className="h-4 w-4 animate-spin"/>:<>Create Account <ArrowRight className="ml-2 h-4 w-4"/></>}</Button>
              </form>
              <p className="mt-6 text-center text-body-sm text-stone-500">Already have an account?{" "}<Link href="/login" className="text-brand-600 hover:text-brand-700 font-semibold">Log in</Link></p>
            </motion.div>
          )}
          {step==="verify" && (
            <motion.div key="verify" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4"><Mail className="h-7 w-7 text-brand-600"/></div>
                <h1 className="text-display-sm text-stone-900">Check your email</h1>
                <p className="mt-2 text-body-sm text-stone-500">We sent a verification code to <strong>{email}</strong></p>
              </div>
              <form onSubmit={handleVerify} className="space-y-4">
                <div><label className="block text-body-sm font-medium text-stone-700 mb-1.5">Verification code</label><Input value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="Enter 6-digit code" className="h-14 text-center text-2xl font-bold tracking-[0.3em] font-mono" maxLength={6} autoFocus/></div>
                {verifyError && <p className="text-body-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{verifyError}</p>}
                <Button type="submit" disabled={loading||code.length<4} className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-base font-semibold">{loading?<Loader2 className="h-4 w-4 animate-spin"/>:"Verify Email"}</Button>
              </form>
              <button onClick={handleResend} disabled={resending} className="mt-4 w-full text-center text-body-sm text-stone-500 hover:text-brand-600 disabled:opacity-50">{resending?"Code resent!":"Didn't get it? Resend code"}</button>
              <p className="mt-3 text-center text-[12px] text-stone-400">Closed the tab? <a href="/verify" className="text-brand-600 hover:underline font-medium">Continue verifying here →</a></p>
            </motion.div>
          )}
          {step==="quiz" && (
            <motion.div key="quiz" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="h-7 w-7 text-brand-600"/></div>
                <h1 className="text-display-sm text-stone-900">Email verified!</h1>
                <p className="mt-2 text-body-sm text-stone-500">How do you interact with your customers?</p>
              </div>
              <div className="space-y-3">
                <button onClick={()=>router.push("/pricing?plan=starter")} className="w-full text-left p-5 rounded-2xl border-2 border-stone-200 hover:border-brand-400 hover:bg-brand-50/30 transition-all group">
                  <div className="flex items-start gap-4"><div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors"><MessageSquare className="h-5 w-5 text-brand-600"/></div><div><h3 className="text-heading-sm text-stone-900">I see customers in person</h3><p className="mt-1 text-body-sm text-stone-500">Service businesses, clinics, trades, salons</p><span className="mt-2 inline-block text-caption font-semibold text-brand-600">Starter — SMS Reviews</span></div></div>
                </button>
                <button onClick={()=>router.push("/pricing?plan=ecommerce")} className="w-full text-left p-5 rounded-2xl border-2 border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all group">
                  <div className="flex items-start gap-4"><div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors"><ShoppingCart className="h-5 w-5 text-amber-600"/></div><div><h3 className="text-heading-sm text-stone-900">I sell products online</h3><p className="mt-1 text-body-sm text-stone-500">Shopify, WooCommerce, BigCommerce</p><span className="mt-2 inline-block text-caption font-semibold text-amber-600">Ecommerce — Review Funnel</span></div></div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
