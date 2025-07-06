import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '../components/Snackbar';

interface SnackbarContextProps {
  showSnackbar: (message: string, actionLabel?: string, onAction?: () => void, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextProps>({
  showSnackbar: () => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [actionLabel, setActionLabel] = useState<string | undefined>(undefined);
  const [onAction, setOnAction] = useState<(() => void) | undefined>(undefined);
  const [duration, setDuration] = useState<number>(3000);

  const showSnackbar = useCallback((msg: string, label?: string, action?: () => void, dur?: number) => {
    setMessage(msg);
    setActionLabel(label);
    setOnAction(() => action);
    setDuration(dur || 3000);
    setVisible(true);
  }, []);

  const handleDismiss = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        message={message}
        actionLabel={actionLabel}
        onAction={() => {
          if (onAction) onAction();
          setVisible(false);
        }}
        onDismiss={handleDismiss}
        duration={duration}
      />
    </SnackbarContext.Provider>
  );
};
