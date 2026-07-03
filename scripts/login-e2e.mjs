/**
 * Login E2E — cookie-based auth. Run: node scripts/login-e2e.mjs
 */
import { chromium } from "playwright";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const BASE = process.env.FRONTEND_URL || "http://localhost:3001";
const API = process.env.API_URL || "http://localhost:3000";
const PASSWORD = "Password123!";
const email = `e2e-${Date.now()}@test.tn`;
const COOKIE_JAR = join(tmpdir(), `tunrent-e2e-${Date.now()}.txt`);

const results = [];
function log(step, ok, detail = "") {
  const line = `[${ok ? "PASS" : "FAIL"}] ${step}${detail ? ` — ${detail}` : ""}`;
  console.log(line);
  results.push({ step, ok, detail });
}

async function main() {
  // Backend curl-style proof via fetch + manual cookie handling
  await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "E2E",
      lastName: "Test",
      email,
      password: PASSWORD,
    }),
  });

  const loginRes = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: PASSWORD }),
    credentials: "include",
  });
  const loginBody = await loginRes.json();
  const setCookie = loginRes.headers.getSetCookie?.() ?? [];
  log("0. POST /auth/login", loginRes.status === 200, `status=${loginRes.status}`);
  log(
    "0b. No refresh_token in body",
    !("refresh_token" in loginBody),
    Object.keys(loginBody).join(", "),
  );
  log(
    "0c. Set-Cookie headers",
    setCookie.some((c) => c.includes("tunrent_rt")) &&
      setCookie.some((c) => c.includes("tunrent_logged_in")),
    setCookie.map((c) => c.split(";")[0]).join(" | "),
  );

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("pageerror", (e) => consoleErrors.push(e.message));

  await page.goto(`${BASE}/login`, { waitUntil: "load", timeout: 120000 });
  await page.waitForSelector("h1", { timeout: 60000 });
  log("1. /login loads", true);

  const loginReq = page.waitForResponse(
    (r) => r.url().includes("/auth/login") && r.request().method() === "POST",
  );
  await page.locator('input[type="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill(PASSWORD);
  await page.getByRole("button", { name: /connexion|login|Se connecter/i }).first().click();
  const loginNetwork = await loginReq;
  log("2a. UI login POST", loginNetwork.status() === 200, `status=${loginNetwork.status()}`);

  await page.waitForURL(/\/account/, { timeout: 20000 });
  log("2b. Redirect /account", page.url().includes("/account"), page.url());

  const cookies = await context.cookies();
  log(
    "2c. tunrent_logged_in cookie",
    cookies.some((c) => c.name === "tunrent_logged_in" && c.value === "1"),
  );
  log(
    "2d. No localStorage tokens",
    await page.evaluate(
      () =>
        !localStorage.getItem("tunrent_refresh_token") &&
        !localStorage.getItem("tunrent-auth"),
    ),
  );

  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(2000);
  log("3. F5 /account persists", page.url().includes("/account"), page.url());

  const page2 = await context.newPage();
  await page2.goto(`${BASE}/account`, { waitUntil: "load" });
  await page2.waitForTimeout(2000);
  log("4. New tab /account", page2.url().includes("/account"), page2.url());
  await page2.close();

  await page.getByRole("button", { name: /déconnexion|Déconnexion/i }).first().click();
  await page.waitForURL(/\/login/, { timeout: 15000 });
  log("5. Logout redirects", page.url().includes("/login"), page.url());

  await page.goto(`${BASE}/login`, { waitUntil: "load" });
  await page.getByRole("tab", { name: /Espace agence/i }).click();
  await page.locator('input[type="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill(PASSWORD);
  await page.getByRole("button", { name: /Accéder au dashboard/i }).click();
  await page.waitForTimeout(3000);
  const toast = await page.locator("[data-sonner-toast]").first().textContent().catch(() => "");
  log("6. Dashboard client error", toast?.includes("agency") || toast?.includes("agence"), toast?.slice(0, 80));

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n--- SUMMARY: ${results.length - failed.length}/${results.length} ---`);
  if (failed.length) {
    console.log("Failed:", failed.map((f) => f.step).join(", "));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
