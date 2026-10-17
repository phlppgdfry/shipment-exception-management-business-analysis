import { defineConfig, devices } from "@playwright/test";

// Tests the static case site (repository /site): landing, recruiter tour, evidence navigator, learning lab and the older pages.
const BASE = "/shipment-exception-management-business-analysis";

export default defineConfig({
  testDir: "tests/site",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL: `http://localhost:4176${BASE}/` },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: { command: "node scripts/serve-site.mjs", url: `http://localhost:4176${BASE}/`, reuseExistingServer: !process.env.CI },
});
