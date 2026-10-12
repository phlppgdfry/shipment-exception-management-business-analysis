// The ten-step guided scenario, clicked through in the browser exactly as a reviewer would.
import { expect, test } from "@playwright/test";

test("guided scenario: from on schedule to resolved, with audit trail and test results", async ({ page }) => {
  await page.goto("./");
  const guide = page.locator("#scenario");
  const next = () => guide.getByRole("button", { name: "Next step →" }).click();

  // 1. On schedule
  await expect(guide.getByRole("heading", { name: "1. A shipment starts on schedule" })).toBeVisible();
  await next();
  // 2. Transport event
  await guide.getByRole("button", { name: "Publish the sailing delay" }).click();
  await expect(guide.getByRole("button", { name: "Publish the sailing delay" })).toBeDisabled();
  await next();
  // 3. Detection — and the duplicate event is ignored
  await expect(guide).toContainText("All 11 orders on E-312 are evaluated; only the 4");
  await guide.getByRole("button", { name: "Send the same event again" }).click();
  await expect(guide.getByRole("button", { name: "Duplicate ignored ✓" })).toBeVisible();
  await next();
  // 4. Classification
  await expect(guide).toContainText("Critical");
  await next();
  // 5. Assign owner
  await guide.getByRole("button", { name: /Assign to Maren Vos/ }).click();
  await expect(guide.getByRole("button", { name: /Assign to Maren Vos/ })).toBeDisabled();
  await next();
  // 6. Response action + message with note
  await guide.getByRole("button", { name: /Log the action/ }).click();
  await expect(guide.getByRole("button", { name: /Log the action/ })).toBeDisabled();
  await next();
  // 7. Customer view
  await guide.getByRole("link", { name: "Open the customer view →" }).click();
  await expect(page.getByRole("heading", { level: 2, name: /Significant delay: expected Thu 12:40/ })).toBeVisible();
  await expect(page.getByText("Message from your planner")).toBeVisible();
  await expect(page.locator("main")).not.toContainText(/ER-\d\d|ROAD_PLANNING|CRITICAL/);
  await page.getByRole("link", { name: "Overview" }).click();
  await next();
  // 8. New window + resolve
  await guide.getByRole("button", { name: "Record the new window" }).click();
  await guide.getByRole("button", { name: "Resolve: new window agreed" }).click();
  await expect(guide.getByRole("button", { name: "Resolve: new window agreed" })).toBeDisabled();
  await next();
  // 9. Audit trail
  await guide.getByRole("link", { name: "Open the audit trail →" }).click();
  const audit = page.locator("#audit");
  await expect(audit).toContainText("EXCEPTION_OPENED");
  await expect(audit).toContainText("assigned to Maren Vos");
  await expect(audit).toContainText("New delivery window agreed");
  await expect(audit).toContainText("RECOVERED → RESOLVED");
  // Customer heard "back on schedule" (ER-13)
  await page.goto("track/?ref=D2D-48213");
  await expect(page.getByRole("heading", { level: 2, name: "Back on schedule" })).toBeVisible();
  // 10. Acceptance criteria and tests
  await page.goto("./");
  await guide.getByRole("button", { name: /Inspect the acceptance criteria/ }).click();
  await guide.getByRole("link", { name: "Open acceptance criteria and test results →" }).click();
  await expect(page.locator("#examples")).toContainText(/Result in this build: \d+ of \d+ tests passed/);
  await expect(page.locator("#examples").getByRole("row", { name: /AC-01.11/ })).toContainText("passed");
});
