"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutDashboard, Plug, Activity, MessageSquare, Settings, Palette, ShoppingCart, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardLayout, type DashboardTab } from "@/components/dashboard/dashboard-layout";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/components/ui/toast-provider";
import { subscription, ecommerce as ecomApi } from "@/lib/api/client";
import { EcomWizard } from "./setup-wizard";
import { EcomOverviewTab } from "./tabs/overview";
import { PlatformsTab } from "./tabs/platforms";
import { ActivityTab } from "./tabs/activity";
import { EcomFeedbackTab } from "./tabs/feedback";
import { EcomSettingsTab } from "./tabs/settings";
import { FunnelTab } from "./tabs/funnel";

const TABS: DashboardTab[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "funnel", label: "Funnel", icon: Palette },
  { id: "webhooks", label: "Webhooks", icon: Plug },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function EcommerceDashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated, updateUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [accessChecked, setAccessChecked] = useState(false);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const searchParams = useSearchParams();
  const isPostCheckout = searchParams.get("checkout") === "success";

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.push("/login"); return; }
    async function checkAccess() {
      const maxAttempts = isPostCheckout ? 7 : 3; // retry 3x on normal load, 7x post-checkout
      const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const data = await subscription.status();
          const status = data.subscriptionStatus;

          if (status === "active" || status === "trialing") {
            updateUser({
              plan: data.plan || "Starter", subscriptionStatus: status,
              contactLimit: data.contactLimit, contactsUsed: data.contactsUsed,
              googleReviewLink: data.googleReviewLink, shortcode: data.shortcode,
              name: data.name, email: data.email,
            });
            if (isPostCheckout) window.history.replaceState({}, "", "/dashboard/ecommerce");
            if (isPostCheckout || !data.googleReviewLink) setShowWelcome(true);
            setAccessChecked(true);
            return;
          }

          // Subscription genuinely inactive (not a transient error) — send to pricing
          // Only do this if we got a real response (not a network/auth error)
          if (status === "none" || status === "ended" || status === "past_due") {
            router.push("/pricing");
            return;
          }

          // Any other status — wait and retry
          if (attempt < maxAttempts - 1) await delay(1500);

        } catch (err: unknown) {
          // Network error or API failure — retry, don't punish the user
          // Only give up after all retries exhausted
          if (attempt < maxAttempts - 1) {
            await delay(1500);
          } else {
            // Final attempt failed — if we have a cached subscription in localStorage, use it
            const cachedStatus = user?.subscriptionStatus;
            if (cachedStatus === "active" || cachedStatus === "trialing") {
              // Trust the cached status — show dashboard with what we know
              setAccessChecked(true);
            } else {
              router.push("/pricing");
            }
          }
        }
      }
    }
    checkAccess();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, user?.subscriptionStatus]);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [statsData, ordersData] = await Promise.all([ecomApi.stats(user.id), ecomApi.orders(user.id)]);
      // stats endpoint returns { positive, negative, total, positiveRate }
      // orders endpoint returns { orders: [...], stats: {...} }
      setStats({ ...(statsData as Record<string, unknown>), ...((ordersData as Record<string, unknown>).stats as Record<string, unknown> || {}) });
      setOrders(((ordersData as Record<string, unknown>).orders || []) as Array<Record<string, unknown>>);
    } catch { toast("Failed to load data", "error"); }
    finally { setLoading(false); }
  }, [user?.id, toast]);

  useEffect(() => { if (accessChecked && user?.id && !showWizard && !showWelcome) loadData(); }, [accessChecked, user?.id, loadData, showWizard, showWelcome]);

  if (authLoading || !accessChecked) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <div className="w-10 h-10 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <div>
            <p className="text-body-sm font-medium text-stone-700">
              {isPostCheckout ? "Setting up your account…" : "Loading your dashboard…"}
            </p>
            <p className="text-[12px] text-stone-400 mt-1">
              {isPostCheckout ? "Confirming your payment — this takes a few seconds" : "Just a moment…"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-cream/95 backdrop-blur-sm z-[1000] flex items-center justify-center p-5">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-brand-400"
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((i / 8) * Math.PI * 2) * (80 + Math.random() * 60),
              y: Math.sin((i / 8) * Math.PI * 2) * (80 + Math.random() * 60),
            }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.06, repeat: Infinity, repeatDelay: 2.5 }}
            style={{ left: "50%", top: "50%" }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-600/30"
          >
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>

          <h1 className="text-display-sm text-stone-900 mb-2">You&apos;re in. Let&apos;s get you set up.</h1>
          <p className="text-body-md text-stone-500 mb-8 max-w-sm mx-auto">Your 7-day free trial is live. Setup takes 2 minutes.</p>

          <div className="flex items-center justify-center gap-4 mb-8">
            {[
              { label: "Connect Google" },
              { label: "Style your funnel" },
              { label: "You're live" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl bg-white border-2 border-stone-200 flex items-center justify-center">
                    <span className="text-[12px] font-bold text-stone-400">{i + 1}</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap">{step.label}</span>
                </div>
                {i < 2 && <div className="w-5 h-px bg-stone-200 mb-4" />}
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowWelcome(false); setShowWizard(true); }}
            className="bg-brand-600 hover:bg-brand-700 text-white px-10 py-4 rounded-2xl text-[15px] font-semibold shadow-lg shadow-brand-600/25 transition-colors"
          >
            Start Setup →
          </motion.button>
          <p className="mt-3 text-[12px] text-stone-400">Takes about 2 minutes</p>
        </motion.div>
      </div>
    );
  }

  if (showWizard) {
    return <EcomWizard onComplete={() => { setShowWizard(false); loadData(); }} onNavigateToWebhooks={() => setActiveTab("webhooks")} />;
  }

  const isTrial = user?.subscriptionStatus === "trialing";

  return (
    <DashboardLayout tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} planBadge="Ecommerce"
      trialBanner={isTrial ? (
        <div className="mb-6 bg-gradient-to-r from-brand-50 to-brand-50/40 border border-brand-200 rounded-2xl px-5 py-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-body-sm text-stone-700"><strong className="text-brand-700">Your 7-day free trial is active.</strong> Your plan will start automatically — no action needed.</p>
          <button onClick={() => setActiveTab("settings")} className="text-body-sm text-brand-600 font-semibold hover:underline shrink-0">Manage Billing</button>
        </div>
      ) : undefined}
    >
      {activeTab === "overview" && <EcomOverviewTab stats={stats} orders={orders} loading={loading} onRefresh={loadData} />}
      {activeTab === "funnel" && <FunnelTab onNavigateToWebhooks={() => setActiveTab("webhooks")} />}
      {activeTab === "webhooks" && <PlatformsTab />}
      {activeTab === "activity" && <ActivityTab orders={orders} loading={loading} onRefresh={loadData} />}
      {activeTab === "feedback" && <EcomFeedbackTab />}
      {activeTab === "settings" && <EcomSettingsTab onNavigateToTab={setActiveTab} />}
    </DashboardLayout>
  );
}
