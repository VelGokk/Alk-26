import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { sendEmail } from "@/lib/integrations/resend";

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
  const html = `
    <div>
      <p>Nuevo mensaje desde ALKAYA.</p>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Tipo:</strong> ${tipo}</p>
      <p><strong>Mensaje:</strong> ${mensaje || "Sin mensaje"}</p>
    </div>
  `;

  const fallbackRecipient = "hola@alkaya.com";
  const recipient = process.env.RESEND_FROM ?? fallbackRecipient;

  await sendEmail({
    to: recipient,
    subject,
    html,
  });

  const redirectUrl = new URL(`/${lang}/contacto?enviado=1`, request.url);
  return NextResponse.redirect(redirectUrl, 303);
}
