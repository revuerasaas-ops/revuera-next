"use client";

import { useState, useEffect } from "react";
import { MessageSquare, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/components/ui/toast-provider";
import { ecommerce as ecomApi } from "@/lib/api/client";

type FeedbackRecord = { rating: number; feedback: string; name: string; created: string; source?: string };

export function EcomFeedbackTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await ecomApi.feedback(user.id);
      const recs = (data.records || []).map((r: Record<string, unknown>) => ({
        rating: Number(r.rating || 0),
        feedback: String(r.feedback || ""),
        name: String(r.name || r.customer_name || "Customer"),
        created: String(r.created || r.created_at || ""),
        source: String(r.source || ""),
      }));
      setRecords(recs);
    } catch { toast("Failed to load feedback", "error"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [user?.id]);

  function fmtDate(iso: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-sm text-stone-900">Feedback Inbox</h1>
          <p className="mt-1 text-body-sm text-stone-500">Private feedback caught before Google</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200">
        {loading ? (
          <div className="p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
        ) : records.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No feedback yet" description="When customers rate their experience on your review funnel, feedback will appear here." />
        ) : (
          <div className="divide-y divide-stone-100">
            {records.map((r, i) => (
              <div key={i} className="px-6 py-4 hover:bg-stone-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm font-semibold text-stone-900">{r.name}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`h-3.5 w-3.5 ${j < r.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                    ))}
                  </div>
                </div>
                {r.feedback && <p className="text-body-sm text-stone-600 leading-relaxed">{r.feedback}</p>}
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-caption text-stone-400">{fmtDate(r.created)}</span>
                  {r.source && <span className="text-caption text-stone-300">·</span>}
                  {r.source && <span className="text-caption text-stone-400">{r.source}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
