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
  Dimensions,
} from 'react-native';
import GameGrid from '../components/GameGrid';
import {GameState} from '../types';
import {createSamplePuzzle, validatePath} from '../utils/puzzleUtils';

const {width: screenWidth} = Dimensions.get('window');

const GameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    puzzle: null,
    drawnPath: [],
    isCompleted: false,
    isLoading: false,
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
    
    if (progress < 0.3) return '#FF5722';
    if (progress < 0.7) return '#FF9800';
    return '#4CAF50';
  };

  if (gameState.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
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
        <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Failed to load puzzle</Text>
          <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={loadPuzzle}>
            <Text style={styles.buttonText}>🔄 Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalCells = gameState.puzzle.gridSize * gameState.puzzle.gridSize;
  const progressPercentage = Math.round((gameState.drawnPath.length / totalCells) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          }
        ]}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎯 Dot Line</Text>
          <Text style={styles.subtitle}>Connect • Fill • Win</Text>
        </View>
        
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>
            Draw a continuous line connecting numbers 1→2→3→4→5 that fills all cells
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progress: {progressPercentage}%</Text>
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

        {/* Game Grid */}
        <GameGrid
          cells={gameState.puzzle.cells}
          gridSize={gameState.puzzle.gridSize}
          onPathUpdate={handlePathUpdate}
          drawnPath={gameState.drawnPath}
        />

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
            disabled={gameState.drawnPath.length === 0}>
            <Text style={styles.buttonText}>🔄 Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button, 
              styles.submitButton,
              gameState.drawnPath.length === 0 && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={gameState.drawnPath.length === 0}>
            <Text style={[
              styles.buttonText,
              gameState.drawnPath.length === 0 && styles.disabledButtonText
            ]}>
              ✓ Check
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{gameState.drawnPath.length}</Text>
            <Text style={styles.statLabel}>Cells Filled</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalCells}</Text>
            <Text style={styles.statLabel}>Total Cells</Text>
          </View>
        </View>
        
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1565C0',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '500',
    marginTop: 5,
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructions: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  resetButton: {
    backgroundColor: '#FF7043',
  },
  submitButton: {
    backgroundColor: '#66BB6A',
  },
  retryButton: {
    backgroundColor: '#42A5F5',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#757575',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
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
    backgroundColor: '#1565C0',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default GameScreen;