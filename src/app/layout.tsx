import type { Metadata } from "next";
import type { ReactNode, CSSProperties } from "react";
import { Providers } from "./providers";
import "./globals.css";
import { cssVariables } from "@/styles/tokens";
import { SEO_DEFAULTS } from "@/config/seo";
import { SUPPORTED_LOCALES } from "@/config/i18n";
import { getBranding } from "@/lib/settings";

const baseUrl = SEO_DEFAULTS.metadataBase.replace(/\/$/, "");
const ogImageUrl = `${baseUrl}${SEO_DEFAULTS.openGraphImage}`;
const logoUrl = `${baseUrl}${SEO_DEFAULTS.logoPath}`;

const alternateLanguages = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [locale, `${baseUrl}/${locale}`])
);

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SEO_DEFAULTS.applicationName,
  url: baseUrl,
  logo: logoUrl,
  description: SEO_DEFAULTS.description,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SEO_DEFAULTS.contactEmail,
      availableLanguage: ["es", "en", "pt"],
    },
  ],
  sameAs: [
    "https://www.linkedin.com/company/alkaya",
    "https://www.instagram.com/alkaya",
    "https://www.youtube.com/@alkaya",
  ],
};

const structuredDataJson = JSON.stringify(structuredData);

export const metadata: Metadata = {
  title: SEO_DEFAULTS.title,
  description: SEO_DEFAULTS.description,
  metadataBase: new URL(baseUrl),
  applicationName: SEO_DEFAULTS.applicationName,
  openGraph: {
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    url: baseUrl,
    siteName: SEO_DEFAULTS.applicationName,
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "ALKAYA Consultora Ontologica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    creator: SEO_DEFAULTS.twitterHandle,
    site: SEO_DEFAULTS.twitterHandle,
  },
  alternates: {
    canonical: baseUrl,
    languages: alternateLanguages,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    "theme-color": "#0f172a",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const branding = await getBranding();
  const dynamicVars: Record<string, string> = {
    "--brand-primary": branding.primaryColor,
    "--brand-secondary": branding.secondaryColor,
    "--brand-accent": branding.accentColor,
    "--panel-radius": `${branding.panelRadius ?? 24}px`,
    "--panel-blur": `${branding.panelBlur ?? 16}px`,
  };
  const rootStyle = {
    ...cssVariables,
    ...dynamicVars,
  } satisfies CSSProperties;

  return (
    <html lang="es-AR" className={fontVariables} style={rootStyle}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataJson }}
        />
      </body>
    </html>
  );
}
