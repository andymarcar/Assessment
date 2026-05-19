import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactListPage extends BasePage {
  private readonly addContactButton = () =>
    this.page.getByRole('button', { name: 'Add a New Contact' });
  private readonly logoutButton = () => this.page.getByRole('button', { name: 'Logout' });
  private readonly contactRows = () => this.page.locator('tr.contactTableBodyRow');
  private readonly pageHeader = () =>
    this.page.getByRole('heading', { name: 'Contact List' });

  constructor(page: Page) {
    super(page);
  }

  async isLoggedIn(): Promise<boolean> {
    return this.pageHeader().isVisible();
  }

  async clickAddContact(): Promise<void> {
    await this.addContactButton().click();
    await this.page.waitForURL('**/addContact');
  }

  async clickLogout(): Promise<void> {
    await this.logoutButton().click();
    await this.page.waitForURL('**/');
  }

  async getContactNames(): Promise<string[]> {
    await this.contactRows().first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const rowCount = await this.contactRows().count();
    const names: string[] = [];
    for (let index = 0; index < rowCount; index++) {
      const row = this.contactRows().nth(index);
      const text = await row.locator('td').nth(1).innerText();
      names.push(text.trim());
    }
    return names;
  }

  async clickContact(nameContains: string): Promise<void> {
    const contactRow = this.contactRows().filter({ hasText: nameContains }).first();
    await contactRow.click();
    await this.page.waitForURL('**/contactDetails');
  }

  async getContactCount(): Promise<number> {
    return this.contactRows().count();
  }
}
