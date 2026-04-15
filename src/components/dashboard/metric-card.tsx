"use client";

import { motion } from "framer-motion";
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string };
  loading?: boolean;
};

export function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-brand-600",
  iconBg = "bg-brand-50",
  trend,
  loading,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-8 w-16" />
            <div className="skeleton h-3 w-32" />
          </div>
          <div className="skeleton h-10 w-10 rounded-xl" />
        </div>
      </div>
    );
  }

  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-stone-200 p-5 card-hover"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-body-sm text-stone-500 font-medium">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-stone-900 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-caption text-stone-400">{subtitle}</p>
          )}
          {trend && TrendIcon && (
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-0.5 text-caption font-semibold ${
                  trend.value > 0
                    ? "text-brand-600"
                    : trend.value < 0
                    ? "text-red-600"
                    : "text-stone-400"
                }`}
              >
                <TrendIcon className="h-3 w-3" />
                {Math.abs(trend.value)}%
              </span>
              <span className="text-caption text-stone-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}
