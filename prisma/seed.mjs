import { PrismaClient, Role, CourseStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

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
        title: "Liderazgo EstratÃ(c)gico",
        slug: "liderazgo-estrategico",
        description:
          "Programa intensivo para lÃ­deres que necesitan alinear visiÃ³n, equipo y resultados.",
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
          "Sistema de hÃbitos y frameworks para equipos que necesitan foco.",
        price: 32000,
        status: CourseStatus.DRAFT,
        instructorId: instructor.id,
      },
    });

    const moduleExists = await prisma.courseModule.findFirst({
      where: { courseId: course.id },
    });

    if (!moduleExists) {
      const module = await prisma.courseModule.create({
        data: { courseId: course.id, title: "Fundamentos del liderazgo" },
      });

      await prisma.lesson.createMany({
        data: [
          {
            moduleId: module.id,
            title: "VisiÃ³n y narrativa",
            content: "CÃ³mo alinear equipos con una visiÃ³n poderosa.",
          },
          {
            moduleId: module.id,
            title: "Rituales de gestiÃ³n",
            content: "Cadencias y hÃbitos para mejorar performance.",
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
      excerpt: "Por quÃ(c) creamos una suite LMS premium.",
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
      title: "GuÃ­a de onboarding",
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
      maintenanceMessage: "Estamos realizando mejoras. VolvÃ(c) en unos minutos.",
    },
  });

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
          content: "Comentario de prueba para moderaciÃ³n.",
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

