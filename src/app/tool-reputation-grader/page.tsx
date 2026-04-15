"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CTA } from "@/components/sections/cta/cta";
import { Input } from "@/components/ui/input";
import { LeadCaptureGate } from "@/components/ui/lead-capture-gate";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Search, Loader2, Star, TrendingDown, AlertTriangle, CheckCircle2, MapPin } from "lucide-react";
import { useGooglePlaces, getPlaceDetails } from "@/lib/hooks/use-google-places";

type GradeResult = { name: string; rating: number; totalReviews: number; grade: string; gradeColor: string; insights: string[]; score: number };

function calculateGrade(rating: number, reviews: number): Omit<GradeResult, "name"> {
  let score = 0; const insights: string[] = [];

  // Rating score (0-50)
  if (rating >= 4.5) { score += 50; insights.push("Excellent rating — customers love your service"); }
  else if (rating >= 4.0) { score += 40; insights.push("Good rating — room to reach 4.5+"); }
  else if (rating >= 3.5) { score += 25; insights.push("Average rating — focus on improving customer experience"); }
  else if (rating > 0) { score += 10; insights.push("Rating needs attention — consider addressing common complaints"); }
  else { insights.push("No rating data found — this business may be new to Google"); }

  // Volume score (0-30)
  if (reviews >= 100) { score += 30; insights.push("Strong review volume — great social proof"); }
  else if (reviews >= 50) { score += 25; insights.push("Decent volume — aim for 100+ reviews"); }
  else if (reviews >= 20) { score += 15; insights.push("Growing — keep collecting reviews consistently"); }
  else if (reviews >= 5) { score += 8; insights.push("Low volume — start asking every customer for reviews"); }
  else if (reviews > 0) { score += 3; insights.push("Very few reviews — this is your biggest opportunity"); }
  else { insights.push("No reviews yet — start collecting today"); }

  // Combined bonus (0-20)
  if (reviews >= 20 && rating >= 4.0) { score += 20; insights.push("Strong position — automated collection will accelerate growth"); }
  else if (reviews >= 10 && rating >= 3.5) { score += 10; }
  else if (reviews >= 5) { score += 5; }

  let grade = "F", gradeColor = "text-red-600";
  if (score >= 90) { grade = "A+"; gradeColor = "text-brand-600"; }
  else if (score >= 80) { grade = "A"; gradeColor = "text-brand-600"; }
  else if (score >= 70) { grade = "B+"; gradeColor = "text-brand-500"; }
  else if (score >= 60) { grade = "B"; gradeColor = "text-amber-600"; }
  else if (score >= 45) { grade = "C+"; gradeColor = "text-amber-600"; }
  else if (score >= 35) { grade = "C"; gradeColor = "text-amber-500"; }
  else if (score >= 20) { grade = "D"; gradeColor = "text-red-500"; }

  return { rating, totalReviews: reviews, grade, gradeColor, insights, score };
}

export default function ReputationGraderPage() {
  const { results, loading: searchLoading, search } = useGooglePlaces();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  function handleSearch(val: string) { setQuery(val); if (val.length >= 3) search(val); }

  async function selectPlace(placeId: string, name: string) {
    setLoadingDetails(true);
    try {
      // Fetch real rating data from Google Place Details
      const details = await getPlaceDetails(placeId);
      const rating = details?.rating || 0;
      const reviews = details?.totalReviews || 0;
      const realName = details?.name || name;

      const grade = calculateGrade(rating, reviews);
      setResult({ ...grade, name: realName });
    } catch {
      // Fallback: no details available
      const grade = calculateGrade(0, 0);
      setResult({ ...grade, name });
    } finally {
      setLoadingDetails(false);
    }
  }

  return (
    <>
      <Header />
      <main>
        <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative section-container max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] font-semibold mb-6"><Award className="h-3.5 w-3.5" />Free Tool</span>
              <h1 className="text-display-md md:text-display-lg text-stone-900">Reputation Grader</h1>
              <p className="mt-4 text-body-lg text-stone-500">Get an instant grade on your Google reputation. See where you stand and how to improve.</p>
            </div>
            <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-8">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Search your business name + city" className="pl-10 h-12 text-base" />
                {(searchLoading || loadingDetails) && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 animate-spin" />}
              </div>

              {/* Search results */}
              {results.length > 0 && !result && !loadingDetails && (
                <div className="mt-3 border border-stone-200 rounded-xl overflow-hidden">
                  {results.map((p) => (
                    <button key={p.place_id} onClick={() => selectPlace(p.place_id, p.name)} className="w-full text-left px-4 py-3 border-b border-stone-100 last:border-0 hover:bg-brand-50/30 transition-colors">
                      <strong className="text-[13px] text-stone-900 block">{p.name}</strong>
                      <span className="text-[11px] text-stone-400">{p.formatted_address}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Loading details */}
              {loadingDetails && (
                <div className="mt-8 text-center py-8">
                  <Loader2 className="h-8 w-8 text-brand-600 animate-spin mx-auto mb-3" />
                  <p className="text-body-sm text-stone-500">Analyzing reputation...</p>
                </div>
              )}

              {/* Grade result — behind login wall */}
              <AnimatePresence>
                {result && !loadingDetails && (
                  <LeadCaptureGate toolName="Sign up to see your full reputation grade — free, 30 seconds.">
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                    <div className="text-center mb-8">
                      <h2 className="text-heading-md text-stone-900 mb-4">{result.name}</h2>
                      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl border-4 ${result.score >= 70 ? "border-brand-200 bg-brand-50" : result.score >= 40 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                        <span className={`text-4xl font-extrabold ${result.gradeColor}`}>{result.grade}</span>
                      </div>
                      <p className="mt-3 text-body-sm text-stone-500">Score: {result.score}/100</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 rounded-2xl bg-stone-50 border border-stone-200">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.round(result.rating) ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                          ))}
                        </div>
                        <p className="text-2xl font-extrabold text-stone-900">{result.rating || "—"}</p>
                        <p className="text-caption text-stone-400">Google Rating</p>
                      </div>
                      <div className="text-center p-4 rounded-2xl bg-stone-50 border border-stone-200">
                        <p className="text-2xl font-extrabold text-stone-900 mt-2">{result.totalReviews}</p>
                        <p className="text-caption text-stone-400 mt-1">Total Reviews</p>
                      </div>
                    </div>

                    {/* Insights */}
                    <div className="space-y-3">
                      <h3 className="text-heading-sm text-stone-900">Insights</h3>
                      {result.insights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
                          {result.score >= 70 ? <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" /> :
                           result.score >= 40 ? <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> :
                           <TrendingDown className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />}
                          <p className="text-body-sm text-stone-600">{insight}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 text-center">
                      <button onClick={() => { setResult(null); setQuery(""); }} className="text-body-sm text-brand-600 font-medium hover:underline">Search another business →</button>
                    </div>
                  </motion.div>
                  </LeadCaptureGate>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
