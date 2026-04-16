import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/hooks/use-auth";
import { ToastProvider } from "@/components/ui/toast-provider";

export const metadata: Metadata = {
  title: {
    default: "Revuera — Turn Happy Customers into 5-Star Google Reviews",
    template: "%s | Revuera",
  },
  description:
    "Smart review filtering sends happy customers to Google and keeps negative feedback private. SMS reviews for service businesses. Review funnel for ecommerce. Built in Australia.",
  metadataBase: new URL("https://revuera.com.au"),
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://revuera.com.au",
    siteName: "Revuera",
    title: "Revuera — Turn Happy Customers into 5-Star Google Reviews",
    description:
      "Smart review filtering. SMS reviews. Review funnel. Built for Australian businesses.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Revuera",
    description: "Turn happy customers into 5-star Google reviews.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
        {/* PostHog Analytics — replace YOUR_POSTHOG_KEY with your actual key after running npx @posthog/wizard */}
        {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
          <Script id="posthog" strategy="afterInteractive">{`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}',{api_host:'https://app.posthog.com'})
          `}</Script>
        )}
      </body>
    </html>
  );
}
