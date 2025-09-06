import React, { useState } from 'react';
import { View } from 'react-native';
import LevelSelectionScreen from '../screens/LevelSelectionScreen';
import PuzzlePacksScreen from '../screens/PuzzlePacksScreen';
import PackPuzzlesScreen from '../screens/PackPuzzlesScreen';
import GameScreen from '../screens/GameScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import HelpTutorialScreen from '../screens/HelpTutorialScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import { Level } from '../utils/levels';
import { PuzzlePack, Puzzle } from '../types';

type NavigationState = 
  | { screen: 'levelSelection' }
  | { screen: 'puzzlePacks' }
  | { screen: 'packPuzzles'; pack: PuzzlePack }
  | { screen: 'game'; level?: Level; puzzle?: Puzzle; gameMode: 'level' | 'pack' }
  | { screen: 'statistics' }
  | { screen: 'achievements' }
  | { screen: 'helpTutorial' }
  | { screen: 'contactUs' }
  | { screen: 'privacyPolicy' }
  | { screen: 'termsOfService' };

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

  const handleNavigateToStatistics = () => {
    setNavigationState({ screen: 'statistics' });
  };

  const handleNavigateToAchievements = () => {
    setNavigationState({ screen: 'achievements' });
  };

  const handleNavigateToHelpTutorial = () => {
    setNavigationState({ screen: 'helpTutorial' });
  };

  const handleNavigateToContactUs = () => {
    setNavigationState({ screen: 'contactUs' });
  };

  const handleNavigateToPrivacyPolicy = () => {
    setNavigationState({ screen: 'privacyPolicy' });
  };

  const handleNavigateToTermsOfService = () => {
    setNavigationState({ screen: 'termsOfService' });
  };


  const handleLevelComplete = async (levelId: number, completionTime: number) => {
    // Pack unlock notifications are handled in GameScreen
    // This handler is kept for future navigation logic if needed
  };

  const handlePuzzleComplete = (puzzleId: string, completionTime: number) => {
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
            onNavigateToStatistics={handleNavigateToStatistics}
            onNavigateToAchievements={handleNavigateToAchievements}
            onNavigateToHelpTutorial={handleNavigateToHelpTutorial}
            onNavigateToContactUs={handleNavigateToContactUs}
            onNavigateToPrivacyPolicy={handleNavigateToPrivacyPolicy}
            onNavigateToTermsOfService={handleNavigateToTermsOfService}
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

      case 'statistics':
        return <StatisticsScreen onBack={handleBackToLevels} />;

      case 'achievements':
        return <AchievementsScreen onBack={handleBackToLevels} />;

      case 'helpTutorial':
        return <HelpTutorialScreen onBack={handleBackToLevels} />;

      case 'contactUs':
        return <ContactUsScreen onBack={handleBackToLevels} />;

      case 'privacyPolicy':
        return <PrivacyPolicyScreen onBack={handleBackToLevels} />;

      case 'termsOfService':
        return <TermsOfServiceScreen onBack={handleBackToLevels} />;

      default:
        return null;
    }
  };

  return <View style={{ flex: 1 }}>{renderCurrentScreen()}</View>;
};

export default AppNavigator;