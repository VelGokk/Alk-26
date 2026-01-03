import { PrismaClient, Role, CourseStatus } from "@prisma/client";
import { hash } from "bcryptjs";

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
        },
        create: {
          slug: page.slug,
          lang,
          seoTitle: page.seoTitle,
          seoDesc: page.seoDesc,
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

async function main() {
  const passwordHash = await hash("Alkaya123!", 10);

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
      },
      create: {
        ...user,
        passwordHash,
        isActive: true,
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

