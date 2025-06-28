export const colors = {
  // Primary palette - Modern nature-inspired tones
  primary: {
    moss: '#2D5A3D',      // Deep Moss Green - main brand color (darker, more sophisticated)
    bark: '#8B4A2B',      // Rich Bark Brown - secondary accent
    fern: '#4A7C59',      // Forest Fern - medium green for highlights
    mushroom: '#F8F6F3',  // Light Mushroom Beige - clean background
    pebble: '#8A9BA8',    // Cool Pebble Gray - modern borders/text
  },
  
  // Semantic colors based on primary palette
  background: {
    primary: '#FAFAFA',   // Almost white with warm undertone
    secondary: '#F8F6F3', // Light mushroom
    surface: '#FFFFFF',   // Pure white for contrast
    card: '#FFFFFF',      // Card background
    overlay: 'rgba(45, 90, 61, 0.95)', // Dark moss overlay
  },
  
  text: {
    primary: '#1F2937',   // Dark gray for excellent readability
    secondary: '#2D5A3D', // Deep moss for secondary text
    muted: '#6B7280',     // Modern gray for disabled/subtle text
    inverse: '#FFFFFF',   // White text on dark backgrounds
    accent: '#8B4A2B',    // Bark brown for accents
  },
  
  border: {
    primary: '#E5E7EB',   // Light modern gray
    secondary: '#F3F4F6', // Very light gray
    accent: '#2D5A3D',    // Deep moss for focus states
    subtle: '#F9FAFB',    // Almost invisible border
  },
  
  interactive: {
    primary: '#2D5A3D',     // Deep moss for buttons/active states
    primaryHover: '#1F3A2A', // Even darker moss for hover
    secondary: '#4A7C59',   // Forest fern for secondary actions
    disabled: '#D1D5DB',    // Modern disabled gray
    accent: '#8B4A2B',      // Bark brown accent
  },
  
  game: {
    // Game-specific colors - Modern and clean
    cellDefault: '#FFFFFF',      // Pure white for empty cells
    cellNumber: '#F8F6F3',       // Very light mushroom for numbered cells
    cellActive: '#4A7C59',       // Forest fern for currently selected cell
    cellDrawn: '#2D5A3D',        // Deep moss for drawn path
    cellHighlight: '#E6F3E9',    // Very light green for highlights
    
    // Path and line colors
    pathStroke: '#2D5A3D',       // Deep moss for drawn lines
    pathComplete: '#8B4A2B',     // Rich bark for completed paths
    pathGlow: 'rgba(45, 90, 61, 0.3)', // Subtle glow effect
    
    // UI elements
    gridBackground: '#FFFFFF',    // Pure white grid background
    gridBorder: '#F3F4F6',       // Very subtle border
    shadow: 'rgba(0, 0, 0, 0.08)', // Modern subtle shadow
    cardShadow: 'rgba(0, 0, 0, 0.04)', // Even subtler card shadow
  },
  
  feedback: {
    // Modern feedback colors
    success: '#10B981',        // Modern green
    successLight: '#D1FAE5',   // Light success background
    warning: '#F59E0B',        // Modern amber
    warningLight: '#FEF3C7',   // Light warning background
    error: '#EF4444',          // Modern red
    errorLight: '#FEE2E2',     // Light error background
    info: '#3B82F6',           // Modern blue
    infoLight: '#DBEAFE',      // Light info background
  },
  
  // Opacity variants for overlays and states
  opacity: {
    overlay: 'rgba(45, 90, 61, 0.95)',     // Deep moss overlay
    highlight: 'rgba(74, 124, 89, 0.15)',  // Forest fern highlight
    disabled: 'rgba(107, 114, 128, 0.5)',  // Modern gray disabled
    hover: 'rgba(45, 90, 61, 0.08)',       // Subtle hover state
    pressed: 'rgba(45, 90, 61, 0.12)',     // Pressed state
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