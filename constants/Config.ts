/**
 * Global configuration constants for the CornerChef app
 */

// App Configuration
export const APP_CONFIG = {
  // Platform package name for Appwrite
  PLATFORM_PACKAGE_NAME: 'app.cornerchef.app',
  
  // App information
  APP_NAME: 'CornerChef',
  APP_SLUG: 'CornerChef',
  APP_VERSION: '1.0.0',
  
  // URL schemes
  URL_SCHEME: 'cornerchef',
} as const;

// Appwrite Configuration
export const APPWRITE_CONFIG = {
  ENDPOINT: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  BUCKET_ID: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
  PLATFORM: APP_CONFIG.PLATFORM_PACKAGE_NAME,
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// UI Configuration
export const UI_CONFIG = {
  // Animation durations (milliseconds)
  ANIMATION_DURATION_SHORT: 200,
  ANIMATION_DURATION_MEDIUM: 300,
  ANIMATION_DURATION_LONG: 500,
} as const;
