export const colors = {
  // Primary palette - Ocean and purple theme
  primary: {
    ocean: '#1e3a8a',     // Deep Ocean Blue - main brand color
    purple: '#5d3c64',    // Vibrant Purple - secondary accent
    oceanLight: '#2d65beff', // Lighter ocean blue for highlights
    purpleLight: '#9f6496', // Light purple for backgrounds
    neutral: '#8A9BA8',   // Cool neutral gray - modern borders/text
  },
  
  // Semantic colors based on primary palette
  background: {
    primary: '#FAFAFA',   // Almost white with warm undertone
    secondary: '#f8fafc', // Light blue-gray
    surface: '#dde6ed',   // Pure white for contrast
    card: '#FFFFFF',      // Card background
    overlay: 'rgba(30, 58, 138, 0.95)', // Dark ocean blue overlay
    snackbar: 'rgba(11, 13, 19, 0.95)'
  },
  
  text: {
    primary: '#1F2937',   // Dark gray for excellent readability
    secondary: '#1e3a8a', // Deep ocean blue for secondary text
    muted: '#6B7280',     // Modern gray for disabled/subtle text
    inverse: '#FFFFFF',   // White text on dark backgrounds
    accent: '#8b5cf6',    // Vibrant purple for accents
  },
  
  border: {
    primary: '#E5E7EB',   // Light modern gray
    secondary: '#d7dae0ff', // Very light gray
    accent: '#1e3a8a',    // Deep ocean blue for focus states
    subtle: '#F9FAFB',    // Almost invisible border
  },
  
  interactive: {
    primary: '#1e3a8a',     // Deep ocean blue for buttons/active states
    primaryHover: '#1e40af', // Darker ocean blue for hover
    secondary: '#9f6496',   // Vibrant purple for secondary actions
    disabled: '#D1D5DB',    // Modern disabled gray
    accent: '#a78bfa',      // Light purple accent
  },
  
  game: {
    // Game-specific colors - Modern and clean
    cellDefault: '#FFFFFF',      // Pure white for empty cells
    cellNumber: '#f8fafc',       // Very light blue-gray for numbered cells
    cellActive: '#9f6496',       // Vibrant purple for currently selected cell
    cellDrawn: '#1e3a8a',        // Deep ocean blue for drawn path
    cellHighlight: '#e0e7ff',    // Very light blue for highlights
    
    // Path and line colors
    pathStroke: '#1e3a8a',       // Deep ocean blue for drawn lines
    pathComplete: '#9f6496',     // Vibrant purple for completed paths
    pathGlow: 'rgba(30, 58, 138, 0.3)', // Subtle ocean blue glow effect
    
    // UI elements
    gridBackground: '#FFFFFF',    // Pure white grid background
    gridBorder: '#F3F4F6',       // Very subtle border
    shadow: 'rgba(0, 0, 0, 0.08)', // Modern subtle shadow
    cardShadow: 'rgba(0, 0, 0, 0.04)', // Even subtler card shadow
  },
  
  feedback: {
    // Modern feedback colors
    success: '#0fac78d0',        // Modern green
    successLight: '#D1FAE5',   // Light success background
    warning: '#c4810cff',        // Modern amber
    warningLight: '#FEF3C7',   // Light warning background
    error: '#9e2828ff',          // Modern red
    errorLight: '#FEE2E2',     // Light error background
    info: '#3B82F6',           // Modern blue
    infoLight: '#DBEAFE',      // Light info background
  },
  
  // Opacity variants for overlays and states
  opacity: {
    overlay: 'rgba(30, 58, 138, 0.95)',     // Deep ocean blue overlay
    highlight: 'rgba(139, 92, 246, 0.15)',  // Vibrant purple highlight
    disabled: 'rgba(107, 114, 128, 0.5)',  // Modern gray disabled
    hover: 'rgba(30, 58, 138, 0.08)',       // Subtle ocean blue hover state
    pressed: 'rgba(30, 58, 138, 0.12)',     // Ocean blue pressed state
  },
} as const;

// Type safety for color usage
export type ColorKey = keyof typeof colors;
export type PrimaryColor = keyof typeof colors.primary;
export type GameColor = keyof typeof colors.game;

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Design tokens for consistent spacing and sizing
export const designTokens = {
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    xxl: 16,
    full: 9999,
  },
  
  elevation: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    subtle: {
      shadowColor: colors.game.cardShadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 1,
    },
    low: {
      shadowColor: colors.game.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: colors.game.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    high: {
      shadowColor: colors.game.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 8,
    },
    highest: {
      shadowColor: colors.game.shadow,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 12,
    },
  },
  
  spacing: {
    px: 1,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 48,
  },
  
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      xxxxl: 48,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  transitions: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
} as const;