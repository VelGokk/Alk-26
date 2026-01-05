import { NextResponse } from "next/server";
import { SITEMAP_ROUTES, SITE_LOCALES, SEO_DEFAULTS } from "@/config/seo";

export async function GET() {
  const baseUrl = SEO_DEFAULTS.metadataBase.replace(/\/$/, "");
  const today = new Date().toISOString().split("T")[0];
  const entries = SITE_LOCALES.flatMap((locale) =>
    SITEMAP_ROUTES.map((route) => {
      const loc = `${baseUrl}${route.path(locale)}`;
      return `
        <url>
          <loc>${loc}</loc>
          <lastmod>${today}</lastmod>
          <changefreq>${route.changefreq}</changefreq>
          <priority>${route.priority.toFixed(1)}</priority>
        </url>
      `;
    })
  );

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${entries.join("")}
  </urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
