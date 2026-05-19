import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly emailInput = () => this.page.getByPlaceholder('Email');
  private readonly passwordInput = () => this.page.getByPlaceholder('Password');
  private readonly submitButton = () => this.page.getByRole('button', { name: 'Submit' });
  private readonly signUpButton = () => this.page.getByRole('button', { name: 'Sign up' });

  constructor(page: Page) {
    super(page);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput().fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput().fill(password);
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton().click();
  }

  async clickSignUp(): Promise<void> {
    await this.signUpButton().click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  async isSubmitButtonVisible(): Promise<boolean> {
    return this.submitButton().isVisible();
  }
}
