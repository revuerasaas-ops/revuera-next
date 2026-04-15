"use client";

import { useState } from "react";
import { Copy, Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/components/ui/toast-provider";
import { API_URL } from "@/lib/constants";
import { motion } from "framer-motion";

// Platform brand colours for icon dots
// FIX H3: Platforms that previously pointed to 'shopify' path now correctly route
// to the generic Shopify-compatible handler OR show correct Zapier/setup instructions.
// Shopify, WooCommerce, BigCommerce, Square have dedicated parsers.
// All others use the generic handler which tries common field patterns.
const PLATFORMS = [
  { key: "shopify",       label: "Shopify",         path: "shopify",      color: "#96BF48", popular: true,  instructions: "Settings → Notifications → Webhooks → Create → Event: Order creation → URL: paste above" },
  { key: "woocommerce",   label: "WooCommerce",      path: "woocommerce",  color: "#7F54B3", popular: true,  instructions: "WooCommerce → Settings → Advanced → Webhooks → Add → Topic: Order created → Delivery URL: paste above" },
  { key: "bigcommerce",   label: "BigCommerce",      path: "bigcommerce",  color: "#34313F", popular: true,  instructions: "Settings → API → Webhooks → Create → Scope: store/order/created → URL: paste above" },
  { key: "stripe",        label: "Stripe",           path: "shopify",      color: "#6772E5", popular: true,  instructions: "Note: Stripe payments are handled via our Stripe webhook — check Settings tab for your Stripe webhook URL. Do NOT use the URL below for Stripe." },
  { key: "square",        label: "Square",           path: "square",       color: "#3E4348", popular: false, instructions: "Developer Dashboard → Webhooks → Add → Event: payment.completed → URL: paste above" },
  { key: "wix",           label: "Wix",              path: "shopify",      color: "#0C6EFC", popular: false, instructions: "Wix Dashboard → Automations → New Automation → Trigger: Order Paid → Action: Send webhook → URL: paste above. Wix webhooks send standard order data which our generic handler will process." },
  { key: "squarespace",   label: "Squarespace",      path: "shopify",      color: "#222222", popular: false, instructions: "Recommended: Use Zapier — Trigger 'New Order in Squarespace' → Action 'POST to Webhook URL' → paste above. Squarespace has limited native webhook support." },
  { key: "gumroad",       label: "Gumroad",          path: "shopify",      color: "#FF90E8", popular: false, instructions: "Settings → Advanced → Ping notification URL → Paste the URL above and save. Gumroad pings include customer name and email (no phone — SMS requires a phone number)." },
  { key: "paypal",        label: "PayPal",           path: "shopify",      color: "#003087", popular: false, instructions: "Developer Dashboard → My Apps → Webhooks → Add Webhook → Event: PAYMENT.CAPTURE.COMPLETED → URL: paste above" },
  { key: "ecwid",         label: "Ecwid",            path: "shopify",      color: "#F97316", popular: false, instructions: "My Sales → Settings → System Settings → Webhooks → Add Webhook → Event: order.created → URL: paste above" },
  { key: "lemonsqueezy",  label: "Lemon Squeezy",    path: "shopify",      color: "#FFD234", popular: false, instructions: "Settings → Webhooks → Add → Event: order_created → URL: paste above" },
  { key: "paddle",        label: "Paddle",           path: "shopify",      color: "#3DBA6E", popular: false, instructions: "Developer Tools → Notifications → New Destination → Event: transaction.completed → URL: paste above" },
  { key: "thrivecart",    label: "ThriveCart",       path: "shopify",      color: "#22A7E0", popular: false, instructions: "Product → Fulfilment → Webhook Notifications → Add URL → Event: Purchase completed → paste above" },
  { key: "etsy",          label: "Etsy",             path: "shopify",      color: "#F56400", popular: false, instructions: "Recommended: Use Zapier — Trigger 'New Order in Etsy' → Action 'POST to Webhook URL' → paste above. Etsy has no native outbound webhook support." },
  { key: "magento",       label: "Magento",          path: "shopify",      color: "#F26322", popular: false, instructions: "Stores → Configuration → Services → Webhooks → Add → Event: sales_order_place_after → URL: paste above" },
  { key: "prestashop",    label: "PrestaShop",       path: "shopify",      color: "#DF0067", popular: false, instructions: "Modules → Webhook → Configure → Add endpoint → Event: actionOrderStatusPostUpdate → URL: paste above" },
  { key: "opencart",      label: "OpenCart",         path: "shopify",      color: "#23ADF0", popular: false, instructions: "Extensions → Modules → Webhook → Install → Add → Event: order/add → URL: paste above" },
  { key: "boldcommerce",  label: "Bold Commerce",    path: "shopify",      color: "#E53935", popular: false, instructions: "Apps → Bold Cashier → Settings → Webhooks → Add URL → Event: Order completed → paste above" },
  { key: "kajabi",        label: "Kajabi",           path: "shopify",      color: "#7B61FF", popular: false, instructions: "Settings → Integrations → Webhooks → Add Webhook → Event: Purchase → URL: paste above" },
];

export function PlatformsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = PLATFORMS.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase())
  );
  const popular = filtered.filter((p) => p.popular);
  const others = filtered.filter((p) => !p.popular);

  function getWebhookUrl(platform: typeof PLATFORMS[0]) {
    return `${API_URL}/api/ecommerce/${platform.path}/${user?.id || "YOUR_ID"}`;
  }

  function copyUrl(platform: typeof PLATFORMS[0]) {
    navigator.clipboard.writeText(getWebhookUrl(platform));
    setCopied(platform.key);
    toast("Webhook URL copied!");
    setTimeout(() => setCopied(null), 2000);
  }

  function PlatformCard({ platform, index }: { platform: typeof PLATFORMS[0]; index: number }) {
    const isExpanded = expanded === platform.key;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
      >
        <button
          onClick={() => setExpanded(isExpanded ? null : platform.key)}
          className="w-full flex items-center gap-4 p-4 text-left hover:bg-stone-50/50 transition-colors"
        >
          {/* Brand colour dot */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-[12px] font-extrabold shadow-sm"
            style={{ backgroundColor: platform.color }}
          >
            {platform.label.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-stone-900">{platform.label}</span>
              {platform.popular && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wide">
                  Popular
                </span>
              )}
            </div>
            <p className="text-[12px] text-stone-400 truncate mt-0.5">
              {isExpanded ? "Click to collapse" : "Click to see setup instructions"}
            </p>
          </div>
          <div className={`shrink-0 w-5 h-5 rounded-full border border-stone-200 flex items-center justify-center transition-transform ${isExpanded ? "rotate-180" : ""}`}>
            <svg className="w-3 h-3 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-stone-100 px-4 pb-4 pt-3"
          >
            <p className="text-[12px] text-stone-500 mb-3 leading-relaxed">
              <span className="font-semibold text-stone-700">Setup: </span>{platform.instructions}
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-[11px] text-stone-600 font-mono truncate">
                {getWebhookUrl(platform)}
              </code>
              <button
                onClick={() => copyUrl(platform)}
                className="shrink-0 h-8 px-3 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 flex items-center gap-1.5 text-[12px] font-medium text-stone-600 hover:text-brand-700 hover:border-brand-300 transition-colors"
              >
                {copied === platform.key ? (
                  <><Check className="h-3.5 w-3.5 text-brand-600" />Copied</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" />Copy URL</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-display-sm text-stone-900">Webhooks</h1>
        <p className="mt-1 text-body-sm text-stone-500">
          Connect your store to automatically collect reviews after every order.
          <span className="ml-1.5 text-brand-600 font-semibold">{PLATFORMS.length} platforms supported.</span>
        </p>
      </div>



      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${PLATFORMS.length} platforms…`}
          className="pl-9 h-10"
        />
      </div>

      {/* Popular platforms */}
      {popular.length > 0 && !search && (
        <div>
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-3">Popular</p>
          <div className="space-y-3">
            {popular.map((p, i) => (
              <PlatformCard key={p.key} platform={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* All other platforms */}
      {(search ? filtered : others).length > 0 && (
        <div>
          {!search && <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-3">All Platforms</p>}
          <div className="space-y-3">
            {(search ? filtered : others).map((p, i) => (
              <PlatformCard key={p.key} platform={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-10 text-stone-400">
          <p className="text-[14px]">No platforms found for &ldquo;{search}&rdquo;</p>
          <p className="text-[12px] mt-1">Try Zapier to connect any platform not listed here.</p>
        </div>
      )}
    </div>
  );
}
