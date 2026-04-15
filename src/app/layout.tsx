import type { Metadata } from "next";
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
    icon: "/favicon.ico",
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
      </body>
    </html>
  );
}
