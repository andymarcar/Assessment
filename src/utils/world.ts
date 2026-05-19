import { World, setWorldConstructor, IWorldOptions } from '@cucumber/cucumber';
import { APIRequestContext, Browser, BrowserContext, Page } from '@playwright/test';

export interface ApiResponse {
  status: number;
  body: unknown;
}

export class CustomWorld extends World {
  token: string = '';
  response: ApiResponse = { status: 0, body: {} };
  contactId: string = '';
  createdUserEmail: string = '';
  createdUserPassword: string = '';
  page!: Page;
  browser!: Browser;
  context!: BrowserContext;
  apiRequest!: APIRequestContext;

  constructor(options: IWorldOptions) {
    super(options);
  }

  reset(): void {
    this.token = '';
    this.response = { status: 0, body: {} };
    this.contactId = '';
    this.createdUserEmail = '';
    this.createdUserPassword = '';
  }
}

setWorldConstructor(CustomWorld);
