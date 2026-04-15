"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, Save, Download, CreditCard, Trash2, AlertTriangle, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/components/ui/toast-provider";
import { company as companyApi, sms, auth as authApi, subscription, ApiError } from "@/lib/api/client";

type Props = { onRefresh: () => void };

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

// Smart insert button — inserts token at the cursor position in a referenced textarea
function InsertBtn({
  label, token, textareaRef, value, onChange,
}: {
  label: string; token: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string; onChange: (v: string) => void;
}) {
  function insert() {
    const el = textareaRef.current;
    if (!el) { onChange(value + token); return; }
    const s = el.selectionStart ?? value.length;
    const e2 = el.selectionEnd ?? value.length;
    onChange(value.slice(0, s) + token + value.slice(e2));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + token.length, s + token.length); });
  }
  return (
    <button type="button" onClick={insert}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 hover:bg-brand-50 hover:text-brand-700 border border-stone-200 hover:border-brand-200 text-[11px] font-medium text-stone-500 transition-all">
      + {label}
    </button>
  );
}

// Shows the exact SMS the customer receives — body + automatic rating prompt
function SmsPreview({ template, defaultTemplate, businessName }: { template: string; defaultTemplate: string; businessName: string }) {
  const PROMPT = "\n\nPlease reply with a number from 1-5.";
  const body = (template || defaultTemplate)
    .replace(/\{name\}/gi, "Sarah")
    .replace(/\{business\}/gi, businessName || "Your Business");
  return (
    <div className="mt-4 rounded-2xl overflow-hidden border border-stone-200 bg-[#F5F4EF]">
      <div className="px-4 py-2 bg-stone-100 border-b border-stone-200 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-stone-300" />
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Customer receives</span>
      </div>
      <div className="px-4 py-4 flex justify-start">
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[280px] shadow-sm">
          <p className="text-[13px] text-stone-800 leading-relaxed whitespace-pre-line">{body + PROMPT}</p>
        </div>
      </div>
      <p className="px-4 pb-3 text-[11px] text-stone-400 italic">
        The &ldquo;reply 1-5&rdquo; prompt is appended automatically — do not include it in your template.
      </p>
    </div>
  );
}

export function SettingsTab({ onRefresh }: Props) {
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();

  const [reviewLink, setReviewLink] = useState(user?.googleReviewLink || "");
  const [smsTemplate, setSmsTemplate] = useState("");
  const [smsDefault, setSmsDefault] = useState("");
  const [replyPositive, setReplyPositive] = useState("");
  const [replyNegative, setReplyNegative] = useState("");
  const [replyFeedback, setReplyFeedback] = useState("");
  const [defaultReplyPositive, setDefaultReplyPositive] = useState("");
  const [defaultReplyNegative, setDefaultReplyNegative] = useState("");
  const [defaultReplyFeedback, setDefaultReplyFeedback] = useState("");
  const [smsLoading, setSmsLoading] = useState(true);

  const refPos = useRef<HTMLTextAreaElement>(null);
  const refNeg = useRef<HTMLTextAreaElement>(null);
  const refFbk = useRef<HTMLTextAreaElement>(null);

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [savingLink, setSavingLink] = useState(false);
  const [savingSms, setSavingSms] = useState(false);
  const [savingReplies, setSavingReplies] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setSmsLoading(true);
    try {
      const d = await sms.getSettings(user.id);
      setSmsTemplate(d.template || "");
      setSmsDefault(d.defaultTemplate || "");
      setReplyPositive(d.replyPositive || "");
      setReplyNegative(d.replyNegative || "");
      setReplyFeedback(d.replyFeedback || "");
      setDefaultReplyPositive(d.defaultReplyPositive || "");
      setDefaultReplyNegative(d.defaultReplyNegative || "");
      setDefaultReplyFeedback(d.defaultReplyFeedback || "");
    } catch { /* use defaults */ } finally { setSmsLoading(false); }
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  async function saveReviewLink() {
    if (!reviewLink.trim()) { toast("Enter a review link", "warning"); return; }
    setSavingLink(true);
    try {
      await companyApi.updateReviewLink(user!.id, reviewLink.trim());
      updateUser({ googleReviewLink: reviewLink.trim() });
      toast("Review link saved!");
    } catch (err) { toast(err instanceof ApiError ? err.message : "Failed to save", "error"); }
    finally { setSavingLink(false); }
  }

  async function saveSmsTemplate() {
    setSavingSms(true);
    try {
      await sms.saveSettings({ template: smsTemplate });
      toast("SMS template saved!");
    } catch (err) { toast(err instanceof ApiError ? err.message : "Failed to save", "error"); }
    finally { setSavingSms(false); }
  }

  async function saveReplyTemplates() {
    setSavingReplies(true);
    try {
      await sms.saveSettings({ template: smsTemplate, replyPositive, replyNegative, replyFeedback });
      toast("Reply templates saved!");
    } catch (err) { toast(err instanceof ApiError ? err.message : "Failed to save", "error"); }
    finally { setSavingReplies(false); }
  }

  async function changePassword() {
    if (!pwCurrent || !pwNew) { toast("Fill in all fields", "warning"); return; }
    if (pwNew.length < 8) { toast("Minimum 8 characters", "warning"); return; }
    if (pwNew !== pwConfirm) { toast("Passwords don't match", "warning"); return; }
    setPwLoading(true);
    try {
      await authApi.changePassword(user!.id, pwCurrent, pwNew);
      toast("Password changed!");
      setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch (err) { toast(err instanceof ApiError ? err.message : "Failed", "error"); }
    finally { setPwLoading(false); }
  }

  async function openBilling() {
    try {
      const d = await subscription.openPortal();
      if (d.url) window.location.href = d.url;
    } catch {
      toast("Redirecting to pricing…", "warning");
      setTimeout(() => { window.location.href = "/pricing"; }, 1200);
    }
  }

  async function handleDelete() {
    if (deleteConfirm !== "DELETE") { toast("Type DELETE to confirm", "warning"); return; }
    setDeleteLoading(true);
    try { await companyApi.deleteAccount(); logout(); window.location.href = "/"; }
    catch (err) { toast(err instanceof ApiError ? err.message : "Failed", "error"); }
    finally { setDeleteLoading(false); }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-display-sm text-stone-900">Settings</h1>
        <p className="mt-1 text-body-sm text-stone-500">Configure your SMS review system</p>
      </div>

      {/* Account */}
      <Section title="Account">
        <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 text-body-sm">
          <span className="text-stone-400 font-medium">Business</span><span className="text-stone-900">{user?.name || "—"}</span>
          <span className="text-stone-400 font-medium">Email</span><span className="text-stone-900">{user?.email || "—"}</span>
          <span className="text-stone-400 font-medium">Phone</span><span className="text-stone-900">{user?.phone || "—"}</span>
        </div>
      </Section>

      {/* Review link */}
      <Section title="Google Review Link" description="Where happy customers (4-5★) are sent to leave a public review.">
        <div className="flex gap-3">
          <Input value={reviewLink} onChange={(e) => setReviewLink(e.target.value)}
            placeholder="https://search.google.com/local/writereview?placeid=..." className="h-10 flex-1" />
          <Button onClick={saveReviewLink} disabled={savingLink} size="sm">
            {savingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-1.5" />Save</>}
          </Button>
        </div>
        {user?.googleReviewLink && (
          <a href={user.googleReviewLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-[12px] text-brand-600 hover:underline">
            <ExternalLink className="h-3 w-3" />Test your link
          </a>
        )}
      </Section>

      {/* SMS Template */}
      <Section title="SMS Message" description="Customise the review request your customers receive.">
        {smsLoading ? <div className="skeleton h-24 rounded-xl" /> : (
          <>
            <div className="flex gap-2 flex-wrap mb-3">
              {[
                { label: "Friendly", tpl: "Hi {name}! Thanks for choosing {business}. We'd love to hear how your experience was." },
                { label: "Professional", tpl: "Hi {name}, thank you for visiting {business}. We value your feedback — please rate your experience." },
                { label: "Short", tpl: "Hi {name}, how was your experience at {business}?" },
              ].map((p, i) => (
                <button key={i} onClick={() => setSmsTemplate(p.tpl)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                    smsTemplate === p.tpl ? "bg-brand-600 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                  }`}>{p.label}</button>
              ))}
              <button onClick={() => setSmsTemplate("")}
                className="px-3 py-1.5 rounded-full text-[12px] font-medium text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors">
                Reset
              </button>
            </div>

            <Textarea value={smsTemplate} onChange={(e) => setSmsTemplate(e.target.value)}
              placeholder={smsDefault} rows={3} maxLength={300} className="resize-y min-h-[80px]" />
            <p className="mt-1.5 text-[11px] text-stone-400">
              Use &#123;name&#125; and &#123;business&#125; as placeholders. {smsTemplate.length}/300
            </p>

            {/* Preview showing FULL message including auto-appended rating prompt */}
            <SmsPreview template={smsTemplate} defaultTemplate={smsDefault} businessName={user?.name || ""} />

            <Button onClick={saveSmsTemplate} disabled={savingSms} size="sm" className="mt-4">
              {savingSms ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Message"}
            </Button>
          </>
        )}
      </Section>

      {/* Reply templates — click-to-insert, no typing placeholders */}
      <Section title="Auto-Reply Messages" description="What customers receive after they rate you. Click Insert to add your Google link or business name.">
        {smsLoading ? <div className="skeleton h-40 rounded-xl" /> : (
          <div className="space-y-5">

            {/* 4-5★ Positive */}
            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                <label className="text-body-sm font-medium text-stone-700">
                  Rating 4–5★ <span className="text-brand-600">(Positive)</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-stone-400">Insert:</span>
                  <InsertBtn label="Google link" token="{link}" textareaRef={refPos} value={replyPositive} onChange={setReplyPositive} />
                  <InsertBtn label="Business name" token="{business}" textareaRef={refPos} value={replyPositive} onChange={setReplyPositive} />
                </div>
              </div>
              <Textarea ref={refPos} value={replyPositive} onChange={(e) => setReplyPositive(e.target.value)}
                placeholder={defaultReplyPositive || "Wonderful! Share your experience on Google: {link}"} rows={2} maxLength={400} />
              {(replyPositive || defaultReplyPositive) && (
                <div className="mt-1.5 text-[12px] text-stone-600 bg-stone-50 rounded-lg px-3 py-2 leading-relaxed">
                  <span className="text-[10px] text-stone-400 block mb-0.5 font-semibold uppercase tracking-wide">Preview</span>
                  {(replyPositive || defaultReplyPositive)
                    .replace(/\{link\}/g, user?.googleReviewLink || "https://g.page/r/...")
                    .replace(/\{business\}/g, user?.name || "Your Business")}
                </div>
              )}
            </div>

            {/* 1-3★ Negative */}
            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                <label className="text-body-sm font-medium text-stone-700">
                  Rating 1–3★ <span className="text-red-500">(Negative)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-stone-400">Insert:</span>
                  <InsertBtn label="Business name" token="{business}" textareaRef={refNeg} value={replyNegative} onChange={setReplyNegative} />
                </div>
              </div>
              <Textarea ref={refNeg} value={replyNegative} onChange={(e) => setReplyNegative(e.target.value)}
                placeholder={defaultReplyNegative || "We're sorry to hear that. Could you tell us what went wrong?"} rows={2} maxLength={400} />
            </div>

            {/* After feedback */}
            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                <label className="text-body-sm font-medium text-stone-700">After feedback received</label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-stone-400">Insert:</span>
                  <InsertBtn label="Business name" token="{business}" textareaRef={refFbk} value={replyFeedback} onChange={setReplyFeedback} />
                </div>
              </div>
              <Textarea ref={refFbk} value={replyFeedback} onChange={(e) => setReplyFeedback(e.target.value)}
                placeholder={defaultReplyFeedback || "Thank you for your feedback. We really appreciate it."} rows={2} maxLength={400} />
            </div>

            <Button onClick={saveReplyTemplates} disabled={savingReplies} size="sm">
              {savingReplies ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Replies"}
            </Button>
          </div>
        )}
      </Section>

      {/* Password */}
      <Section title="Change Password">
        <div className="space-y-3 max-w-sm">
          <div className="relative">
            <Input type={showPw ? "text" : "password"} value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} placeholder="Current password" className="h-10 pr-10" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Input type={showPw ? "text" : "password"} value={pwNew} onChange={(e) => setPwNew(e.target.value)} placeholder="New password (min 8 chars)" className="h-10" />
          <Input type={showPw ? "text" : "password"} value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} placeholder="Confirm new password" className="h-10" />
          <Button onClick={changePassword} disabled={pwLoading} size="sm">
            {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Password"}
          </Button>
        </div>
      </Section>

      {/* Data */}
      <Section title="Your Data" description="Download all customer data as CSV.">
        <Button variant="outline" size="sm" onClick={() => toast("Go to History tab → Export CSV")}>
          <Download className="h-4 w-4 mr-1.5" />Export My Data
        </Button>
      </Section>

      {/* Billing */}
      <Section title="Billing" description="Manage your subscription, update payment method, or cancel.">
        <Button variant="outline" size="sm" onClick={openBilling}>
          <CreditCard className="h-4 w-4 mr-1.5" />Manage Billing
        </Button>
      </Section>

      {/* Danger */}
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h3 className="text-heading-sm text-red-600 mb-1">Danger Zone</h3>
        <p className="text-body-sm text-stone-500 mb-4">Permanently delete your account and all data. Cannot be undone.</p>
        <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-4 w-4 mr-1.5" />Delete My Account
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Delete your account?</DialogTitle>
            <DialogDescription className="text-center">
              This cancels your subscription, deletes all data within 30 days, and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-body-sm font-medium text-stone-700 block mb-1.5">Type <strong>DELETE</strong> to confirm</label>
              <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="DELETE" className="h-10" autoComplete="off" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleteLoading || deleteConfirm !== "DELETE"}>
                {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Account"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
