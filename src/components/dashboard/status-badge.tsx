import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Sent: "bg-brand-50 text-brand-700 border-brand-200",
  Delivered: "bg-brand-50 text-brand-700 border-brand-200",
  Completed: "bg-brand-50 text-brand-700 border-brand-200",
  Replied: "bg-brand-50 text-brand-700 border-brand-200",
  Pending: "bg-purple-50 text-purple-700 border-purple-200",
  Queued: "bg-purple-50 text-purple-700 border-purple-200",
  Failed: "bg-red-50 text-red-700 border-red-200",
  "Awaiting Feedback": "bg-amber-50 text-amber-700 border-amber-200",
};

export function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || "bg-stone-100 text-stone-600 border-stone-200";
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border", style)}>
      {status || "Unknown"}
    </span>
  );
}
