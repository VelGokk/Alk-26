import { PrismaClient, Role, CourseStatus, ProgramPhase } from "@prisma/client";
import { hash } from "bcryptjs";
import permissionMatrix from "../src/config/permissions.json" assert { type: "json" };

const prisma = new PrismaClient();

const LOCALES = ["es-ar", "es-mx", "en"];

const resolveHref = (lang, path) => path.replace("{lang}", lang);

function buildPages(lang) {
  const href = (path) => resolveHref(lang, path);

  return [
    {
      slug: "home",
      seoTitle: "ALKAYA | Consultoria Ontologica",
      seoDesc:
        "Disenamos el sistema que hace que el cambio si se sostenga para lideres y organizaciones.",
      sections: [
        {
          type: "hero",
          order: 0,
          data: {
            eyebrow: "ALKAYA",
            title: "Disenamos el sistema que hace que el cambio si se sostenga.",
            subtitle:
              "Para lideres y organizaciones cansados de entender mucho... y cambiar poco.",
            actions: [
              {
                label: "Quiero ordenar mi proceso",
                href: href("/{lang}/consultoria"),
                variant: "primary",
              },
              {
                label: "Quiero formarme",
                href: href("/{lang}/formacion"),
                variant: "secondary",
              },
            ],
            stats: [
              { value: "+12", label: "Procesos 2025/26" },
              { value: "3", label: "Formatos de intervencion" },
              { value: "92%", label: "Continuidad a 6 meses" },
              { value: "1:1", label: "Seguimiento humano" },
            ],
            sideCard: {
              eyebrow: "Mapa de transformacion",
              title: "Del diagnostico a la practica diaria",
              list: [
                "Observamos quiebres, conversaciones y contextos.",
                "Disenamos intervenciones y metricas de avance.",
                "Acompanamos lideres, equipos y personas clave.",
                "Medimos impacto y ajustamos el sistema.",
              ],
              pills: ["Diagnostico", "Diseno", "Intervencion", "Seguimiento"],
            },
          },
        },
        {
          type: "cards",
          order: 1,
          data: {
            eyebrow: "Que hacemos",
            title: "Procesos de transformacion, no cursos sueltos",
            layout: "grid-3",
            cards: [
              {
                eyebrow: "ALKAYA",
                title: "Consultoria Ontologica",
                description:
                  "Intervenciones para transformar conversaciones, decisiones y cultura en tiempo real.",
                ctaLabel: "Hablemos",
                ctaHref: href("/{lang}/contacto"),
              },
              {
                eyebrow: "ALKAYA",
                title: "Formacion Transformacional",
                description:
                  "Programas que cambian la forma de observar, decidir y actuar, sin recetas magicas.",
                ctaLabel: "Hablemos",
                ctaHref: href("/{lang}/contacto"),
              },
              {
                eyebrow: "ALKAYA",
                title: "Acompanamiento Sostenido",
                description:
                  "Seguimiento, medicion y ajustes para que el cambio se sostenga en el tiempo.",
                ctaLabel: "Hablemos",
                ctaHref: href("/{lang}/contacto"),
              },
            ],
          },
        },
        {
          type: "steps",
          order: 2,
          data: {
            eyebrow: "Como trabajamos",
            title: "Un proceso claro con acompanamiento sostenido",
            steps: [
              {
                title: "Escucha y diagnostico",
                description:
                  "Leemos el sistema actual, sus conversaciones y los quiebres que no se nombran.",
              },
              {
                title: "Diseno del proceso",
                description:
                  "Co-creamos un mapa de intervencion con hitos, responsables y medicion.",
              },
              {
                title: "Intervencion y practica",
                description:
                  "Entrenamos nuevas formas de observar y actuar con acompanamiento cercano.",
              },
              {
                title: "Medicion y ajuste",
                description:
                  "Observamos resultados, ajustamos el proceso y consolidamos aprendizajes.",
              },
            ],
          },
        },
        {
          type: "testimonials",
          order: 3,
          data: {
            eyebrow: "Casos reales",
            title: "Testimonios que hablan de proceso",
            ctaLabel: "Ver recursos",
            ctaHref: href("/{lang}/recursos"),
            items: [
              {
                quote:
                  "No cambiamos la gente. Cambiamos las conversaciones y la forma de decidir.",
                name: "Martina R.",
                role: "Directora de RRHH, Industria",
              },
              {
                quote:
                  "El proceso ordeno prioridades y dio lenguaje comun a equipos que no se escuchaban.",
                name: "Gustavo L.",
                role: "CEO, Servicios Profesionales",
              },
              {
                quote:
                  "Lo valioso fue el seguimiento: sostener la practica cuando vuelve la urgencia.",
                name: "Lucia P.",
                role: "People Lead, Tecnologia",
              },
            ],
          },
        },
        {
          type: "cta",
          order: 4,
          data: {
            eyebrow: "CTA",
            title: "Listo para disenar un proceso que se sostenga",
            subtitle:
              "Hablemos sobre tu contexto y lo que hoy no esta ocurriendo.",
            ctaLabel: "Hablar con un consultor",
            ctaHref: href("/{lang}/contacto"),
            variant: "dark",
          },
        },
      ],
    },
    {
      slug: "consultoria",
      seoTitle: "Consultoria Ontologica | ALKAYA",
      seoDesc:
        "Procesos de transformacion para lideres y equipos con acompanamiento sostenido.",
      sections: [
        {
          type: "hero",
          order: 0,
          data: {
            eyebrow: "Consultoria",
            title:
              "Procesos de transformacion disenados desde coaching ontologico.",
            subtitle:
              "Disenamos intervenciones que impactan en como observas, decidis y coordinas. No es consultoria de cursos: es acompanamiento sostenido.",
            pills: ["Diagnostico", "Diseno", "Intervencion", "Medicion"],
          },
        },
        {
          type: "cards",
          order: 1,
          data: {
            layout: "grid-3",
            cards: [
              {
                title: "Liderazgo & Cultura",
                description:
                  "Alineamos conversaciones clave, acuerdos y coherencia entre lo que se dice y lo que se hace.",
                ctaLabel: "Quiero conversar esto",
                ctaHref: href("/{lang}/contacto?tipo=consultoria"),
              },
              {
                title: "Coaching de Equipos",
                description:
                  "Entrenamos equipos para coordinar acciones, feedback y compromisos en contextos complejos.",
                ctaLabel: "Quiero conversar esto",
                ctaHref: href("/{lang}/contacto?tipo=consultoria"),
              },
              {
                title: "Gestion del Cambio",
                description:
                  "Acompanamos cambios estructurales con intervenciones y metricas que sostienen el avance.",
                ctaLabel: "Quiero conversar esto",
                ctaHref: href("/{lang}/contacto?tipo=consultoria"),
              },
            ],
          },
        },
        {
          type: "cards",
          order: 2,
          data: {
            layout: "split",
            cards: [
              {
                eyebrow: "Senales tipicas",
                title: "Cuando conviene una intervencion ontologica",
                list: [
                  "La organizacion entiende el cambio, pero no lo sostiene.",
                  "Los equipos trabajan, pero no coordinan conversaciones dificiles.",
                  "El liderazgo pide resultados sin un proceso claro de aprendizaje.",
                ],
              },
              {
                eyebrow: "Primeros 30 dias",
                title: "Un proceso claro desde el inicio",
                list: [
                  "Entrevistas con lideres y mapeo de quiebres.",
                  "Diseno del proceso y acuerdos de trabajo.",
                  "Inicio de intervenciones con seguimiento semanal.",
                  "Plan de medicion y ajustes tempranos.",
                ],
              },
            ],
          },
        },
        {
          type: "cta",
          order: 3,
          data: {
            eyebrow: "Siguiente paso",
            title: "Hablemos sobre tu contexto",
            subtitle:
              "Contanos donde esta el quiebre y disenamos un proceso a medida.",
            ctaLabel: "Quiero conversar esto",
            ctaHref: href("/{lang}/contacto?tipo=consultoria"),
            variant: "dark",
          },
        },
      ],
    },
    {
      slug: "formacion",
      seoTitle: "Formacion Ontologica | ALKAYA",
      seoDesc:
        "Formacion basada en coaching ontologico para transformar como observas, decidis y actuas.",
      sections: [
        {
          type: "hero",
          order: 0,
          data: {
            eyebrow: "Formacion",
            title:
              "Formacion basada en coaching ontologico para transformar como observas, decidis y actuas.",
            subtitle:
              "No somos escuela. Disenamos procesos de aprendizaje insertos en tu realidad, con acompanamiento sostenido.",
            actions: [
              {
                label: "Ver programas activos",
                href: href("/{lang}/formacion/programas"),
                variant: "primary",
              },
              {
                label: "Hablar con un asesor",
                href: href("/{lang}/contacto?tipo=formacion"),
                variant: "secondary",
              },
            ],
          },
        },
        {
          type: "cards",
          order: 1,
          data: {
            layout: "grid-3",
            cards: [
              {
                title: "Programas personales",
                description:
                  "Procesos uno a uno para revisar la forma en que observas, decidis y sostienes compromisos.",
                ctaLabel: "Quiero saber mas",
                ctaHref: href("/{lang}/contacto?tipo=formacion"),
              },
              {
                title: "Programas para lideres",
                description:
                  "Entrenamiento en conversaciones, coordinacion y liderazgo en contextos reales.",
                ctaLabel: "Quiero saber mas",
                ctaHref: href("/{lang}/contacto?tipo=formacion"),
              },
              {
                title: "Programas para equipos",
                description:
                  "Intervenciones grupales para mejorar confianza, acuerdos y cultura de trabajo.",
                ctaLabel: "Quiero saber mas",
                ctaHref: href("/{lang}/contacto?tipo=formacion"),
              },
            ],
          },
        },
        {
          type: "cards",
          order: 2,
          data: {
            layout: "split",
            cards: [
              {
                eyebrow: "Principios",
                title: "Formacion que se vuelve practica",
                list: [
                  "Formacion aplicada a tu contexto, no teorica.",
                  "Acompanamiento entre encuentros para sostener el cambio.",
                  "Metricas y reflexion para consolidar aprendizajes.",
                ],
              },
              {
                eyebrow: "Acompanamiento",
                title: "Sostener el cambio, no solo entenderlo",
                description:
                  "La formacion incluye seguimiento entre encuentros, guias de conversacion y espacios de retroalimentacion para mantener el compromiso vivo.",
                ctaLabel: "Hablar con un asesor",
                ctaHref: href("/{lang}/contacto?tipo=formacion"),
              },
            ],
          },
        },
      ],
    },
    {
      slug: "recursos",
      seoTitle: "Recursos | ALKAYA",
      seoDesc:
        "Ideas, herramientas y conversaciones para ampliar tu forma de observar.",
      sections: [
        {
          type: "hero",
          order: 0,
          data: {
            eyebrow: "Recursos",
            title:
              "Ideas, herramientas y conversaciones para ampliar tu forma de observar.",
            subtitle:
              "Seleccion curada para lideres y organizaciones que buscan sostener el cambio en el tiempo.",
            actions: [
              {
                label: "Explorar recursos",
                href: "#articulos",
                variant: "primary",
              },
              {
                label: "Recibir novedades",
                href: href("/{lang}/contacto"),
                variant: "secondary",
              },
            ],
          },
        },
        {
          type: "cards",
          order: 1,
          data: {
            anchor: "articulos",
            title: "Articulos",
            pill: "Lecturas",
            layout: "grid-3",
            cardTitleSize: "text-xl",
            cards: [
              {
                eyebrow: "Articulo",
                title: "El observador y sus decisiones",
                description:
                  "Como los juicios y las emociones condicionan lo que elegis y lo que postergas.",
                ctaLabel: "Pedir acceso",
                ctaHref: href("/{lang}/contacto"),
              },
              {
                eyebrow: "Conversaciones",
                title: "Conversaciones que sostienen la cultura",
                description:
                  "Claves para pasar de acuerdos declarados a practicas que se cumplen.",
                ctaLabel: "Pedir acceso",
                ctaHref: href("/{lang}/contacto"),
              },
              {
                eyebrow: "Equipos",
                title: "Coordinacion en equipos complejos",
                description:
                  "Herramientas para coordinar acciones sin perder confianza ni claridad.",
                ctaLabel: "Pedir acceso",
                ctaHref: href("/{lang}/contacto"),
              },
            ],
          },
        },
        {
          type: "cards",
          order: 2,
          data: {
            anchor: "podcasts",
            title: "Podcasts / Videos",
            pill: "Conversaciones",
            layout: "grid-2",
            cardTitleSize: "text-xl",
            cards: [
              {
                eyebrow: "Podcast",
                title: "Cambiar sin promesas magicas",
                description:
                  "Una charla sobre procesos reales de transformacion.",
                ctaLabel: "Solicitar link",
                ctaHref: href("/{lang}/contacto"),
              },
              {
                eyebrow: "Video",
                title: "Liderazgo conversacional",
                description:
                  "Como liderar conversaciones dificiles en contextos de cambio.",
                ctaLabel: "Solicitar link",
                ctaHref: href("/{lang}/contacto"),
              },
            ],
          },
        },
        {
          type: "cards",
          order: 3,
          data: {
            anchor: "descargables",
            title: "Descargables",
            pill: "Herramientas",
            layout: "grid-2",
            cardTitleSize: "text-xl",
            cards: [
              {
                eyebrow: "Descargable",
                title: "Guia de conversaciones clave",
                description:
                  "Preguntas y estructuras para conversaciones que abren camino.",
                ctaLabel: "Recibir descargable",
                ctaHref: href("/{lang}/contacto"),
              },
              {
                eyebrow: "Herramienta",
                title: "Checklist de cambios sostenidos",
                description:
                  "Senales para medir si el cambio se vuelve practica.",
                ctaLabel: "Recibir descargable",
                ctaHref: href("/{lang}/contacto"),
              },
            ],
          },
        },
      ],
    },
    {
      slug: "nosotros",
      seoTitle: "Nosotros | ALKAYA",
      seoDesc:
        "ALKAYA es una consultora de coaching ontologico que disena procesos de transformacion sostenidos.",
      sections: [
        {
          type: "hero",
          order: 0,
          data: {
            eyebrow: "Nosotros",
            title: "ALKAYA - que es, que hace y como lo hace",
            subtitle:
              "Somos una consultora de coaching ontologico que disena procesos de transformacion personal y organizacional con acompanamiento real.",
          },
        },
        {
          type: "cards",
          order: 1,
          data: {
            layout: "grid-3",
            cards: [
              {
                title: "Que es Alkaya",
                description:
                  "Alkaya es una consultora de coaching ontologico. Disenamos procesos de transformacion personal y organizacional que integran coaching profesional, consultoria estrategica y formacion aplicada.",
              },
              {
                title: "Para que existe",
                description:
                  "Alkaya existe para cerrar una brecha concreta: personas y organizaciones entienden mucho, pero cambian poco.",
                list: [
                  "Decisiones claras",
                  "Conversaciones distintas",
                  "Habitos que se sostienen",
                  "Culturas que evolucionan",
                ],
              },
              {
                title: "Por que lo hacemos",
                description:
                  "El verdadero problema no es falta de conocimiento. Es la forma en que las personas observan, interpretan y deciden. Eso no se cambia con motivacion ni con teoria: se cambia redisenando la manera en que miras tu realidad.",
              },
            ],
          },
        },
        {
          type: "cards",
          order: 2,
          data: {
            eyebrow: "Que hace Alkaya",
            title: "Dos caminos de transformacion",
            layout: "grid-2",
            cards: [
              {
                title: "Consultoria en Coaching Ontologico",
                description:
                  "Para lideres, equipos, pymes y organizaciones que necesitan:",
                list: [
                  "Alinear cultura y resultados",
                  "Ordenar conversaciones",
                  "Redisenar decisiones y formas de liderazgo",
                ],
              },
              {
                title: "Formacion basada en Coaching Ontologico",
                description:
                  "Para personas, profesionales y emprendedores que buscan:",
                list: [
                  "Mayor claridad personal",
                  "Foco en sus decisiones",
                  "Herramientas para sostener el cambio",
                ],
              },
            ],
          },
        },
        {
          type: "steps",
          order: 3,
          data: {
            eyebrow: "Como lo hace Alkaya",
            title: "Sistema propio de 4 fases que se viven, no se estudian",
            steps: [
              {
                title: "Observacion",
                description:
                  "Ayudamos a ver lo que hoy no se esta viendo: creencias, conversaciones, patrones y decisiones automaticas.",
              },
              {
                title: "Orden",
                description:
                  "Convertimos la observacion en foco: prioridades claras, criterios de decision y estructura.",
              },
              {
                title: "Accion guiada",
                description:
                  "El aprendizaje baja a la realidad con practicas concretas, conversaciones reales y decisiones visibles.",
              },
              {
                title: "Sostenimiento",
                description:
                  "Disenamos el entorno para que el cambio no se caiga: seguimiento, acompanamiento y diseno de habitos.",
              },
            ],
          },
        },
        {
          type: "cta",
          order: 4,
          data: {
            eyebrow: "Mantra Alkaya",
            title:
              "No cambiamos personas. Cambiamos la forma en que observan, deciden y actuan.",
            subtitle: "Eso es Alkaya.",
            ctaLabel: "Hablar con un consultor",
            ctaHref: href("/{lang}/contacto"),
            variant: "dark",
          },
        },
      ],
    },
    {
      slug: "contacto",
      seoTitle: "Contacto | ALKAYA",
      seoDesc:
        "Contanos tu contexto y conversemos sobre el proceso que puede sostener el cambio.",
      sections: [
        {
          type: "hero",
          order: 0,
          data: {
            eyebrow: "Contacto",
            title: "Listo para dejar de intentar cambiar y empezar a disenar?",
            subtitle:
              "Contanos tu contexto y conversemos sobre el proceso que puede sostener el cambio.",
          },
        },
        {
          type: "contact_form",
          order: 1,
          data: {
            submitLabel: "Iniciar conversacion",
            successTitle: "Mensaje enviado",
            successMessage:
              "Gracias por escribirnos. Te respondemos en breve.",
            infoCards: [
              {
                eyebrow: "Contacto directo",
                title: "Hablemos con claridad",
                description:
                  "Respondemos en 24/48 hs habiles. Si tu consulta es urgente, escribinos directo.",
                lines: [
                  "hola@alkaya.com",
                  "+54 11 5555-5555",
                  "Buenos Aires - CDMX - Remoto",
                ],
              },
              {
                eyebrow: "Acceso privado",
                title: "Ya tenes login?",
                description:
                  "Ingresa al dashboard para seguir tu proceso si ya sos cliente.",
                ctaLabel: "Ir al acceso privado",
                ctaHref: href("/{lang}/auth"),
              },
            ],
          },
        },
      ],
    },
  ];
}

async function seedPages() {
  for (const lang of LOCALES) {
    const pages = buildPages(lang);
    for (const page of pages) {
    const created = await prisma.page.upsert({
      where: { slug_lang: { slug: page.slug, lang } },
      update: {
        seoTitle: page.seoTitle,
        seoDesc: page.seoDesc,
        isPublished: true,
      },
      create: {
        slug: page.slug,
        lang,
        seoTitle: page.seoTitle,
        seoDesc: page.seoDesc,
        isPublished: true,
      },
    });

      await prisma.section.deleteMany({ where: { pageId: created.id } });
      await prisma.section.createMany({
        data: page.sections.map((section) => ({
          pageId: created.id,
          type: section.type,
          order: section.order ?? 0,
          enabled: section.enabled ?? true,
          data: section.data,
        })),
      });
    }
  }
}

async function seedRolePermissions() {
  const entries = Object.entries(permissionMatrix) as [Role, string[]][];
  for (const [role, permissions] of entries) {
    const safePermissions = Array.isArray(permissions) ? permissions : [];
    for (const permission of safePermissions) {
      await prisma.rolePermission.upsert({
        where: { role_permission: { role, permission } },
        update: {},
        create: { role, permission },
      });
    }
  }
}

async function seedLegalDocuments() {
  const defaultText =
    "<p>Este contrato regula el uso del sistema. Actualice este contenido para reflejar sus términos específicos.</p>";
  const targetRole = Role.SUPERADMIN;
  const latest = await prisma.legalDocument.findFirst({
    where: { roleTarget: targetRole, isActive: true },
    orderBy: { versionNumber: "desc" },
  });
  if (!latest) {
    await prisma.legalDocument.create({
      data: {
        roleTarget: targetRole,
        title: "Contrato de Gobierno",
        content: defaultText,
        versionNumber: 1,
        isActive: true,
      },
    });
  }
}

async function seedPrograms() {
  const programSlug = "observador-en-accion";
  const programData = {
    title: "Observador en acción",
    summary:
      "Programa premium para revisar cómo observas, decides y guías conversaciones complejas.",
    strapline: "Desde la observación hasta la práctica sostenida",
    duration: "8 semanas",
    intensity: "2 encuentros semanales + prácticas guiadas",
    heroImage:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1400&q=80",
  };

  const program = await prisma.program.upsert({
    where: { slug: programSlug },
    update: {
      title: programData.title,
      summary: programData.summary,
      strapline: programData.strapline,
      duration: programData.duration,
      intensity: programData.intensity,
      heroImage: programData.heroImage,
      published: true,
    },
    create: {
      slug: programSlug,
      title: programData.title,
      summary: programData.summary,
      strapline: programData.strapline,
      duration: programData.duration,
      intensity: programData.intensity,
      heroImage: programData.heroImage,
      published: true,
    },
  });

  await prisma.programModule.deleteMany({ where: { programId: program.id } });

  const moduleBlueprints = [
    {
      title: "Descubrimiento y observación",
      summary: "Mapea el sistema, las conversaciones y las tensiones invisibles.",
      phase: ProgramPhase.DISCOVERY,
      order: 0,
      lessons: [
        {
          title: "Primer vistazo al sistema",
          summary: "Reconoce los patrones que no ves al tomar decisiones.",
          content:
            "<p>Exploramos cómo nuestras interpretaciones configuran lo que consideramos posible. Dibujá el sistema que te rodea.</p>",
          videoUrl: "https://www.youtube.com/watch?v=YdGzqxfj4KA",
          durationMin: 18,
          resource: {
            title: "Guía de mapeo",
            url: "https://example.com/observador/mapeo",
            type: "guide",
          },
        },
        {
          title: "Escucha las conversaciones clave",
          summary: "Escucha activa y preguntas que liberan conversaciones difíciles.",
          content:
            "<p>Ejercemos la escucha radical. Practica con casos reales y anota las preguntas que abren nuevas interpretaciones.</p>",
          videoUrl: "https://www.youtube.com/watch?v=QO5vCjFjx5s",
          durationMin: 20,
          resource: {
            title: "Cuaderno de escucha",
            url: "https://example.com/observador/escucha",
            type: "guide",
          },
        },
      ],
    },
    {
      title: "Práctica y decisiones",
      summary: "Diseña intervenciones, compromisos y decisiones claras.",
      phase: ProgramPhase.PRACTICE,
      order: 1,
      lessons: [
        {
          title: "Conversaciones con propósito",
          summary: "Disciplinas para coordinar conversaciones con impacto.",
          content:
            "<p>Identificamos los elementos que hacen que una conversación cambie resultados. Practicá el hilo conductor.</p>",
          videoUrl: "https://www.youtube.com/watch?v=lg6KAu7Awzg",
          durationMin: 22,
          resource: {
            title: "Plantilla de conversación",
            url: "https://example.com/observador/conversaciones",
            type: "template",
          },
        },
        {
          title: "Decidir con el equipo",
          summary: "Cómo coordinar acciones y compromisos con transparencia.",
          content:
            "<p>Compartimos formatos para cerrar compromisos y seguir avances. Documentá tus acuerdos en la herramienta.</p>",
          videoUrl: "https://www.youtube.com/watch?v=Hf6D4tQ1vLA",
          durationMin: 16,
          resource: {
            title: "Formato de compromiso",
            url: "https://example.com/observador/decidir",
            type: "template",
          },
        },
      ],
    },
    {
      title: "Sostenimiento y acompañamiento",
      summary: "Integrá prácticas para monitorear y ajustar el recorrido.",
      phase: ProgramPhase.SUSTAINMENT,
      order: 2,
      lessons: [
        {
          title: "Rituales de seguimiento",
          summary: "Diseñá los espacios que mantienen el movimiento.",
          content:
            "<p>Construí una cadencia real. Establecimos indicadores y rituales para sostener nuevas prácticas.</p>",
          videoUrl: "https://www.youtube.com/watch?v=2OWoXU1Y4gM",
          durationMin: 14,
          resource: {
            title: "Checklist de rituales",
            url: "https://example.com/observador/rituales",
            type: "checklist",
          },
        },
        {
          title: "Acompañamiento humano",
          summary: "Sostener la transformación con conversaciones de coaching.",
          content:
            "<p>Practica sesiones de acompañamiento y los interrogantes que sostienen el cambio.</p>",
          videoUrl: "https://www.youtube.com/watch?v=rGsBoClF6G0",
          durationMin: 17,
          resource: {
            title: "Guía de coaching",
            url: "https://example.com/observador/coaching",
            type: "guide",
          },
        },
      ],
    },
  ];

  const lessonRecords = [];
  for (const moduleBlueprint of moduleBlueprints) {
    const module = await prisma.programModule.create({
      data: {
        programId: program.id,
        title: moduleBlueprint.title,
        summary: moduleBlueprint.summary,
        phase: moduleBlueprint.phase,
        order: moduleBlueprint.order,
      },
    });

    for (const [lessonIndex, lessonBlueprint] of moduleBlueprint.lessons.entries()) {
      const lesson = await prisma.programLesson.create({
        data: {
          moduleId: module.id,
          title: lessonBlueprint.title,
          summary: lessonBlueprint.summary,
          content: lessonBlueprint.content,
          videoUrl: lessonBlueprint.videoUrl,
          durationMin: lessonBlueprint.durationMin,
          order: lessonIndex,
        },
      });

      lessonRecords.push({
        id: lesson.id,
        phase: moduleBlueprint.phase,
      });

      if (lessonBlueprint.resource) {
        await prisma.programResource.create({
          data: {
            lessonId: lesson.id,
            title: lessonBlueprint.resource.title,
            url: lessonBlueprint.resource.url,
            type: lessonBlueprint.resource.type,
          },
        });
      }
    }
  }

  const tags = [
    { name: "Observador", slug: "observador" },
    { name: "Conversaciones", slug: "conversaciones" },
    { name: "Equipos", slug: "equipos" },
  ];
  for (const tagInfo of tags) {
    const tag = await prisma.programTag.upsert({
      where: { slug: tagInfo.slug },
      update: { name: tagInfo.name },
      create: { name: tagInfo.name, slug: tagInfo.slug },
    });
    await prisma.programTagRelation.upsert({
      where: {
        programId_tagId: {
          programId: program.id,
          tagId: tag.id,
        },
      },
      update: {},
      create: {
        programId: program.id,
        tagId: tag.id,
      },
    });
  }

  const student = await prisma.user.findUnique({
    where: { email: "user@alkaya.ai" },
  });
  if (!student) return;

  const enrollment = await prisma.programEnrollment.upsert({
    where: {
      userId_programId: {
        userId: student.id,
        programId: program.id,
      },
    },
    update: { status: "ACTIVE" },
    create: {
      userId: student.id,
      programId: program.id,
      status: "ACTIVE",
    },
  });

  const completedLessons = lessonRecords.slice(0, 2);
  for (const record of completedLessons) {
    await prisma.programProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: record.id,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
        phase: record.phase,
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId: record.id,
        completed: true,
        completedAt: new Date(),
        phase: record.phase,
      },
    });
  }

  const totalLessons = lessonRecords.length;
  const completedCount = completedLessons.length;
  const progressPercent = totalLessons
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  await prisma.programEnrollment.update({
    where: { id: enrollment.id },
    data: { progressPercent },
  });
}

async function seedNotificationPreferences() {
  const notificationTypes = [
    "REVIEW_REQUESTED",
    "REVIEW_APPROVED",
    "REVIEW_CHANGES_REQUESTED",
    "CERTIFICATE_READY",
    "EVENT",
  ];
  const users = await prisma.user.findMany({ select: { id: true } });
  for (const user of users) {
    for (const type of notificationTypes) {
      await prisma.notificationPreference.upsert({
        where: { userId_type: { userId: user.id, type } },
        update: {},
        create: {
          userId: user.id,
          type,
          enabled: true,
        },
      });
    }
  }
}

async function seedContentReviews() {
  const instructor = await prisma.user.findUnique({
    where: { email: "instructor@alkaya.ai" },
  });
  const reviewer = await prisma.user.findUnique({
    where: { email: "reviewer@alkaya.ai" },
  });
  if (!instructor || !reviewer) return;

  const lesson = await prisma.lesson.findFirst({
    where: { module: { course: { instructorId: instructor.id } } },
    include: {
      module: {
        include: {
          course: true,
        },
      },
    },
  });
  if (!lesson) return;

  const review = await prisma.contentReview.upsert({
    where: {
      lessonId_instructorId: {
        lessonId: lesson.id,
        instructorId: instructor.id,
      },
    },
    update: {
      status: "IN_REVIEW",
      reviewerId: reviewer.id,
      summary: "Revisar la narrativa y ritmo de apertura.",
      checklist: {
        structure: true,
        clarity: false,
        practice: true,
      },
    },
    create: {
      lessonId: lesson.id,
      instructorId: instructor.id,
      reviewerId: reviewer.id,
      status: "IN_REVIEW",
      summary: "Revisar la narrativa y ritmo de apertura.",
      checklist: {
        structure: true,
        clarity: false,
        practice: true,
      },
    },
  });

  await prisma.reviewDecision.create({
    data: {
      reviewId: review.id,
      state: review.status,
      checklist: review.checklist ?? {},
      notes: "Inicio de revision",
      createdById: reviewer.id,
    },
  });

  await prisma.reviewFeedback.create({
    data: {
      reviewId: review.id,
      authorId: reviewer.id,
      anchor: "Introduccion",
      message:
        "Falta claridad en la propuesta de valor. Agrega ejemplos concretos al principio.",
    },
  });
}

async function main() {
  const passwordHash = await hash("Alkaya123!", 10);

  const organization = await prisma.organization.upsert({
    where: { slug: "alkaya" },
    update: { name: "ALKAYA" },
    create: {
      name: "ALKAYA",
      slug: "alkaya",
      locale: "es-ar",
    },
  });

  await prisma.tenantConfig.upsert({
    where: { organizationId: organization.id },
    update: {},
    create: {
      organizationId: organization.id,
      slug: "alkaya-main",
      tenantName: "ALKAYA Collective",
      primaryColor: "#0A2A43",
      secondaryColor: "#F5F7FA",
      accentColor: "#0D6EFD",
      cursorColor: "#8E2EE4",
      ctaGlowColor: "#2FBF71",
      panelRadiusSpecific: 32,
      panelBlurSpecific: 24,
    },
  });

  const users = [
    {
      email: "superadmin@alkaya.ai",
      name: "Super Admin",
      role: Role.SUPERADMIN,
    },
    {
      email: "admin@alkaya.ai",
      name: "Admin",
      role: Role.ADMIN,
    },
    {
      email: "instructor@alkaya.ai",
      name: "Instructor",
      role: Role.INSTRUCTOR,
    },
    {
      email: "reviewer@alkaya.ai",
      name: "Reviewer",
      role: Role.REVIEWER,
    },
    {
      email: "moderator@alkaya.ai",
      name: "Moderator",
      role: Role.MODERATOR,
    },
    {
      email: "user@alkaya.ai",
      name: "Alumno",
      role: Role.USER,
    },
    {
      email: "subscriber@alkaya.ai",
      name: "Suscriptor",
      role: Role.SUBSCRIBER,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
        isActive: true,
        organizationId: organization.id,
      },
      create: {
        ...user,
        passwordHash,
        isActive: true,
        organizationId: organization.id,
      },
    });
  }

  const instructor = await prisma.user.findUnique({
    where: { email: "instructor@alkaya.ai" },
  });

  if (instructor) {
    const course = await prisma.course.upsert({
      where: { slug: "liderazgo-estrategico" },
      update: {},
      create: {
        title: "Liderazgo Estrategico",
        slug: "liderazgo-estrategico",
        description:
          "Programa intensivo para lideres que necesitan alinear vision, equipo y resultados.",
        price: 45000,
        status: CourseStatus.PUBLISHED,
        instructorId: instructor.id,
      },
    });

    const draftCourse = await prisma.course.upsert({
      where: { slug: "productividad-ejecutiva" },
      update: {},
      create: {
        title: "Productividad Ejecutiva",
        slug: "productividad-ejecutiva",
        description:
          "Sistema de hbitos y frameworks para equipos que necesitan foco.",
        price: 32000,
        status: CourseStatus.DRAFT,
        instructorId: instructor.id,
      },
    });

    const moduleExists = await prisma.courseModule.findFirst({
      where: { courseId: course.id },
    });

    if (!moduleExists) {
      const courseModule = await prisma.courseModule.create({
        data: { courseId: course.id, title: "Fundamentos del liderazgo" },
      });

      await prisma.lesson.createMany({
        data: [
          {
              moduleId: courseModule.id,
            title: "Vision y narrativa",
            content: "Como alinear equipos con una vision poderosa.",
          },
          {
              moduleId: courseModule.id,
            title: "Rituales de gestion",
            content: "Cadencias y hbitos para mejorar performance.",
          },
        ],
      });
    }

    const draftModule = await prisma.courseModule.findFirst({
      where: { courseId: draftCourse.id },
    });
    if (!draftModule) {
      await prisma.courseModule.create({
        data: {
          courseId: draftCourse.id,
          title: "Kickoff",
        },
      });
    }
  }

  await prisma.blogPost.upsert({
    where: { slug: "bienvenida-alkaya" },
    update: {},
    create: {
      title: "Bienvenida a ALKAYA",
      slug: "bienvenida-alkaya",
      excerpt: "Por que creamos una suite LMS premium.",
      content: "ALKAYA nace para liderar experiencias de aprendizaje premium.",
      published: true,
      publishedAt: new Date(),
    },
  });

  await prisma.publicResource.upsert({
    where: { id: "resource-1" },
    update: {},
    create: {
      id: "resource-1",
      title: "Guia de onboarding",
      description: "Checklist operativo para lanzar tu academia.",
      url: "https://example.com/alkaya-onboarding.pdf",
    },
  });

  await prisma.brandingSetting.upsert({
    where: { id: "branding-default" },
    update: {},
    create: {
      id: "branding-default",
      primaryColor: "#0B0D0E",
      secondaryColor: "#F5F1E8",
      accentColor: "#8C6C3F",
    },
  });

  await prisma.systemSetting.upsert({
    where: { id: "system-default" },
    update: {},
    create: {
      id: "system-default",
      maintenanceMode: false,
      maintenanceMessage: "Estamos realizando mejoras. Volve en unos minutos.",
    },
  });

  await seedPages();
  await seedRolePermissions();
  await seedLegalDocuments();
  await seedPrograms();
  await seedNotificationPreferences();
  await seedContentReviews();

  const insightCount = await prisma.insightPost.count();
  if (insightCount === 0) {
    await prisma.insightPost.createMany({
      data: [
        {
          organizationId: organization.id,
          content:
            "Las prácticas compartidas del equipo mantienen vivo el aprendizaje cuando alguien documenta los ajustes.",
          isAnonymous: true,
          shareLevel: "TEAM",
          status: "APPROVED",
        },
        {
          organizationId: organization.id,
          content:
            "La sensibilidad al otro se activa cuando validamos los avances en voz alta, no solo en números.",
          isAnonymous: true,
          shareLevel: "PUBLIC",
          status: "APPROVED",
        },
      ],
    });
  }

  for (const provider of [
    "MercadoPago",
    "Resend",
    "Cloudinary",
    "Mux",
    "OpenAI",
  ]) {
    await prisma.integrationSetting.upsert({
      where: { provider },
      update: {},
      create: { provider, isEnabled: false },
    });
  }

  const comment = await prisma.comment.findFirst();
  if (!comment) {
    const user = await prisma.user.findUnique({
      where: { email: "user@alkaya.ai" },
    });
    const course = await prisma.course.findFirst();
    if (user && course) {
      const created = await prisma.comment.create({
        data: {
          content: "Comentario de prueba para moderacion.",
          userId: user.id,
          courseId: course.id,
        },
      });

      await prisma.moderationReport.create({
        data: {
          targetType: "COMMENT",
          targetId: created.id,
          reason: "Contenido inapropiado",
        },
      });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

