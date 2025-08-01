import { getApps, initializeApp } from '@react-native-firebase/app';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FIREBASE_PROJECT_ID, FIREBASE_WEB_API_KEY, FIREBASE_PROJECT_NUMBER, GOOGLE_WEB_CLIENT_ID } from '@env';
import { initializeFirebaseCollections } from './game';

export * from './game'; // Export all from game module
export * from './auth'; // Export all from auth module

export const initializeFirebase = () => {
  if (getApps().length === 0) {
    try {
      const config = {
        projectId: FIREBASE_PROJECT_ID,
        apiKey: FIREBASE_WEB_API_KEY,
        appId: `1:${FIREBASE_PROJECT_NUMBER}:android:${FIREBASE_PROJECT_ID}`,
      };
      initializeApp(config);
      GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
      setTimeout(() => { initializeFirebaseCollections(); }, 1000);
    } catch (error) {
      console.error('Firebase initialization failed:', error);
    }
  }
};