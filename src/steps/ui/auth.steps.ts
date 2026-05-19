import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { AuthApiClient } from '../../api/clients/AuthApiClient';
import { ContactListPage } from '../../ui/pages/ContactListPage';
import { LoginPage } from '../../ui/pages/LoginPage';
import { SignUpPage } from '../../ui/pages/SignUpPage';
import { generateUser } from '../../utils/testData';
import { CustomWorld } from '../../utils/world';

async function registerGeneratedUser(world: CustomWorld) {
  const authClient = new AuthApiClient(world.apiRequest);
  const user = generateUser();
  const result = await authClient.register(user);
  expect(result.status).toBe(201);
  const body = result.body as unknown as Record<string, unknown>;
  world.token = (body.token as string) ?? '';
  world.createdUserEmail = user.email;
  world.createdUserPassword = user.password;
  return user;
}

function generateUiUser() {
  const user = generateUser();
  return {
    ...user,
    firstName: 'Ui',
    lastName: 'User',
    email: `ui.${Date.now()}.${Math.floor(Math.random() * 100000)}@testmail.com`,
    password: 'TestPass123!',
  };
}

Given('el usuario está en la página principal de la aplicación', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate('/');
});

Given('el usuario ha iniciado sesión en la UI', async function (this: CustomWorld) {
  const user = await registerGeneratedUser(this);
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate('/');
  await loginPage.login(user.email, user.password);
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
  const contactListPage = new ContactListPage(this.page);
  expect(await contactListPage.isLoggedIn()).toBe(true);
});

Given('existe un usuario registrado via API con email conocido', async function (this: CustomWorld) {
  await registerGeneratedUser(this);
});

When('el usuario ingresa credenciales válidas en el formulario', async function (this: CustomWorld) {
  const user = await registerGeneratedUser(this);
  const loginPage = new LoginPage(this.page);
  await loginPage.fillEmail(user.email);
  await loginPage.fillPassword(user.password);
});

When('el usuario ingresa email válido y contraseña incorrecta', async function (this: CustomWorld) {
  const user = await registerGeneratedUser(this);
  const loginPage = new LoginPage(this.page);
  await loginPage.fillEmail(user.email);
  await loginPage.fillPassword('ContraseñaIncorrecta999');
});

When('hace clic en Submit', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.clickSubmit();
});

When('el usuario hace clic en Submit sin ingresar datos', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.clickSubmit();
});

When('el usuario hace clic en Sign up', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.clickSignUp();
  await this.page.waitForURL('**/addUser');
  await this.page.waitForLoadState('networkidle');
});

When('completa el formulario de registro con datos válidos', async function (this: CustomWorld) {
  const user = generateUiUser();
  this.createdUserEmail = user.email;
  this.createdUserPassword = user.password;
  const signUpPage = new SignUpPage(this.page);
  await signUpPage.fillFirstName(user.firstName);
  await signUpPage.fillLastName(user.lastName);
  await signUpPage.fillEmail(user.email);
  await signUpPage.fillPassword(user.password);
});

When('completa el formulario con el email ya registrado', async function (this: CustomWorld) {
  const signUpPage = new SignUpPage(this.page);
  await signUpPage.fillFirstName('Otro');
  await signUpPage.fillLastName('Usuario');
  await signUpPage.fillEmail(this.createdUserEmail);
  await signUpPage.fillPassword('OtroPass123!');
});

Then('debería ser redirigido a la lista de contactos', async function (this: CustomWorld) {
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
  const contactListPage = new ContactListPage(this.page);
  expect(await contactListPage.isLoggedIn()).toBe(true);
});

Then('debería ver un mensaje de error en pantalla', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBeTruthy();
  expect(errorMessage.length).toBeGreaterThan(0);
});

Given('I navigate to the sign up page', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate('/');
  await loginPage.clickSignUp();
  await this.page.waitForURL('**/addUser');
  await this.page.waitForLoadState('networkidle');
});

Given('a user with the email already exists', async function (this: CustomWorld) {
  await registerGeneratedUser(this);
});

Given('a registered user exists', async function (this: CustomWorld) {
  await registerGeneratedUser(this);
});

Given('I navigate to the login page', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate('/');
});

When('I fill in the registration form with valid data', async function (this: CustomWorld) {
  const user = generateUiUser();
  this.createdUserEmail = user.email;
  this.createdUserPassword = user.password;
  const signUpPage = new SignUpPage(this.page);
  await signUpPage.fillFirstName(user.firstName);
  await signUpPage.fillLastName(user.lastName);
  await signUpPage.fillEmail(user.email);
  await signUpPage.fillPassword(user.password);
});

When('I submit the registration form', async function (this: CustomWorld) {
  const signUpPage = new SignUpPage(this.page);
  await signUpPage.clickSubmit();
  await signUpPage.waitForPageLoad();
});

When('I fill in the registration form with an existing email', async function (this: CustomWorld) {
  const signUpPage = new SignUpPage(this.page);
  await signUpPage.fillFirstName('Otro');
  await signUpPage.fillLastName('Usuario');
  await signUpPage.fillEmail(this.createdUserEmail);
  await signUpPage.fillPassword('OtroPass123!');
});

When(
  'I fill in the registration form with a password that is too short',
  async function (this: CustomWorld) {
    const user = generateUiUser();
    const signUpPage = new SignUpPage(this.page);
    await signUpPage.fillFirstName(user.firstName);
    await signUpPage.fillLastName(user.lastName);
    await signUpPage.fillEmail(user.email);
    await signUpPage.fillPassword('short');
  },
);

When('I fill in the login form with valid credentials', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillEmail(this.createdUserEmail);
  await loginPage.fillPassword(this.createdUserPassword);
});

When('I submit the login form', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.clickSubmit();
});

When('I fill in the login form with an incorrect password', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillEmail(this.createdUserEmail);
  await loginPage.fillPassword('WrongPass123!');
});

When('I fill in the login form with a non-existent email', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillEmail('nobody@notexist.com');
  await loginPage.fillPassword('SomePass123!');
});

Then('I should be redirected to the contact list page', async function (this: CustomWorld) {
  await this.page.waitForURL('**/contactList', { timeout: 10000 });
});

Then('I should be logged in', async function (this: CustomWorld) {
  const contactListPage = new ContactListPage(this.page);
  expect(await contactListPage.isLoggedIn()).toBe(true);
});

Then('I should see an error message', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBeTruthy();
  expect(errorMessage.length).toBeGreaterThan(0);
});
