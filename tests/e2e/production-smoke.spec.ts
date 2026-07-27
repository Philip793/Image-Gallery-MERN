import { expect, test } from "@playwright/test";

test("landing and gallery routes render in production mode", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /explore collections/i })).toBeVisible();

  await page.getByRole("link", { name: /open the/i }).first().click();
  await expect(page.getByRole("heading", { name: /photography collection/i })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: /photography collection/i })).toBeVisible();
});
