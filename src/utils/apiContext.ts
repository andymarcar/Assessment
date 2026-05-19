import { APIRequestContext, request } from '@playwright/test';

let apiContext: APIRequestContext | null = null;

export async function getApiContext(): Promise<APIRequestContext> {
  if (!apiContext) {
    apiContext = await request.newContext({
      baseURL: 'https://thinking-tester-contact-list.herokuapp.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
  }
  return apiContext;
}

export async function getAuthHeaders(token: string): Promise<Record<string, string>> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function disposeApiContext(): Promise<void> {
  if (apiContext) {
    await apiContext.dispose();
    apiContext = null;
  }
}
