import {  createContext, useState, useContext } from "react";

// Settings Context
interface SettingsContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (value: boolean) => void;
}
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) { throw new Error('useSettings must be used within SettingsProvider');}
  return ctx;
};

const SettingsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  return (
    <SettingsContext.Provider value={{isDarkMode, setIsDarkMode, isSoundEnabled, setIsSoundEnabled}}>
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider,useSettings };