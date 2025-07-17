import auth from '@react-native-firebase/auth';
import { getApps, initializeApp } from '@react-native-firebase/app';
import { FIREBASE_PROJECT_ID, FIREBASE_WEB_API_KEY, FIREBASE_PROJECT_NUMBER } from '@env';

export const initializeFirebase = () => {
  if (getApps().length === 0) {
    // Initialize Firebase with environment variables
    initializeApp({
      projectId: FIREBASE_PROJECT_ID,
      apiKey: FIREBASE_WEB_API_KEY,
      appId: `1:${FIREBASE_PROJECT_NUMBER}:android:${FIREBASE_PROJECT_ID}`,
    });
    console.log('Firebase initialized with environment config');
  } else {
    console.log('Firebase already initialized');
  }
};

export const fetchDailyPuzzle = async () => {
  // TODO: Implement Firestore fetching
  // For now, return null to use hardcoded puzzle
  return null;
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await auth().sendPasswordResetEmail(email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth().currentUser;
};

export const onAuthStateChanged = (callback: (user: any) => void) => {
  return auth().onAuthStateChanged(callback);
};