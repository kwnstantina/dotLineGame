import auth from '@react-native-firebase/auth';
import firestore, { doc, collection, getDoc, setDoc } from '@react-native-firebase/firestore';
import { getApps, initializeApp } from '@react-native-firebase/app';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FIREBASE_PROJECT_ID, FIREBASE_WEB_API_KEY, FIREBASE_PROJECT_NUMBER, GOOGLE_WEB_CLIENT_ID } from '@env';

export const initializeFirebase = () => {
  if (getApps().length === 0) {
    try {
      // Initialize Firebase with environment variables
      const config = {
        projectId: FIREBASE_PROJECT_ID,
        apiKey: FIREBASE_WEB_API_KEY,
        appId: `1:${FIREBASE_PROJECT_NUMBER}:android:${FIREBASE_PROJECT_ID}`,
      };
      
      console.log('Initializing Firebase with config:', {
        projectId: config.projectId,
        hasApiKey: !!config.apiKey,
        appId: config.appId
      });
      
      initializeApp(config);
      console.log('Firebase initialized successfully');
      
      // Initialize Google Sign-In
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
      });
      console.log('Google Sign-In configured');
      
      // Test Firestore connection
      testFirestoreConnection();
    } catch (error) {
      console.error('Firebase initialization failed:', error);
    }
  } else {
    console.log('Firebase already initialized');
  }
};

// Test Firestore connection
const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    const testDocRef = doc(firestore(), 'test', 'connection');
    await getDoc(testDocRef);
    console.log('✅ Firestore connection successful');
  } catch (error: any) {
    console.error('❌ Firestore connection failed:', error);
    console.error('Error details:', {
      code: error?.code || 'unknown',
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace'
    });
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

export const signInWithGoogle = async () => {
  try {
    // Check if device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    // Get the user's ID token
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken;
    
    if (!idToken) {
      throw new Error('No ID token received from Google Sign-In');
    }
    
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
    // Sign-in the user with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    
    // Handle specific error codes
    if (error.code === 'auth/account-exists-with-different-credential') {
      return { user: null, error: 'An account already exists with the same email address but different sign-in credentials.' };
    }
    
    return { user: null, error: error.message || 'Google sign-in failed' };
  }
};

export const getCurrentUser = () => {
  return auth().currentUser;
};

export const onAuthStateChanged = (callback: (user: any) => void) => {
  return auth().onAuthStateChanged(callback);
};

// User progress data structure
export interface UserProgress {
  userId: string;
  levelProgress: {
    [levelId: string]: {
      solved: boolean;
      completionTime?: number;
      bestTime?: number;
      attempts: number;
      firstCompletedAt?: Date;
      lastCompletedAt?: Date;
    };
  };
  totalLevelsCompleted: number;
  lastUpdated: Date;
}

// Save level completion data
export const saveLevelCompletion = async (levelId: number, completionTime: number) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const userProgressRef = doc(firestore(), 'userProgress', user.uid);
    const userProgressDoc = await getDoc(userProgressRef);

    let userProgress: UserProgress;
    const now = new Date();

    if (userProgressDoc.exists()) {
      // Update existing progress
      userProgress = userProgressDoc.data() as UserProgress;
      
      const levelKey = levelId.toString();
      const currentLevelProgress = userProgress.levelProgress[levelKey];

      if (currentLevelProgress) {
        // Update existing level progress
        userProgress.levelProgress[levelKey] = {
          ...currentLevelProgress,
          solved: true,
          completionTime,
          bestTime: currentLevelProgress.bestTime ? 
            Math.min(currentLevelProgress.bestTime, completionTime) : completionTime,
          attempts: currentLevelProgress.attempts + 1,
          lastCompletedAt: now,
        };
      } else {
        // First time completing this level
        userProgress.levelProgress[levelKey] = {
          solved: true,
          completionTime,
          bestTime: completionTime,
          attempts: 1,
          firstCompletedAt: now,
          lastCompletedAt: now,
        };
        userProgress.totalLevelsCompleted += 1;
      }
    } else {
      // Create new progress document
      userProgress = {
        userId: user.uid,
        levelProgress: {
          [levelId.toString()]: {
            solved: true,
            completionTime,
            bestTime: completionTime,
            attempts: 1,
            firstCompletedAt: now,
            lastCompletedAt: now,
          },
        },
        totalLevelsCompleted: 1,
        lastUpdated: now,
      };
    }

    userProgress.lastUpdated = now;
    await setDoc(userProgressRef, userProgress);

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Retrieve user progress
export const getUserProgress = async (): Promise<UserProgress | null> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const userProgressRef = doc(firestore(), 'userProgress', user.uid);
    const userProgressDoc = await getDoc(userProgressRef);

    if (userProgressDoc.exists()) {
      return userProgressDoc.data() as UserProgress;
    }

    return null;
  } catch (error: any) {
    console.error('Error retrieving user progress:', error);
    return null;
  }
};

// Get specific level progress
export const getLevelProgress = async (levelId: number) => {
  try {
    const userProgress = await getUserProgress();
    if (!userProgress) {
      return null;
    }

    const levelKey = levelId.toString();
    return userProgress.levelProgress[levelKey] || null;
  } catch (error: any) {
    console.error('Error retrieving level progress:', error);
    return null;
  }
};

// Check if level is solved
export const isLevelSolved = async (levelId: number): Promise<boolean> => {
  try {
    const levelProgress = await getLevelProgress(levelId);
    return levelProgress?.solved || false;
  } catch (error: any) {
    console.error('Error checking level solved status:', error);
    return false;
  }
};