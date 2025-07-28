import { AUTH_CODES, AUTH_CONFIG, AUTH_STRINGS } from '../constants/authConstants';

export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email.trim()) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!AUTH_CONFIG.EMAIL_REGEX.test(email)) {
    return { isValid: false, message: AUTH_STRINGS.INVALID_EMAIL };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < AUTH_CONFIG.MIN_PASSWORD_LENGTH) {
    return { isValid: false, message: AUTH_STRINGS.PASSWORD_TOO_SHORT };
  }
  
  return { isValid: true };
};

export const validatePasswordConfirmation = (
  password: string, 
  confirmPassword: string
): { isValid: boolean; message?: string } => {
  if (password !== confirmPassword) {
    return { isValid: false, message: AUTH_STRINGS.PASSWORDS_DONT_MATCH };
  }
  
  return { isValid: true };
};

export const validateAuthForm = (
  email: string,
  password: string,
  confirmPassword?: string,
  mode: 'login' | 'register' | 'forgot' = 'login'
): { isValid: boolean; message?: string } => {
  // For forgot password, only validate email
  if (mode === AUTH_CODES.FORGOT) {
    return validateEmail(email);
  }

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  // For registration, validate password confirmation
  if (mode === AUTH_CODES.REGISTER && confirmPassword !== undefined) {
    const confirmValidation = validatePasswordConfirmation(password, confirmPassword);
    if (!confirmValidation.isValid) {
      return confirmValidation;
    }
  }

  return { isValid: true };
};