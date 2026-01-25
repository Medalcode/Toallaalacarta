import { Client, Databases, Account, ID } from 'appwrite';
import { APP_CONFIG } from '../config';

class AppwriteService {
  private client: Client;
  public databases: Databases;
  public account: Account;

  private static instance: AppwriteService;

  private constructor() {
    this.client = new Client()
      .setEndpoint(APP_CONFIG.appwrite.endpoint)
      .setProject(APP_CONFIG.appwrite.projectId);

    this.databases = new Databases(this.client);
    this.account = new Account(this.client);
  }

  public static getInstance(): AppwriteService {
    if (!AppwriteService.instance) {
      AppwriteService.instance = new AppwriteService();
    }
    return AppwriteService.instance;
  }

  /**
   * Returns a new client instance authenticated with the given token.
   * Safe for server-side per-request usage.
   */
  public createSessionClient(token: string): { client: Client, account: Account, databases: Databases } {
    const sessionClient = new Client()
      .setEndpoint(APP_CONFIG.appwrite.endpoint)
      .setProject(APP_CONFIG.appwrite.projectId)
      .setSession(token);

    return {
      client: sessionClient,
      account: new Account(sessionClient),
      databases: new Databases(sessionClient)
    };
  }

  /**
   * Returns the admin/server client (if using API keys) or public anonymous client.
   */
  public getPublicClient(): Client {
      return this.client;
  }
}

export const appwriteService = AppwriteService.getInstance();
