import { z } from "zod";

export const SECTION_TYPES = [
  "hero",
  "cards",
  "steps",
  "testimonials",
  "cta",
  "contact_form",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

const heroSchema = z
  .object({
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    actions: z
      .array(z.object({ label: z.string(), href: z.string(), variant: z.string().optional() }))
      .optional(),
    stats: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
    pills: z.array(z.string()).optional(),
    sideCard: z
      .object({
        eyebrow: z.string().optional(),
        title: z.string().optional(),
        list: z.array(z.string()).optional(),
        pills: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .passthrough();

const cardsSchema = z
  .object({
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    layout: z.string().optional(),
    pill: z.string().optional(),
    cardTitleSize: z.string().optional(),
    cards: z
      .array(
        z.object({
          eyebrow: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          placeholder: z.string().optional(),
          list: z.array(z.string()).optional(),
          ctaLabel: z.string().optional(),
          ctaHref: z.string().optional(),
        })
      )
      .optional(),
  })
  .passthrough();

const stepsSchema = z
  .object({
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    steps: z
      .array(
        z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .optional(),
  })
  .passthrough();

const testimonialsSchema = z
  .object({
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    items: z
      .array(
        z.object({
          quote: z.string().optional(),
          name: z.string().optional(),
          role: z.string().optional(),
        })
      )
      .optional(),
    ctaLabel: z.string().optional(),
    ctaHref: z.string().optional(),
  })
  .passthrough();

const ctaSchema = z
  .object({
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaHref: z.string().optional(),
    variant: z.string().optional(),
  })
  .passthrough();

const contactFormSchema = z
  .object({
    submitLabel: z.string().optional(),
    successTitle: z.string().optional(),
    successMessage: z.string().optional(),
    infoCards: z
      .array(
        z.object({
          eyebrow: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          lines: z.array(z.string()).optional(),
          ctaLabel: z.string().optional(),
          ctaHref: z.string().optional(),
        })
      )
      .optional(),
  })
  .passthrough();

type SectionSchema = z.ZodTypeAny;

type SectionConfig = {
  label: string;
  description: string;
  schema: SectionSchema;
  defaultData: Record<string, unknown>;
};

const DEFAULT_DATA: Record<SectionType, Record<string, unknown>> = {
  hero: {
    title: "Título",
    subtitle: "Subtítulo",
    actions: [],
    stats: [],
  },
  cards: {
    title: "Título de tarjetas",
    cards: [],
  },
  steps: {
    title: "Pasos",
    steps: [],
  },
  testimonials: {
    title: "Testimonios",
    items: [],
  },
  cta: {
    title: "CTA",
    variant: "dark",
  },
  contact_form: {
    submitLabel: "Enviar",
  },
};

const SECTION_CONFIG: Record<SectionType, SectionConfig> = {
  hero: {
    label: "Hero",
    description: "Encabezado con acciones y estadísticas.",
    schema: heroSchema,
    defaultData: DEFAULT_DATA.hero,
  },
  cards: {
    label: "Cards",
    description: "Grid de tarjetas con CTAs.",
    schema: cardsSchema,
    defaultData: DEFAULT_DATA.cards,
  },
  steps: {
    label: "Steps",
    description: "Lista con pasos numerados.",
    schema: stepsSchema,
    defaultData: DEFAULT_DATA.steps,
  },
  testimonials: {
    label: "Testimonials",
    description: "Lista de testimonios con cita.",
    schema: testimonialsSchema,
    defaultData: DEFAULT_DATA.testimonials,
  },
  cta: {
    label: "CTA",
    description: "Llamado a la acción enfocado.",
    schema: ctaSchema,
    defaultData: DEFAULT_DATA.cta,
  },
  contact_form: {
    label: "Contact Form",
    description: "Formulario de contacto con tarjetas de apoyo.",
    schema: contactFormSchema,
    defaultData: DEFAULT_DATA.contact_form,
  },
};

export function isSectionType(value?: string | null): value is SectionType {
  if (!value) return false;
  return SECTION_TYPES.includes(value as SectionType);
}

export function resolveSectionType(value?: string | null): SectionType {
  if (isSectionType(value)) return value;
  return "cards";
}

export function getSectionConfig(type?: SectionType) {
  return type && SECTION_CONFIG[type]
    ? SECTION_CONFIG[type]
    : SECTION_CONFIG.cards;
}

export function sanitizeSectionData(
  type: SectionType,
  value: unknown
): Record<string, unknown> {
  const config = getSectionConfig(type);
  const parsed = config.schema.safeParse(value ?? {});
  if (parsed.success) {
    return parsed.data;
  }
  return config.defaultData;
}

export function getSectionOptions() {
  return SECTION_TYPES.map((type) => ({
    type,
    ...SECTION_CONFIG[type],
  }));
}
