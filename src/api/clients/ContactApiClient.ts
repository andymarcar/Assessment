import { APIRequestContext, APIResponse } from '@playwright/test';
import { ContactPayload, ContactResponse } from '../models/Contact';

export class ContactApiClient {
  constructor(private readonly request: APIRequestContext) {}

  private authHeader(token: string): Record<string, string> {
    return { Authorization: `Bearer ${token}` };
  }

  private async parseJson<T>(res: APIResponse): Promise<T> {
    return res.json().catch(() => ({} as T));
  }

  async create(
    token: string,
    payload: ContactPayload,
  ): Promise<{ status: number; body: ContactResponse }> {
    const res = await this.request.post('/contacts', {
      data: payload,
      headers: this.authHeader(token),
    });
    const body = await this.parseJson<ContactResponse>(res);
    return { status: res.status(), body };
  }

  async getAll(token: string): Promise<{ status: number; body: ContactResponse[] }> {
    const res = await this.request.get('/contacts', {
      headers: this.authHeader(token),
    });
    const body = (await res.json().catch(() => [])) as ContactResponse[];
    return { status: res.status(), body };
  }

  async getById(
    token: string,
    id: string,
  ): Promise<{ status: number; body: ContactResponse }> {
    const res = await this.request.get(`/contacts/${id}`, {
      headers: this.authHeader(token),
    });
    const body = await this.parseJson<ContactResponse>(res);
    return { status: res.status(), body };
  }

  async update(
    token: string,
    id: string,
    payload: ContactPayload,
  ): Promise<{ status: number; body: ContactResponse }> {
    const res = await this.request.put(`/contacts/${id}`, {
      data: payload,
      headers: this.authHeader(token),
    });
    const body = await this.parseJson<ContactResponse>(res);
    return { status: res.status(), body };
  }

  async patch(
    token: string,
    id: string,
    payload: Partial<ContactPayload>,
  ): Promise<{ status: number; body: ContactResponse }> {
    const res = await this.request.patch(`/contacts/${id}`, {
      data: payload,
      headers: this.authHeader(token),
    });
    const body = await this.parseJson<ContactResponse>(res);
    return { status: res.status(), body };
  }

  async delete(token: string, id: string): Promise<{ status: number }> {
    const res = await this.request.delete(`/contacts/${id}`, {
      headers: this.authHeader(token),
    });
    return { status: res.status() };
  }
}
