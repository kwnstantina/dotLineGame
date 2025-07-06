import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Alert,
  SafeAreaView,
  Animated,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import GameGrid from '../components/GameGrid';
import GameHeader from '../components/GameHeader';
import InstructionsModal from '../components/InstructionsModal';
import ProgressCard from '../components/ProgressCard';
import GameControls from '../components/GameControls';
import GameStats from '../components/GameStats';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
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

  const [showInstructions, setShowInstructions] = useState(false);

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
    if (!gameState.puzzle) { return; }

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
    return <LoadingView fadeAnim={fadeAnim} />;
  }

  if (!gameState.puzzle) {
    return <ErrorView onRetry={loadPuzzle} />;
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
          <GameHeader 
            gridSize={gameState.puzzle.gridSize} 
            level={1} 
            onHelpPress={() => setShowInstructions(true)}
          />
          <ProgressCard 
            progressPercentage={progressPercentage}
            progressAnim={progressAnim}
            progressColor={getProgressColor()}
          />

          {/* Game Grid */}
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
});

export default GameScreen;