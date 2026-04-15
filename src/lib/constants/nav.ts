export const NAV_PRODUCTS = [
  {
    label: "Ecommerce",
    description: "For online businesses — $9/mo",
    href: "/review-funnel",
    icon: "ShoppingBag",
  },
  {
    label: "Starter",
    description: "For local businesses — $19/mo",
    href: "/sms-reviews",
    icon: "MessageSquare",
  },
] as const;

export const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "Pricing", href: "/pricing" },
    { label: "Ecommerce", href: "/review-funnel" },
    { label: "Starter", href: "/sms-reviews" },
    { label: "Changelog", href: "/changelog" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Case Studies", href: "/case-study" },
  ],
  tools: [
    { label: "Review Link Finder", href: "/tool-review-link" },
    { label: "Reputation Grader", href: "/tool-reputation-grader" },
    { label: "Score Calculator", href: "/tool-score-calculator" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;
