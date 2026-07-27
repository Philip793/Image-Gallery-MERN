import { expect, test } from "@playwright/test";

test("landing and gallery routes render in production mode", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /explore collections/i })).toBeVisible();

  await page.locator(".cylinder").evaluate((element) => {
    element.setAttribute("style", "animation-play-state: paused");
  });

  const targetLink = page.getByRole("link", {
    name: /open the coastlines gallery/i
  });

  await targetLink.evaluate((element) => {
    (element as HTMLAnchorElement).click();
  });

  await page.waitForURL(/\/gallery\/coastlines$/);

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
