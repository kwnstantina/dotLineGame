import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Animated,
  StatusBar,
} from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import GameGrid from '../components/GameGrid';
import {GameState} from '../types';
import {createSamplePuzzle, validatePath} from '../utils/puzzleUtils';
import {colors, designTokens} from '../theme/colors';


const GameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    puzzle: null,
    drawnPath: [],
    isCompleted: false,
    isLoading: true,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

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
      const puzzle = createSamplePuzzle();
      
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
    if (!gameState.puzzle) return;
    
    const isValid = validatePath(gameState.drawnPath, gameState.puzzle);
    
    if (isValid) {
      setGameState(prev => ({...prev, isCompleted: true}));
      
      // Success animation
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
      
      Alert.alert(
        '🎉 Congratulations!', 
        'Perfect! You solved the puzzle!', 
        [
          {text: 'Play Again', onPress: loadPuzzle, style: 'default'},
        ],
        {cancelable: false}
      );
    } else {
      // Error shake animation
      Animated.sequence([
        Animated.timing(slideAnim, {toValue: -10, duration: 100, useNativeDriver: true}),
        Animated.timing(slideAnim, {toValue: 10, duration: 100, useNativeDriver: true}),
        Animated.timing(slideAnim, {toValue: -5, duration: 100, useNativeDriver: true}),
        Animated.timing(slideAnim, {toValue: 0, duration: 100, useNativeDriver: true}),
      ]).start();
      
      Alert.alert(
        '❌ Not quite right!', 
        'Make sure to:\n• Connect all numbers in order (1→2→3→4→5)\n• Fill every cell\n• Keep the line continuous',
        [{text: 'Try Again', style: 'default'}]
      );
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
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingDot, {opacity: fadeAnim}]} />
          <Text style={styles.loadingText}>Loading puzzle...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!gameState.puzzle) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Failed to load puzzle</Text>
          <TouchableOpacity style={[styles.modernButton, styles.retryButton]} onPress={loadPuzzle}>
            <Text style={styles.buttonText}>🔄 Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalCells = gameState.puzzle.gridSize * gameState.puzzle.gridSize;
  const progressPercentage = Math.round((gameState.drawnPath.length / totalCells) * 100);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
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
              transform: [{translateY: slideAnim}],
            }
          ]}>
          
          {/* Modern Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🎯</Text>
              </View>
              <View style={styles.titleTextContainer}>
                <Text style={styles.title}>Dot Line</Text>
                <Text style={styles.subtitle}>Connect • Fill • Win</Text>
              </View>
            </View>
          </View>
          
          {/* Modern Instructions Card */}
          <View style={styles.instructionsCard}>
            <View style={styles.instructionsHeader}>
              <Text style={styles.instructionsTitle}>How to Play</Text>
            </View>
            <Text style={styles.instructions}>
              Draw a continuous line connecting numbers 1→2→3→4→5 that fills all cells
            </Text>
            <View style={styles.instructionsBadges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Connect</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Fill All</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Win</Text>
              </View>
            </View>
          </View>

          {/* Modern Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progress</Text>
              <View style={styles.progressBadge}>
                <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View 
                  style={[
                    styles.progressBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                      backgroundColor: getProgressColor(),
                    }
                  ]} 
                />
              </View>
            </View>
          </View>

          {/* Game Grid */}
          <View style={styles.gameGridContainer}>
            <GameGrid
              cells={gameState.puzzle.cells}
              gridSize={gameState.puzzle.gridSize}
              onPathUpdate={handlePathUpdate}
              drawnPath={gameState.drawnPath}
            />
          </View>

          {/* Modern Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[
                styles.modernButton,
                styles.secondaryButton,
                gameState.drawnPath.length === 0 && styles.disabledButton
              ]}
              onPress={handleReset}
              disabled={gameState.drawnPath.length === 0}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>🔄</Text>
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Reset</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modernButton, 
                styles.primaryButton,
                gameState.drawnPath.length === 0 && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={gameState.drawnPath.length === 0}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>✓</Text>
                <Text style={[
                  styles.buttonText,
                  styles.primaryButtonText,
                  gameState.drawnPath.length === 0 && styles.disabledButtonText
                ]}>Check Solution</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Modern Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>📊</Text>
              </View>
              <Text style={styles.statValue}>{gameState.drawnPath.length}</Text>
              <Text style={styles.statLabel}>Cells Filled</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>🎯</Text>
              </View>
              <Text style={styles.statValue}>{totalCells}</Text>
              <Text style={styles.statLabel}>Total Cells</Text>
            </View>
          </View>        
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
  header: {
    marginTop: designTokens.spacing.xl,
    marginBottom: designTokens.spacing.xxl,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: designTokens.borderRadius.xl,
    backgroundColor: colors.interactive.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.lg,
    ...designTokens.elevation.low,
  },
  icon: {
    fontSize: 28,
  },
  titleTextContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: designTokens.typography.fontSizes.xxxl,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
    lineHeight: designTokens.typography.lineHeights.tight * designTokens.typography.fontSizes.xxxl,
  },
  subtitle: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.secondary,
    fontWeight: '500',
    fontFamily: 'Nunito-Medium',
    marginTop: designTokens.spacing.xs,
  },
  instructionsCard: {
    backgroundColor: colors.background.card,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.xl,
    marginBottom: designTokens.spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...designTokens.elevation.subtle,
  },
  instructionsHeader: {
    marginBottom: designTokens.spacing.md,
  },
  instructionsTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  instructions: {
    fontSize: designTokens.typography.fontSizes.sm,
    textAlign: 'center',
    color: colors.text.muted,
    lineHeight: designTokens.typography.lineHeights.relaxed * designTokens.typography.fontSizes.sm,
    fontFamily: 'Nunito-Regular',
    marginBottom: designTokens.spacing.lg,
  },
  instructionsBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: designTokens.spacing.sm,
  },
  badge: {
    backgroundColor: colors.interactive.secondary,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
  },
  badgeText: {
    fontSize: designTokens.typography.fontSizes.xs,
    fontWeight: '600',
    color: colors.text.inverse,
    fontFamily: 'Nunito-SemiBold',
  },
  progressCard: {
    backgroundColor: colors.background.card,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.xl,
    marginBottom: designTokens.spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...designTokens.elevation.subtle,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  progressTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.text.primary,
    fontFamily: 'Nunito-SemiBold',
  },
  progressBadge: {
    backgroundColor: colors.feedback.successLight,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
  },
  progressPercentage: {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: '700',
    color: colors.feedback.success,
    fontFamily: 'Nunito-Bold',
  },
  progressBarContainer: {
    marginTop: designTokens.spacing.sm,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: colors.border.secondary,
    borderRadius: designTokens.borderRadius.lg,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: designTokens.borderRadius.lg,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: designTokens.spacing.md,
    marginVertical: designTokens.spacing.xxl,
    paddingHorizontal: designTokens.spacing.xs,
  },
  modernButton: {
    flex: 1,
    paddingVertical: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.xl,
    borderRadius: designTokens.borderRadius.xl,
    ...designTokens.elevation.low,
  },
  primaryButton: {
    backgroundColor: colors.interactive.primary,
  },
  secondaryButton: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  disabledButton: {
    backgroundColor: colors.interactive.disabled,
    borderColor: colors.interactive.disabled,
    ...designTokens.elevation.none,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: designTokens.spacing.sm,
  },
  buttonIcon: {
    fontSize: designTokens.typography.fontSizes.lg,
  },
  buttonText: {
    fontSize: designTokens.typography.fontSizes.md,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
  },
  primaryButtonText: {
    color: colors.text.inverse,
  },
  secondaryButtonText: {
    color: colors.text.primary,
  },
  disabledButtonText: {
    color: colors.text.muted,
  },
  retryButton: {
    backgroundColor: colors.interactive.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: designTokens.spacing.md,
    marginBottom: designTokens.spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...designTokens.elevation.subtle,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: colors.feedback.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  statEmoji: {
    fontSize: designTokens.typography.fontSizes.lg,
  },
  statValue: {
    fontSize: designTokens.typography.fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    fontFamily: 'Nunito-Bold',
    lineHeight: designTokens.typography.lineHeights.tight * designTokens.typography.fontSizes.xxl,
  },
  statLabel: {
    fontSize: designTokens.typography.fontSizes.xs,
    color: colors.text.muted,
    marginTop: designTokens.spacing.xs,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.interactive.primary,
    marginBottom: designTokens.spacing.lg,
  },
  loadingText: {
    fontSize: 18,
    color: colors.text.muted,
    fontWeight: '500',
    fontFamily: 'Nunito-Medium',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: colors.feedback.error,
    textAlign: 'center',
    marginBottom: designTokens.spacing.lg,
    fontFamily: 'Nunito-Medium',
  },
});

export default GameScreen;