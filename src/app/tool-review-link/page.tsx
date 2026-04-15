"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CTA } from "@/components/sections/cta/cta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Copy, Check, Loader2, MapPin, Building2, Phone, ArrowRight } from "lucide-react";
import { useGooglePlaces, getReviewLink } from "@/lib/hooks/use-google-places";
import { publicApi } from "@/lib/api/client";

const STORAGE_KEY = "rv_lead_captured";

type SelectedPlace = { place_id: string; name: string };

export default function ReviewLinkFinderPage() {
  const { results, loading, search } = useGooglePlaces();
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Gate flow
  const [loadingGate, setLoadingGate] = useState(false);
  const [pendingPlace, setPendingPlace] = useState<SelectedPlace | null>(null);
  const [unlockedPlace, setUnlockedPlace] = useState<SelectedPlace | null>(null);

  // Gate form state
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [gateLoading, setGateLoading] = useState(false);
  const [gateError, setGateError] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

  function handleInputChange(val: string) {
    setQuery(val);
    if (val.length >= 3) search(val);
  }

  function isAlreadyUnlocked() {
    try { return sessionStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  }

  function handlePlaceClick(place_id: string, name: string) {
    if (unlockedPlace || isAlreadyUnlocked()) {
      setUnlockedPlace({ place_id, name });
      return;
    }
    setLoadingGate(true);
    setPendingPlace({ place_id, name });
    setTimeout(() => setLoadingGate(false), 400);
  }

  async function handleGateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGateError("");
    if (!businessName.trim() || !phone.trim()) { setGateError("Please fill in both fields."); return; }
    setGateLoading(true);
    try {
      await publicApi.leadCapture({ businessName: businessName.trim(), phone: phone.trim(), source: "Review Link Finder" });
    } catch {}
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setUnlockedPlace(pendingPlace);
    setGateLoading(false);
  }

  function copyLink(place_id: string) {
    navigator.clipboard.writeText(getReviewLink(place_id));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  const showGate = pendingPlace && !unlockedPlace && !loadingGate;

  return (
    <>
      <Header />
      <main>
        <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative section-container max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] font-semibold mb-6">
                <Search className="h-3.5 w-3.5" />Free Tool
              </span>
              <h1 className="text-display-md md:text-display-lg text-stone-900">Google Review Link Finder</h1>
              <p className="mt-4 text-body-lg text-stone-500">
                Find your direct Google review link in seconds. Share it with customers to make leaving reviews effortless.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input value={query} onChange={(e) => handleInputChange(e.target.value)} placeholder="Search your business name + city" className="pl-10 h-12 text-base" />
                </div>
                <Button type="submit" disabled={loading} className="h-12 px-6 bg-brand-600 hover:bg-brand-700">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4 mr-2" />Search</>}
                </Button>
              </form>

              {/* Results — always fully visible */}
              {results.length > 0 && (
                <div className="mt-6 space-y-3">
                  {results.map((place) => {
                    const isUnlocked = unlockedPlace?.place_id === place.place_id;
                    const isPending = pendingPlace?.place_id === place.place_id;
                    const isShimmering = loadingGate && isPending;

                    return (
                      <motion.div
                        key={place.place_id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border transition-all ${
                          isUnlocked
                            ? "border-brand-400 bg-brand-50/30 shadow-glow-green"
                            : isPending && !loadingGate
                            ? "border-brand-300 bg-brand-50/20"
                            : "border-stone-200 hover:border-brand-300 hover:bg-stone-50 cursor-pointer"
                        }`}
                        onClick={() => !isUnlocked && !isPending && handlePlaceClick(place.place_id, place.name)}
                      >
                        {/* Shimmer */}
                        {isShimmering ? (
                          <div className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-stone-100 rounded-md skeleton w-3/4" />
                                <div className="h-3 bg-stone-100 rounded-md skeleton w-1/2" />
                              </div>
                              <div className="h-8 w-24 bg-stone-100 rounded-xl skeleton shrink-0" />
                            </div>
                            <div className="h-8 bg-stone-100 rounded-lg skeleton w-full" />
                          </div>
                        ) : (
                          <div className="p-4">
                            {/* Place info row */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-heading-sm text-stone-900 truncate">{place.name}</h3>
                                <p className="mt-0.5 text-body-sm text-stone-500 truncate">{place.formatted_address}</p>
                              </div>
                              {isUnlocked ? (
                                <Button size="sm" className="shrink-0 bg-brand-600 hover:bg-brand-700" onClick={(e) => { e.stopPropagation(); copyLink(place.place_id); }}>
                                  {copied ? <><Check className="h-3.5 w-3.5 mr-1" />Copied!</> : <><Copy className="h-3.5 w-3.5 mr-1" />Copy Link</>}
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" className="shrink-0" onClick={(e) => { e.stopPropagation(); handlePlaceClick(place.place_id, place.name); }}>
                                  <Copy className="h-3.5 w-3.5 mr-1" />Get Link
                                </Button>
                              )}
                            </div>

                            {/* Inline gate form */}
                            <AnimatePresence>
                              {showGate && isPending && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                  className="overflow-hidden"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="mt-4 pt-4 border-t border-brand-200">
                                    <div className="flex items-center gap-2 mb-3">
                                      <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      </div>
                                      <div>
                                        <p className="text-[13px] font-semibold text-stone-900">Your link is ready</p>
                                        <p className="text-[11px] text-stone-400">Enter your details to reveal it — free, no spam</p>
                                      </div>
                                    </div>
                                    <form onSubmit={handleGateSubmit} className="space-y-2.5">
                                      <div className="grid grid-cols-2 gap-2.5">
                                        <div className="relative">
                                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                                          <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name" className="pl-9 h-10 text-[13px]" required />
                                        </div>
                                        <div className="relative">
                                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                                          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="pl-9 h-10 text-[13px]" required />
                                        </div>
                                      </div>
                                      {gateError && <p className="text-[12px] text-red-600">{gateError}</p>}
                                      <Button type="submit" disabled={gateLoading} className="w-full h-10 bg-brand-600 hover:bg-brand-700 text-[13px] font-semibold active:scale-[0.97]">
                                        {gateLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <>Show my Google review link <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></>}
                                      </Button>
                                    </form>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Revealed link */}
                            <AnimatePresence>
                              {isUnlocked && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-3 pt-3 border-t border-brand-200 overflow-hidden"
                                >
                                  <label className="text-caption font-medium text-stone-500 block mb-1">Your Google Review Link:</label>
                                  <code className="block bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-caption text-brand-700 font-mono break-all">
                                    {getReviewLink(place.place_id)}
                                  </code>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
