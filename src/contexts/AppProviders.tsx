import React, { ReactNode, useEffect } from 'react';
import { SettingsProvider, useSettings } from './SettingsContext';
import { ThemeProvider, useAppTheme } from './ThemeContext';

// Inner component that syncs Settings with Theme
const ThemeSettingsSync: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isDarkMode } = useSettings();
  const { setTheme } = useAppTheme();

  // Sync theme manager with settings context
  useEffect(() => {
    setTheme(isDarkMode);
  }, [isDarkMode, setTheme]);


  // We can add the enhanced toggle function to the context if needed
  // For now, just ensure sync and render children
  return <>{children}</>;
};

// Combined provider that handles both Settings and Theme
export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <ThemeSettingsSync>
          {children}
        </ThemeSettingsSync>
      </ThemeProvider>
    </SettingsProvider>
  );
};

// Hook that provides both theme and settings with proper sync
export const useAppSettings = () => {
  const settings = useSettings();
  const theme = useAppTheme();

  // Enhanced toggle that updates both contexts
  const toggleDarkMode = (): boolean => {
    const newIsDark = !settings.isDarkMode;
    settings.setIsDarkMode(newIsDark);
    theme.setTheme(newIsDark);
    return newIsDark;
  };

  return {
    ...settings,
    ...theme,
    toggleDarkMode,
  };
};