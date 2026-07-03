import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3001";
const email = process.env.TEST_EMAIL ?? "ashrafjallouz@gmail.com";
const password = process.env.TEST_PASSWORD ?? "Achraf13461342";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle", timeout: 60000 });

  await page.getByRole("tab", { name: /agence|dashboard/i }).click();
  await page.locator("#dash-email").fill(email);
  await page.locator("#dash-password").fill(password);
  await page.getByRole("button", { name: /dashboard|accéder/i }).click();

  await page.waitForURL(/\/dashboard/, { timeout: 30000 });
  await page.waitForTimeout(1500);

  const spinner = page.locator(".animate-spin");
  const spinnerCount = await spinner.count();
  const url = page.url();
  const hasSidebar = await page.getByText(/tableau de bord|dashboard|voitures/i).first().isVisible().catch(() => false);

  console.log("URL:", url);
  console.log("Spinners visible:", spinnerCount);
  console.log("Dashboard UI visible:", hasSidebar);

  if (!url.includes("/dashboard")) {
    throw new Error(`Expected /dashboard, got ${url}`);
  }
  if (spinnerCount > 0 && !hasSidebar) {
    throw new Error("Stuck on spinner — dashboard UI not visible");
  }

  console.log("E2E agency login: PASS");
} catch (err) {
  console.error("E2E agency login: FAIL", err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
