// DotLine Game - All Text Content & Wordings
// Centralized string constants for reuse across the application

export const APP_STRINGS = {
  // App Identity
  APP_NAME: 'DotLineGame',
  TITLE: 'DotLine',
  TAGLINE: 'Connect • Fill • Win',

  // Authentication Screen Texts
  AUTH: {
    // Login Screen
    LOGIN_TITLE: 'Hi :)',
    LOGIN_SUBTITLE: 'Sign in to continue',
    SIGN_IN: 'Sign In',
    SIGNING_IN: 'Signing In...',
    GOOGLE_BUTTON: 'Google',
    FORGOT_PASSWORD: 'Forgot Password?',
    DONT_HAVE_ACCOUNT: "Don't have an account? Sign Up",

    // Register Screen
    REGISTER_TITLE: 'Create Account',
    REGISTER_SUBTITLE: 'Sign up to get started',
    SIGN_UP: 'Sign Up',
    CREATING_ACCOUNT: 'Creating Account...',
    ALREADY_HAVE_ACCOUNT: 'Already have an account? Sign In',

    // Forgot Password Screen
    FORGOT_TITLE: 'Reset Password',
    FORGOT_SUBTITLE: 'Enter your email to reset password',
    SEND_RESET_EMAIL: 'Send Reset Email',
    SENDING: 'Sending...',
    BACK_TO_SIGN_IN: 'Back to Sign In',

    // Form Fields
    EMAIL_PLACEHOLDER: 'Email',
    PASSWORD_PLACEHOLDER: 'Password',
    CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm Password',

    // Validation Messages
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',

    // Success Messages
    PASSWORD_RESET_SENT: 'Password reset email sent. Check your inbox.',

    // Common Elements
    OR: 'or',
    CONTINUE_WITH_GOOGLE: '🔍 Continue with Google',
  },

  // Level Selection Screen
  LEVEL_SELECTION: {
    HEADER_TITLE: 'Choose Your Challenge',
    HEADER_SUBTITLE: 'Select a level to begin your journey',
    
    // Level Details
    LEVELS: {
      FIRST_STEPS: {
        name: 'First Steps',
        description: 'Learn the basics with a simple 3×3 grid',
        icon: '🌟',
      },
      GETTING_WARMER: {
        name: 'Getting Warmer',
        description: 'Step up to a 4×4 challenge',
        icon: '🔥',
      },
      STEADY_PROGRESS: {
        name: 'Steady Progress',
        description: 'Master the 5×5 grid like a pro',
        icon: '⚡',
      },
      MIND_BENDER: {
        name: 'Mind Bender',
        description: 'Challenge yourself with 6×6 complexity',
        icon: '🧠',
      },
      EXPERT_ZONE: {
        name: 'Expert Zone',
        description: 'Only for the most dedicated players',
        icon: '💎',
      },
      MASTER_CLASS: {
        name: 'Master Class',
        description: 'The ultimate puzzle experience',
        icon: '👑',
      },
    },

    // Premium/Ad Unlock
    PREMIUM_REQUIRED: '💎 Premium Required',
    PREMIUM_DIALOG_TITLE: '💎 Premium Level',
    AD_WATCH_FORMAT: '📺 Watch {duration}s Ad',
    AD_DIALOG_TITLE: '📺 Watch Ad to Play',
    
    // Footer
    FOOTER_TEXT: 'More levels coming soon! 🚀',
    
    // Time Display
    BEST_TIME_FORMAT: 'Best: {time}s',
  },

  // Game Screen
  GAME: {
    // Navigation
    BACK_BUTTON: '← Back',
    
    // Game Header
    LEVEL_FORMAT: 'Level {number}',
    HELP_BUTTON: '?',
    
    // Game Controls
    RESET_ICON: '🔄',
    RESET_TEXT: 'Reset',
    SUBMIT_ICON: '✓',
    SUBMIT_TEXT: 'Check Solution',
    
    // Success/Error Messages
    SUCCESS_MESSAGE: '🎉 Perfect! You solved the puzzle!',
    SUCCESS_ACTION: 'Play Again',
    ERROR_MESSAGE: '❌ Not quite right! Make sure to: Connect all numbers in order (1→2→3→4→5), fill every cell, and keep the line continuous.',
    ERROR_ACTION: 'Try Again',
    
    // Loading & Error States
    LOADING_TEXT: 'Loading...',
    ERROR_TEXT: '❌ Failed to load puzzle',
    RETRY_BUTTON: '🔄 Retry',
  },

  // Instructions Modal
  INSTRUCTIONS: {
    TITLE: 'How to Play',
    CLOSE_BUTTON: '✕',
    
    // Difficulty Display
    DIFFICULTY_FORMAT: '{difficulty} • {size}×{size} Grid',
    
    // Sections
    OBJECTIVE: {
      title: '🎯 Objective',
      content: 'Connect all numbered dots in order (1→2→3→4→5) while filling every cell in the grid.',
    },
    
    HOW_TO_PLAY: {
      title: '🎮 How to Play',
      content: [
        'Tap and drag to draw your path',
        'Start from any numbered cell',
        'Connect numbers in sequential order',
        'Fill all {totalCells} cells in the grid',
        'Keep your line continuous',
      ],
    },
    
    WINNING_RULES: {
      title: '✅ Winning Rules',
      content: [
        'Visit all numbered cells in order',
        'Fill every cell exactly once',
        'Maintain a continuous path',
        'No jumping or gaps allowed',
      ],
    },
    
    TIPS: {
      title: '💡 Tips',
      content: [
        'Plan your route before drawing',
        'Use the reset button to start over',
        'Watch the progress bar to track completion',
      ],
      LARGE_GRID_TIP: 'Take your time - larger grids require strategy!',
      SMALL_GRID_TIP: 'Start simple and work your way up!',
    },
  },

  // Sidebar/Settings Menu
  SIDEBAR: {
    TITLE: 'Settings',
    CLOSE_BUTTON: '×',
    
    // Account Section
    ACCOUNT: {
      title: 'Account',
    },
    
    // Preferences Section
    PREFERENCES: {
      title: 'Preferences',
      DARK_MODE: 'Dark Mode',
      SOUND_EFFECTS: 'Sound Effects',
    },
    
    // Game Section
    GAME_SECTION: {
      title: 'Game',
      STATISTICS: 'Statistics',
      ACHIEVEMENTS: 'Achievements',
      LEADERBOARD: 'Leaderboard',
    },
    
    // Support Section
    SUPPORT: {
      title: 'Support',
      HELP_TUTORIAL: 'Help & Tutorial',
      CONTACT_US: 'Contact Us',
      PRIVACY_POLICY: 'Privacy Policy',
      TERMS_OF_SERVICE: 'Terms of Service',
    },
    
    // Account Actions
    SIGN_OUT: 'Sign Out',
  },

  // Difficulty Classifications
  DIFFICULTY: {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    EXPERT: 'Expert',
  },

  // Dialog Actions
  DIALOG_ACTIONS: {
    MAYBE_LATER: 'Maybe Later',
    UNLOCK_PREMIUM: 'Unlock Premium',
    CANCEL: 'Cancel',
    WATCH_AD: 'Watch Ad',
    SKIP_DEBUG: 'Skip (Debug)',
  },

  // Ad Loading States
  AD_LOADING: {
    TITLE: '📺 Ad Loading...',
    MESSAGE_FORMAT: 'Starting {duration}-second ad...',
  },

  // Premium Feature Messages
  PREMIUM: {
    FEATURE_ALERT: 'Premium Feature',
    INTEGRATION_MESSAGE: 'This would integrate with your payment system!',
    UNLOCK_MESSAGE_FORMAT: 'Unlock "{levelName}" with premium access!',
    AD_UNLOCK_MESSAGE_FORMAT: 'Watch a {duration}-second ad to unlock "{levelName}"?',
  },

  // Console/Debug Messages (for development)
  DEBUG: {
    LEVEL_COMPLETION_SAVED: 'Level completion saved successfully',
    FAILED_TO_SAVE: 'Failed to save level completion:',
    ERROR_SAVING: 'Error saving level completion:',
    SIGN_OUT_ERROR: 'Sign out error:',
    ERROR_LOADING_PROGRESS: 'Error loading user progress:',
  },
} as const;

// Helper functions for string formatting
export const formatString = (template: string, params: Record<string, string | number>): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
};

// Type-safe string formatter
export const formatLevelTitle = (levelNumber: number): string => {
  return formatString(APP_STRINGS.GAME.LEVEL_FORMAT, { number: levelNumber });
};

export const formatBestTime = (time: number): string => {
  return formatString(APP_STRINGS.LEVEL_SELECTION.BEST_TIME_FORMAT, { time });
};

export const formatDifficulty = (difficulty: string, size: number): string => {
  return formatString(APP_STRINGS.INSTRUCTIONS.DIFFICULTY_FORMAT, { difficulty, size });
};

export const formatAdDuration = (duration: number): string => {
  return formatString(APP_STRINGS.LEVEL_SELECTION.AD_WATCH_FORMAT, { duration });
};

export const formatPremiumUnlockMessage = (levelName: string): string => {
  return formatString(APP_STRINGS.PREMIUM.UNLOCK_MESSAGE_FORMAT, { levelName });
};

export const formatAdUnlockMessage = (levelName: string, duration: number): string => {
  return formatString(APP_STRINGS.PREMIUM.AD_UNLOCK_MESSAGE_FORMAT, { levelName, duration });
};

export const formatAdLoadingMessage = (duration: number): string => {
  return formatString(APP_STRINGS.AD_LOADING.MESSAGE_FORMAT, { duration });
};

export const formatInstructionsCells = (totalCells: number): string[] => {
  return APP_STRINGS.INSTRUCTIONS.HOW_TO_PLAY.content.map(item => 
    formatString(item, { totalCells })
  );
};

// Type definitions for better IDE support
export type AppStringsType = typeof APP_STRINGS;
export type AuthStringsType = typeof APP_STRINGS.AUTH;
export type GameStringsType = typeof APP_STRINGS.GAME;
export type LevelSelectionStringsType = typeof APP_STRINGS.LEVEL_SELECTION;
export type InstructionsStringsType = typeof APP_STRINGS.INSTRUCTIONS;
export type SidebarStringsType = typeof APP_STRINGS.SIDEBAR;