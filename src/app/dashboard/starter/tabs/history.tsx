"use client";

import { useState, useMemo } from "react";
import { Search, Download, RefreshCw, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useToast } from "@/components/ui/toast-provider";

type CustomerRecord = { id: string; fields: Record<string, unknown>; createdTime: string };

type Props = {
  customers: CustomerRecord[];
  loading: boolean;
  onRefresh: () => void;
};

export function HistoryTab({ customers, loading, onRefresh }: Props) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    return customers.filter((r) => {
      const f = r.fields;
      const name = String(f["Customer Name"] || "").toLowerCase();
      const phone = String(f["Customer Phone"] || "");
      const status = String(f["SMS Status"] || "");
      const matchesSearch = !search || name.includes(search.toLowerCase()) || phone.includes(search);
      const matchesStatus = !statusFilter || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  function exportCSV() {
    if (!customers.length) { toast("No data to export", "warning"); return; }
    let csv = "Name,Phone,Status,Rating,Source,Date\n";
    customers.forEach((r) => {
      const f = r.fields;
      csv += `"${String(f["Customer Name"] || "").replace(/"/g, '""')}","${String(f["Customer Phone"] || "")}","${String(f["SMS Status"] || "")}","${String(f["Rating"] || "")}","${String(f["Source"] || "")}","${(r.createdTime || "").split("T")[0]}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revuera-customers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("CSV downloaded!");
  }

  function fmtDate(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-display-sm text-stone-900">Customer History</h1>
          <p className="mt-1 text-body-sm text-stone-500">All review requests sent</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-1.5" />CSV</Button>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></Button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone..." className="pl-9 h-10" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl border border-stone-200 px-3 text-body-sm text-stone-700 bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 outline-none"
        >
          <option value="">All statuses</option>
          <option value="Sent">Sent</option>
          <option value="Delivered">Delivered</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
          <option value="Awaiting Feedback">Awaiting Feedback</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200">
          <EmptyState icon={Inbox} title={customers.length === 0 ? "No customers yet" : "No results"} description={customers.length === 0 ? "Add your first customer to send them an SMS review request." : "Try a different search or filter."} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="text-left px-5 py-3 text-caption font-semibold text-stone-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3 text-caption font-semibold text-stone-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-5 py-3 text-caption font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-caption font-semibold text-stone-500 uppercase tracking-wider">Rating</th>
                  <th className="text-left px-5 py-3 text-caption font-semibold text-stone-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((r) => {
                  const f = r.fields;
                  const rating = Number(f["Rating"]);
                  return (
                    <tr key={r.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-body-sm font-medium text-stone-900">{String(f["Customer Name"] || "—")}</td>
                      <td className="px-5 py-3.5 text-body-sm text-stone-500 font-mono">{String(f["Customer Phone"] || "—")}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={String(f["SMS Status"] || "")} /></td>
                      <td className="px-5 py-3.5">
                        {rating > 0 ? (
                          <span className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < rating ? "text-amber-400" : "text-stone-200"}`}>★</span>
                            ))}
                          </span>
                        ) : (
                          <span className="text-caption text-stone-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-caption text-stone-400">{fmtDate(r.createdTime)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/30">
            <p className="text-caption text-stone-400">{filtered.length} of {customers.length} customers</p>
          </div>
        </div>
      )}
    </div>
  );
}
