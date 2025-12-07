import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://ModelFlow.vc";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/case-study", "/quote"], 
      disallow: ["/admin/", "/api/", "/_next/", "/static/"], 
      crawlDelay: 1, 
    },
    sitemap: `${baseUrl}/sitemap.xml`, 
  };
}
