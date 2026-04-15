"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, Copy, Check, ThumbsUp, ThumbsDown, ExternalLink, Palette, ImageIcon, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/components/ui/toast-provider";
import { ecommerce as ecomApi } from "@/lib/api/client";

const BRAND_COLORS = [
  { hex: "#16A34A", label: "Brand Green" },
  { hex: "#2563EB", label: "Blue" },
  { hex: "#7C3AED", label: "Purple" },
  { hex: "#DC2626", label: "Red" },
  { hex: "#EA580C", label: "Orange" },
  { hex: "#0891B2", label: "Cyan" },
  { hex: "#0F172A", label: "Dark" },
];

export function FunnelTab({ onNavigateToWebhooks }: { onNavigateToWebhooks?: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();

  // Funnel state
  const [brandColor, setBrandColor] = useState("#16A34A");
  const [logoUrl, setLogoUrl] = useState("");
  const [funnelMessage, setFunnelMessage] = useState("How was your experience with us?");
  const [funnelPositiveText, setFunnelPositiveText] = useState("Great!");
  const [funnelNegativeText, setFunnelNegativeText] = useState("Not great");

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewVote, setPreviewVote] = useState<"positive" | "negative" | null>(null);
  const [hexInput, setHexInput] = useState("#16A34A");

  const funnelUrl = user?.shortcode ? `https://go.revuera.com.au/${user.shortcode}` : null;

  // Load existing funnel settings
  useEffect(() => {
    if (!user?.id) return;
    async function load() {
      try {
        const data = await ecomApi.getFunnel(user!.id);
        if (data.brandColor) { setBrandColor(data.brandColor); setHexInput(data.brandColor); }
        if (data.logoUrl) setLogoUrl(data.logoUrl);
        if (data.funnelMessage) setFunnelMessage(data.funnelMessage);
        if (data.funnelPositiveText) setFunnelPositiveText(data.funnelPositiveText);
        if (data.funnelNegativeText) setFunnelNegativeText(data.funnelNegativeText);
      } catch {
        // Use defaults on error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  async function handleSave() {
    if (!user?.id) return;
    setSaving(true);
    try {
      await ecomApi.saveFunnel({
        companyId: user.id,
        brandColor,
        logoUrl: logoUrl || undefined,
        funnelMessage,
        funnelPositiveText,
        funnelNegativeText,
      });
      toast("Funnel updated!", "success");
    } catch {
      toast("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  function handleColorSwatch(hex: string) {
    setBrandColor(hex);
    setHexInput(hex);
  }

  function handleHexInput(val: string) {
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) setBrandColor(val);
  }

  function handleVotePreview(type: "positive" | "negative") {
    setPreviewVote(type);
    setTimeout(() => setPreviewVote(null), 1800);
  }

  function copyUrl() {
    if (!funnelUrl) return;
    navigator.clipboard.writeText(funnelUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-sm text-stone-900">Funnel Appearance</h1>
        <p className="mt-1 text-body-sm text-stone-500">
          Customise how your review funnel looks to customers. Changes appear instantly in the preview.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* LEFT — Controls */}
        <div className="space-y-6">

          {/* Brand colour */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <Palette className="h-4 w-4 text-brand-600" />
              </div>
              <div>
                <h3 className="text-heading-sm text-stone-900">Brand colour</h3>
                <p className="text-[12px] text-stone-400">Used for buttons and accents</p>
              </div>
            </div>

            {/* Swatches */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {BRAND_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => handleColorSwatch(c.hex)}
                  title={c.label}
                  className="relative w-9 h-9 rounded-xl border-2 transition-all duration-150 hover:scale-110"
                  style={{
                    backgroundColor: c.hex,
                    borderColor: brandColor === c.hex ? "#fff" : "transparent",
                    boxShadow: brandColor === c.hex ? `0 0 0 2px ${c.hex}` : "none",
                  }}
                >
                  {brandColor === c.hex && (
                    <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow" />
                  )}
                </button>
              ))}
            </div>

            {/* Hex input */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg border border-stone-200 shrink-0" style={{ backgroundColor: brandColor }} />
              <Input
                value={hexInput}
                onChange={(e) => handleHexInput(e.target.value)}
                placeholder="#16A34A"
                className="h-9 font-mono text-sm max-w-[140px]"
              />
              <span className="text-[12px] text-stone-400">or enter any hex value</span>
            </div>
          </div>

          {/* Logo */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-brand-600" />
              </div>
              <div>
                <h3 className="text-heading-sm text-stone-900">Logo URL</h3>
                <p className="text-[12px] text-stone-400">Paste a link to your logo (PNG or SVG, min 80×80px)</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://yourstore.com/logo.png"
                className="h-10 flex-1"
              />
              {logoUrl && (
                <div className="w-10 h-10 rounded-lg border border-stone-200 overflow-hidden shrink-0 bg-stone-50">
                  <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </div>
          </div>

          {/* Copy */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-brand-600" />
              </div>
              <div>
                <h3 className="text-heading-sm text-stone-900">Copy & buttons</h3>
                <p className="text-[12px] text-stone-400">The question and button labels customers see</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-stone-600 mb-1.5">Main question</label>
                <Input
                  value={funnelMessage}
                  onChange={(e) => setFunnelMessage(e.target.value)}
                  placeholder="How was your experience with us?"
                  className="h-10"
                  maxLength={80}
                />
                <p className="text-[11px] text-stone-400 mt-1">{funnelMessage.length}/80</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-stone-600 mb-1.5">Positive label</label>
                  <Input
                    value={funnelPositiveText}
                    onChange={(e) => setFunnelPositiveText(e.target.value)}
                    placeholder="Great!"
                    className="h-10"
                    maxLength={20}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-stone-600 mb-1.5">Negative label</label>
                  <Input
                    value={funnelNegativeText}
                    onChange={(e) => setFunnelNegativeText(e.target.value)}
                    placeholder="Not great"
                    className="h-10"
                    maxLength={20}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Funnel URL */}
          {funnelUrl && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h3 className="text-heading-sm text-stone-900 mb-3">Your funnel URL</h3>
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <code className="flex-1 text-[13px] text-brand-700 font-mono truncate">{funnelUrl}</code>
                <button
                  onClick={copyUrl}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-[12px] font-medium text-stone-600 hover:border-brand-300 hover:text-brand-700 transition-all shrink-0"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-brand-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <a
                  href={funnelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-[12px] text-stone-400 mt-2">Share this URL or redirect customers to it after checkout.</p>
            </div>
          )}

          {/* Save */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-11 px-8 bg-brand-600 hover:bg-brand-700 text-[14px] font-semibold active:scale-[0.97]"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</>
            ) : (
              <><Save className="h-4 w-4 mr-2" />Save Changes</>
            )}
          </Button>
        </div>

        {/* RIGHT — Live preview */}
        <div className="lg:sticky lg:top-8">
          <div className="mb-3">
            <span className="text-[12px] font-semibold text-stone-400 uppercase tracking-[0.1em]">Live Preview</span>
          </div>

          {/* Browser frame */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-[0_8px_32px_rgba(0,0,0,0.08)] bg-white">
            {/* Chrome */}
            <div className="bg-[#F0EFEA] px-4 py-2.5 flex items-center gap-2.5 border-b border-stone-200">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 bg-white/80 rounded-md px-2.5 py-1 text-[10px] text-stone-400 font-mono truncate">
                go.revuera.com.au/{user?.shortcode || "yourstore"}
              </div>
            </div>

            {/* Funnel content */}
            <div className="bg-[#FFFBF5] px-6 py-8 min-h-[340px] flex flex-col items-center justify-center">
              {/* Logo or initial */}
              <div className="mb-5">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Brand logo"
                    className="h-10 w-auto object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: brandColor }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Business name */}
              <p className="text-[11px] font-semibold text-stone-500 mb-2 tracking-wide uppercase">
                {user?.name || "Your Business"}
              </p>

              {/* Question */}
              <h2 className="text-[17px] font-extrabold text-stone-900 text-center leading-tight mb-1 tracking-tight max-w-[220px]">
                {funnelMessage || "How was your experience?"}
              </h2>
              <p className="text-[11px] text-stone-400 text-center mb-7">Your feedback helps us improve</p>

              {/* Thumb buttons */}
              <div className="flex items-center gap-5">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleVotePreview("positive")}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm transition-all duration-200"
                    style={{
                      backgroundColor: previewVote === "positive" ? brandColor : "white",
                      border: `2px solid ${previewVote === "positive" ? brandColor : "#E8E6DF"}`,
                    }}
                  >
                    <ThumbsUp
                      className="w-6 h-6 transition-colors"
                      style={{ color: previewVote === "positive" ? "white" : "#A8A49A" }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: previewVote === "positive" ? brandColor : "#A8A49A" }}>
                    {previewVote === "positive" ? "To Google →" : (funnelPositiveText || "Great!")}
                  </span>
                </motion.button>

                <div className="w-px h-10 bg-stone-200" />

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleVotePreview("negative")}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm transition-all duration-200"
                    style={{
                      backgroundColor: previewVote === "negative" ? "rgba(220,38,38,.08)" : "white",
                      border: `2px solid ${previewVote === "negative" ? "rgba(220,38,38,.2)" : "#E8E6DF"}`,
                    }}
                  >
                    <ThumbsDown
                      className="w-6 h-6 transition-colors"
                      style={{ color: previewVote === "negative" ? "#DC2626" : "#A8A49A" }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: previewVote === "negative" ? "#DC2626" : "#A8A49A" }}>
                    {previewVote === "negative" ? "Feedback →" : (funnelNegativeText || "Not great")}
                  </span>
                </motion.button>
              </div>

              {/* Negative: feedback form preview */}
              {previewVote === "negative" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full mt-5 px-2"
                >
                  <div className="flex gap-1.5 justify-center mb-3">
                    {[1,2,3,4,5].map(s => (
                      <div key={s} className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D1D0CB" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </div>
                    ))}
                  </div>
                  <div className="w-full h-14 rounded-lg border border-stone-200 bg-stone-50 flex items-center px-3">
                    <span className="text-[10px] text-stone-300">Tell us what went wrong…</span>
                  </div>
                  <div className="mt-2 w-full h-8 rounded-lg bg-stone-900 flex items-center justify-center">
                    <span className="text-[10px] text-white font-semibold">Send Private Feedback</span>
                  </div>
                  <div className="mt-2 w-full h-7 rounded-lg border border-stone-200 flex items-center justify-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    <span className="text-[9px] text-stone-400">Actually, leave a Google review</span>
                  </div>
                </motion.div>
              )}

              {/* Positive: Google redirect preview */}
              {previewVote === "positive" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full mt-5 px-2"
                >
                  <div className="w-full h-10 rounded-lg flex items-center justify-center gap-2 shadow-sm"
                    style={{ backgroundColor: brandColor }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    <span className="text-[11px] font-semibold text-white">Write a Google Review</span>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">5</div>
                  </div>
                  <p className="text-[9px] text-stone-400 text-center mt-1.5">Redirecting in 5 seconds…</p>
                </motion.div>
              )}

              {/* Powered by */}
              <div className="mt-7 flex items-center gap-1 opacity-40">
                <div className="w-3 h-3 rounded-sm flex items-center justify-center" style={{ backgroundColor: brandColor }}>
                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[9px] text-stone-400 font-medium">Powered by Revuera</span>
              </div>
            </div>
          </div>

          {/* Preview note */}
          <p className="mt-3 text-[11px] text-stone-400 text-center">
            Click the thumbs to see the flow · Changes save instantly
          </p>
        </div>
      </div>
    </div>
  );
}
