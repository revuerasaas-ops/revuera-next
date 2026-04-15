"use client";

import { useState } from "react";
import { Search, CheckCircle2, Circle, Copy, Check, ArrowRight, Loader2, MessageSquare, UserPlus, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/components/ui/toast-provider";
import { company as companyApi, sms, ApiError } from "@/lib/api/client";
import { useGooglePlaces, getReviewLink } from "@/lib/hooks/use-google-places";

const SMS_PRESETS = [
  { label: "Friendly", template: "Hi {name}! Thanks for choosing {business}. We'd love to hear how your experience was." },
  { label: "Professional", template: "Hi {name}, thank you for visiting {business}. We value your feedback — please rate your experience." },
  { label: "Short & Simple", template: "Hi {name}, how was your experience at {business}? Rate us 1-5!" },
];

// Hardcoded sensible defaults — A4 Q1
const REPLY_DEFAULTS = {
  positive: "Thanks so much for the kind words! We really appreciate you taking the time.",
  negative: "We're sorry to hear that. We'd love to make it right — please call us and we'll sort it out.",
  feedback: "Thanks for letting us know. We'll use your feedback to keep improving.",
};

export function StarterWizard({
  onComplete,
  onNavigateToHistory,
}: {
  onComplete: () => void;
  onNavigateToHistory?: () => void;
}) {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const { results, loading: searching, search } = useGooglePlaces();

  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Step 2
  const [smsTemplate, setSmsTemplate] = useState(SMS_PRESETS[0].template);
  const [activePreset, setActivePreset] = useState(0);
  const [savingSms, setSavingSms] = useState(false);

  // Step 3 — reply templates — A4
  const [replyPositive, setReplyPositive] = useState(REPLY_DEFAULTS.positive);
  const [replyNegative, setReplyNegative] = useState(REPLY_DEFAULTS.negative);
  const [replyFeedback, setReplyFeedback] = useState(REPLY_DEFAULTS.feedback);
  const [savingReplies, setSavingReplies] = useState(false);

  function handleSearch(val: string) { setQuery(val); search(val); }

  function selectPreset(idx: number) { setActivePreset(idx); setSmsTemplate(SMS_PRESETS[idx].template); }

  const preview = smsTemplate
    .replace(/\{name\}/gi, "Sarah")
    .replace(/\{business\}/gi, selectedName || user?.name || "Your Business");

  async function selectPlace(placeId: string, name: string) {
    const link = getReviewLink(placeId);
    setReviewLink(link); setSelectedName(name);
    if (!user?.id) { toast("Not logged in — please refresh", "error"); return; }
    setSaving(true);
    try {
      await companyApi.updateReviewLink(user.id, link);
      updateUser({ googleReviewLink: link });
      setStep(2);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[Wizard] updateReviewLink failed:", err);
      const msg = err instanceof ApiError ? err.message : String(err) || "Failed to save review link";
      toast(msg, "error");
    } finally { setSaving(false); }
  }

  async function saveSmsAndContinue() {
    if (!user?.id) { setStep(3); return; }
    setSavingSms(true);
    try { await sms.saveSettings({ template: smsTemplate }); }
    catch {}
    setSavingSms(false);
    setStep(3);
  }

  // A4 — save replies (or defaults on skip) silently then advance
  async function saveRepliesAndContinue(skip = false) {
    if (!user?.id) { setStep(4); return; }
    setSavingReplies(true);
    try {
      await sms.saveSettings({
        template: smsTemplate,
        replyPositive: skip ? REPLY_DEFAULTS.positive : replyPositive,
        replyNegative: skip ? REPLY_DEFAULTS.negative : replyNegative,
        replyFeedback: skip ? REPLY_DEFAULTS.feedback : replyFeedback,
      });
    } catch {}
    setSavingReplies(false);
    setStep(4);
  }

  function handleGoToHistory() {
    onComplete();
    setTimeout(() => onNavigateToHistory?.(), 120);
  }

  const CHECKLIST = [
    { label: "Business connected to Google", done: true },
    { label: "SMS template set", done: true },
    { label: "Add your first customer", done: false, cta: true },
  ];

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center p-5">
      <div className="w-full max-w-[580px] mx-auto text-center">

        {/* Step dots — 4 steps now */}
        <div className="flex gap-2 justify-center mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-2 rounded-full transition-all duration-500 ${step >= s ? "bg-brand-600 w-7" : "bg-stone-200 w-2"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1 — Google Places */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="w-16 h-16 rounded-[20px] bg-brand-50 flex items-center justify-center mx-auto mb-5">
                <Search className="h-7 w-7 text-brand-600" />
              </div>
              <h2 className="text-display-sm text-stone-900 mb-2">Find your business on Google</h2>
              <p className="text-body-md text-stone-500 mb-8 max-w-[420px] mx-auto">This tells us where to send happy customers to leave a review.</p>
              <div className="text-left max-w-[420px] mx-auto">
                <label className="text-body-sm font-medium text-stone-700 block mb-1.5">Search your business</label>
                <div className="relative">
                  <Input value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="e.g. Smith Plumbing Sydney" className="h-11" autoFocus />
                  {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 animate-spin" />}
                </div>
              </div>
              {results.length > 0 && (
                <div className="max-w-[420px] mx-auto mt-3 border border-stone-200 rounded-xl overflow-hidden bg-white">
                  {results.map((p) => (
                    <button key={p.place_id} onClick={() => selectPlace(p.place_id, p.name)} disabled={saving}
                      className="w-full text-left px-4 py-3 border-b border-stone-100 last:border-0 hover:bg-brand-50/30 transition-colors disabled:opacity-50">
                      <strong className="text-[13px] text-stone-900 block">{p.name}</strong>
                      <span className="text-[11px] text-stone-400">{p.formatted_address}</span>
                    </button>
                  ))}
                </div>
              )}
              {saving && (
                <div className="mt-4 flex items-center justify-center gap-2 text-body-sm text-brand-600">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2 — SMS Template */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="w-16 h-16 rounded-[20px] bg-brand-50 flex items-center justify-center mx-auto mb-5">
                <MessageSquare className="h-7 w-7 text-brand-600" />
              </div>
              <h2 className="text-display-sm text-stone-900 mb-2">Customize your SMS message</h2>
              <p className="text-body-md text-stone-500 mb-6 max-w-[420px] mx-auto">Pick a style or write your own. This is what your customers receive.</p>
              <div className="flex gap-2 justify-center mb-5">
                {SMS_PRESETS.map((preset, i) => (
                  <button key={i} onClick={() => selectPreset(i)}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${activePreset === i ? "bg-brand-600 text-white shadow-sm" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}>
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="max-w-[420px] mx-auto text-left mb-4">
                <Textarea value={smsTemplate} onChange={(e) => { setSmsTemplate(e.target.value); setActivePreset(-1); }} rows={3} maxLength={300} className="resize-none" />
                <p className="mt-1.5 text-[11px] text-stone-400">Use &#123;name&#125; for customer name, &#123;business&#125; for your business. {smsTemplate.length}/300</p>
              </div>
              <div className="max-w-[420px] mx-auto mb-6 bg-white border border-stone-200 rounded-xl p-4 text-left">
                <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-2">Preview</label>
                <div className="bg-brand-50 rounded-lg px-3.5 py-2.5 text-[13px] text-stone-700 leading-relaxed">
                  {preview}<br /><br /><span className="text-stone-400">Please reply with a number from 1-5 (1=poor, 5=excellent).</span>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setStep(3)} className="h-11 px-6 rounded-xl">Skip</Button>
                <Button onClick={saveSmsAndContinue} disabled={savingSms} className="bg-brand-600 hover:bg-brand-700 h-11 px-6 rounded-xl shadow-lg shadow-brand-600/20">
                  {savingSms ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Save & Continue <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Reply Templates — A4 */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="w-16 h-16 rounded-[20px] bg-brand-50 flex items-center justify-center mx-auto mb-5">
                <MessageCircle className="h-7 w-7 text-brand-600" />
              </div>
              <h2 className="text-display-sm text-stone-900 mb-2">Auto-reply messages</h2>
              <p className="text-body-md text-stone-500 mb-6 max-w-[420px] mx-auto">
                Revuera automatically replies to customers after they rate you. Defaults are ready — tweak or leave them.
              </p>

              <div className="max-w-[460px] mx-auto text-left space-y-4">
                <div>
                  <label className="text-[12px] font-semibold text-stone-700 block mb-1.5">
                    When someone loves it <span className="text-brand-600 font-normal">(4–5 stars)</span>
                  </label>
                  <Textarea
                    value={replyPositive}
                    onChange={(e) => setReplyPositive(e.target.value)}
                    rows={2}
                    maxLength={160}
                    className="resize-none text-[13px]"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">{replyPositive.length}/160</p>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-stone-700 block mb-1.5">
                    When someone&apos;s disappointed <span className="text-stone-400 font-normal">(1–3 stars)</span>
                  </label>
                  <Textarea
                    value={replyNegative}
                    onChange={(e) => setReplyNegative(e.target.value)}
                    rows={2}
                    maxLength={160}
                    className="resize-none text-[13px]"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">{replyNegative.length}/160</p>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-stone-700 block mb-1.5">
                    After they leave feedback
                  </label>
                  <Textarea
                    value={replyFeedback}
                    onChange={(e) => setReplyFeedback(e.target.value)}
                    rows={2}
                    maxLength={160}
                    className="resize-none text-[13px]"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">{replyFeedback.length}/160</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center mt-7">
                {/* Skip — silently saves defaults — A4 Q2 */}
                <Button variant="outline" onClick={() => saveRepliesAndContinue(true)} disabled={savingReplies} className="h-11 px-6 rounded-xl">
                  {savingReplies ? <Loader2 className="h-4 w-4 animate-spin" /> : "Skip — use defaults"}
                </Button>
                <Button onClick={() => saveRepliesAndContinue(false)} disabled={savingReplies} className="bg-brand-600 hover:bg-brand-700 h-11 px-6 rounded-xl shadow-lg shadow-brand-600/20">
                  {savingReplies ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Save & Continue <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Animated checklist completion — A5 */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-600/25"
              >
                <CheckCircle2 className="h-8 w-8 text-white" />
              </motion.div>

              <h2 className="text-display-sm text-stone-900 mb-2">You&apos;re all set. Here&apos;s what to do next.</h2>
              <p className="text-body-md text-stone-500 mb-8 max-w-[400px] mx-auto">
                {selectedName || "Your business"} is connected and your SMS is ready to send.
              </p>

              {/* Animated checklist */}
              <div className="max-w-[380px] mx-auto mb-8 space-y-3 text-left">
                {CHECKLIST.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border ${
                      item.done ? "bg-brand-50 border-brand-200" : "bg-white border-stone-200"
                    }`}
                  >
                    {item.done ? (
                      <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0" />
                    ) : (
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Circle className="h-5 w-5 text-stone-300 shrink-0" />
                      </motion.div>
                    )}
                    <span className={`text-[14px] font-medium ${item.done ? "text-stone-800" : "text-stone-500"}`}>
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Primary CTA — go to History tab to add first customer */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Button
                  onClick={handleGoToHistory}
                  className="bg-brand-600 hover:bg-brand-700 h-12 px-8 text-[14px] font-semibold rounded-xl shadow-lg shadow-brand-600/20 active:scale-[0.97]"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add your first customer →
                </Button>

                {/* Secondary plain link */}
                <div className="mt-4">
                  <button
                    onClick={onComplete}
                    className="text-[13px] text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    Go to dashboard
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
