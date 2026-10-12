#!/usr/bin/env node
// Captures portfolio screenshots of the control tower by clicking through the guided scenario.
// Needs a static build with the Pages base path:
//   BASE_PATH=/shipment-exception-management-business-analysis/control-tower npm run build
//   node scripts/capture-screenshots.mjs
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(app, "../../portfolio/screenshots");
const BASE_PATH = "/shipment-exception-management-business-analysis/control-tower";
const base = `http://localhost:4174${BASE_PATH}`;
mkdirSync(out, { recursive: true });

const server = spawn(process.execPath, ["scripts/serve-static.mjs"], { cwd: app, env: { ...process.env, BASE_PATH, PORT: "4174" } });
await new Promise((r) => setTimeout(r, 800));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: "light" });
const shot = async (name) => {
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(out, `${name}.png`) });
  console.log(`  ${name}.png`);
};
const guide = page.locator("#scenario");
const next = () => guide.getByRole("button", { name: "Next step →" }).click();
// Wait until a scenario action has been applied (its button becomes disabled) before moving on.
const act = async (name) => {
  const b = guide.getByRole("button", { name });
  await b.click();
  await b.first().waitFor({ state: "visible" });
  await page.waitForFunction((n) => [...document.querySelectorAll("#scenario button")].some((x) => n.test(x.textContent) && x.disabled), name);
  // Some steps chain two API calls; wait until nothing is pending any more ("Next step" re-enabled).
  await page.waitForFunction(() => !document.querySelector("#scenario button[disabled]")?.textContent?.includes("Next step"));
  await page.waitForTimeout(500);
};

try {
  await page.goto(`${base}/`);
  await page.evaluate(() => sessionStorage.clear());
  await page.goto(`${base}/`);
  await shot("01-overview-start");
  await next();
  await act(/Publish the sailing delay/);
  await next();
  await next();
  await shot("02-overview-after-delay");
  await page.goto(`${base}/exceptions/?id=EX-1012`);
  await shot("03-exception-critical");
  await page.goto(`${base}/`);
  await next();
  await act(/Assign to Maren Vos/);
  await next();
  await act(/Log the action/);
  await page.goto(`${base}/track/?ref=D2D-48213`);
  await shot("04-customer-view-delayed");
  await page.goto(`${base}/`);
  await next();
  await next();
  await act(/Record the new window/);
  await act(/Resolve: new window agreed/);
  await page.goto(`${base}/exceptions/?id=EX-1012#audit`);
  await page.locator("#audit").scrollIntoViewIfNeeded();
  await shot("05-audit-trail");
  await page.goto(`${base}/shipments/D2D-48213/`);
  await shot("06-shipment-detail");
  await page.goto(`${base}/analysis/?rules=ER-04,ER-11#examples`);
  await page.locator("#examples").scrollIntoViewIfNeeded();
  await shot("07-acceptance-examples-and-tests");
  await page.goto(`${base}/delivery/`);
  await shot("08-delivery-workspace");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/exceptions/?id=EX-1005`);
  await shot("09-mobile-workbench");
} finally {
  await browser.close();
  server.kill();
}
