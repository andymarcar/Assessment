import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { AuthApiClient } from '../../api/clients/AuthApiClient';
import { ContactApiClient } from '../../api/clients/ContactApiClient';
import { AddContactPage } from '../../ui/pages/AddContactPage';
import { ContactListPage } from '../../ui/pages/ContactListPage';
import { LoginPage } from '../../ui/pages/LoginPage';
import { generateContact, generateUser } from '../../utils/testData';
import { CustomWorld } from '../../utils/world';

Given('existe al menos un contacto en la lista', async function (this: CustomWorld) {
  const contactClient = new ContactApiClient(this.apiRequest);
  const result = await contactClient.create(this.token, generateContact());
  expect(result.status).toBe(201);
  this.contactId = result.body._id;
});

When('el usuario hace clic en "Add a New Contact"', async function (this: CustomWorld) {
  const contactListPage = new ContactListPage(this.page);
  await contactListPage.clickAddContact();
});

When('completa el formulario de contacto con datos válidos', async function (this: CustomWorld) {
  const contact = generateContact();
  this.createdUserEmail = `${contact.firstName} ${contact.lastName}`;
  const addContactPage = new AddContactPage(this.page);
  await addContactPage.fillContact(contact);
});

When('el usuario selecciona el primer contacto de la lista', async function (this: CustomWorld) {
  const contactListPage = new ContactListPage(this.page);
  const names = await contactListPage.getContactNames();
  expect(names.length).toBeGreaterThan(0);
  this.createdUserEmail = names[0];
  await contactListPage.clickContact(names[0]);
});

When('hace clic en Delete', async function (this: CustomWorld) {
  this.page.once('dialog', (dialog) => dialog.accept());
  await this.page.getByRole('button', { name: 'Delete' }).click();
  await this.page.waitForURL('**/contactList');
});

Then('el nuevo contacto debería aparecer en la lista', async function (this: CustomWorld) {
  await this.page.waitForURL('**/contactList');
  const contactListPage = new ContactListPage(this.page);
  const names = await contactListPage.getContactNames();
  expect(names.length).toBeGreaterThan(0);
});

Then('el contacto eliminado no debería aparecer en la lista', async function (this: CustomWorld) {
  const contactListPage = new ContactListPage(this.page);
  const names = await contactListPage.getContactNames();
  const deletedName = this.createdUserEmail;
  expect(names).not.toContain(deletedName);
});

Given('I am logged in via UI', async function (this: CustomWorld) {
  const authClient = new AuthApiClient(this.apiRequest);
  const user = generateUser();
  const result = await authClient.register(user);
  expect(result.status).toBe(201);
  const body = result.body as unknown as Record<string, unknown>;
  this.token = (body.token as string) ?? '';
  this.createdUserEmail = user.email;
  this.createdUserPassword = user.password;

  const loginPage = new LoginPage(this.page);
  await loginPage.navigate('/');
  await loginPage.login(user.email, user.password);
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
  const contactListPage = new ContactListPage(this.page);
  expect(await contactListPage.isLoggedIn()).toBe(true);
});

Given('I have a contact in the list', async function (this: CustomWorld) {
  const contactClient = new ContactApiClient(this.apiRequest);
  const contact = generateContact();
  const result = await contactClient.create(this.token, contact);
  expect(result.status).toBe(201);
  this.contactId = result.body._id;
  this.createdUserEmail = `${contact.firstName} ${contact.lastName}`;
});

Given('I am on the contact list page', async function (this: CustomWorld) {
  await this.page.goto('/contactList');
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
  await this.page.waitForLoadState('networkidle');
});

When('I click the add contact button', async function (this: CustomWorld) {
  const contactListPage = new ContactListPage(this.page);
  await contactListPage.clickAddContact();
});

When('I fill in the contact form with valid data', async function (this: CustomWorld) {
  const contact = generateContact();
  this.createdUserEmail = `${contact.firstName} ${contact.lastName}`;
  const addContactPage = new AddContactPage(this.page);
  await addContactPage.fillContact(contact);
});

When('I submit the contact form', async function (this: CustomWorld) {
  const addContactPage = new AddContactPage(this.page);
  await addContactPage.clickSubmit();
});

When('I submit the contact form without required fields', async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: 'Submit' }).click();
});

When('I click on the contact to view details', async function (this: CustomWorld) {
  const contactListPage = new ContactListPage(this.page);
  const names = await contactListPage.getContactNames();
  expect(names.length).toBeGreaterThan(0);
  this.createdUserEmail = names[0];
  await contactListPage.clickContact(names[0]);
});

When('I click the delete contact button', async function (this: CustomWorld) {
  this.page.once('dialog', (dialog) => dialog.accept());
  await this.page.getByRole('button', { name: 'Delete' }).click();
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
});

When('I cancel the delete operation', async function (this: CustomWorld) {
  this.page.once('dialog', (dialog) => dialog.dismiss());
  await this.page.getByRole('button', { name: 'Delete' }).click();
  await this.page.waitForLoadState('networkidle');
});

Then('the new contact should appear in the contact list', async function (this: CustomWorld) {
  const contactListPage = new ContactListPage(this.page);
  const names = await contactListPage.getContactNames();
  expect(names).toContain(this.createdUserEmail);
});

Then('the contact should no longer appear in the contact list', async function (this: CustomWorld) {
  const contactListPage = new ContactListPage(this.page);
  const names = await contactListPage.getContactNames();
  expect(names).not.toContain(this.createdUserEmail);
});

Then('the contact should still appear in the contact list', async function (this: CustomWorld) {
  await this.page.goto('/contactList');
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
  const contactListPage = new ContactListPage(this.page);
  const names = await contactListPage.getContactNames();
  expect(names).toContain(this.createdUserEmail);
});
