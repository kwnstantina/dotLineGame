// ⚠️ DEPRECATED: This file has been moved to ../core/services/authService.ts
// This file provides backward compatibility during migration
// Please update your imports to use the new location

import {
  signUpWithEmail as newSignUpWithEmail,
  signInWithEmail as newSignInWithEmail,
  signOut as newSignOut,
  resetPassword as newResetPassword,
  signInWithGoogle as newSignInWithGoogle,
  getCurrentUser as newGetCurrentUser,
  onAuthStateChanged as newOnAuthStateChanged,
} from '../core/services/authService';

// Re-export all functions for backward compatibility
export const signUpWithEmail = newSignUpWithEmail;
export const signInWithEmail = newSignInWithEmail;
export const signOut = newSignOut;
export const resetPassword = newResetPassword;
export const signInWithGoogle = newSignInWithGoogle;
export const getCurrentUser = newGetCurrentUser;
export const onAuthStateChanged = newOnAuthStateChanged;

console.warn(
  '⚠️ Deprecated: utils/auth.ts has been moved to core/services/authService.ts. ' +
  'Please update your imports to use the new location.'
);
