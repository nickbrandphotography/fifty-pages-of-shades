import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Search and AI crawlers are welcome on every public page. Only the enquiry API is off limits.
const aiAndSearchBots = [
  "Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot", "Applebot-Extended", "CCBot", "Amazonbot", "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...aiAndSearchBots.map((userAgent) => ({ userAgent, allow: "/", disallow: "/api/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

export const dynamic = "force-static";
