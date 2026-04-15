"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth as authApi, ApiError } from "@/lib/api/client";
import Link from "next/link";

export default function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!token) { setError("Invalid reset link. Please request a new one."); return; }
    if (password.length<8) { setError("Password must be at least 8 characters."); return; }
    if (password!==confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try { await authApi.resetPassword(token, password); setSuccess(true); setTimeout(()=>router.push("/login"),3000); }
    catch (err) { setError(err instanceof ApiError ? err.message : "Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="w-full max-w-md">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8 md:p-10">
        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="h-7 w-7 text-brand-600"/></div>
            <h1 className="text-display-sm text-stone-900">Password reset!</h1>
            <p className="mt-2 text-body-sm text-stone-500">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-display-sm text-stone-900">Set new password</h1>
              <p className="mt-2 text-body-sm text-stone-500">Choose a strong password for your account.</p>
            </div>
            <form onSubmit={handleReset} className="space-y-4">
              <div><label className="block text-body-sm font-medium text-stone-700 mb-1.5">New password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400"/><Input type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 8 characters" className="pl-10 pr-10 h-11" minLength={8} required/><button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">{showPw?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></div>
              <div><label className="block text-body-sm font-medium text-stone-700 mb-1.5">Confirm password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400"/><Input type={showPw?"text":"password"} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat password" className="pl-10 h-11" required/></div></div>
              {error && <p className="text-body-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-base font-semibold">{loading?<Loader2 className="h-4 w-4 animate-spin"/>:"Reset Password"}</Button>
            </form>
            <Link href="/login" className="mt-4 block w-full text-center text-body-sm text-stone-500 hover:text-stone-700">← Back to login</Link>
          </>
        )}
      </div>
    </motion.div>
  );
}
