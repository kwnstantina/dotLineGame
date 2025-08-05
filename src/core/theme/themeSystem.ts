// Modern theme system with dark mode support

// Light theme colors
const LIGHT_THEME = {
  primary: {
    black: '#212121',
    oceanWhite: '#305e88ff',
    purple: '#6366f1',
    purpleLight: '#a5b4fc',
    purpleDark: '#4338ca',
  },
  
  background: {
    primary: '#F8F8FF.',
    secondary: '#f8fafc8a',
    surface: '#f1f5f9',
    card: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.05)',
    snackbar: 'rgba(0, 0, 0, 0.85)'
  },
  
  text: {
    primary: '#161618',
    secondary: '#4338ca',
    muted: '#64748b',
    inverse: '#FFFFF0',
    accent: '#6366f1',
  },
  
  border: {
    primary: '#E5E7EB',
    secondary: '#d7dae0ff',
    accent: '#6366f1',
    subtle: '#F9FAFB',
  },
  
  interactive: {
    primary: '#212121',
    primaryHover: '#1f2937',
    secondary: '#6366f1',
    disabled: '#e2e8f0',
    accent: '#a5b4fc',
    background: '#f8fafc',
  },
  
  game: {
    cellDefault: '#ffffff',
    cellNumber: '#f8fafc',
    cellActive: '#a5b4fc',
    cellDrawn: '#6366f1',
    cellHighlight: '#e2e8f0',
    pathStroke: '#212121',
    pathComplete: '#6366f1',
    pathGlow: 'rgba(99, 102, 241, 0.3)',
    gridBackground: '#ffffff',
    gridBorder: '#f1f5f9',
    shadow: 'rgba(0, 0, 0, 0.08)',
    cardShadow: 'rgba(0, 0, 0, 0.04)',
  },
  
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
};

// Dark theme colors
const DARK_THEME = {
  primary: {
    black: '#eeebebff',
    oceanWhite: '#1e293b',
    purple: '#8b5cf6',
    purpleLight: '#c4b5fd',
    purpleDark: '#7c3aed',
  },
  
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    surface: '#334155',
    card: '#1e293b',
    overlay: 'rgba(255, 255, 255, 0.05)',
    snackbar: 'rgba(255, 255, 255, 0.85)'
  },
  
  text: {
    primary: '#f8fafc',
    secondary: '#c4b5fd',
    muted: '#94a3b8',
    inverse: '#0f172a',
    accent: '#8b5cf6',
  },
  
  border: {
    primary: '#475569',
    secondary: '#64748b',
    accent: '#8b5cf6',
    subtle: '#334155',
  },
  
  interactive: {
    primary: '#f8fafc',
    primaryHover: '#e2e8f0',
    secondary: '#8b5cf6',
    disabled: '#475569',
    accent: '#c4b5fd',
    background: '#1e293b',
  },
  
  game: {
    cellDefault: '#1e293b',
    cellNumber: '#334155',
    cellActive: '#c4b5fd',
    cellDrawn: '#8b5cf6',
    cellHighlight: '#475569',
    pathStroke: '#f8fafc',
    pathComplete: '#8b5cf6',
    pathGlow: 'rgba(139, 92, 246, 0.3)',
    gridBackground: '#1e293b',
    gridBorder: '#334155',
    shadow: 'rgba(0, 0, 0, 0.4)',
    cardShadow: 'rgba(0, 0, 0, 0.2)',
  },
  
  feedback: {
    success: '#10b981',
    successLight: '#065f46',
    warning: '#f59e0b',
    warningLight: '#92400e',
    error: '#ef4444',
    errorLight: '#991b1b',
    info: '#3b82f6',
    infoLight: '#1e40af',
  },
};

// Theme management
class ThemeManager {
  private isDarkMode = false;
  private listeners: Array<(isDark: boolean) => void> = [];

  get colors() {
    return this.isDarkMode ? DARK_THEME : LIGHT_THEME;
  }

  get isDark() {
    return this.isDarkMode;
  }

  toggle() {
    this.isDarkMode = !this.isDarkMode;
    this.notifyListeners();
    return this.isDarkMode;
  }

  setTheme(isDark: boolean) {
    this.isDarkMode = isDark;
    this.notifyListeners();
    return this.isDarkMode;
  }

  subscribe(listener: (isDark: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isDarkMode));
  }
}

// Export singleton instance
export const themeManager = new ThemeManager();

// Convenience exports
export const useTheme = () => ({
  colors: themeManager.colors,
  isDark: themeManager.isDark,
  toggle: themeManager.toggle.bind(themeManager),
  setTheme: themeManager.setTheme.bind(themeManager),
  subscribe: themeManager.subscribe.bind(themeManager),
});

// For backward compatibility
export const COLORS = themeManager.colors;

// Export individual systems that don't depend on theme
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