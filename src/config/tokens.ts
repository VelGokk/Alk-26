export const tokens = {
  brand: {
    900: "#0A2A43",
    600: "#0D6EFD",
  },
  bg: "#F5F7FA",
  text: "#0F172A",
  cta: "#2FBF71",
  border: "#E2E8F0",
  surface: "#FFFFFF",
  surfaceMuted: "#EDF2F7",
  haze: "rgba(13, 110, 253, 0.08)",
  tide: "#D6E3F0",
} as const;

export type Tokens = typeof tokens;

export const cssVariables = {
  "--brand-900": tokens.brand[900],
  "--brand-600": tokens.brand[600],
  "--bg": tokens.bg,
  "--text": tokens.text,
  "--cta": tokens.cta,
  "--border": tokens.border,
  "--color-deep": tokens.brand[900],
  "--color-alkaya": tokens.brand[600],
  "--color-surface": tokens.bg,
  "--color-surface-muted": tokens.surfaceMuted,
  "--color-text": tokens.text,
  "--color-cta": tokens.cta,
  "--color-line": tokens.border,
  "--color-haze": tokens.haze,
  "--color-ink": tokens.brand[900],
  "--color-sand": tokens.bg,
  "--color-brass": tokens.brand[600],
  "--color-tide": tokens.tide,
  "--color-ember": tokens.cta,
  "--surface": tokens.surface,
  "--surface-muted": tokens.surfaceMuted,
} satisfies Record<`--${string}`, string>;

export type CssVariables = typeof cssVariables;
