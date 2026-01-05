"use client";

import { useEffect, useState } from "react";
import { updateBranding } from "@/lib/actions/admin";

interface BrandingControlsProps {
  branding: {
    logoUrl?: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    panelRadius: number;
    panelBlur: number;
  };
}

const PANEL_RADIUS_RANGE = { min: 8, max: 64 };
const PANEL_BLUR_RANGE = { min: 0, max: 48 };

export default function BrandingControls({ branding }: BrandingControlsProps) {
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(branding.secondaryColor);
  const [accentColor, setAccentColor] = useState(branding.accentColor);
  const [panelRadius, setPanelRadius] = useState(branding.panelRadius ?? 24);
  const [panelBlur, setPanelBlur] = useState(branding.panelBlur ?? 16);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", primaryColor);
    root.style.setProperty("--brand-secondary", secondaryColor);
    root.style.setProperty("--brand-accent", accentColor);
    root.style.setProperty("--panel-radius", `${panelRadius}px`);
    root.style.setProperty("--panel-blur", `${panelBlur}px`);
  }, [primaryColor, secondaryColor, accentColor, panelRadius, panelBlur]);

  useEffect(() => {
    const root = document.documentElement;
    return () => {
      root.style.setProperty("--brand-primary", branding.primaryColor);
      root.style.setProperty("--brand-secondary", branding.secondaryColor);
      root.style.setProperty("--brand-accent", branding.accentColor);
      root.style.setProperty("--panel-radius", `${branding.panelRadius ?? 24}px`);
      root.style.setProperty("--panel-blur", `${branding.panelBlur ?? 16}px`);
    };
  }, [branding]);

  return (
    <form action={updateBranding} className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Logo URL
            <input
              name="logoUrl"
              defaultValue={branding.logoUrl ?? ""}
              placeholder="https://cdn..."
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
              type="url"
            />
          </label>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Color primario
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                name="primaryColor"
                value={primaryColor}
                onChange={(event) => setPrimaryColor(event.target.value)}
                className="h-12 w-12 rounded-xl border border-black/10 p-0"
                aria-label="Color primario"
              />
              <span className="font-mono text-sm text-zinc-600">{primaryColor}</span>
            </div>
          </label>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Color secundario
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                name="secondaryColor"
                value={secondaryColor}
                onChange={(event) => setSecondaryColor(event.target.value)}
                className="h-12 w-12 rounded-xl border border-black/10 p-0"
                aria-label="Color secundario"
              />
              <span className="font-mono text-sm text-zinc-600">
                {secondaryColor}
              </span>
            </div>
          </label>
          <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Color acento
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                name="accentColor"
                value={accentColor}
                onChange={(event) => setAccentColor(event.target.value)}
                className="h-12 w-12 rounded-xl border border-black/10 p-0"
                aria-label="Color acento"
              />
              <span className="font-mono text-sm text-zinc-600">{accentColor}</span>
            </div>
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-500">
              <span>Radio de panel</span>
              <span className="font-mono text-sm">{panelRadius}px</span>
            </div>
            <input
              type="range"
              name="panelRadius"
              min={PANEL_RADIUS_RANGE.min}
              max={PANEL_RADIUS_RANGE.max}
              value={panelRadius}
              onChange={(event) => setPanelRadius(Number(event.target.value))}
              className="w-full"
              style={{ accentColor: primaryColor }}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-500">
              <span>Desenfoque</span>
              <span className="font-mono text-sm">{panelBlur}px</span>
            </div>
            <input
              type="range"
              name="panelBlur"
              min={PANEL_BLUR_RANGE.min}
              max={PANEL_BLUR_RANGE.max}
              value={panelBlur}
              onChange={(event) => setPanelBlur(Number(event.target.value))}
              className="w-full"
              style={{ accentColor: accentColor }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:brightness-110"
          style={{ backgroundColor: primaryColor }}
        >
          Guardar branding
        </button>
      </div>

      <section className="glass-panel rounded-2xl p-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Preview a vuelo
          </p>
          <h3 className="font-heading text-xl">Como se ve en el sitio</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[primaryColor, secondaryColor, accentColor].map((color, index) => (
            <div
              key={`preview-${index}-${color}`}
              className="h-12 rounded-xl border border-black/10"
              style={{ backgroundColor: color }}
              aria-label={`Color ${index + 1}`}
            />
          ))}
        </div>
        <div className="space-y-3 rounded-2xl border border-black/5 bg-white/60 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-600">Panel de control</p>
            <span
              className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] text-zinc-600"
              style={{ backgroundColor: `${secondaryColor}33` }}
            >
              beta
            </span>
          </div>
          <div
            className="mt-2 rounded-xl px-4 py-3 text-sm text-zinc-700"
            style={{
              boxShadow: `0 12px 40px -24px ${primaryColor}`,
              borderRadius: `${panelRadius}px`,
            }}
          >
            <p className="font-semibold" style={{ color: primaryColor }}>
              Panel principal
            </p>
            <p className="text-xs text-zinc-500">
              Los elementos usan los tokens activos para botones y fondos.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                className="rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em]"
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  borderRadius: `${panelRadius}px`,
                }}
              >
                Accion principal
              </button>
              <button
                className="rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em]"
                style={{
                  borderColor: secondaryColor,
                  color: secondaryColor,
                  borderRadius: `${panelRadius}px`,
                }}
              >
                Secundario
              </button>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}
