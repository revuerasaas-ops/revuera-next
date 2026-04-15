export { NAV_PRODUCTS, NAV_LINKS, FOOTER_LINKS } from "./nav";

export const PLANS = {
  ecommerce: {
    name: "Ecommerce",
    tagline: "For online stores",
    monthlyPrice: 9,
    annualPrice: 7,
    annualTotal: 84,
    features: [
      "Branded review funnel page",
      "Smart rating filter (4-5★ → Google, 1-3★ → private)",
      "Works with Shopify, WooCommerce, BigCommerce, Square + more",
      "Post-checkout redirect",
      "Real-time analytics",
      "100 reviews/month",
    ],
    stripePriceMonthly: "price_1REBvPEDIUGTDeRSIIxlp7YO",
    stripePriceAnnual: "price_1REBvPEDIUGTDeRiPCXafKvq",
    dashboard: "/dashboard/ecommerce",
    popular: false,
  },
  starter: {
    name: "Starter",
    tagline: "For service businesses",
    monthlyPrice: 19,
    annualPrice: 15,
    annualTotal: 180,
    features: [
      "SMS review requests",
      "Smart rating filter (4-5★ → Google, 1-3★ → private)",
      "Custom SMS templates",
      "Auto-reply messages",
      "24hr follow-up SMS",
      "Customer history & analytics",
      "200 contacts/month",
    ],
    stripePriceMonthly: "price_1REBvPEDIUGTDeTpYF2FcRcw",
    stripePriceAnnual: "price_1REBvPEDIUGTDeTiytqgQ5I4",
    dashboard: "/dashboard/starter",
    popular: true,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

// FIX C4: Key now reads from env var, not hardcoded.
// Restrict this key in Google Cloud Console to your domains + Places API only.
export const GOOGLE_PLACES_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY || "";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://revueraworker.revuerasaas.workers.dev";
