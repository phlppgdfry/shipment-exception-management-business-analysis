#!/usr/bin/env node
// Renders an HTML file to PDF with headless Chromium (Playwright). Used for the executive case study.
//   node scripts/render-pdf.mjs <input.html> <output.pdf>
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const [input, output] = process.argv.slice(2).map((p) => resolve(p));
if (!input || !output) {
  console.error("Usage: node scripts/render-pdf.mjs <input.html> <output.pdf>");
  process.exit(1);
}
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(input).href, { waitUntil: "networkidle" });
await page.pdf({ path: output, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`Wrote ${output}`);
