"use client";

import { useState } from "react";
import { Search, CheckCircle2, Circle, ArrowRight, Loader2, Palette, ThumbsUp, ThumbsDown, Plug } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/components/ui/toast-provider";
import { company as companyApi, ecommerce as ecomApi, ApiError } from "@/lib/api/client";
import { useGooglePlaces, getReviewLink } from "@/lib/hooks/use-google-places";

const COLORS = ["#16A34A", "#2563EB", "#7C3AED", "#DC2626", "#EA580C", "#0891B2", "#1A1714"];

export function EcomWizard({
  onComplete,
  onNavigateToWebhooks,
}: {
  onComplete: () => void;
  onNavigateToWebhooks?: () => void;
}) {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const { results, loading: searching, search } = useGooglePlaces();

  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [saving, setSaving] = useState(false);

  // Step 2 state
  const [brandColor, setBrandColor] = useState("#16A34A");
  const [funnelMessage, setFunnelMessage] = useState("How was your experience?");
  const [logoUrl, setLogoUrl] = useState("");
  const [funnelPositiveText, setFunnelPositiveText] = useState("Great!");
  const [funnelNegativeText, setFunnelNegativeText] = useState("Not great");
  const [savingFunnel, setSavingFunnel] = useState(false);

  function handleSearch(val: string) { setQuery(val); search(val); }

  async function selectPlace(placeId: string, name: string) {
    const link = getReviewLink(placeId);
    setSelectedName(name);
    if (!user?.id) return;
    setSaving(true);
    try {
      await companyApi.updateReviewLink(user.id, link);
      updateUser({ googleReviewLink: link });
      setStep(2);
    } catch (err) { toast(err instanceof ApiError ? err.message : "Failed", "error"); }
    finally { setSaving(false); }
  }

  async function saveFunnelAndContinue() {
    if (!user?.id) { setStep(3); return; }
    setSavingFunnel(true);
    try {
      await ecomApi.saveFunnel({
        brandColor,
        funnelMessage,
        logoUrl: logoUrl || undefined,
        funnelPositiveText,
        funnelNegativeText,
      });
    } catch {} // Continue even if save fails
    setSavingFunnel(false);
    setStep(3);
  }

  function handleGoToWebhooks() {
    onComplete();
    // Small delay so dashboard mounts before tab switch
    setTimeout(() => onNavigateToWebhooks?.(), 120);
  }

  const CHECKLIST = [
    { label: "Business connected to Google", done: true },
    { label: "Review funnel customised", done: true },
    { label: "Store webhook connected", done: false, cta: true },
  ];

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center p-5">
      <div className="w-full max-w-[600px] mx-auto text-center">

        {/* Step dots */}
        <div className="flex gap-2 justify-center mb-10">
          {[1, 2, 3].map((s) => (
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
              <p className="text-body-md text-stone-500 mb-8 max-w-[420px] mx-auto">This tells us where to send happy customers from your review funnel.</p>
              <div className="text-left max-w-[420px] mx-auto">
                <label className="text-body-sm font-medium text-stone-700 block mb-1.5">Search your business</label>
                <div className="relative">
                  <Input value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="e.g. My Store Sydney" className="h-11" autoFocus />
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

          {/* STEP 2 — Funnel Customisation + Positive/Negative text */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="w-16 h-16 rounded-[20px] bg-brand-50 flex items-center justify-center mx-auto mb-5">
                <Palette className="h-7 w-7 text-brand-600" />
              </div>
              <h2 className="text-display-sm text-stone-900 mb-2">Customize your review funnel</h2>
              <p className="text-body-md text-stone-500 mb-6 max-w-[440px] mx-auto">This is the page customers see after checkout.</p>

              <div className="max-w-[520px] mx-auto grid md:grid-cols-[1fr_190px] gap-6 text-left">
                {/* Controls */}
                <div className="space-y-4">
                  {/* Brand colour */}
                  <div>
                    <label className="text-body-sm font-medium text-stone-700 block mb-2">Brand color</label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map((color) => (
                        <button key={color} onClick={() => setBrandColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${brandColor === color ? "border-stone-900 scale-110" : "border-transparent hover:scale-105"}`}
                          style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>

                  {/* Question */}
                  <div>
                    <label className="text-body-sm font-medium text-stone-700 block mb-1.5">Main question</label>
                    <Input value={funnelMessage} onChange={(e) => setFunnelMessage(e.target.value)} placeholder="How was your experience?" className="h-10" maxLength={80} />
                  </div>

                  {/* Positive / Negative labels — A3 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-body-sm font-medium text-stone-700 block mb-1.5">Positive label</label>
                      <Input value={funnelPositiveText} onChange={(e) => setFunnelPositiveText(e.target.value)} placeholder="Great!" className="h-10" maxLength={20} />
                    </div>
                    <div>
                      <label className="text-body-sm font-medium text-stone-700 block mb-1.5">Negative label</label>
                      <Input value={funnelNegativeText} onChange={(e) => setFunnelNegativeText(e.target.value)} placeholder="Not great" className="h-10" maxLength={20} />
                    </div>
                  </div>

                  {/* Logo */}
                  <div>
                    <label className="text-body-sm font-medium text-stone-700 block mb-1.5">Logo URL <span className="text-stone-400">(optional)</span></label>
                    <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://yourbrand.com/logo.png" className="h-10" />
                  </div>
                </div>

                {/* Live preview */}
                <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center flex flex-col items-center justify-start gap-3" style={{ minHeight: 260 }}>
                  <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Preview</label>
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-7 mx-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="text-[13px] font-bold" style={{ color: brandColor }}>{selectedName || "Your Store"}</div>
                  )}
                  <p className="text-[12px] text-stone-600 leading-tight">{funnelMessage || "How was your experience?"}</p>
                  <div className="flex gap-3 justify-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: brandColor + "18", border: `1.5px solid ${brandColor}35` }}>
                        <ThumbsUp className="h-5 w-5" style={{ color: brandColor }} />
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: brandColor }}>{funnelPositiveText || "Great!"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center">
                        <ThumbsDown className="h-5 w-5 text-stone-400" />
                      </div>
                      <span className="text-[10px] font-semibold text-stone-400">{funnelNegativeText || "Not great"}</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-stone-300 mt-auto">go.revuera.com.au/{user?.shortcode || "..."}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center mt-8">
                <Button variant="outline" onClick={() => setStep(3)} className="h-11 px-6 rounded-xl">Skip</Button>
                <Button onClick={saveFunnelAndContinue} disabled={savingFunnel} className="bg-brand-600 hover:bg-brand-700 h-11 px-6 rounded-xl shadow-lg shadow-brand-600/20">
                  {savingFunnel ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Save & Continue <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Animated checklist completion — A5 */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
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
                {selectedName || "Your store"} is connected and your funnel is ready.
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
                      item.done
                        ? "bg-brand-50 border-brand-200"
                        : "bg-white border-stone-200"
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

              {/* Primary CTA — go to Webhooks tab */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Button
                  onClick={handleGoToWebhooks}
                  className="bg-brand-600 hover:bg-brand-700 h-12 px-8 text-[14px] font-semibold rounded-xl shadow-lg shadow-brand-600/20 active:scale-[0.97]"
                >
                  <Plug className="mr-2 h-4 w-4" />
                  Connect your store →
                </Button>

                {/* Secondary — plain text link */}
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
