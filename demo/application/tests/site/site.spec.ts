// The static case site: every page renders, has one h1, no console errors, no horizontal scroll and no serious axe violations.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["", "for/recruiters/", "for/business-analyst/", "workspace/", "learning/", "process/", "rules/", "event-storming/", "prototype/"];

for (const path of PAGES) {
  test(`site /${path} renders and passes axe (WCAG 2.2 A/AA)`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveCount(1);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth, "no horizontal page scroll").toBeLessThanOrEqual(page.viewportSize()!.width + 1);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.help} — ${v.nodes[0]?.target.join(" ")}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("landing: evidence register and status tiers come from the manifest", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".evidence-list > li")).toHaveCount(20);
  await expect(page.locator(".tiers > li")).toHaveCount(6);
  await expect(page.locator(".stream")).toHaveCount(4);
});

test("evidence navigator: search, area and kind filters, URL state", async ({ page }) => {
  await page.goto("workspace/");
  await expect(page.getByRole("status")).toContainText(/of \d+ artefacts/);
  await page.getByLabel("Search the evidence").fill("idempotency");
  await expect(page.locator(".ws-item").first()).toBeVisible();
  const count = await page.locator(".ws-item").count();
  expect(count).toBeGreaterThan(3);
  await page.getByRole("button", { name: "Architecture" }).click();
  await expect(page).toHaveURL(/area=Architecture/);
  await page.getByRole("button", { name: "Executed" }).click();
  await expect(page).toHaveURL(/status=executed/);
  await page.getByLabel("Search the evidence").fill("zzzz-nothing");
  await expect(page.getByText("Nothing matches")).toBeVisible();
});

test("learning lab: a quiz can be answered and scored", async ({ page }) => {
  await page.goto("learning/");
  await expect(page.locator("#load-state")).toContainText("10 modules");
  await page.getByRole("button", { name: /Quiz \(8\)/ }).first().click();
  await page.locator("#q-0 input[value=B]").check();
  await page.getByRole("button", { name: "Controleer mijn antwoorden" }).click();
  await expect(page.locator("#result")).toContainText(/Score: 1 van 8/);
});
