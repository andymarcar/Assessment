import { APIRequestContext, APIResponse } from '@playwright/test';
import { UserPayload, UserResponse } from '../models/User';

export class AuthApiClient {
  constructor(private readonly request: APIRequestContext) {}

  // Parsea el body de la respuesta de forma segura; nunca lanza excepción.
  private async parseJson<T>(res: APIResponse): Promise<T> {
    return res.json().catch(() => ({} as T));
  }

  async register(payload: UserPayload): Promise<{ status: number; body: UserResponse }> {
    const res = await this.request.post('/users', { data: payload });
    const body = await this.parseJson<UserResponse>(res);
    return { status: res.status(), body };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ status: number; body: UserResponse }> {
    const res = await this.request.post('/users/login', {
      data: { email, password },
    });
    const body = await this.parseJson<UserResponse>(res);
    return { status: res.status(), body };
  }

  async getProfile(token: string): Promise<{ status: number; body: UserResponse }> {
    const res = await this.request.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await this.parseJson<UserResponse>(res);
    return { status: res.status(), body };
  }

  async updateUser(
    token: string,
    payload: Partial<UserPayload>,
  ): Promise<{ status: number; body: UserResponse }> {
    const res = await this.request.patch('/users/me', {
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await this.parseJson<UserResponse>(res);
    return { status: res.status(), body };
  }

  async logout(token: string): Promise<{ status: number }> {
    const res = await this.request.post('/users/logout', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { status: res.status() };
  }

  async deleteUser(token: string): Promise<{ status: number }> {
    const res = await this.request.delete('/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { status: res.status() };
  }
}
