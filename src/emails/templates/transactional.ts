export type PaymentNotificationPayload = {
  nombre: string;
  cursos: string[];
  monto: number;
  currency: string;
};

export function paymentReceiptTemplate({
  nombre,
  cursos,
  monto,
  currency,
}: PaymentNotificationPayload) {
  const courseList = cursos.map((curso) => `<li>${curso}</li>`).join("");
  return `
    <div style="font-family:system-ui, sans-serif;line-height:1.5;color:#111">
      <h2>Pago confirmado</h2>
      <p>Hola ${nombre},</p>
      <p>Gracias por tu pago. Ya podés acceder a los siguientes cursos:</p>
      <ul>${courseList}</ul>
      <p>
        Total: ${new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency,
        }).format(monto)}
      </p>
      <p>Ingresá al panel para continuar aprendiendo.</p>
    </div>
  `;
}

export function certificateReadyTemplate({
  nombre,
  curso,
}: {
  nombre: string;
  curso: string;
}) {
  return `
    <div style="font-family:system-ui, sans-serif;line-height:1.5;color:#111">
      <h2>Certificado disponible</h2>
      <p>Hola ${nombre},</p>
      <p>
        Felicitaciones, completaste el curso ${curso}. Tu certificado está
        disponible en el dashboard.
      </p>
      <p>Gracias por aprender con ALKAYA.</p>
    </div>
  `;
}
