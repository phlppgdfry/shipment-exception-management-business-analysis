import { defineConfig, devices } from "@playwright/test";

// Runs against the static export served under the GitHub Pages base path. Build first:
//   BASE_PATH=/shipment-exception-management-business-analysis/control-tower npm run build
export const BASE_PATH = "/shipment-exception-management-business-analysis/control-tower";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:4173${BASE_PATH}/`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /routes\.spec\.ts/ },
  ],
  webServer: {
    command: "node scripts/serve-static.mjs",
    env: { BASE_PATH },
    url: `http://localhost:4173${BASE_PATH}/`,
    reuseExistingServer: !process.env.CI,
  },
});
