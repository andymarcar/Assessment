import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, request } from '@playwright/test';
import { CustomWorld } from '../utils/world';

setDefaultTimeout(30000);

// ── Before genérico (TODOS los escenarios) ──────────────────────────────────
// Debe declararse ANTES del Before @ui para que apiRequest esté disponible
// cuando los hooks de UI se ejecuten.
Before(async function (this: CustomWorld) {
  this.apiRequest = await request.newContext({
    baseURL: 'https://thinking-tester-contact-list.herokuapp.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  });
  // Reset state inline (evita posibles conflictos con métodos de World base)
  this.token = '';
  this.response = { status: 0, body: {} };
  this.contactId = '';
  this.createdUserEmail = '';
  this.createdUserPassword = '';
});

// ── Before @ui ───────────────────────────────────────────────────────────────
Before({ tags: '@ui' }, async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext({
    baseURL: 'https://thinking-tester-contact-list.herokuapp.com',
  });
  this.page = await this.context.newPage();
});

// ── After @ui ────────────────────────────────────────────────────────────────
After({ tags: '@ui' }, async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }
  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();
});

// ── After genérico (TODOS los escenarios) ───────────────────────────────────
After(async function (this: CustomWorld) {
  await this.apiRequest?.dispose();
});
