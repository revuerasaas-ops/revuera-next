import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/login",
          "/signup",
          "/verify",
          "/reset-password",
        ],
      },
    ],
    sitemap: "https://revuera.com.au/sitemap.xml",
    host: "https://revuera.com.au",
  };
}
