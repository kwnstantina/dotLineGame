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
import GameProgress from '../components/GameProgress';
import GameControls from '../components/GameControls';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import ThemeLoadingView from '../components/ThemeLoadingView';
import type { GameState } from '../core/models/game';
import type { Puzzle } from '../core/models/puzzle';
import type { Level } from '../core/models/level';
import { createSamplePuzzle } from '../core/services/puzzleService';
import { validatePuzzleCompletion } from '../core/services/validationService';
import { useAppTheme } from '../contexts/ThemeContext';
import { DESIGN_SYSTEM } from '../core/theme/designSystem';
import { useSnackbar } from '../components/SnackbarProvider';
import InstructionsModal from '../components/InstructionsModal';
import { saveLevelCompletion } from '../core/services/levelService';
import { savePuzzleCompletion } from '../core/services/userService';
import { processLevelCompletion, getPackUnlockMessage, processPuzzleCompletion, trackPuzzleReplay, shouldRedirectToPackPuzzles } from '../core/services/packProgressionService';
import { APP_STRINGS } from '../constants/strings';


export interface GameScreenProps {
  level?: Level;
  puzzle?: Puzzle; // Support for direct puzzle input from packs
  onBackToLevels?: () => void;
  onLevelComplete?: (levelId: number, completionTime: number) => void;
  onPuzzleComplete?: (puzzleId: string, completionTime: number) => void;
  gameMode?: 'level' | 'pack'; // Distinguish between level mode and pack mode
}

const GameScreen: React.FC<GameScreenProps> = (props) => {
  const { level, puzzle, onBackToLevels, onLevelComplete, onPuzzleComplete, gameMode = 'level' } = props;
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
  const [startTime, setStartTime] = useState<number | null>(null);

  const { showSnackbar } = useSnackbar();
  const { colors, isLoading: themeLoading } = useAppTheme();

  // Early return for theme loading
  if (themeLoading) {
    return <ThemeLoadingView />;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors?.background?.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: DESIGN_SYSTEM.spacing.xxxl,
    },
    content: {
      paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    },
    gameGridContainer: {
      alignItems: 'center',
      paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
      marginVertical: DESIGN_SYSTEM.spacing.lg,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    subHeaderContainer: {
      marginVertical: DESIGN_SYSTEM.spacing.md,
    },
    backButton: {
      width: 100,
      height: 22,
      borderRadius: 22,
      backgroundColor: colors?.background?.primary,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginRight: DESIGN_SYSTEM.spacing.md,
      ...DESIGN_SYSTEM.elevation.low,
    },
    backButtonText: {
      fontSize: DESIGN_SYSTEM.spacing.xl,
      color: colors?.text?.primary,
      fontWeight: 'bold',
    },
  });

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
      let puzzleToLoad: Puzzle;
      
      if (gameMode === 'pack' && puzzle) {
        // Use the provided puzzle from pack
        puzzleToLoad = puzzle;
      } else {
        // Generate a random puzzle for this level with increasing difficulty
        const levelDifficulty = level?.id ? 
          (level.id <= 2 ? 'easy' : level.id <= 4 ? 'medium' : level.id <= 6 ? 'hard' : 'expert') as 'easy' | 'medium' | 'hard' | 'expert' 
          : 'easy';
        
        puzzleToLoad = createSamplePuzzle(level?.gridSize || 5, levelDifficulty);
      }
      
      setGameState(prev => ({
        ...prev,
        puzzle: puzzleToLoad,
        drawnPath: [],
        isCompleted: false,
        isLoading: false,
      }));
      
      // Set start time when puzzle is loaded
      setStartTime(Date.now());
    }, 500);
  };

  const handlePathUpdate = (path: string[]) => {
    if (!path || !Array.isArray(path)) {
      return;
    }
    
    setGameState(prev => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        drawnPath: path,
      };
    });
  };

  const handleSubmit = () => {
    if (!gameState.puzzle || !startTime) { return; }

    // Use enhanced completion detection
    const completionResult = validatePuzzleCompletion(gameState.drawnPath, gameState.puzzle, startTime);

    if (completionResult.isValid) {
      setGameState(prev => ({ ...prev, isCompleted: true }));
      
      // Save puzzle completion to Firebase
      savePuzzleCompletion(gameState.puzzle.id, completionResult)
        .then((result: any) => {
          if (result.success) {
            console.log('Puzzle completion saved successfully');
          } else {
            console.error('Failed to save puzzle completion:', result.error);
          }
        })
        .catch((error: any) => {
          console.error('Error saving puzzle completion:', error);
        });
      
      // Save completion based on game mode
      if (gameMode === 'level' && level?.id) {
        // Save level completion to Firebase
        saveLevelCompletion(level.id, completionResult.completionTime)
          .then(result => {
            if (result.success) {
              console.log('Level completion saved successfully');
            } else {
              console.error('Failed to save level completion:', result.error);
            }
          })
          .catch(error => {
            console.error('Error saving level completion:', error);
          });
        
        // Check for pack unlocks after level completion
        processLevelCompletion(level.id)
          .then(newlyUnlockedPacks => {
            if (newlyUnlockedPacks.length > 0) {
              // Show unlock notifications for each newly unlocked pack
              newlyUnlockedPacks.forEach((packId, index) => {
                setTimeout(() => {
                  const unlockMessage = getPackUnlockMessage(packId);
                  showSnackbar(unlockMessage, 'Play Now', undefined, 4000);
                }, index * 1000); // Stagger notifications if multiple packs unlock
              });
              
              console.log('🎉 Newly unlocked packs:', newlyUnlockedPacks);
            }
          })
          .catch(error => {
            console.error('Error processing level completion for pack unlocks:', error);
          });
        
        // Check if user should be directed to pack puzzles
        shouldRedirectToPackPuzzles(level.id)
          .then(redirectInfo => {
            if (redirectInfo.shouldRedirect && redirectInfo.reason) {
              // Show suggestion to play pack puzzles
              setTimeout(() => {
                showSnackbar(
                  redirectInfo.reason || 'Try pack puzzles for more challenges!',
                  'Play Packs',
                  undefined,
                  5000
                );
              }, 2000); // Show after other notifications
              
              console.log('📦 Suggesting pack puzzles:', redirectInfo);
            }
          })
          .catch(error => {
            console.error('Error checking pack puzzle redirect:', error);
          });
        
        // Notify parent component about level completion
        if (onLevelComplete) {
          onLevelComplete(level.id, completionResult.completionTime);
        }
      } else if (gameMode === 'pack' && puzzle?.id && puzzle?.packId) {
        // Track replay information first
        trackPuzzleReplay(puzzle.id, puzzle.packId)
          .then(replayInfo => {
            // Check if this is an improvement
            const isImprovement = (replayInfo.previousBestStars && completionResult.stars > replayInfo.previousBestStars) ||
              (replayInfo.previousBestTime && completionResult.completionTime < replayInfo.previousBestTime);
            
            if (isImprovement) {
              // Show improvement notification
              const improvementMsg = replayInfo.previousBestStars && completionResult.stars > replayInfo.previousBestStars
                ? `⭐ Star Improvement! ${replayInfo.previousBestStars} → ${completionResult.stars} stars`
                : `⚡ Time Improvement! ${replayInfo.previousBestTime}s → ${completionResult.completionTime}s`;
              
              showSnackbar(improvementMsg, 'Great!', undefined, 3500);
              console.log('🎯 Puzzle improvement achieved:', improvementMsg);
            }
          })
          .catch(error => {
            console.error('Error tracking replay:', error);
          });
        
        // Track pack progression for puzzle completion
        processPuzzleCompletion(puzzle.id, puzzle.packId)
          .then(packProgress => {
            if (packProgress.packCompleted) {
              // Show pack completion notification
              showSnackbar(
                `🎉 Pack Completed! ${packProgress.totalCompleted}/${packProgress.totalPuzzles} puzzles solved`,
                'View Packs',
                undefined,
                4000
              );
              console.log('🏆 Pack completed:', puzzle.packId);
            } else {
              // Show progress update for first-time completions
              console.log(`📈 Pack progress: ${packProgress.newCompletionPercentage}% (${packProgress.totalCompleted}/${packProgress.totalPuzzles})`);
            }
          })
          .catch(error => {
            console.error('Error processing puzzle completion:', error);
          });
        
        // Notify parent component about puzzle completion
        if (onPuzzleComplete) {
          onPuzzleComplete(puzzle.id, completionResult.completionTime);
        }
      }
      
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
      
      // Enhanced success message with stars
      const starMessage = `${APP_STRINGS.GAME.SUCCESS_MESSAGE} ⭐${completionResult.stars}/3 - ${completionResult.efficiency}% efficiency`;
      showSnackbar(starMessage, APP_STRINGS.GAME.SUCCESS_ACTION, loadPuzzle, 3000);
    } else {
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -5, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
      
      // Show specific error from completion result
      const errorMessage = completionResult.errors.length > 0 ? 
        completionResult.errors[0] : APP_STRINGS.GAME.ERROR_MESSAGE;
      showSnackbar(errorMessage, APP_STRINGS.GAME.ERROR_ACTION, undefined, 5000);
    }
  };

  const handleReset = () => {
    setGameState(prev => ({
      ...prev,
      drawnPath: [],
      isCompleted: false,
    }));
    
    // Reset start time for new attempt
    setStartTime(Date.now());

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

    if (progress < 0.3) {return colors.feedback.error;}
    if (progress < 0.7) {return colors.feedback.warning;}
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
        <StatusBar barStyle="dark-content" backgroundColor={colors?.background?.primary} />
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
                  <Text style={styles.backButtonText}>{APP_STRINGS.GAME.BACK_BUTTON}</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.subHeaderContainer}>
            <GameHeader
              gridSize={gameState.puzzle.gridSize}
              level={gameMode === 'pack' ? undefined : level?.id || 1}
              onHelpPress={() => setShowInstructions(true)}
            /></View>
            <GameProgress
              cellsFilled={gameState.drawnPath.length}
              totalCells={totalCells}
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
                isPuzzleComplete={gameState.isCompleted}
              />
            </View>

            <GameControls
              drawnPathLength={gameState.drawnPath.length}
              onReset={handleReset}
              onSubmit={handleSubmit}
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

export default GameScreen;