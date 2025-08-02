import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { themeManager } from '../core/theme/themeSystem';
import { useSettings } from './SettingsContext';

interface ThemeContextType {
  colors: typeof themeManager.colors;
  isDark: boolean;
  isLoading: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialDarkMode?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialDarkMode = false 
}) => {
  const [colors, setColors] = useState(themeManager.colors);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set initial theme
    themeManager.setTheme(initialDarkMode);
    setColors(themeManager.colors);

    // Validate that colors are properly loaded
    const validateColors = (colors: any) => {
      return colors && 
             colors.background && 
             colors.text && 
             colors.interactive && 
             colors.primary &&
             colors.border &&
             colors.game &&
             colors.feedback;
    };

    // Set loading to false if colors are valid
    if (validateColors(themeManager.colors)) {
      setIsLoading(false);
    } else {
      console.warn('Theme colors not fully initialized');
      // Try again on next tick
      setTimeout(() => {
        setColors(themeManager.colors);
        if (validateColors(themeManager.colors)) {
          setIsLoading(false);
        }
      }, 50);
    }

    // Subscribe to theme changes
    const unsubscribe = themeManager.subscribe(() => {
      setColors(themeManager.colors);
      setIsLoading(false); // Colors are ready after theme change
    });

    return unsubscribe;
  }, [initialDarkMode]);

  const toggleTheme = () => {
    themeManager.toggle();
    setColors(themeManager.colors);
  };

  const setTheme = (darkMode: boolean) => {
    themeManager.setTheme(darkMode);
    setColors(themeManager.colors);
  };

  const value: ThemeContextType = {
    colors,
    isDark: themeManager.isDark,
    isLoading,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export for convenience
export default ThemeProvider;