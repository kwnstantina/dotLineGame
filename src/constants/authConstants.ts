import { APP_STRINGS } from './strings';

// Re-export auth strings from centralized constants for backward compatibility
export const AUTH_STRINGS = APP_STRINGS.AUTH;

export const AUTH_CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;


export type AuthMode = 'login' | 'register' | 'forgot';

export const AUTH_CODES={
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT: 'forgot',
} as const as { [key: string]: AuthMode };