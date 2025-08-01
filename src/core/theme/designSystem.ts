// Consolidated design system with all design tokens

// Color palette
export const COLORS = {
  // Primary palette - Ocean and purple theme
  primary: {
    ocean: '#1e3a8a',
    purple: '#5d3c64',
    oceanLight: '#2d65beff',
    purpleLight: '#9f6496',
    neutral: '#8A9BA8',
  },
  
  // Background colors
  background: {
    primary: '#FAFAFA',
    secondary: '#f8fafc',
    surface: '#dde6ed',
    card: '#FFFFFF',
    overlay: 'rgba(30, 58, 138, 0.95)',
    snackbar: 'rgba(11, 13, 19, 0.95)'
  },
  
  // Text colors
  text: {
    primary: '#1F2937',
    secondary: '#1e3a8a',
    muted: '#6B7280',
    inverse: '#FFFFFF',
    accent: '#8b5cf6',
  },
  
  // Border colors
  border: {
    primary: '#E5E7EB',
    secondary: '#d7dae0ff',
    accent: '#1e3a8a',
    subtle: '#F9FAFB',
  },
  
  // Interactive states
  interactive: {
    primary: '#1e3a8a',
    primaryHover: '#1e40af',
    secondary: '#9f6496',
    disabled: '#D1D5DB',
    accent: '#a78bfa',
  },
  
  // Game-specific colors
  game: {
    cellDefault: '#FFFFFF',
    cellNumber: '#f8fafc',
    cellActive: '#9f6496',
    cellDrawn: '#1e3a8a',
    cellHighlight: '#e0e7ff',
    pathStroke: '#1e3a8a',
    pathComplete: '#9f6496',
    pathGlow: 'rgba(30, 58, 138, 0.3)',
    gridBackground: '#FFFFFF',
    gridBorder: '#F3F4F6',
    shadow: 'rgba(0, 0, 0, 0.08)',
    cardShadow: 'rgba(0, 0, 0, 0.04)',
  },
  
  // Feedback colors
  feedback: {
    success: '#0fac78d0',
    successLight: '#D1FAE5',
    warning: '#c4810cff',
    warningLight: '#FEF3C7',
    error: '#9e2828ff',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
  },
  
  // Opacity variants
  opacity: {
    overlay: 'rgba(30, 58, 138, 0.95)',
    highlight: 'rgba(139, 92, 246, 0.15)',
    disabled: 'rgba(107, 114, 128, 0.5)',
    hover: 'rgba(30, 58, 138, 0.08)',
    pressed: 'rgba(30, 58, 138, 0.12)',
  },
} as const;

// Spacing system
export const SPACING = {
  px: 1,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 48,
  xxxxxl: 64,
} as const;

// Typography system
export const TYPOGRAPHY = {
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
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// Border radius system
export const BORDER_RADIUS = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  xxl: 16,
  full: 9999,
} as const;

// Shadow/elevation system
export const ELEVATION = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  subtle: {
    shadowColor: COLORS.game.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  low: {
    shadowColor: COLORS.game.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.game.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  high: {
    shadowColor: COLORS.game.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  highest: {
    shadowColor: COLORS.game.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// Animation/transition system
export const TRANSITIONS = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// Component-specific constants
export const COMPONENT_CONSTANTS = {
  // Header
  headerHeight: 60,
  
  // Grid and game
  minCellSize: 30,
  maxCellSize: 80,
  cellBorderWidth: 1,
  
  // Touch interactions
  touchSlop: 8,
  longPressDuration: 500,
  
  // UI feedback
  snackbarDuration: 3000,
  loadingSpinnerSize: 40,
  
  // Layout
  sidebarWidth: 280,
  footerHeight: 80,
} as const;

// Breakpoints for responsive design (if needed for tablets)
export const BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

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

// Helper function to get responsive spacing
export const getSpacing = (multiplier: number = 1) => {
  return Object.fromEntries(
    Object.entries(SPACING).map(([key, value]) => [key, value * multiplier])
  );
};

// Complete design system export
export const DESIGN_SYSTEM = {
  colors: COLORS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  borderRadius: BORDER_RADIUS,
  elevation: ELEVATION,
  transitions: TRANSITIONS,
  components: COMPONENT_CONSTANTS,
  breakpoints: BREAKPOINTS,
  utils: {
    withOpacity,
    getSpacing,
  },
} as const;

// Type definitions for design system
export type ColorKey = keyof typeof COLORS;
export type SpacingKey = keyof typeof SPACING;
export type TypographySize = keyof typeof TYPOGRAPHY.fontSizes;
export type BorderRadiusKey = keyof typeof BORDER_RADIUS;
export type ElevationKey = keyof typeof ELEVATION;