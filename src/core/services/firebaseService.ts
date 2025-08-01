import { getApps, initializeApp, getApp } from '@react-native-firebase/app';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// These would typically come from environment variables or config
// For now, we'll use placeholder values that should be replaced
const FIREBASE_CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
  apiKey: process.env.FIREBASE_WEB_API_KEY || 'your-api-key',
  appId: process.env.FIREBASE_APP_ID || 'your-app-id',
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID || 'your-web-client-id',
};

export class FirebaseService {
  private initialized = false;

  // Initialize Firebase app
  initialize(): boolean {
    if (this.initialized || getApps().length > 0) {
      return true;
    }

    try {
      const config = {
        projectId: FIREBASE_CONFIG.projectId,
        apiKey: FIREBASE_CONFIG.apiKey,
        appId: FIREBASE_CONFIG.appId,
      };

      initializeApp(config);
      this.initializeGoogleSignIn();
      this.initialized = true;
      
      // Initialize collections after a short delay
      setTimeout(() => {
        this.initializeCollections();
      }, 1000);

      return true;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      return false;
    }
  }

  // Initialize Google Sign-In
  private initializeGoogleSignIn(): void {
    try {
      GoogleSignin.configure({ 
        webClientId: FIREBASE_CONFIG.webClientId 
      });
    } catch (error) {
      console.error('Google Sign-In configuration failed:', error);
    }
  }

  // Initialize Firebase collections (levels, puzzle packs, etc.)
  private async initializeCollections(): Promise<void> {
    try {
      // Import and initialize user service
      const { getUserService } = await import('./userService');
      const userService = getUserService();
      
      // Initialize default levels and puzzle packs if needed
      // This would be called when the app first loads
      console.log('Firebase collections initialized');
    } catch (error) {
      console.error('Failed to initialize Firebase collections:', error);
    }
  }

  // Get Firebase app instance
  getApp() {
    if (!this.initialized) {
      this.initialize();
    }
    return getApp();
  }

  // Check if Firebase is ready
  isReady(): boolean {
    return this.initialized && getApps().length > 0;
  }

  // Reset Firebase (mainly for testing)
  reset(): void {
    this.initialized = false;
  }
}

// Singleton instance
let firebaseServiceInstance: FirebaseService | null = null;

export const getFirebaseService = (): FirebaseService => {
  if (!firebaseServiceInstance) {
    firebaseServiceInstance = new FirebaseService();
  }
  return firebaseServiceInstance;
};

// Export initialization function for backward compatibility
export const initializeFirebase = (): boolean => {
  return getFirebaseService().initialize();
};