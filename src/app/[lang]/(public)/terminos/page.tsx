export default function TerminosPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="eyebrow">Legal</p>
        <h1 className="font-heading text-4xl text-deep sm:text-5xl">
          Terminos y condiciones
        </h1>
        <p className="text-sm text-slate-600">
          Al acceder a este sitio aceptas los terminos de uso y las condiciones
          de nuestros servicios.
        </p>
      </div>
      <div className="card space-y-4 text-sm text-slate-600">
        <p>
          Los contenidos y recursos son informativos y no constituyen promesas
          de resultados. Cada proceso es disenado segun el contexto.
        </p>
        <p>
          La contratacion de consultoria o formacion requiere acuerdos
          especificos definidos por propuesta.
        </p>
        <p>
          Para dudas o aclaraciones, escribinos a hola@alkaya.com.
        </p>
      </div>
    </div>
  );
}
