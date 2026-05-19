import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserPayload } from '../../api/models/User';

export class SignUpPage extends BasePage {
  private readonly firstNameInput = () => this.page.getByPlaceholder('First Name');
  private readonly lastNameInput = () => this.page.getByPlaceholder('Last Name');
  private readonly emailInput = () => this.page.getByPlaceholder('Email');
  private readonly passwordInput = () => this.page.getByPlaceholder('Password');
  private readonly submitButton = () => this.page.getByRole('button', { name: 'Submit' });

  constructor(page: Page) {
    super(page);
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput().fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput().fill(lastName);
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

  async signUp(user: UserPayload): Promise<void> {
    await this.fillFirstName(user.firstName);
    await this.fillLastName(user.lastName);
    await this.fillEmail(user.email);
    await this.fillPassword(user.password);
    await this.clickSubmit();
  }
}
