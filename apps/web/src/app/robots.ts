import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const aiUserAgents = [
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "Google-Extended",
    "Applebot-Extended",
    "PerplexityBot",
    "YouBot",
    "cohere-ai",
    "Anthropic-AI",
    "Omgilibot",
    "Omgili",
    "Diffbot",
    "ByteSpider",
  ];

  const rules = [
    // Standard rules for all web crawlers
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/admin/", "/preview/"],
    },
    // Explicitly allow LLMs/AI bots to crawl landing page content, but disallow private admin/api paths
    ...aiUserAgents.map((agent) => ({
      userAgent: agent,
      allow: ["/", "/terms", "/privacy", "/refund", "/cookies", "/affiliate"],
      disallow: ["/api/", "/dashboard/", "/admin/", "/preview/"],
    }))
  ];

  return {
    rules,
    sitemap: "https://cursorwebs.com/sitemap.xml",
  };
}
