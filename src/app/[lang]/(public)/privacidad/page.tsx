export default function PrivacidadPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="eyebrow">Legal</p>
        <h1 className="font-heading text-4xl text-deep sm:text-5xl">
          Politica de privacidad
        </h1>
        <p className="text-sm text-slate-600">
          Esta politica explica como recopilamos, usamos y protegemos tu
          informacion cuando interactuas con ALKAYA.
        </p>
      </div>
      <div className="card space-y-4 text-sm text-slate-600">
        <p>
          Recopilamos datos de contacto y contexto para responder consultas y
          acompanarte en procesos de transformacion.
        </p>
        <p>
          No compartimos informacion con terceros sin consentimiento, salvo
          proveedores tecnicos necesarios para operar el servicio.
        </p>
        <p>
          Podes solicitar acceso, rectificacion o eliminacion de tus datos
          escribiendo a hola@alkaya.com.
        </p>
      </div>
    </div>
  );
}
