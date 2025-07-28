import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import LevelSelectionScreen from '../screens/LevelSelectionScreen';
import PuzzlePacksScreen from '../screens/PuzzlePacksScreen';
import PackPuzzlesScreen from '../screens/PackPuzzlesScreen';
import GameScreen from '../screens/GameScreen';
import { Level } from '../utils/levels';
import { PuzzlePack, Puzzle } from '../types';
import { checkPackProgression, getPackUnlockMessage } from '../utils/packProgression';

type NavigationState = 
  | { screen: 'levelSelection' }
  | { screen: 'puzzlePacks' }
  | { screen: 'packPuzzles'; pack: PuzzlePack }
  | { screen: 'game'; level?: Level; puzzle?: Puzzle; gameMode: 'level' | 'pack' };

const AppNavigator: React.FC = () => {
  const [navigationState, setNavigationState] = useState<NavigationState>({ screen: 'levelSelection' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLevelSelect = (level: Level) => {
    setNavigationState({ screen: 'game', level, gameMode: 'level' });
  };

  const handlePuzzlePacksSelect = () => {
    setNavigationState({ screen: 'puzzlePacks' });
  };

  const handlePackSelect = (pack: PuzzlePack) => {
    setNavigationState({ screen: 'packPuzzles', pack });
  };

  const handlePuzzleSelect = (puzzle: Puzzle) => {
    setNavigationState({ screen: 'game', puzzle, gameMode: 'pack' });
  };

  const handleBackToLevels = () => {
    setNavigationState({ screen: 'levelSelection' });
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBackToPacks = () => {
    setNavigationState({ screen: 'puzzlePacks' });
  };


  const handleLevelComplete = async (levelId: number, completionTime: number) => {
        // Check for newly unlocked puzzle packs
    try {
      const progression = await checkPackProgression(levelId);
      
      // Show notifications for newly unlocked packs
      if (progression.newlyUnlockedPacks.length > 0) {
        const packNames = progression.newlyUnlockedPacks.map(packId => {
          const message = getPackUnlockMessage(packId);
          return message;
        });
        
        Alert.alert(
          'New Content Unlocked! 🎉',
          packNames.join('\n\n'),
          [
            { text: 'Continue Playing', style: 'default' },
            { 
              text: 'Check Puzzle Packs', 
              style: 'default',
              onPress: () => setNavigationState({ screen: 'puzzlePacks' })
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error checking pack progression:', error);
    }
  };

  const handlePuzzleComplete = (puzzleId: string, completionTime: number) => {
    console.log(`Puzzle ${puzzleId} completed in ${completionTime}s`);
    // You can add logic here for pack progression tracking
  };

  const renderCurrentScreen = () => {
    switch (navigationState.screen) {
      case 'levelSelection':
        return (
          <LevelSelectionScreen
            onLevelSelect={handleLevelSelect}
            onPuzzlePacksSelect={handlePuzzlePacksSelect}
            refreshTrigger={refreshTrigger}
          />
        );

      case 'puzzlePacks':
        return (
          <PuzzlePacksScreen
            onPackSelect={handlePackSelect}
            onBackToMain={handleBackToLevels}
          />
        );

      case 'packPuzzles':
        return (
          <PackPuzzlesScreen
            pack={navigationState.pack}
            onPuzzleSelect={handlePuzzleSelect}
            onBack={handleBackToPacks}
          />
        );

      case 'game':
        if (navigationState.gameMode === 'level') {
          return (
            <GameScreen
              level={navigationState.level}
              gameMode="level"
              onBackToLevels={handleBackToLevels}
              onLevelComplete={handleLevelComplete}
            />
          );
        } else {
          return (
            <GameScreen
              puzzle={navigationState.puzzle}
              gameMode="pack"
              onBackToLevels={() => {
                // Find the pack this puzzle belongs to and go back to pack puzzles
                // For now, just go back to packs
                handleBackToPacks();
              }}
              onPuzzleComplete={handlePuzzleComplete}
            />
          );
        }

      default:
        return null;
    }
  };

  return <View style={{ flex: 1 }}>{renderCurrentScreen()}</View>;
};

export default AppNavigator;