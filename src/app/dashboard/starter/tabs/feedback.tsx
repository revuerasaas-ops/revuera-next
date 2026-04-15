"use client";

import { useMemo } from "react";
import { Star, ThumbsUp, ThumbsDown, BarChart3, MessageCircle } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { EmptyState } from "@/components/dashboard/empty-state";

type CustomerRecord = { id: string; fields: Record<string, unknown>; createdTime: string };
type Props = { customers: CustomerRecord[]; loading: boolean };

export function FeedbackTab({ customers, loading }: Props) {
  const { avg, positive, negative, total, feedbackItems } = useMemo(() => {
    const rated = customers.filter((r) => Number(r.fields["Rating"]) > 0);
    const pos = rated.filter((r) => Number(r.fields["Rating"]) >= 4).length;
    const neg = rated.filter((r) => Number(r.fields["Rating"]) <= 3).length;
    const sum = rated.reduce((s, r) => s + Number(r.fields["Rating"]), 0);
    const avgRating = rated.length > 0 ? (sum / rated.length).toFixed(1) : "—";
    const feedback = customers
      .filter((r) => r.fields["Feedback"])
      .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
    return { avg: avgRating, positive: pos, negative: neg, total: rated.length, feedbackItems: feedback };
  }, [customers]);

  function fmtDate(iso: string) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-display-sm text-stone-900">Customer Feedback</h1>
        <p className="mt-1 text-body-sm text-stone-500">Ratings and private feedback from your customers</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Avg Rating" value={avg} icon={Star} iconColor="text-amber-600" iconBg="bg-amber-50" loading={loading} />
        <MetricCard label="Positive (4-5★)" value={positive} icon={ThumbsUp} loading={loading} />
        <MetricCard label="Negative (1-3★)" value={negative} icon={ThumbsDown} iconColor="text-amber-600" iconBg="bg-amber-50" loading={loading} />
        <MetricCard label="Total Rated" value={total} icon={BarChart3} iconColor="text-stone-600" iconBg="bg-stone-100" loading={loading} />
      </div>

      {/* Feedback list */}
      <div className="bg-white rounded-2xl border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="text-heading-sm text-stone-900">Private Feedback</h3>
          <p className="text-caption text-stone-400 mt-0.5">Feedback from customers who rated 1-3★. Only you can see this.</p>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
          </div>
        ) : feedbackItems.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="No private feedback yet"
            description="When customers rate 1-3★, their comments appear here — keeping negative feedback off Google."
          />
        ) : (
          <div className="divide-y divide-stone-100">
            {feedbackItems.map((r) => {
              const f = r.fields;
              const rating = Number(f["Rating"] || 0);
              return (
                <div key={r.id} className="px-6 py-4 hover:bg-stone-50/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-body-sm font-semibold text-stone-900">
                      {String(f["Customer Name"] || "Anonymous")}
                    </span>
                    <span className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < rating ? "text-amber-400" : "text-stone-200"}`}>★</span>
                      ))}
                    </span>
                  </div>
                  <p className="text-body-sm text-stone-600 leading-relaxed">
                    {String(f["Feedback"])}
                  </p>
                  <span className="mt-2 inline-block text-caption text-stone-400">{fmtDate(r.createdTime)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
