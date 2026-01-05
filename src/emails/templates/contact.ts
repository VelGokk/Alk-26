export type ContactPayload = {
  nombre: string;
  email: string;
  tipo: string;
  mensaje: string;
};

export function supportContactTemplate({
  nombre,
  email,
  tipo,
  mensaje,
}: ContactPayload) {
  return `
    <div style="font-family:system-ui, sans-serif;line-height:1.5;color:#111">
      <h2>Nuevo contacto desde ALKAYA</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Tipo de consulta:</strong> ${tipo}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje || "Sin mensaje"}</p>
    </div>
  `;
}

export function contactConfirmationTemplate({
  nombre,
  tipo,
}: Pick<ContactPayload, "nombre" | "tipo">) {
  return `
    <div style="font-family:system-ui, sans-serif;line-height:1.5;color:#111">
      <p>Hola ${nombre},</p>
      <p>
        Gracias por escribirnos. Recibimos tu solicitud (${tipo}) y nuestro equipo
        te responderá a la brevedad.
      </p>
      <p>El equipo de ALKAYA</p>
    </div>
  `;
}
