// Validation constants
export const VALIDATION_CONSTANTS = {
  // User authentication
  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 254,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  
  // Game validation
  PATH_MIN_LENGTH: 1,
  MAX_GENERATION_ATTEMPTS: 50,
  MAX_OBSTACLE_ATTEMPTS: 30,
  
  // Performance thresholds
  MAX_COMPLETION_TIME: 3600, // 1 hour max
  MIN_EFFICIENCY: 0,
  MAX_EFFICIENCY: 100,
  
  // Firebase limits
  BATCH_SIZE: 500,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // milliseconds
} as const;

// Error messages
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_EMAIL: 'Please enter a valid email address',
  WEAK_PASSWORD: 'Password must be at least 6 characters long',
  USER_NOT_FOUND: 'No account found with this email',
  WRONG_PASSWORD: 'Incorrect password',
  EMAIL_IN_USE: 'An account with this email already exists',
  
  // Game validation
  INVALID_PATH: 'Invalid path - cells must be connected',
  INCOMPLETE_PATH: 'Path must visit all required cells',
  OBSTACLE_HIT: 'Path cannot go through obstacles',
  WRONG_ORDER: 'Numbered cells must be visited in order',
  
  // Network
  NETWORK_ERROR: 'Network connection error. Please try again.',
  TIMEOUT_ERROR: 'Request timed out. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred',
} as const;