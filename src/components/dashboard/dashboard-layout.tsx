"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Clock, MessageCircle, Settings, Menu,
  X, LogOut, ChevronLeft, CreditCard, HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/components/ui/toast-provider";

export type DashboardTab = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type DashboardLayoutProps = {
  children: ReactNode;
  tabs: DashboardTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  planBadge?: string;
  trialBanner?: ReactNode;
};

export function DashboardLayout({
  children,
  tabs,
  activeTab,
  onTabChange,
  planBadge,
  trialBanner,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-sand flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-stone-200 bg-white transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-stone-100">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-lg font-extrabold text-stone-900">Revuera</span>
              <span className="text-lg font-extrabold text-brand-600">.</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {/* Plan badge */}
          {!collapsed && planBadge && (
            <div className="mb-4 px-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-caption font-semibold border border-brand-200">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                {planBadge}
              </span>
            </div>
          )}

          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-sm"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                }`}
                title={collapsed ? tab.label : undefined}
              >
                <tab.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-brand-600" : "text-stone-400 group-hover:text-stone-600"}`} />
                {!collapsed && <span>{tab.label}</span>}
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-1.5 h-1.5 bg-brand-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-stone-100 p-3 space-y-1">
          {!collapsed && (
            <div className="px-3 py-2 mb-2">
              <p className="text-body-sm font-semibold text-stone-900 truncate">{user?.name || "—"}</p>
              <p className="text-caption text-stone-400 truncate">{user?.email || "—"}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title={collapsed ? "Log out" : undefined}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-stone-200 z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between h-16 px-5 border-b border-stone-100">
                <Link href="/" className="flex items-center gap-0.5">
                  <span className="text-lg font-extrabold text-stone-900">Revuera</span>
                  <span className="text-lg font-extrabold text-brand-600">.</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-stone-100"><X className="h-5 w-5 text-stone-500" /></button>
              </div>
              <nav className="flex-1 py-4 px-3 space-y-1">
                {planBadge && (
                  <div className="mb-4 px-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-caption font-semibold border border-brand-200">
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />{planBadge}
                    </span>
                  </div>
                )}
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button key={tab.id} onClick={() => { onTabChange(tab.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all ${isActive ? "bg-brand-50 text-brand-700" : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"}`}
                    >
                      <tab.icon className={`h-[18px] w-[18px] ${isActive ? "text-brand-600" : "text-stone-400"}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
              <div className="border-t border-stone-100 p-3">
                <div className="px-3 py-2 mb-2">
                  <p className="text-body-sm font-semibold text-stone-900 truncate">{user?.name}</p>
                  <p className="text-caption text-stone-400 truncate">{user?.email}</p>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-[18px] w-[18px]" />Log out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-stone-200 bg-white/80 backdrop-blur-xl flex items-center px-4 lg:px-8 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-stone-100">
            <Menu className="h-5 w-5 text-stone-600" />
          </button>
          <div className="flex-1" />
          <Link href="/faq" className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {trialBanner}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
