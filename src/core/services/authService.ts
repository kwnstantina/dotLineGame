import auth from '@react-native-firebase/auth';
import { getAuth } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ERROR_MESSAGES } from '../constants/validation';

export class AuthService {
  
  // Sign up with email and password
  async signUpWithEmail(email: string, password: string) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      const errorMessage = this.getFirebaseErrorMessage(error.code) || error.message;
      return { user: null, error: errorMessage };
    }
  }

  // Sign in with email and password
  async signInWithEmail(email: string, password: string) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      const errorMessage = this.getFirebaseErrorMessage(error.code) || error.message;
      return { user: null, error: errorMessage };
    }
  }

  // Sign out current user
  async signOut() {
    try {
      await auth().signOut();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Send password reset email
  async resetPassword(email: string) {
    try {
      await auth().sendPasswordResetEmail(email);
      return { error: null };
    } catch (error: any) {
      const errorMessage = this.getFirebaseErrorMessage(error.code) || error.message;
      return { error: errorMessage };
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;
      
      if (!idToken) {
        throw new Error('No ID token received from Google Sign-In');
      }
      
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        return { 
          user: null, 
          error: 'An account already exists with the same email address but different sign-in credentials.' 
        };
      }
      return { user: null, error: error.message || 'Google sign-in failed' };
    }
  }

  // Get current authenticated user
  getCurrentUser() {
    const authInstance = getAuth(getApp());
    return authInstance.currentUser;
  }

  // Listen to authentication state changes
  onAuthStateChanged(callback: (user: any) => void) {
    const authInstance = getAuth(getApp());
    return authInstance.onAuthStateChanged(callback);
  }

  // Convert Firebase error codes to user-friendly messages
  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return ERROR_MESSAGES.USER_NOT_FOUND;
      case 'auth/wrong-password':
        return ERROR_MESSAGES.WRONG_PASSWORD;
      case 'auth/email-already-in-use':
        return ERROR_MESSAGES.EMAIL_IN_USE;
      case 'auth/weak-password':
        return ERROR_MESSAGES.WEAK_PASSWORD;
      case 'auth/invalid-email':
        return ERROR_MESSAGES.INVALID_EMAIL;
      case 'auth/network-request-failed':
        return ERROR_MESSAGES.NETWORK_ERROR;
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Get user display name or email
  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
    return user.displayName || user.email || 'User';
  }

  // Get user email
  getUserEmail(): string {
    const user = this.getCurrentUser();
    return user?.email || '';
  }

  // Get user ID
  getUserId(): string {
    const user = this.getCurrentUser();
    return user?.uid || '';
  }
}

// Singleton instance
let authServiceInstance: AuthService | null = null;

export const getAuthService = (): AuthService => {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService();
  }
  return authServiceInstance;
};

// Export individual functions for backward compatibility
export const signUpWithEmail = (email: string, password: string) => 
  getAuthService().signUpWithEmail(email, password);

export const signInWithEmail = (email: string, password: string) => 
  getAuthService().signInWithEmail(email, password);

export const signOut = () => getAuthService().signOut();

export const resetPassword = (email: string) => getAuthService().resetPassword(email);

export const signInWithGoogle = () => getAuthService().signInWithGoogle();

export const getCurrentUser = () => getAuthService().getCurrentUser();

export const onAuthStateChanged = (callback: (user: any) => void) => 
  getAuthService().onAuthStateChanged(callback);