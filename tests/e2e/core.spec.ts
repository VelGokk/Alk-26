import { test, expect, type Page } from "@playwright/test";

const credentials = {
  user: {
    email: "user@alkaya.ai",
    password: "Alkaya123!",
  },
  admin: {
    email: "admin@alkaya.ai",
    password: "Alkaya123!",
  },
  superadmin: {
    email: "superadmin@alkaya.ai",
    password: "Alkaya123!",
  },
  reviewer: {
    email: "reviewer@alkaya.ai",
    password: "Alkaya123!",
  },
  moderator: {
    email: "moderator@alkaya.ai",
    password: "Alkaya123!",
  },
};

type LoginInput = {
  email: string;
  password: string;
  next?: string;
};

async function login(page: Page, input: LoginInput) {
  const nextParam = input.next ? `?next=${encodeURIComponent(input.next)}` : "";
  await page.goto(`/es-ar/auth${nextParam}`);
  await page.locator('input[name="email"]').fill(input.email);
  await page.locator('input[name="password"]').fill(input.password);
  await page
    .locator("form")
    .getByRole("button", { name: "Ingresar" })
    .click();
}

test("login", async ({ page }) => {
  await login(page, credentials.user);
  await page.waitForURL("**/es-ar/app");
  await expect(page.getByRole("heading", { name: "Mi progreso" })).toBeVisible();
});

test("acceso a dashboard", async ({ page }) => {
  await login(page, { ...credentials.admin, next: "/admin" });
  await page.waitForURL("**/es-ar/admin");
  await expect(page.getByRole("heading", { name: "Operacion" })).toBeVisible();
});

test("checkout mercadopago (simulado)", async ({ page }) => {
  await login(page, credentials.user);
  await page.waitForURL("**/es-ar/app");

  let requested = false;
  await page.route("**/api/mercadopago/create-preference", async (route) => {
    requested = true;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ initPoint: "/es-ar/checkout/success" }),
    });
  });

  await page.goto("/es-ar");
  await page.evaluate(async () => {
    const res = await fetch("/api/mercadopago/create-preference", {
      method: "POST",
    });
    const data = await res.json();
    if (data?.initPoint) {
      window.location.href = data.initPoint;
    }
  });

  await page.waitForURL("**/es-ar/contacto");
  expect(requested).toBeTruthy();
});

test("navegación principal expone cursos y certificados", async ({ page }) => {
  await login(page, credentials.user);
  await page.waitForURL("**/es-ar/app");
  await expect(page.getByRole("link", { name: "Mis cursos" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Certificados" })).toBeVisible();
});

test("reviewer accede a su dashboard de revisión", async ({ page }) => {
  await login(page, credentials.reviewer);
  await page.waitForURL("**/es-ar/reviewer");
  await expect(
    page.getByRole("heading", { name: /Pipeline de revisión/i })
  ).toBeVisible();
  await expect(page.getByText("En revisión")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Solicitar cambios" })
  ).toBeVisible();
});

test("moderador ve reportes y acciones", async ({ page }) => {
  await login(page, credentials.moderator);
  await page.waitForURL("**/es-ar/moderator/reports");
  await expect(
    page.getByRole("heading", { name: "Reportes y acciones" })
  ).toBeVisible();
  await expect(page.getByText("Reportes y acciones")).toBeVisible();
});

test("page builder muestra páginas publicadas y permite ver una", async ({
  page,
}) => {
  await login(page, credentials.superadmin);
  await page.goto("/es-ar/super-admin/pages");
  await expect(
    page.getByRole("heading", { name: "Paginas publicas" })
  ).toBeVisible();
  const verLink = page.getByRole("link", { name: "Ver" }).first();
  const targetHref = await verLink.getAttribute("href");
  expect(targetHref).toBeTruthy();
  await verLink.click();
  await page.waitForURL(targetHref!);
  await expect(
    page.getByText("Disenamos el sistema que hace que el cambio si se sostenga.")
  ).toBeVisible();
});
