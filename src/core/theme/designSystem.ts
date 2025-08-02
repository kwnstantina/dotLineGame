// Modern theme system with dark mode support - Re-export from themeSystem.ts
export * from './themeSystem';

// Legacy COLORS export for backward compatibility
import { themeManager } from './themeSystem';
export const COLORS = themeManager.colors;

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

// Shadow/elevation system that adapts to theme
export const getElevation = (isDark: boolean = false) => ({
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  subtle: {
    shadowColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  low: {
    shadowColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  high: {
    shadowColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  highest: {
    shadowColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
  },
});

// Default elevation export
export const ELEVATION = getElevation();

// Animation/transition system
export const TRANSITIONS = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// Component-specific constants  
export const COMPONENT_CONSTANTS = {
  headerHeight: 60,
  minCellSize: 30,
  maxCellSize: 80,
  cellBorderWidth: 1,
  touchSlop: 8,
  longPressDuration: 500,
  snackbarDuration: 3000,
  loadingSpinnerSize: 40,
  sidebarWidth: 280,
  footerHeight: 80,
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

// Helper function to get responsive spacing
export const getSpacing = (multiplier: number = 1) => {
  return Object.fromEntries(
    Object.entries({
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
    }).map(([key, value]) => [key, value * multiplier])
  );
};

// Complete design system export with theme support
export const getDesignSystem = (isDark: boolean = false) => ({
  colors: isDark ? themeManager.colors : themeManager.colors,
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
    xxxxxl: 64,
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
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
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
  elevation: getElevation(isDark),
  transitions: TRANSITIONS,
  components: COMPONENT_CONSTANTS,
  breakpoints: BREAKPOINTS,
  utils: {
    withOpacity,
    getSpacing,
  },
});

// Default design system export
export const DESIGN_SYSTEM = getDesignSystem();

// Type definitions for design system
export type ColorKey = 'primary' | 'background' | 'text' | 'border' | 'interactive' | 'game' | 'feedback';
export type SpacingKey = 'px' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl' | 'xxxxxl';
export type TypographySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl';
export type BorderRadiusKey = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';
export type ElevationKey = 'none' | 'subtle' | 'low' | 'medium' | 'high' | 'highest';