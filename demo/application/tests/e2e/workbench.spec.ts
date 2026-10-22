// Workbench behaviour that is not in the guided scenario: roles, validation, held exceptions, escalation, outages.
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
  await page.evaluate(() => window.sessionStorage.clear());
});

test("a terminal coordinator can read but not change a road-planning exception (NFR-06)", async ({ page }) => {
  await page.goto("exceptions/?id=EX-1005");
  await page.getByLabel("Acting as").selectOption("USR-TERMINAL");
  await expect(page.getByText(/You can read this exception; only Road planning or the shift lead can change it/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Acknowledge — I own this" })).toBeDisabled();
});

test("resolving with reason 'other' and no note is refused (AC-04.3)", async ({ page }) => {
  await page.goto("exceptions/?id=EX-1005");
  await page.getByRole("button", { name: "Acknowledge — I own this" }).click();
  await page.getByLabel("Reason (required)").selectOption("OTHER");
  await page.getByRole("button", { name: "Resolve", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("A note is required");
  await page.getByLabel("Note (required for “other”)").fill("Customer collects at the terminal");
  await page.getByRole("button", { name: "Resolve", exact: true }).click();
  await expect(page.getByText("Resolved Wed")).toBeVisible();
});

test("missing status is held; 'haulier confirms on time' closes it without a customer message (US-08)", async ({ page }) => {
  await page.goto("track/?ref=D2D-48288");
  await expect(page.getByRole("heading", {level:2,name:"Status awaiting confirmation"})).toBeVisible();
  await expect(page.getByText("EX-1008")).toHaveCount(0);
  await page.goto("exceptions/?id=EX-1008");
  await expect(page.getByText("Held: nothing goes to the customer")).toBeVisible();
  await page.getByRole("button", { name: "Haulier confirms on time" }).click();
  await expect(page.getByText("reason: False alarm")).toBeVisible();
  await page.goto("track/?ref=D2D-48288");
  await expect(page.getByRole("heading", { level: 2, name: "On schedule" })).toBeVisible();
});

test("an unacknowledged critical exception escalates after 30 minutes (ER-09)", async ({ page }) => {
  await page.goto("exceptions/?id=EX-1005");
  await page.getByRole("button", { name: "+30 min" }).click();
  await expect(page.locator("main").getByText("Escalated", { exact: true }).first()).toBeVisible();
  await page.getByLabel("Acting as").selectOption("USR-SHIFTLEAD");
  await page.getByRole("button", { name: "Assign", exact: true }).click();
  await expect(page.locator("#audit")).toContainText("assigned to Maren Vos by Priya Raman");
});

test("a held exception past its response time is escalated but stays held (D-09)", async ({ page }) => {
  await page.goto("exceptions/?id=EX-1008");
  await page.getByRole("button", { name: "+30 min" }).click();
  await expect(page.locator("main").getByText("escalated (D-09)").first()).toBeVisible();
  await expect(page.getByText(/still held \(D-09\)/)).toBeVisible();
  await expect(page.getByText("Held: nothing goes to the customer")).toBeVisible();
});

test("a TMS outage shows an error with retry, and recovers (NFR-04)", async ({ page }) => {
  await page.goto("shipments/");
  await page.getByLabel("Simulate TMS outage").check();
  await expect(page.locator("main").getByRole("alert")).toContainText("TMS unavailable");
  await page.getByLabel("Simulate TMS outage").uncheck();
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText(/\d+ shipments/)).toBeVisible();
});

test("shipment explorer: search, filter and open a detail page", async ({ page }) => {
  await page.goto("shipments/");
  await page.getByLabel("Search").fill("Northfield");
  await expect(page.getByRole("link", { name: "D2D-48213" })).toBeVisible();
  await page.getByLabel("Search").fill("");
  await page.getByLabel("Schedule").selectOption("exception");
  await expect(page.getByText(/^\d+ shipments?$/)).toBeVisible();
  await page.getByLabel("Search").fill("D2D-48213");
  await page.getByLabel("Schedule").selectOption("all");
  await page.getByRole("link", { name: "D2D-48213" }).click();
  await expect(page.getByRole("heading", { name: "Shipment D2D-48213" })).toBeVisible();
  await expect(page.getByLabel("Transport legs")).toContainText("Sailing E-312");
});


test("planner inputs use Brussels and reject a missing DST wall clock", async ({ page }) => {
  await page.goto("exceptions/?id=EX-1008");
  await expect(page.getByText("Planner clock (Europe/Brussels)")).toBeVisible();
  await page.getByLabel("New ETA from the haulier (Europe/Brussels)").fill("2026-03-29T02:30");
  await page.getByRole("button", {name:"Haulier confirms a delay"}).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("clocks change");
  await expect(page.getByText("Held: nothing goes to the customer")).toBeVisible();
});
