import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60000,
  expect: {
    timeout: 15000
  },
  use: {
    baseURL: "http://127.0.0.1:5010",
    headless: true,
    viewport: { width: 1280, height: 720 }
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
