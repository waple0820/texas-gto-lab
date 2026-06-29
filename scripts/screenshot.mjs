#!/usr/bin/env node
// Visual-QA screenshots of the app (local dev or the live server), so UI changes
// can be verified by eye rather than guessed at. Uses the system Google Chrome via
// playwright-core (no bundled browser download).
//
//   node scripts/screenshot.mjs [url] [view] [out.png]
//     url  : default http://localhost:5174  (use the live URL to check production)
//     view : lab | practice | multi   (default lab)
//     out  : default /tmp/tgl-<view>.png
//
// For `multi` it joins as a player and adds two bots so the table + decision
// station render. WebSocket keeps the network busy, so we use domcontentloaded +
// fixed waits, never networkidle.

import { chromium } from "playwright-core";

const CHROME =
  process.env.CHROME ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = process.argv[2] || "http://localhost:5174";
const view = process.argv[3] || "lab";
const out = process.argv[4] || `/tmp/tgl-${view}.png`;

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1.5 });
  page.setDefaultTimeout(8000);
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1300);
  if (view !== "lab") {
    await page.click(`[data-tab="${view}"]`);
    await page.waitForTimeout(400);
  }
  if (view === "multi") {
    await page.fill("#mp-name", "我").catch(() => {});
    await page.click("#mp-join").catch(() => {});
    await page.waitForTimeout(700);
    for (let i = 0; i < 2; i += 1) {
      await page.click("#mp-add-ai").catch(() => {});
      await page.waitForTimeout(350);
    }
    await page.click("#mp-ready").catch(() => {});
    await page.waitForTimeout(2500);
  }
  await page.screenshot({ path: out, fullPage: view === "lab" });
  console.log(`wrote ${out}`);
} finally {
  await browser.close();
}
