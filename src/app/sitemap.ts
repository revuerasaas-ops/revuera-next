import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://revuera.com.au";
  const now = new Date();

  const staticRoutes = [
    { url: base, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${base}/pricing`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${base}/sms-reviews`, priority: 0.85, changeFrequency: "monthly" as const },
    { url: `${base}/review-funnel`, priority: 0.85, changeFrequency: "monthly" as const },
    { url: `${base}/about`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${base}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${base}/case-study`, priority: 0.75, changeFrequency: "monthly" as const },
    { url: `${base}/faq`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${base}/contact`, priority: 0.6, changeFrequency: "yearly" as const },
    { url: `${base}/changelog`, priority: 0.5, changeFrequency: "weekly" as const },
    { url: `${base}/tool-reputation-grader`, priority: 0.75, changeFrequency: "monthly" as const },
    { url: `${base}/tool-review-link`, priority: 0.75, changeFrequency: "monthly" as const },
    { url: `${base}/tool-score-calculator`, priority: 0.75, changeFrequency: "monthly" as const },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return staticRoutes.map((r) => ({ ...r, lastModified: now }));
}
