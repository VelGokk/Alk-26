import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE, AppLocale, isLocale } from "@/config/i18n";
import { paths } from "@/lib/paths";
import type { UniversalSearchResult } from "@/types/search";

const MAX_RESULTS_PER_TYPE = 5;

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim();
  const langParam = url.searchParams.get("lang");
  const lang: AppLocale = isLocale(langParam) ? (langParam as AppLocale) : DEFAULT_LOCALE;

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const resourcesPromise = prisma.programResource.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { lesson: { title: { contains: query, mode: "insensitive" } } },
        {
          lesson: {
            module: {
              program: {
                title: { contains: query, mode: "insensitive" },
              },
            },
          },
        },
      ],
    },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              program: {
                select: { title: true, slug: true },
              },
            },
          },
        },
      },
    },
    take: MAX_RESULTS_PER_TYPE,
  });

  const usersPromise = prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, email: true, role: true },
    take: MAX_RESULTS_PER_TYPE,
  });

  const pagesPromise = prisma.page.findMany({
    where: {
      isPublished: true,
      lang: lang,
      OR: [
        { slug: { contains: query, mode: "insensitive" } },
        { seoTitle: { contains: query, mode: "insensitive" } },
        { seoDesc: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: MAX_RESULTS_PER_TYPE,
  });

  const [resources, users, pages] = await Promise.all([
    resourcesPromise,
    usersPromise,
    pagesPromise,
  ]);

  const results: UniversalSearchResult[] = [
    ...resources.map((resource) => {
      const lessonTitle = resource.lesson?.title;
      const programTitle = resource.lesson?.module?.program?.title;
      const descriptionParts = [
        lessonTitle,
        programTitle,
        resource.url,
      ].filter(Boolean);
      const description = descriptionParts.join(" · ");
      const isExternal =
        resource.url.startsWith("http://") ||
        resource.url.startsWith("https://");

      return {
        id: resource.id,
        label: resource.title,
        description: description || undefined,
        href: resource.url,
        type: "resources",
        external: isExternal,
      };
    }),
    ...users.map((user) => ({
      id: user.id,
      label: user.name ?? user.email ?? "Usuario",
      description: user.email,
      href: `${paths.dashboard.section(lang, "admin")}/users?q=${encodeURIComponent(
        query
      )}`,
      type: "users",
    })),
    ...pages.map((page) => ({
      id: page.id,
      label: page.seoTitle ?? page.slug,
      description: page.seoDesc ?? page.slug,
      href: `/${lang}/${page.slug}`,
      type: "pages",
    })),
  ];

  return NextResponse.json({ results });
}
