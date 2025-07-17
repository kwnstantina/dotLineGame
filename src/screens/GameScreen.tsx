import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  SafeAreaView,
  Animated,
  StatusBar,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import GameGrid from '../components/GameGrid';
import GameHeader from '../components/GameHeader';
import ProgressCard from '../components/ProgressCard';
import GameControls from '../components/GameControls';
import GameStats from '../components/GameStats';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import { GameState } from '../types';
import { createSamplePuzzle, validatePath } from '../utils/puzzleUtils';
import { colors, designTokens } from '../theme/colors';
import { useSnackbar } from '../components/SnackbarProvider';
import { Level } from '../utils/levels';
import InstructionsModal from '../components/InstructionsModal';


export interface GameScreenProps {
  level?: Level;
  onBackToLevels?: () => void;
}

const GameScreen: React.FC<GameScreenProps> = (props) => {
  const { level, onBackToLevels } = props;
  const [gameState, setGameState] = useState<GameState>({
    puzzle: null,
    drawnPath: [],
    isCompleted: false,
    isLoading: true,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [showInstructions, setShowInstructions] = useState(false);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    loadPuzzle();
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Animate progress bar
    const totalCells = gameState.puzzle ? gameState.puzzle.gridSize * gameState.puzzle.gridSize : 25;
    const progress = gameState.drawnPath.length / totalCells;

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [gameState.drawnPath, gameState.puzzle]);

 const loadPuzzle = () => {
    setGameState(prev => ({...prev, isLoading: true}));
    // Simulate loading delay for better UX
    setTimeout(() => {
      const puzzle = createSamplePuzzle(level?.gridSize || 5);
      
      setGameState(prev => ({
        ...prev,
        puzzle,
        drawnPath: [],
        isCompleted: false,
        isLoading: false,
      }));
    }, 500);
  };

  const handlePathUpdate = (path: string[]) => {
    setGameState(prev => ({
      ...prev,
      drawnPath: path,
    }));
  };

  const handleSubmit = () => {
    if (!gameState.puzzle) { return; }

    const isValid = validatePath(gameState.drawnPath, gameState.puzzle);

    if (isValid) {
      setGameState(prev => ({ ...prev, isCompleted: true }));
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      showSnackbar('🎉 Perfect! You solved the puzzle!', 'Play Again', loadPuzzle, 4000);
    } else {
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -5, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
      showSnackbar('❌ Not quite right! Make sure to: Connect all numbers in order (1→2→3→4→5), fill every cell, and keep the line continuous.', 'Try Again', undefined, 5000);
    }
  };

  const handleReset = () => {
    setGameState(prev => ({
      ...prev,
      drawnPath: [],
      isCompleted: false,
    }));

    // Reset animation
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const getProgressColor = () => {
    const totalCells = gameState.puzzle ? gameState.puzzle.gridSize * gameState.puzzle.gridSize : 25;
    const progress = gameState.drawnPath.length / totalCells;

    if (progress < 0.3) return colors.feedback.error;
    if (progress < 0.7) return colors.feedback.warning;
    return colors.feedback.success;
  };

  if (gameState.isLoading) {
    return <LoadingView fadeAnim={fadeAnim} />;
  }

  if (!gameState.puzzle) {
    return <ErrorView onRetry={loadPuzzle} />;
  }

  const totalCells = gameState.puzzle.gridSize * gameState.puzzle.gridSize;
  const progressPercentage = Math.round((gameState.drawnPath.length / totalCells) * 100);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          nestedScrollEnabled={true}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}>
            <View style={styles.headerContainer}>
              {onBackToLevels && (
                <Pressable style={styles.backButton} onPress={onBackToLevels}>
                  <Text style={styles.backButtonText}>← Back</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.subHeaderContainer}>
            <GameHeader
              gridSize={gameState.puzzle.gridSize}
              level={level?.id || 1}
              onHelpPress={() => setShowInstructions(true)}
            /></View>
            <ProgressCard
              progressPercentage={progressPercentage}
              progressAnim={progressAnim}
              progressColor={getProgressColor()}
            />
            <View style={styles.gameGridContainer}>
              <GameGrid
                cells={gameState.puzzle.cells}
                gridSize={gameState.puzzle.gridSize}
                onPathUpdate={handlePathUpdate}
                drawnPath={gameState.drawnPath}
              />
            </View>

            <GameControls
              drawnPathLength={gameState.drawnPath.length}
              onReset={handleReset}
              onSubmit={handleSubmit}
            />

            <GameStats
              cellsFilled={gameState.drawnPath.length}
              totalCells={totalCells}
            />
            <InstructionsModal
              visible={showInstructions}
              onClose={() => setShowInstructions(false)}
              gridSize={gameState.puzzle.gridSize}
            />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: designTokens.spacing.xxxl,
  },
  content: {
    paddingHorizontal: designTokens.spacing.xl,
  },
  gameGridContainer: {
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    marginVertical: designTokens.spacing.lg,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  subHeaderContainer: {
    marginVertical: designTokens.spacing.md,
  },
  backButton: {
    width: 100,
    height: 22,
    borderRadius: 22,
    backgroundColor: colors.background.secondary,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: designTokens.spacing.md,
    ...designTokens.elevation.low,
  },
  backButtonText: {
    fontSize: designTokens.spacing.xl,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
});

export default GameScreen;