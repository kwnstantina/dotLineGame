// ⚠️ DEPRECATED: This file has been moved to ../core/services/validationService.ts
// This file provides backward compatibility during migration
// Please update your imports to use the new location

import {
  validateEmail as newValidateEmail,
  validatePassword as newValidatePassword,
  validatePasswordConfirmation as newValidatePasswordConfirmation,
  validateAuthForm as newValidateAuthForm,
} from '../core/services/validationService';

// Re-export all functions for backward compatibility
export const validateEmail = newValidateEmail;
export const validatePassword = newValidatePassword;
export const validatePasswordConfirmation = newValidatePasswordConfirmation;
export const validateAuthForm = newValidateAuthForm;

console.warn(
  '⚠️ Deprecated: utils/validation.ts has been moved to core/services/validationService.ts. ' +
  'Please update your imports to use the new location.'
);