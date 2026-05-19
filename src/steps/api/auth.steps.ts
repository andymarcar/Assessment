import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../utils/world';
import { AuthApiClient } from '../../api/clients/AuthApiClient';
import { generateUser } from '../../utils/testData';

// ─────────────────────────────────────────────────────────────
// GIVENs
// ─────────────────────────────────────────────────────────────

Given(
  'existe un usuario registrado con email generado',
  async function (this: CustomWorld) {
    const client = new AuthApiClient(this.apiRequest);
    const user = generateUser();
    this.createdUserEmail = user.email;
    this.createdUserPassword = user.password;
    const result = await client.register(user);
    // La respuesta de registro tiene forma: { user: {...}, token: '...' }
    const body = result.body as unknown as Record<string, unknown>;
    this.token = (body['token'] as string) ?? '';
    expect(result.status).toBe(201);
  },
);

// ─────────────────────────────────────────────────────────────
// WHENs — signup
// ─────────────────────────────────────────────────────────────

// Nota: las URLs entre comillas dobles en step texts son tratadas como {string}
// por Cucumber Expressions. Se usa regex para garantizar match literal exacto.

When(
  /^se envía una solicitud POST a "\/users" con payload válido$/,
  async function (this: CustomWorld) {
    const client = new AuthApiClient(this.apiRequest);
    const user = generateUser();
    this.createdUserEmail = user.email;
    this.createdUserPassword = user.password;
    const result = await client.register(user);
    this.response = result;
  },
);

When(
  /^se intenta registrar otro usuario con el mismo email$/,
  async function (this: CustomWorld) {
    const client = new AuthApiClient(this.apiRequest);
    const duplicate = generateUser();
    duplicate.email = this.createdUserEmail;
    const result = await client.register(duplicate);
    this.response = result;
  },
);

// ─────────────────────────────────────────────────────────────
// WHENs — login
// ─────────────────────────────────────────────────────────────

When(
  /^se envía POST a "\/users\/login" con las credenciales del usuario$/,
  async function (this: CustomWorld) {
    const client = new AuthApiClient(this.apiRequest);
    const result = await client.login(this.createdUserEmail, this.createdUserPassword);
    this.response = result;
  },
);

When(
  /^se envía POST a "\/users\/login" con password incorrecto "([^"]+)"$/,
  async function (this: CustomWorld, wrongPassword: string) {
    const client = new AuthApiClient(this.apiRequest);
    const result = await client.login(this.createdUserEmail, wrongPassword);
    this.response = result;
  },
);

// ─────────────────────────────────────────────────────────────
// WHENs — autorización
// ─────────────────────────────────────────────────────────────

When(
  /^se envía GET a "\/contacts" sin header de Authorization$/,
  async function (this: CustomWorld) {
    const res = await this.apiRequest.get('/contacts');
    const body = await res.json().catch(() => ({}));
    this.response = { status: res.status(), body };
  },
);

When(
  /^se envía GET a "\/contacts" con token "([^"]+)"$/,
  async function (this: CustomWorld, token: string) {
    const res = await this.apiRequest.get('/contacts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json().catch(() => ({}));
    this.response = { status: res.status(), body };
  },
);

// ─────────────────────────────────────────────────────────────
// THENs — compartidos entre auth y contacts (NO duplicar en contacts.steps.ts)
// ─────────────────────────────────────────────────────────────

Then(
  'el status code de respuesta debería ser {int}',
  async function (this: CustomWorld, expectedStatus: number) {
    expect(this.response.status).toBe(expectedStatus);
  },
);

Then(
  'el body de respuesta debería contener el campo {string}',
  async function (this: CustomWorld, field: string) {
    expect(this.response.body).toHaveProperty(field);
  },
);

Then(
  'el campo {string} no debería estar vacío',
  async function (this: CustomWorld, field: string) {
    const body = this.response.body as Record<string, unknown>;
    expect(body[field]).toBeTruthy();
  },
);

// Alias corto — reutilizado desde los feature files de contacts
Then(
  'el status code debería ser {int}',
  async function (this: CustomWorld, expectedStatus: number) {
    expect(this.response.status).toBe(expectedStatus);
  },
);

Then(
  'el body debería contener el campo {string}',
  async function (this: CustomWorld, field: string) {
    expect(this.response.body).toHaveProperty(field);
  },
);
