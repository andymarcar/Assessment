import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../utils/world';
import { AuthApiClient } from '../../api/clients/AuthApiClient';
import { ContactApiClient } from '../../api/clients/ContactApiClient';
import { generateUser, generateContact } from '../../utils/testData';
import { ContactResponse } from '../../api/models/Contact';

// ─────────────────────────────────────────────────────────────
// GIVENs
// ─────────────────────────────────────────────────────────────

Given('el usuario está autenticado via API', async function (this: CustomWorld) {
  const authClient = new AuthApiClient(this.apiRequest);
  const user = generateUser();
  const result = await authClient.register(user);
  expect(result.status).toBe(201);
  const body = result.body as unknown as Record<string, unknown>;
  this.token = (body['token'] as string) ?? '';
});

Given('existe un contacto creado via API', async function (this: CustomWorld) {
  const contactClient = new ContactApiClient(this.apiRequest);
  const result = await contactClient.create(this.token, generateContact());
  expect(result.status).toBe(201);
  this.contactId = result.body._id;
});

Given('el contacto ha sido eliminado via API', async function (this: CustomWorld) {
  const contactClient = new ContactApiClient(this.apiRequest);
  const result = await contactClient.delete(this.token, this.contactId);
  expect(result.status).toBe(200);
});

// ─────────────────────────────────────────────────────────────
// WHENs — create
// Nota: regex para evitar que Cucumber Expressions capture las URLs como {string}
// ─────────────────────────────────────────────────────────────

When(
  /^se envía POST a "\/contacts" con payload de contacto válido$/,
  async function (this: CustomWorld) {
    const contactClient = new ContactApiClient(this.apiRequest);
    const result = await contactClient.create(this.token, generateContact());
    const body = result.body as ContactResponse;
    if (body._id) this.contactId = body._id;
    this.response = result;
  },
);

When(
  /^se envía POST a "\/contacts" sin token de autorización$/,
  async function (this: CustomWorld) {
    const res = await this.apiRequest.post('/contacts', { data: generateContact() });
    const body = await res.json().catch(() => ({}));
    this.response = { status: res.status(), body };
  },
);

When(
  /^se envía POST a "\/contacts" con birthdate "([^"]+)"$/,
  async function (this: CustomWorld, birthdate: string) {
    const contactClient = new ContactApiClient(this.apiRequest);
    const payload = { ...generateContact(), birthdate };
    const result = await contactClient.create(this.token, payload);
    this.response = result;
  },
);

// ─────────────────────────────────────────────────────────────
// WHENs — read
// ─────────────────────────────────────────────────────────────

When(
  /^se envía GET a "\/contacts" con token válido$/,
  async function (this: CustomWorld) {
    const contactClient = new ContactApiClient(this.apiRequest);
    const result = await contactClient.getAll(this.token);
    this.response = result;
  },
);

When(
  /^se envía GET a "\/contacts\/:id" con el id del contacto creado$/,
  async function (this: CustomWorld) {
    const contactClient = new ContactApiClient(this.apiRequest);
    const result = await contactClient.getById(this.token, this.contactId);
    this.response = result;
  },
);

When(
  /^se envía GET a "\/contacts\/:id" con el id del contacto eliminado$/,
  async function (this: CustomWorld) {
    const contactClient = new ContactApiClient(this.apiRequest);
    const result = await contactClient.getById(this.token, this.contactId);
    this.response = result;
  },
);

// ─────────────────────────────────────────────────────────────
// WHENs — update
// ─────────────────────────────────────────────────────────────

When(
  /^se envía PUT a "\/contacts\/:id" con todos los campos actualizados$/,
  async function (this: CustomWorld) {
    const contactClient = new ContactApiClient(this.apiRequest);
    const updatedPayload = { ...generateContact(), city: 'New York' };
    const result = await contactClient.update(this.token, this.contactId, updatedPayload);
    this.response = result;
  },
);

When(
  /^se envía PATCH a "\/contacts\/:id" con solo el campo "phone" actualizado$/,
  async function (this: CustomWorld) {
    const contactClient = new ContactApiClient(this.apiRequest);
    const result = await contactClient.patch(this.token, this.contactId, {
      phone: '9991234567',
    });
    this.response = result;
  },
);

When(
  /^se envía PUT a "\/contacts\/:id" sin token de autorización$/,
  async function (this: CustomWorld) {
    const res = await this.apiRequest.put(`/contacts/${this.contactId}`, {
      data: generateContact(),
    });
    const body = await res.json().catch(() => ({}));
    this.response = { status: res.status(), body };
  },
);

// ─────────────────────────────────────────────────────────────
// WHENs — delete
// ─────────────────────────────────────────────────────────────

When(
  /^se envía DELETE a "\/contacts\/:id" con token válido$/,
  async function (this: CustomWorld) {
    const contactClient = new ContactApiClient(this.apiRequest);
    const result = await contactClient.delete(this.token, this.contactId);
    this.response = { status: result.status, body: {} };
  },
);

When(
  /^se envía DELETE a "\/contacts\/:id" sin token de autorización$/,
  async function (this: CustomWorld) {
    const res = await this.apiRequest.delete(`/contacts/${this.contactId}`);
    this.response = { status: res.status(), body: {} };
  },
);

// ─────────────────────────────────────────────────────────────
// THENs — exclusivos de contacts
// (los comunes viven en auth.steps.ts — NO duplicar)
// ─────────────────────────────────────────────────────────────

Then('el body debería ser un array', async function (this: CustomWorld) {
  expect(Array.isArray(this.response.body)).toBe(true);
});

Then(
  'el body debería reflejar el campo {string} actualizado',
  async function (this: CustomWorld, field: string) {
    const body = this.response.body as Record<string, unknown>;
    expect(body).toHaveProperty(field);
    expect(body[field]).toBe('New York');
  },
);

Then(
  'el campo {string} del response debería coincidir con el nuevo valor',
  async function (this: CustomWorld, field: string) {
    const body = this.response.body as Record<string, unknown>;
    expect(body[field]).toBe('9991234567');
  },
);
