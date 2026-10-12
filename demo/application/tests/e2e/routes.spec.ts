// Every route renders, has one h1, no console errors, no horizontal scroll, and no serious accessibility violations.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = ["", "shipments/", "shipments/D2D-48213/", "exceptions/", "exceptions/?id=EX-1005", "track/?ref=D2D-48302", "analysis/", "delivery/"];

for (const route of ROUTES) {
  test(`route /${route} renders and passes axe (WCAG 2.2 A/AA)`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await page.waitForLoadState("networkidle");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewport = page.viewportSize()!.width;
    expect(scrollWidth, "no horizontal page scroll").toBeLessThanOrEqual(viewport + 1);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("every internal link on the overview resolves", async ({ page, request }) => {
  await page.goto("./");
  const hrefs = await page.locator("a[href^='/']").evaluateAll((as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!))]);
  expect(hrefs.length).toBeGreaterThan(5);
  for (const href of hrefs) {
    const res = await request.get(`http://localhost:4173${href.split("#")[0]}`);
    expect(res.status(), href).toBe(200);
  }
});
