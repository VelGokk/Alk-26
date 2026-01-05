import type { Metadata } from "next";
import QRCode from "qrcode";
import { SEO_DEFAULTS } from "@/config/seo";
import { paths } from "@/config/paths";
import {
  DEFAULT_LOCALE,
  getDictionary,
  isLocale,
  type AppLocale,
} from "@/lib/i18n";

type Params = {
  params: {
    lang: string;
  };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const lang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  return {
    title: `QR Login | ${SEO_DEFAULTS.applicationName}`,
    description:
      "Escanea el código para acceder rápidamente a la plataforma desde tu celular.",
    metadataBase: new URL(SEO_DEFAULTS.metadataBase),
    alternates: {
      canonical: `${SEO_DEFAULTS.metadataBase}/${lang}/qr-login`,
    },
  };
}

export default async function QRLoginPage({ params }: Params) {
  const lang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const dictionary = await getDictionary(lang);
  const loginUrl = `${SEO_DEFAULTS.metadataBase.replace(/\/$/, "")}${paths.auth.signIn(
    lang as AppLocale
  )}`;
  const qrDataUrl = await QRCode.toDataURL(loginUrl, {
    width: 320,
    margin: 2,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-4 py-12 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/40">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          ALKAYA QR Login
        </p>
        <h1 className="text-center text-3xl font-bold">
          {dictionary.cta.login} rápido
        </h1>
        <p className="text-center text-sm text-slate-300">
          Escanea este código desde tu teléfono para iniciar sesión sin escribir
          usuario y contraseña. También puedes usarlo para compartir tu sesión de
          instructor o SuperAdmin.
        </p>
        <div className="rounded-2xl border border-white/10 bg-slate-950 p-6">
          <img
            src={qrDataUrl}
            alt="Código QR para iniciar sesión en ALKAYA"
            className="h-64 w-64 rounded-xl bg-white p-1"
            width={256}
            height={256}
          />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          {loginUrl}
        </p>
      </div>
    </div>
  );
}
