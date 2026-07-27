import { expect, test, type Page } from "@playwright/test";

async function placeCoastlinesCardAtFront(page: Page) {
  await page.locator(".cylinder").evaluate((element) => {
    const cylinder = element as HTMLElement;

    cylinder.style.animation = "none";
    cylinder.style.transform = "rotateX(-4deg) rotateY(0deg)";

    const items = Array.from(cylinder.querySelectorAll<HTMLElement>(".cylinder-item"));

    items.forEach((item) => {
      const link = item.querySelector("a.cylinder-card");
      const isTarget = link?.getAttribute("aria-label") === "Open the Coastlines gallery";

      if (isTarget) {
        item.style.display = "block";
        item.style.visibility = "visible";
        item.style.opacity = "1";
        item.style.pointerEvents = "auto";
      } else {
        item.style.display = "none";
      }
    });
  });
}

test("landing and gallery routes render in production mode", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /explore collections/i })).toBeVisible();

  await placeCoastlinesCardAtFront(page);

  const targetLink = page.getByRole("link", {
    name: /open the coastlines gallery/i
  });

  await expect(targetLink).toBeVisible();
  await targetLink.click();

  await expect(page).toHaveURL(/\/gallery\/coastlines$/);

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

test("keyboard navigation opens the coastlines gallery", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /explore collections/i })).toBeVisible();

  await placeCoastlinesCardAtFront(page);

  const targetLink = page.getByRole("link", {
    name: /open the coastlines gallery/i
  });

  await expect(targetLink).toBeVisible();
  await targetLink.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/gallery\/coastlines$/);
});
