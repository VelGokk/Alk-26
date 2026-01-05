import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { deliverEmail } from "@/lib/email";
import {
  contactConfirmationTemplate,
  supportContactTemplate,
} from "@/emails/templates/contact";

export async function POST(request: Request) {
  const formData = await request.formData();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const mensaje = String(formData.get("mensaje") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "consultoria").trim();
  const rawLang = String(formData.get("lang") ?? "");
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;

  if (!nombre || !email) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const subject = `Nuevo contacto (${tipo})`;
  const supportRecipient = process.env.CONTACT_SUPPORT_EMAIL ?? process.env.RESEND_FROM ?? "hola@alkaya.com";

  await deliverEmail({
    to: supportRecipient,
    subject,
    html: supportContactTemplate({ nombre, email, tipo, mensaje }),
    metadata: { tipo, email },
  });

  await deliverEmail({
    to: email,
    subject: "Confirmamos tu mensaje",
    html: contactConfirmationTemplate({ nombre, tipo }),
  });

  const redirectUrl = new URL(`/${lang}/contacto?enviado=1`, request.url);
  return NextResponse.redirect(redirectUrl, 303);
}
