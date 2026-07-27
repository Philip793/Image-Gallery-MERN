import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 15_000
  },
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:5010/api/health",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: "5010"
    }
  },
  use: {
    baseURL: "http://127.0.0.1:5010",
    headless: true,
    viewport: {
      width: 1280,
      height: 720
    }
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"]
      }
    }
  ]
});
