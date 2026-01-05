import { NextResponse } from "next/server";
import { SEO_DEFAULTS } from "@/config/seo";

export function GET() {
  const sitemapUrl = `${SEO_DEFAULTS.metadataBase.replace(/\/$/, "")}/sitemap.xml`;
  const body = [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${sitemapUrl}`,
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
