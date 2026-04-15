"use client";

import { useMemo } from "react";
import { TrendingUp, Star, MessageSquare, ShoppingBag, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";

type Props = {
  stats: Record<string, unknown> | null;
  orders: Array<Record<string, unknown>>;
  loading: boolean;
  onRefresh: () => void;
};

export function EcomOverviewTab({ stats, orders, loading, onRefresh }: Props) {
  const totalOrders = Number(stats?.total || orders.length || 0);
  const totalReviews = Number(stats?.total_reviews || stats?.totalReviews || stats?.positive || 0) + Number(stats?.negative || stats?.negativeFeedback || 0);
  const negativeFeedback = Number(stats?.negative || stats?.negativeFeedback || 0);
  const positiveRate = totalReviews > 0 ? Math.round(((totalReviews - negativeFeedback) / totalReviews) * 100) : 0;

  // Weekly chart
  const chartData = useMemo(() => {
    const weeks: { label: string; orders: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i * 7);
      weeks.push({ label: d.toLocaleDateString("en-AU", { day: "numeric", month: "short" }), orders: 0 });
    }
    orders.forEach((o) => {
      const created = String(o.created || o.created_at || "");
      if (!created) return;
      const rd = new Date(created);
      for (let i = weeks.length - 1; i >= 0; i--) {
        const bd = new Date(); bd.setDate(bd.getDate() - (7 - i) * 7);
        if (rd >= bd) { weeks[i].orders++; break; }
      }
    });
    return weeks;
  }, [orders]);

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-display-sm text-stone-900">Dashboard</h1><p className="mt-1 text-body-sm text-stone-500">Review funnel performance</p></div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading} className="rounded-lg"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></Button>
      </div>

      {/* 4 Stat cards — matches original labels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Positive Rate" value={`${positiveRate}%`} icon={TrendingUp} loading={loading} subtitle="Of all reviews" />
        <MetricCard label="Total Reviews" value={totalReviews} icon={Star} iconColor="text-amber-600" iconBg="bg-amber-50" loading={loading} />
        <MetricCard label="Private Feedback" value={negativeFeedback} icon={MessageSquare} iconColor="text-stone-600" iconBg="bg-stone-100" loading={loading} subtitle="Caught before Google" />
        <MetricCard label="Orders Processed" value={totalOrders} icon={ShoppingBag} loading={loading} />
      </div>

      {/* Chart + Recent orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4"><h3 className="text-heading-sm text-stone-900">Weekly Orders</h3><span className="text-caption text-stone-400">Last 8 weeks</span></div>
          {loading ? <div className="h-[200px] skeleton rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} /><stop offset="95%" stopColor="#16A34A" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#A8A49A" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E8E6DF", borderRadius: "12px", fontSize: "13px", boxShadow: "0 4px 12px rgba(0,0,0,.06)" }} />
                <Area type="monotone" dataKey="orders" stroke="#16A34A" strokeWidth={2} fill="url(#colorOrders)" name="Orders" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h3 className="text-heading-sm text-stone-900 mb-4">Recent Orders</h3>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-10 rounded-lg" />)}</div>
          ) : recentOrders.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No orders yet" description="Connect your store in the Webhooks tab to start receiving orders." />
          ) : (
            <div className="space-y-2">
              {recentOrders.map((o, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-stone-50 transition-colors">
                  <div><p className="text-body-sm font-medium text-stone-900">{String(o.name || o.customer_name || "Customer")}</p><p className="text-caption text-stone-400">{String(o.source || "—")}</p></div>
                  <StatusBadge status={String(o.status || o.sms_status || "Queued")} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
