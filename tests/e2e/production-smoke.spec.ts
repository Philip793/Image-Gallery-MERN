import { expect, test } from "@playwright/test";

test("landing and gallery routes render in production mode", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /explore collections/i })).toBeVisible();

  const firstCard = page.locator(".cylinder-card").first();
  await firstCard.waitFor({ state: "visible" });
  await firstCard.click({ force: true });
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /coastlines/i
    })
  ).toBeVisible();

  await page.reload();

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /coastlines/i
    })
  ).toBeVisible();
});
