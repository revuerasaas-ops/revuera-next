"use client";

import { useState, useMemo } from "react";
import { Send, Star, MessageSquare, Zap, Plus, Loader2, RefreshCw, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MetricCard } from "@/components/dashboard/metric-card";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/components/ui/toast-provider";
import { customers as customersApi, ApiError } from "@/lib/api/client";

type Props = {
  customers: Array<{ id: string; fields: Record<string, unknown>; createdTime: string }>;
  loading: boolean;
  onRefresh: () => void;
  onAddCustomer: () => void;
};

export function OverviewTab({ customers, loading, onRefresh, onAddCustomer }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addName, setAddName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [adding, setAdding] = useState(false);

  // Compute stats from real data
  const stats = useMemo(() => {
    let sent = 0, reviewed = 0, positive = 0;
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    customers.forEach((r) => {
      const f = r.fields;
      const status = String(f["SMS Status"] || "");
      if (["Sent", "Delivered", "Completed", "Replied"].includes(status)) sent++;
      const rating = Number(f["Rating"]);
      if (rating > 0) {
        reviewed++;
        if (rating >= 4) positive++;
        if (rating >= 1 && rating <= 5) dist[rating]++;
      }
    });

    const positiveRate = reviewed > 0 ? Math.round((positive / reviewed) * 100) : 0;
    return { sent, reviewed, positive, positiveRate, dist };
  }, [customers]);

  // Weekly chart data (last 8 weeks)
  const chartData = useMemo(() => {
    const weeks: { label: string; sent: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i * 7);
      weeks.push({ label: d.toLocaleDateString("en-AU", { day: "numeric", month: "short" }), sent: 0 });
    }
    customers.forEach((r) => {
      if (!r.createdTime) return;
      const rd = new Date(r.createdTime);
      const st = String(r.fields["SMS Status"] || "");
      if (!["Sent", "Delivered", "Completed", "Replied"].includes(st)) return;
      for (let i = weeks.length - 1; i >= 0; i--) {
        const bd = new Date(); bd.setDate(bd.getDate() - (7 - i) * 7);
        if (rd >= bd) { weeks[i].sent++; break; }
      }
    });
    return weeks;
  }, [customers]);

  // Rating distribution for bar chart
  const ratingData = useMemo(() => {
    return [5, 4, 3, 2, 1].map((r) => ({
      star: `${r}★`,
      count: stats.dist[r] || 0,
      fill: r >= 4 ? "#16A34A" : r === 3 ? "#F59E0B" : "#EF4444",
    }));
  }, [stats.dist]);

  // Last activity time
  const lastActivity = useMemo(() => {
    if (!customers.length) return null;
    const sorted = [...customers].sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
    const last = sorted[0];
    if (!last?.createdTime) return null;
    const diff = Date.now() - new Date(last.createdTime).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }, [customers]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addName.trim() || !addPhone.trim()) { toast("Enter name and phone", "warning"); return; }
    if (!user?.id) return;
    setAdding(true);
    try {
      const data = await customersApi.add(user.id, addName.trim(), addPhone.trim());
      if (data.success) {
        toast(`SMS sent to ${addName.trim()}`);
        setAddName(""); setAddPhone("");
        onAddCustomer();
      }
    } catch (err) { toast(err instanceof ApiError ? err.message : "Failed to add customer", "error"); }
    finally { setAdding(false); }
  }

  const usagePct = user?.contactLimit ? Math.min((user.contactsUsed / user.contactLimit) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-sm text-stone-900">Dashboard</h1>
          <p className="mt-1 text-body-sm text-stone-500">Manage SMS review requests</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading} className="rounded-lg">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* 4 Stat cards — matches original */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Sent" value={stats.sent} icon={Send} loading={loading} subtitle="All time" />
        <MetricCard label="Reviews Collected" value={stats.reviewed} icon={Star} iconColor="text-amber-600" iconBg="bg-amber-50" loading={loading} subtitle={`Positive rate: ${stats.positiveRate}%`} />
        <MetricCard label="This Month" value={user?.contactsUsed || 0} icon={MessageSquare} loading={loading} subtitle={`of ${user?.contactLimit || 300} limit`} />
        <MetricCard label="Plan" value="Starter" icon={Zap} iconColor="text-brand-500" iconBg="bg-brand-50" loading={loading} subtitle={user?.subscriptionStatus === "trialing" ? "Trial" : "Active"} />
      </div>

      {/* Usage bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body-sm font-medium text-stone-700">Monthly usage</span>
          <span className="text-caption text-stone-400">{user?.contactsUsed || 0} of {user?.contactLimit || 300} contacts</span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${usagePct > 90 ? "bg-red-500" : usagePct > 70 ? "bg-amber-500" : "bg-brand-500"}`} style={{ width: `${usagePct}%` }} />
        </div>
      </div>

      {/* Last activity */}
      {lastActivity && (
        <p className="text-[12px] text-stone-400 flex items-center gap-1.5 -mt-2">
          <Clock className="h-3 w-3" />Last activity: {lastActivity}
        </p>
      )}

      {/* Add customer form */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h3 className="text-heading-sm text-stone-900 mb-1">Send a Review Request</h3>
        <p className="text-body-sm text-stone-500 mb-4">Add a customer and we&apos;ll send them an SMS asking for a review.</p>
        <form onSubmit={handleAdd} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div><label className="text-body-sm font-medium text-stone-700 block mb-1.5">Customer Name</label><Input value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="Jane Smith" className="h-10" /></div>
          <div><label className="text-body-sm font-medium text-stone-700 block mb-1.5">Phone Number</label><Input value={addPhone} onChange={(e) => setAddPhone(e.target.value)} placeholder="04XX XXX XXX" type="tel" className="h-10" /></div>
          <Button type="submit" disabled={adding} className="bg-brand-600 hover:bg-brand-700 h-10 px-5">
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1.5" />Send</>}
          </Button>
        </form>
      </div>

      {/* Charts grid — SMS Trend + Rating Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* SMS Trend */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-sm text-stone-900">SMS Trend</h3>
            <span className="text-caption text-stone-400">Last 8 weeks</span>
          </div>
          {loading ? <div className="h-[200px] skeleton rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} /><stop offset="95%" stopColor="#16A34A" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#A8A49A" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E8E6DF", borderRadius: "12px", fontSize: "13px", boxShadow: "0 4px 12px rgba(0,0,0,.06)" }} labelStyle={{ fontWeight: 600, color: "#1A1714" }} />
                <Area type="monotone" dataKey="sent" stroke="#16A34A" strokeWidth={2} fill="url(#colorSent)" name="SMS Sent" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-sm text-stone-900">Rating Distribution</h3>
            <span className="text-caption text-stone-400">All time</span>
          </div>
          {loading ? <div className="h-[200px] skeleton rounded-xl" /> : (
            <div className="space-y-3">
              {ratingData.map((r) => {
                const maxCount = Math.max(...ratingData.map((d) => d.count), 1);
                const pct = (r.count / maxCount) * 100;
                return (
                  <div key={r.star} className="flex items-center gap-3">
                    <span className="text-[12px] font-semibold text-stone-500 w-6 text-right flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{r.star.replace("★", "")}
                    </span>
                    <div className="flex-1 h-5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: r.fill }} />
                    </div>
                    <span className="text-[12px] text-stone-500 w-6 text-right font-medium">{r.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
