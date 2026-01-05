import Link from "next/link";
import type { Section } from "@prisma/client";
import { getDictionary, type AppLocale } from "@/lib/i18n";
import { getSectionConfig, resolveSectionType } from "@/config/sections";

type PageSectionsProps = {
  sections: Section[];
  lang: AppLocale;
  spacing?: string;
  context?: {
    selectedTipo?: string;
    sent?: boolean;
  };
};

type SectionData = Record<string, any>;
type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

function getSectionData(section: Section): SectionData {
  if (section.data && typeof section.data === "object") {
    return section.data as SectionData;
  }
  return {};
}

function getLayoutClass(layout?: string) {
  switch (layout) {
    case "grid-2":
      return "grid gap-6 md:grid-cols-2";
    case "grid-3":
      return "grid gap-6 md:grid-cols-3";
    case "grid-4":
      return "grid gap-6 md:grid-cols-2 lg:grid-cols-4";
    case "split":
      return "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]";
    case "stack":
      return "grid gap-6";
    default:
      return "grid gap-6 md:grid-cols-3";
  }
}

function renderHero(data: SectionData) {
  const actions = Array.isArray(data.actions) ? data.actions : [];
  const stats = Array.isArray(data.stats) ? data.stats : [];
  const pills = Array.isArray(data.pills) ? data.pills : [];
  const sideCard =
    data.sideCard && typeof data.sideCard === "object" ? data.sideCard : null;

  const heroContent = (
    <div className="space-y-6">
      {data.eyebrow ? <p className="eyebrow">{data.eyebrow}</p> : null}
      {data.title ? (
        <h1 className="font-heading text-4xl leading-tight text-deep sm:text-5xl">
          {data.title}
        </h1>
      ) : null}
      {data.subtitle ? <p className="subtitle">{data.subtitle}</p> : null}
      {actions.length > 0 ? (
        <div className="flex flex-col gap-4 sm:flex-row">
          {actions.map((action, index) => (
            <Link
              key={`${action.href}-${index}`}
              href={action.href}
              className={
                action.variant === "secondary" ? "btn-secondary" : "btn-primary"
              }
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
      {pills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {pills.map((pill, index) => (
            <span key={`${pill}-${index}`} className="pill">
              {pill}
            </span>
          ))}
        </div>
      ) : null}
      {stats.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 pt-4 text-sm text-slate-600 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={`${stat.value}-${index}`}>
              <p className="font-heading text-2xl text-deep">{stat.value}</p>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <section className="relative overflow-hidden rounded-3xl hero-panel p-8 sm:p-12 animate-fade-up">
      <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-alkaya/20 blur-3xl animate-glow" />
      <div className="absolute -bottom-16 left-6 h-40 w-40 rounded-full bg-cta/20 blur-3xl animate-glow" />
      {sideCard ? (
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {heroContent}
          <div className="card card-hover space-y-5">
            <div>
              {sideCard.eyebrow ? (
                <p className="eyebrow">{sideCard.eyebrow}</p>
              ) : null}
              {sideCard.title ? (
                <h2 className="mt-3 font-heading text-2xl text-deep">
                  {sideCard.title}
                </h2>
              ) : null}
            </div>
            {Array.isArray(sideCard.list) && sideCard.list.length > 0 ? (
              <ul className="space-y-3 text-sm text-slate-600">
                {sideCard.list.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            ) : null}
            {Array.isArray(sideCard.pills) && sideCard.pills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sideCard.pills.map((pill, index) => (
                  <span key={`${pill}-${index}`} className="pill">
                    {pill}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="relative">{heroContent}</div>
      )}
    </section>
  );
}

function renderCards(data: SectionData) {
  const cards = Array.isArray(data.cards) ? data.cards : [];
  const layoutClass = getLayoutClass(data.layout);
  const cardTitleSize = data.cardTitleSize ?? "text-2xl";

  return (
    <section className="space-y-6" id={data.anchor || undefined}>
      {data.title || data.eyebrow ? (
        data.pill ? (
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              {data.eyebrow ? <p className="eyebrow">{data.eyebrow}</p> : null}
              {data.title ? (
                <h2 className="font-heading text-3xl text-deep">
                  {data.title}
                </h2>
              ) : null}
            </div>
            <span className="pill">{data.pill}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.eyebrow ? <p className="eyebrow">{data.eyebrow}</p> : null}
            {data.title ? (
              <h2 className="font-heading text-3xl text-deep">{data.title}</h2>
            ) : null}
            {data.subtitle ? <p className="subtitle">{data.subtitle}</p> : null}
          </div>
        )
      ) : null}
      <div className={layoutClass}>
        {cards.map((card, index) => (
          <div key={`${card.title}-${index}`} className="card card-hover">
            {card.placeholder ? (
              <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-100 text-xs uppercase tracking-[0.24em] text-slate-400">
                {card.placeholder}
              </div>
            ) : null}
            {card.eyebrow ? <p className="eyebrow">{card.eyebrow}</p> : null}
            {card.title ? (
              <h3 className={`mt-3 font-heading ${cardTitleSize} text-deep`}>
                {card.title}
              </h3>
            ) : null}
            {card.description ? (
              <p className="mt-3 text-sm text-slate-600">{card.description}</p>
            ) : null}
            {Array.isArray(card.list) && card.list.length > 0 ? (
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {card.list.map((item, listIndex) => (
                  <li key={`${item}-${listIndex}`}>- {item}</li>
                ))}
              </ul>
            ) : null}
            {card.ctaLabel && card.ctaHref ? (
              <Link href={card.ctaHref} className="btn-ghost mt-6">
                {card.ctaLabel}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function renderSteps(data: SectionData) {
  const steps = Array.isArray(data.steps) ? data.steps : [];

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3">
        {data.eyebrow ? <p className="eyebrow">{data.eyebrow}</p> : null}
        {data.title ? (
          <h2 className="font-heading text-3xl text-deep">{data.title}</h2>
        ) : null}
        {data.subtitle ? <p className="subtitle">{data.subtitle}</p> : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step, index) => (
          <div key={`${step.title}-${index}`} className="card card-hover">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-alkaya/10 text-sm font-semibold text-alkaya">
                0{index + 1}
              </div>
              <div>
                <h3 className="font-heading text-xl text-deep">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderTestimonials(data: SectionData) {
  const items = Array.isArray(data.items) ? data.items : [];

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          {data.eyebrow ? <p className="eyebrow">{data.eyebrow}</p> : null}
          {data.title ? (
            <h2 className="font-heading text-3xl text-deep">{data.title}</h2>
          ) : null}
        </div>
        {data.ctaLabel && data.ctaHref ? (
          <Link href={data.ctaHref} className="btn-ghost">
            {data.ctaLabel}
          </Link>
        ) : null}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((item, index) => (
          <div key={`${item.name}-${index}`} className="card card-hover">
            <p className="text-sm text-slate-600">&ldquo;{item.quote}&rdquo;</p>
            <div className="mt-6">
              <p className="font-heading text-lg text-deep">{item.name}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                {item.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderCta(data: SectionData) {
  const isDark = data.variant !== "light";

  return (
    <section
      className={
        isDark
          ? "relative overflow-hidden rounded-3xl bg-deep p-10 text-white shadow-glow sm:p-12"
          : "relative overflow-hidden rounded-3xl hero-panel p-10 sm:p-12"
      }
    >
      {isDark ? (
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-alkaya/30 blur-3xl animate-float" />
      ) : null}
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          {data.eyebrow ? (
            <p className={isDark ? "eyebrow text-white/70" : "eyebrow"}>
              {data.eyebrow}
            </p>
          ) : null}
          {data.title ? (
            <h2 className={isDark ? "font-heading text-3xl" : "font-heading text-3xl text-deep"}>
              {data.title}
            </h2>
          ) : null}
          {data.subtitle ? (
            <p className={isDark ? "text-sm text-white/80" : "text-sm text-slate-600"}>
              {data.subtitle}
            </p>
          ) : null}
        </div>
        {data.ctaLabel && data.ctaHref ? (
          <Link href={data.ctaHref} className="btn-primary">
            {data.ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function renderContactForm(
  data: SectionData,
  lang: AppLocale,
  dictionary: Dictionary,
  context?: PageSectionsProps["context"]
) {
  const selectedTipo = context?.selectedTipo ?? "consultoria";
  const sent = Boolean(context?.sent);
  const infoCards = Array.isArray(data.infoCards) ? data.infoCards : [];
  const contactForm = dictionary.contactForm;

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form className="card space-y-6" action="/api/contacto" method="post">
        <input type="hidden" name="lang" value={lang} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 font-sans">
              {contactForm.nameLabel}
            </label>
            <input
              name="nombre"
              required
              className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-deep outline-none transition focus:border-alkaya focus:ring-2 focus:ring-alkaya/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 font-sans">
              {contactForm.emailLabel}
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-deep outline-none transition focus:border-alkaya focus:ring-2 focus:ring-alkaya/20"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 font-sans">
            {contactForm.tipoLabel}
          </label>
          <select
            name="tipo"
            className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-deep outline-none transition focus:border-alkaya focus:ring-2 focus:ring-alkaya/20"
            defaultValue={selectedTipo}
          >
            <option value="consultoria">{contactForm.tipos.consultoria}</option>
            <option value="formacion">{contactForm.tipos.formacion}</option>
            <option value="otro">{contactForm.tipos.otro}</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 font-sans">
            {contactForm.messageLabel}
          </label>
          <textarea
            name="mensaje"
            rows={5}
            className="w-full rounded-2xl border border-line bg-white/80 px-4 py-3 text-sm text-deep outline-none transition focus:border-alkaya focus:ring-2 focus:ring-alkaya/20"
          />
        </div>
        <button type="submit" className="btn-primary w-full sm:w-auto">
          {data.submitLabel ?? contactForm.submitLabel}
        </button>
      </form>

      <div className="space-y-6">
        {sent ? (
          <div className="card border-emerald-500/40 bg-emerald-50/60">
            <p className="eyebrow text-emerald-700">
              {data.successTitle ?? contactForm.successTitle}
            </p>
            <p className="mt-2 text-sm text-emerald-700">
              {data.successMessage ?? contactForm.successMessage}
            </p>
          </div>
        ) : null}
        {infoCards.map((card, index) => (
          <div key={`${card.title}-${index}`} className="card">
            {card.eyebrow ? <p className="eyebrow">{card.eyebrow}</p> : null}
            {card.title ? (
              <h2 className="mt-3 font-heading text-2xl text-deep">
                {card.title}
              </h2>
            ) : null}
            {card.description ? (
              <p className="mt-3 text-sm text-slate-600">
                {card.description}
              </p>
            ) : null}
            {Array.isArray(card.lines) && card.lines.length > 0 ? (
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {card.lines.map((line, lineIndex) => (
                  <p key={`${line}-${lineIndex}`}>{line}</p>
                ))}
              </div>
            ) : null}
            {card.ctaLabel && card.ctaHref ? (
              <Link href={card.ctaHref} className="btn-ghost mt-6">
                {card.ctaLabel}
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function PageSections({
  sections,
  lang,
  spacing,
  context,
}: PageSectionsProps) {
  const dictionary = await getDictionary(lang);
  const visibleSections = sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);
  const spacingClass = spacing ?? "space-y-20";

  return (
    <div className={spacingClass}>
      {visibleSections.map((section) => {
        const sectionType = resolveSectionType(section.type);
        const sectionMeta = getSectionConfig(sectionType);
        const data = getSectionData(section);

        switch (sectionType) {
          case "hero":
            return <div key={section.id}>{renderHero(data)}</div>;
          case "cards":
            return <div key={section.id}>{renderCards(data)}</div>;
          case "steps":
            return <div key={section.id}>{renderSteps(data)}</div>;
          case "testimonials":
            return <div key={section.id}>{renderTestimonials(data)}</div>;
          case "cta":
            return <div key={section.id}>{renderCta(data)}</div>;
          case "contact_form":
            return (
              <div key={section.id}>
                {renderContactForm(data, lang, dictionary, context)}
              </div>
            );
          default:
            return (
              <section
                key={section.id}
                className="glass-panel rounded-2xl border border-line/40 p-6 text-sm text-slate-500"
              >
                <p className="font-semibold text-zinc-500">
                  Tipo desconocido{" "}
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {section.type}
                  </span>
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {sectionMeta
                    ? `Define este tipo en el editor (tipo ${sectionMeta.label}).`
                    : "Agrega un tipo válido de sección desde el CMS."}
                </p>
              </section>
            );
        }
      })}
    </div>
  );
}
