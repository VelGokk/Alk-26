import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        ink: "var(--color-ink)",
        sand: "var(--color-sand)",
        brass: "var(--color-brass)",
        tide: "var(--color-tide)",
        ember: "var(--color-ember)",
      },
      boxShadow: {
        glow: "0 24px 80px -32px rgba(15, 23, 42, 0.55)",
      },
    },
  },
  plugins: [],
};

export default config;
