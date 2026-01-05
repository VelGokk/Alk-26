import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        ui: ["var(--font-ui)", "sans-serif"],
      },
      colors: {
        ink: "var(--color-ink)",
        sand: "var(--color-sand)",
        brass: "var(--color-brass)",
        tide: "var(--color-tide)",
        ember: "var(--color-ember)",
        deep: "var(--color-deep)",
        alkaya: "var(--color-alkaya)",
        surface: "var(--color-surface)",
        "surface-muted": "var(--color-surface-muted)",
        text: "var(--color-text)",
        cta: "var(--color-cta)",
        line: "var(--color-line)",
        haze: "var(--color-haze)",
      },
      boxShadow: {
        glow: "0 24px 80px -32px rgba(10, 42, 67, 0.45)",
        soft: "0 20px 50px -32px rgba(10, 42, 67, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
