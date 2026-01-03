import type { Metadata } from "next";
import { Inter, Playfair_Display, Poppins } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const headingFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

const uiFont = Poppins({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ALKAYA | Consultoria Ontologica",
  description:
    "Consultora de coaching ontologico para lideres y organizaciones. Procesos de transformacion sostenidos.",
  metadataBase: new URL("https://alkaya.com"),
  applicationName: "ALKAYA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${headingFont.variable} ${bodyFont.variable} ${uiFont.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
