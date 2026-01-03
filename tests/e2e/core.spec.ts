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
