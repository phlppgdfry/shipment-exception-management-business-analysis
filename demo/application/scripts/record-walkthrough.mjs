#!/usr/bin/env node
// Records a ±60–90 s walkthrough of the guided scenario (captions burned in, clicks highlighted), then converts it
// with ffmpeg to MP4 (site) and GIF (README). Needs a static build with the Pages base path and ffmpeg on PATH:
//   BASE_PATH=/shipment-exception-management-business-analysis/control-tower npm run build
//   node scripts/record-walkthrough.mjs
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(app, "..", "..");
const BASE_PATH = "/shipment-exception-management-business-analysis/control-tower";
const base = `http://localhost:4175${BASE_PATH}`;
const W = 1280;
const H = 800;
const videoDir = mkdtempSync(join(tmpdir(), "walkthrough-"));

const server = spawn(process.execPath, ["scripts/serve-static.mjs"], { cwd: app, env: { ...process.env, BASE_PATH, PORT: "4175" } });
await new Promise((r) => setTimeout(r, 800));

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: videoDir, size: { width: W, height: H } }, colorScheme: "light" });
const page = await context.newPage();
const wait = (ms) => page.waitForTimeout(ms);

/** Caption bar at the bottom of the viewport (re-created after every navigation). */
async function caption(text, step) {
  await page.evaluate(
    ([t, s]) => {
      let el = document.getElementById("__caption");
      if (!el) {
        el = document.createElement("div");
        el.id = "__caption";
        el.style.cssText =
          "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:9999;max-width:1040px;padding:12px 20px;border-radius:12px;background:rgba(15,23,32,.92);color:#fff;font:600 19px/1.35 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.35);text-align:center";
        document.body.appendChild(el);
      }
      el.innerHTML = (s ? `<span style="opacity:.65;font-weight:500;margin-right:10px">${s}</span>` : "") + t;
    },
    [text, step ?? ""],
  );
}

async function highlightClick(locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.evaluate((el) => {
    el.style.outline = "4px solid #f59e0b";
    el.style.outlineOffset = "3px";
  });
  await wait(945);
  await locator.click();
  await locator.evaluate((el) => (el.style.outline = "")).catch(() => {});
}

const guide = () => page.locator("#scenario");
async function nextStep() {
  await guide().getByRole("button", { name: "Next step →" }).click();
}
async function act(name) {
  await highlightClick(guide().getByRole("button", { name }));
  await page.waitForFunction((n) => [...document.querySelectorAll("#scenario button")].some((x) => n.test(x.textContent) && x.disabled), name);
  await wait(540);
}

try {
  await page.goto(`${base}/`);
  await page.evaluate(() => sessionStorage.clear());
  await page.goto(`${base}/`);
  await page.getByText("Exceptions to act on").waitFor();
  await caption("Logistics Control Tower — a fictional short-sea &amp; door-to-door operator. Exceptions here are opened by business rules.");
  await wait(5130);
  await caption("D2D-48213: chilled food for a key account, delivery window Thu 06:00–08:00 — on schedule.", "1/9");
  await wait(4320);

  await nextStep();
  await caption("The sailing system publishes a delay: sailing E-312 leaves 6 hours late.", "2/9");
  await wait(1620);
  await act(/Publish the sailing delay/);
  await nextStep();
  await caption("All 11 orders on the sailing are evaluated — only the 4 now expected after their window become exceptions (ER-01).", "3/9");
  await wait(5670);

  await page.goto(`${base}/exceptions/?id=EX-1012`);
  await page.getByText("Why the rules decided this").waitFor();
  await caption("280 min after the window → major; reefer → one level up: critical. Key account → message and a call task. Respond within 30 min.", "4/9");
  await wait(2700);
  await page.mouse.wheel(0, 380);
  await wait(4590);

  await page.goto(`${base}/`);
  await caption("The shift lead assigns the exception to the senior planner.", "5/9");
  await nextStep();
  await nextStep();
  await act(/Assign to Maren Vos/);
  await wait(1620);
  await nextStep();
  await caption("The planner logs what she did and sends the customer message with a short personal note.", "6/9");
  await act(/Log the action/);
  await wait(1620);

  await page.goto(`${base}/track/?ref=D2D-48213`);
  await page.getByText("Message from your planner").waitFor();
  await caption("The customer sees one clear message: new expected time, reason, next step — nothing internal.", "7/9");
  await wait(6210);

  await page.goto(`${base}/`);
  await nextStep();
  await nextStep();
  await caption("A new window is agreed: back on schedule (the customer is told), then resolved with a reason code.", "8/9");
  await act(/Record the new window/);
  await act(/Resolve: new window agreed/);
  await wait(2025);

  await page.goto(`${base}/exceptions/?id=EX-1012#audit`);
  await page.locator("#audit").waitFor();
  await page.locator("#audit").scrollIntoViewIfNeeded();
  await caption("Every event, decision and change is in the audit trail — with the rule IDs behind it.", "9/9");
  await wait(5130);

  await page.goto(`${base}/analysis/?rules=ER-04,ER-11#examples`);
  await page.locator("#examples").scrollIntoViewIfNeeded();
  await caption("The same rules are Given/When/Then examples — and this build ran them as tests.");
  await wait(5670);
  await caption("Fictional organisation · github.com/phlppgdfry/shipment-exception-management-business-analysis");
  await wait(4050);
} finally {
  await context.close();
  await browser.close();
  server.kill();
}

const webm = join(videoDir, readdirSync(videoDir).find((f) => f.endsWith(".webm")));
const outSite = join(repo, "site/assets/walkthrough");
const outGif = join(repo, "portfolio/walkthrough");
mkdirSync(outSite, { recursive: true });
mkdirSync(outGif, { recursive: true });
const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
ff(["-i", webm, "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", join(outSite, "walkthrough.mp4")]);
ff(["-ss", "4", "-i", webm, "-frames:v", "1", join(outSite, "walkthrough-poster.png")]);
ff(["-i", webm, "-vf", "fps=4,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle", join(outGif, "walkthrough.gif")]);
rmSync(videoDir, { recursive: true, force: true });
console.log("Wrote site/assets/walkthrough/walkthrough.mp4, walkthrough-poster.png and portfolio/walkthrough/walkthrough.gif");
