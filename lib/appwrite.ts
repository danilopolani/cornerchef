import { Client, Account, ID, Models } from 'react-native-appwrite';
import { APPWRITE_CONFIG } from '@/constants/Config';

// Initialize the Appwrite client
export const client = new Client();

client
  .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
  .setProject(APPWRITE_CONFIG.PROJECT_ID)
  .setPlatform(APPWRITE_CONFIG.PLATFORM);

// Initialize Account service
export const account = new Account(client);

// Authentication functions
export const authService = {
  // Create a new account
  async createAccount(email: string, password: string, name: string): Promise<Models.User<Models.Preferences>> {
    try {
      const newAccount = await account.create({
        userId: ID.unique(),
        email,
        password,
        name
      });
      // Auto-login after registration
      await this.login(email, password);
      return newAccount;
    } catch (error) {
      console.error('Account creation failed:', error);
      throw error;
    }
  },

  // Login with email and password
  async login(email: string, password: string): Promise<Models.Session> {
    try {
      return await account.createEmailPasswordSession({
        email,
        password
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      return await account.get();
    } catch (error) {
      console.error('Get current user failed:', error);
      return null;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await account.deleteSession({ sessionId: 'current' });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }
};

export { ID, Models };
