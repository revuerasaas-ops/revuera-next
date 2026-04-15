"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Save, CreditCard, Trash2, AlertTriangle, Eye, EyeOff, Palette, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/components/ui/toast-provider";
import { company as companyApi, auth as authApi, subscription, ApiError } from "@/lib/api/client";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <h3 className="text-heading-sm text-stone-900 mb-1">{title}</h3>
      {description && <p className="text-body-sm text-stone-500 mb-5">{description}</p>}
      {!description && <div className="mb-5" />}
      {children}
    </div>
  );
}

export function EcomSettingsTab({ onNavigateToTab }: { onNavigateToTab?: (tab: string) => void }) {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();

  const [reviewLink, setReviewLink] = useState(user?.googleReviewLink || "");
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [savingLink, setSavingLink] = useState(false);

  async function saveReviewLink() {
    if (!user?.id || !reviewLink.trim()) { toast("Enter a review link", "warning"); return; }
    setSavingLink(true);
    try {
      await companyApi.updateReviewLink(user.id, reviewLink.trim());
      updateUser({ googleReviewLink: reviewLink.trim() });
      toast("Review link saved!");
    } catch (err) { toast(err instanceof ApiError ? err.message : "Failed", "error"); }
    finally { setSavingLink(false); }
  }

  async function changePassword() {
    if (!user?.id || !pwCurrent || !pwNew) { toast("Fill in all fields", "warning"); return; }
    if (pwNew.length < 8) { toast("Min 8 characters", "warning"); return; }
    if (pwNew !== pwConfirm) { toast("Passwords don't match", "warning"); return; }
    setPwLoading(true);
    try {
      await authApi.changePassword(user.id, pwCurrent, pwNew);
      toast("Password changed!"); setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch (err) { toast(err instanceof ApiError ? err.message : "Failed", "error"); }
    finally { setPwLoading(false); }
  }

  async function openBilling() {
    try {
      const data = await subscription.openPortal();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      // No Stripe customer exists yet — they need to subscribe first
      toast("You need an active subscription to manage billing. Redirecting to pricing...", "warning");
      setTimeout(() => { window.location.href = "/pricing"; }, 1500);
    }
  }

  async function handleDelete() {
    if (deleteConfirm !== "DELETE") return;
    setDeleteLoading(true);
    try { await companyApi.deleteAccount(); logout(); window.location.href = "/"; }
    catch (err) { toast(err instanceof ApiError ? err.message : "Failed", "error"); }
    finally { setDeleteLoading(false); }
  }

  const funnelUrl = user?.shortcode ? `https://go.revuera.com.au/${user.shortcode}` : "Set up your Google review link first";

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-display-sm text-stone-900">Settings</h1><p className="mt-1 text-body-sm text-stone-500">Configure your review funnel</p></div>

      <Section title="Account">
        <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 text-body-sm">
          <span className="text-stone-400 font-medium">Business</span><span className="text-stone-900">{user?.name || "—"}</span>
          <span className="text-stone-400 font-medium">Email</span><span className="text-stone-900">{user?.email || "—"}</span>
          <span className="text-stone-400 font-medium">Shortcode</span><span className="text-stone-900 font-mono text-[13px]">{user?.shortcode || "—"}</span>
        </div>
      </Section>

      {/* Review funnel URL */}
      <Section title="Your Review Funnel" description="This is the page customers see after checkout. Share this URL or redirect to it from your store.">
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-4">
          <label className="text-caption font-medium text-stone-500 block mb-1">Your funnel URL</label>
          <code className="text-[13px] text-brand-700 font-mono break-all">{funnelUrl}</code>
        </div>
        <p className="text-[12px] text-stone-400 leading-relaxed">Customers visit this page → tap thumbs up or down → positive goes to Google, negative goes to your inbox.</p>
      </Section>

      {/* Funnel shortcut card — B2 */}
      {onNavigateToTab && (
        <button
          onClick={() => onNavigateToTab("funnel")}
          className="w-full text-left bg-white rounded-2xl border border-stone-200 p-5 hover:border-brand-300 hover:shadow-card transition-all group active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
              <Palette className="h-5 w-5 text-brand-600" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-stone-900">Edit Funnel Appearance</p>
              <p className="text-[12px] text-stone-400 mt-0.5">Change colours, logo, button labels and preview live</p>
            </div>
            <ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </button>
      )}

      {/* Google review link */}
      <Section title="Google Review Link" description="Where happy customers go to leave a review.">
        <div className="flex gap-3">
          <Input value={reviewLink} onChange={(e) => setReviewLink(e.target.value)} placeholder="https://search.google.com/local/writereview?placeid=..." className="h-10 flex-1" />
          <Button onClick={saveReviewLink} disabled={savingLink} size="sm">{savingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-1.5" />Save</>}</Button>
        </div>
      </Section>

      <Section title="Change Password">
        <div className="space-y-3 max-w-sm">
          <div className="relative"><Input type={showPw?"text":"password"} value={pwCurrent} onChange={(e)=>setPwCurrent(e.target.value)} placeholder="Current password" className="h-10 pr-10"/><button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">{showPw?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div>
          <Input type={showPw?"text":"password"} value={pwNew} onChange={(e)=>setPwNew(e.target.value)} placeholder="New password (min 8)" className="h-10"/>
          <Input type={showPw?"text":"password"} value={pwConfirm} onChange={(e)=>setPwConfirm(e.target.value)} placeholder="Confirm password" className="h-10"/>
          <Button onClick={changePassword} disabled={pwLoading} size="sm">{pwLoading?<Loader2 className="h-4 w-4 animate-spin"/>:"Change Password"}</Button>
        </div>
      </Section>

      <Section title="Billing" description="Manage your subscription.">
        <Button variant="outline" size="sm" onClick={openBilling}><CreditCard className="h-4 w-4 mr-1.5"/>Manage Billing</Button>
      </Section>

      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h3 className="text-heading-sm text-red-600 mb-1">Danger Zone</h3>
        <p className="text-body-sm text-stone-500 mb-4">Permanently delete your account and all data.</p>
        <Button variant="destructive" size="sm" onClick={()=>setDeleteOpen(true)}><Trash2 className="h-4 w-4 mr-1.5"/>Delete My Account</Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2"><AlertTriangle className="h-6 w-6 text-red-600"/></div>
            <DialogTitle className="text-center">Delete your account?</DialogTitle>
            <DialogDescription className="text-center">This cancels your subscription and deletes all data. Cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div><label className="text-body-sm font-medium text-stone-700 block mb-1.5">Type <strong>DELETE</strong> to confirm</label><Input value={deleteConfirm} onChange={(e)=>setDeleteConfirm(e.target.value)} placeholder="DELETE" className="h-10" autoComplete="off"/></div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={()=>setDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleteLoading||deleteConfirm!=="DELETE"}>{deleteLoading?<Loader2 className="h-4 w-4 animate-spin"/>:"Delete Account"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
