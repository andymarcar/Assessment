import { Page } from '@playwright/test';
import { ContactPayload } from '../../api/models/Contact';
import { BasePage } from './BasePage';

export class AddContactPage extends BasePage {
  private readonly firstNameInput = () => this.page.getByPlaceholder('First Name');
  private readonly lastNameInput = () => this.page.getByPlaceholder('Last Name');
  private readonly birthdateInput = () => this.page.getByPlaceholder('yyyy-MM-dd');
  private readonly emailInput = () => this.page.getByPlaceholder('example@email.com');
  private readonly phoneInput = () => this.page.getByPlaceholder('8005551234');
  private readonly street1Input = () => this.page.getByPlaceholder('Address 1');
  private readonly cityInput = () => this.page.getByPlaceholder('City');
  private readonly stateInput = () => this.page.getByPlaceholder('State or Province');
  private readonly postalCodeInput = () => this.page.getByPlaceholder('Postal Code');
  private readonly countryInput = () => this.page.getByPlaceholder('Country');
  private readonly submitButton = () => this.page.getByRole('button', { name: 'Submit' });

  constructor(page: Page) {
    super(page);
  }

  async fillContact(contact: ContactPayload): Promise<void> {
    await this.firstNameInput().fill(contact.firstName);
    await this.lastNameInput().fill(contact.lastName);
    if (contact.birthdate) await this.birthdateInput().fill(contact.birthdate);
    if (contact.email) await this.emailInput().fill(contact.email);
    if (contact.phone) await this.phoneInput().fill(contact.phone);
    if (contact.street1) await this.street1Input().fill(contact.street1);
    if (contact.city) await this.cityInput().fill(contact.city);
    if (contact.stateProvince) await this.stateInput().fill(contact.stateProvince);
    if (contact.postalCode) await this.postalCodeInput().fill(contact.postalCode);
    if (contact.country) await this.countryInput().fill(contact.country);
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton().click();
    await this.page.waitForURL('**/contactList');
  }
}
