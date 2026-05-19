import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string = '/'): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getErrorMessage(): Promise<string> {
    const errorLocator = this.page
      .getByRole('alert')
      .or(this.page.locator('#error'))
      .or(this.page.getByText(/error|incorrect|invalid/i).first());
    await errorLocator.waitFor({ state: 'visible', timeout: 5000 });
    return errorLocator.innerText();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}
