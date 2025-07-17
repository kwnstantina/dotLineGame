import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LevelSelectionScreen from './screens/LevelSelectionScreen';
import GameScreen from './screens/GameScreen';
import AuthScreen from './screens/AuthScreen';
import { Level } from './utils/levels';
import { SnackbarProvider } from './components/SnackbarProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeFirebase } from './utils/firebase';
import LoadingView from './components/LoadingView';

type AppScreen = 'levelSelection' | 'game';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('levelSelection');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    setCurrentScreen('game');
  };

  const handleBackToLevels = () => {
    setCurrentScreen('levelSelection');
    setSelectedLevel(null);
  };

  useEffect(() => {
    initializeFirebase();
  }, []);

  if (isLoading) {
    const fadeAnim = new Animated.Value(0);
    return <LoadingView fadeAnim={fadeAnim} />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <View style={styles.container}>
      {currentScreen === 'levelSelection' ? (
        <LevelSelectionScreen onLevelSelect={handleLevelSelect} />
      ) : (
        <GameScreen
          level={selectedLevel || undefined}
          onBackToLevels={handleBackToLevels}
        />
      )}
    </View>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <AppContent />
      </SnackbarProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;