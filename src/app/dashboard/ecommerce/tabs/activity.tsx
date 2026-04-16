"use client";

import { useState, useMemo } from "react";
import { Search, RefreshCw, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";

type Props = {
  orders: Array<Record<string, unknown>>;
  loading: boolean;
  onRefresh: () => void;
};

export function ActivityTab({ orders, loading, onRefresh }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter((o) => {
      const name = String(o.name || o.customer_name || "").toLowerCase();
      const source = String(o.source || "").toLowerCase();
      return name.includes(q) || source.includes(q);
    });
  }, [orders, search]);

  function fmtDate(val: unknown) {
    const s = String(val || "");
    if (!s) return "—";
    return new Date(s).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-display-sm text-stone-900">Activity</h1>
          <p className="mt-1 text-body-sm text-stone-500">All orders and review requests</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="pl-9 h-10" />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200">
          <EmptyState icon={Inbox} title="No orders yet" description="Connect your store in the Platforms tab to start receiving orders." />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-5 py-3 text-caption font-semibold text-stone-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-caption font-semibold text-stone-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-5 py-3 text-caption font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-caption font-semibold text-stone-500 uppercase tracking-wider">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((o, i) => (
                  <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-body-sm font-medium text-stone-900">{String(o.name || o.customer_name || "—")}</td>
                    <td className="px-5 py-3.5 text-body-sm text-stone-500">{String(o.source || "—")}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={String(o.status || o.sms_status || "Queued")} /></td>
                    <td className="px-5 py-3.5 text-caption text-stone-400">{fmtDate(o.created || o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-stone-100">
            {filtered.map((o, i) => (
              <div key={i} className="px-4 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-body-sm font-semibold text-stone-900 truncate">{String(o.name || o.customer_name || "—")}</p>
                  <p className="text-caption text-stone-400 mt-0.5">{String(o.source || "—")} · {fmtDate(o.created || o.created_at)}</p>
                </div>
                <StatusBadge status={String(o.status || o.sms_status || "Queued")} />
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/30">
            <p className="text-caption text-stone-400">{filtered.length} orders</p>
          </div>
        </div>
      )}
    </div>
  );
}
