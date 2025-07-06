import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LevelSelectionScreen from './screens/LevelSelectionScreen';
import GameScreen from './screens/GameScreen';
import { Level } from './utils/levels';
import { SnackbarProvider } from './components/SnackbarProvider';

type AppScreen = 'levelSelection' | 'game';

const App: React.FC = () => {
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

  return (
    <SnackbarProvider>
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
    </SnackbarProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;