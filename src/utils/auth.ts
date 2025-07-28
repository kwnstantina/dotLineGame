import auth from '@react-native-firebase/auth';
import { getAuth } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken;
    if (!idToken) throw new Error('No ID token received from Google Sign-In');
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      return { user: null, error: 'An account already exists with the same email address but different sign-in credentials.' };
    }
    return { user: null, error: error.message || 'Google sign-in failed' };
  }
};

export const getCurrentUser = () => {
  const authInstance = getAuth(getApp());
  return authInstance.currentUser;
};

export const onAuthStateChanged = (callback: (user: any) => void) => {
  const authInstance = getAuth(getApp());
  return authInstance.onAuthStateChanged(callback);
};
