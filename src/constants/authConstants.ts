export const AUTH_STRINGS = {
  // Titles
  LOGIN_TITLE: 'Hi :)',
  REGISTER_TITLE: 'Create Account',
  FORGOT_TITLE: 'Reset Password',

  // Subtitles
  LOGIN_SUBTITLE: 'Sign in to continue',
  REGISTER_SUBTITLE: 'Sign up to get started',
  FORGOT_SUBTITLE: 'Enter your email to reset password',

  // Placeholders
  EMAIL_PLACEHOLDER: 'Email',
  PASSWORD_PLACEHOLDER: 'Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm Password',

  // Button texts
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
  SIGNING_IN: 'Signing In...',
  CREATING_ACCOUNT: 'Creating Account...',
  SEND_RESET_EMAIL: 'Send Reset Email',
  SENDING: 'Sending...',
  CONTINUE_WITH_GOOGLE: '🔍 Continue with Google',

  // Link texts
  FORGOT_PASSWORD: 'Forgot Password?',
  DONT_HAVE_ACCOUNT: "Don't have an account? Sign Up",
  ALREADY_HAVE_ACCOUNT: 'Already have an account? Sign In',
  BACK_TO_SIGN_IN: 'Back to Sign In',

  // Divider
  OR: 'or',

  // Validation messages
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',

  // Success messages
  PASSWORD_RESET_SENT: 'Password reset email sent. Check your inbox.',

  // Google button text variations
  GOOGLE_BUTTON: 'Google',
} as const;

export const AUTH_CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;