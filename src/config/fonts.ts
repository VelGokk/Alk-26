import { DM_Serif_Display, Inter, Poppins } from "next/font/google";

const headingFontConfig = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
  fallback: ["Playfair Display", "serif"],
});

const bodyFontConfig = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

const uiFontConfig = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
});

export const fonts = {
  heading: headingFontConfig,
  body: bodyFontConfig,
  ui: uiFontConfig,
} as const;

export const fontVariables = [
  headingFontConfig.variable,
  bodyFontConfig.variable,
  uiFontConfig.variable,
].join(" ");

export type FontKey = keyof typeof fonts;
export type FontConfig = typeof headingFontConfig;
