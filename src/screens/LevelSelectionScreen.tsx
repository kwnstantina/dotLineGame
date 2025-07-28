import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, designTokens} from '../theme/colors';
import {LEVELS, Level, getDifficultyGradient} from '../utils/levels';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import SolvedBadge from '../components/SolvedBadge';
import { getUserProgress, UserProgress, getLevelsWithProgress, FirebaseLevel } from '../utils/firebase';
import { APP_STRINGS, formatPremiumUnlockMessage, formatAdUnlockMessage, formatAdLoadingMessage } from '../constants/strings';

interface LevelSelectionScreenProps {
  onLevelSelect: (level: Level) => void;
  onPuzzlePacksSelect?: () => void; // Add puzzle packs navigation
  refreshTrigger?: number; // Add this to trigger refresh from parent
}

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 140;

const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({onLevelSelect, onPuzzlePacksSelect, refreshTrigger}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [_userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [levelsWithProgress, setLevelsWithProgress] = useState<(FirebaseLevel & { solved?: boolean; completionTime?: number; bestTime?: number })[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(true);

  const levelAnimations = useRef<{
    scale: Animated.Value;
    opacity: Animated.Value;
    translateY: Animated.Value;
  }[]>([]).current;

  useEffect(() => {
    // Load user progress from Firebase
    const initializeScreen = async () => {
      await loadUserProgress();
    };
    
    initializeScreen();
    
    // Initial screen animations
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered level card animations
    const staggeredAnimations = levelAnimations.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.spring(anim.scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ])
    );

    // Only start animations if we have level animations initialized
    if (levelAnimations.length > 0) {
      Animated.parallel(staggeredAnimations).start();
    }
  }, []);

  // Refresh progress when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      const refreshData = async () => {
        await loadUserProgress();
      };
      refreshData();
    }
  }, [refreshTrigger]);

  const loadUserProgress = async () => {
    try {
      setIsLoadingLevels(true);
      
      // Load levels with progress from Firebase
      const levels = await getLevelsWithProgress();
      console.log('📊 Raw levels received:', levels?.length || 0, levels);
      
      // Load user progress
      const progress = await getUserProgress();
      setUserProgress(progress);
      
      if (!levels || levels.length === 0) {
        throw new Error('No levels found');
      }
      
      setLevelsWithProgress(levels);
      
      // Initialize animations for the loaded levels
      if (levelAnimations.length !== levels.length) {
        levelAnimations.length = 0; // Clear existing animations
        [...levelAnimations,...levels.map(item => ({
          ...item,
          scale: new Animated.Value(0.95),
          opacity: new Animated.Value(0),
          translateY: new Animated.Value(20),
        }))];
      }

    } catch (error) {
      console.error('❌ Error loading levels and user progress:', error);
      
      // Fallback: try to use local levels if Firebase fails
      try {
        console.log('🔧 Attempting fallback to local levels...')
        const { LEVELS } = await import('../utils/levels');
        console.log('📦 Local levels imported:', LEVELS?.length || 0);
        
        const fallbackLevels = LEVELS.map(level => ({
          ...level,
          unlocked: level.id <= 2 ? true : level.unlocked,
          solved: false,
        })) as (FirebaseLevel & { solved?: boolean; completionTime?: number; bestTime?: number })[];
        
        setLevelsWithProgress(fallbackLevels);
        console.log('🔧 Using fallback local levels:', fallbackLevels.length);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        
        // Last resort: create some dummy levels
        console.log('🆘 Creating emergency fallback levels...');
        const emergencyLevels = [
          {
            id: 1,
            name: 'Level 1',
            difficulty: 'Beginner' as const,
            gridSize: 3,
            unlocked: true,
            requiresPayment: false,
            requiresAd: false,
            adDuration: 0,
            stars: 0,
            description: 'First level',
            icon: '🎮',
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            solved: false,
          },
          {
            id: 2,
            name: 'Level 2',
            difficulty: 'Beginner' as const,
            gridSize: 3,
            unlocked: true,
            requiresPayment: false,
            requiresAd: false,
            adDuration: 0,
            stars: 0,
            description: 'Second level',
            icon: '🎮',
            order: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
            solved: false,
          }
        ] as (FirebaseLevel & { solved?: boolean; completionTime?: number; bestTime?: number })[];
        
        setLevelsWithProgress(emergencyLevels);
        console.log('🆘 Emergency levels created:', emergencyLevels.length);
      }
    } finally {
      setIsLoadingLevels(false);
    }
  };

  const handleLevelPress = (level: Level) => {
    // Ensure level data is valid
    if (!level || !level.id) {
      return;
    }
        
    if (!level.unlocked) {
      if (level.requiresPayment) {
        Alert.alert(
          APP_STRINGS.LEVEL_SELECTION.PREMIUM_DIALOG_TITLE,
          formatPremiumUnlockMessage(level.name),
          [
            {text: APP_STRINGS.DIALOG_ACTIONS.MAYBE_LATER, style: 'cancel'},
            {text: APP_STRINGS.DIALOG_ACTIONS.UNLOCK_PREMIUM, onPress: handlePremiumUnlock},
          ]
        );
      } else if (level.requiresAd) {
        Alert.alert(
          APP_STRINGS.LEVEL_SELECTION.AD_DIALOG_TITLE,
          formatAdUnlockMessage(level.name, level.adDuration),
          [
            {text: APP_STRINGS.DIALOG_ACTIONS.CANCEL, style: 'cancel'},
            {text: APP_STRINGS.DIALOG_ACTIONS.WATCH_AD, onPress: () => handleAdWatch(level)},
          ]
        );
      }
      return;
    }

    // Level selection animation
    const levelIndex = levelsWithProgress.findIndex(l => l.id === level.id);
    Animated.sequence([
      Animated.timing(levelAnimations[levelIndex].scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(levelAnimations[levelIndex].scale, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(levelAnimations[levelIndex].scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    console.log('🎯 About to select level:', level.id);
    setTimeout(() => {
      console.log('🚀 Calling onLevelSelect for level:', level.id);
      onLevelSelect(level);
    }, 400);
  };

  const handlePremiumUnlock = () => {
    // Simulate premium unlock process
    Alert.alert(APP_STRINGS.PREMIUM.FEATURE_ALERT, APP_STRINGS.PREMIUM.INTEGRATION_MESSAGE);
  };

  const handleAdWatch = (level: Level) => {
    // Simulate ad watching
    Alert.alert(
      APP_STRINGS.AD_LOADING.TITLE,
      formatAdLoadingMessage(level.adDuration),
      [
        {
          text: APP_STRINGS.DIALOG_ACTIONS.SKIP_DEBUG,
          onPress: () => {
            // Simulate ad completion
            const updatedLevel = {...level, unlocked: true};
            onLevelSelect(updatedLevel);
          },
        },
      ]
    );
  };

  const renderStars = (stars: number) => {
    return Array.from({length: stars}, (_, i) => (
      <Text key={i} style={[styles.star, {opacity: i < stars ? 1 : 0.3}]}>
        ⭐
      </Text>
    ));
  };

  const renderLevelCard = (level: Level, index: number) => {
    // Ensure level data is valid
    if (!level || !level.id || !level.name) {
      console.warn('⚠️ Invalid level data for index', index, level);
      return null;
    }
    
    const isLocked = !level.unlocked;
    const isSolved = level.solved || false;
    const gradient = getDifficultyGradient(level.difficulty || 'Beginner');
    
    console.log(`🔍 Rendering level ${level.id}:`, { unlocked: level.unlocked, solved: isSolved, isLocked });
    
    // Ensure animation exists for this index
    const animation = levelAnimations[index] || {
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
    };

    return (
      <Animated.View
        key={level.id}
        style={[
          styles.levelCardContainer,
          {
            opacity: animation.opacity,
            transform: [
              {scale: animation.scale},
              {translateY: animation.translateY},
            ],
          },
        ]}>
        <TouchableOpacity
          style={[styles.levelCard, isLocked && styles.lockedCard]}
          onPress={() => handleLevelPress(level)}
          activeOpacity={isLocked ? 1 : 0.8}
          disabled={false} // Always allow taps - let handleLevelPress decide what to do
        >
          <LinearGradient
            colors={isLocked ? ['#6B7280', '#9CA3AF'] : gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.cardGradient}>
            
            <View style={styles.cardHeader}>
              <View style={styles.levelInfo}>
                <Text style={styles.levelIcon}>
                  {isLocked ? '🔒' : (isSolved ? '✅' : (level.icon || '🎮'))}
                </Text>
                <View style={styles.levelDetails}>
                  <Text style={styles.levelName}>
                    {level.name || 'Unnamed Level'} {isSolved && !isLocked ? '(Replay)' : ''}
                  </Text>
                  <Text style={styles.levelDifficulty}>
                    {level.difficulty || 'Beginner'} • {level.gridSize || 3}×{level.gridSize || 3}
                  </Text>
                </View>
              </View>
              
              <View style={styles.levelMeta}>
                <Text style={styles.levelNumber}>#{level.id}</Text>
                {level.unlocked && (
                  <View style={styles.starsContainer}>
                    {renderStars(level.stars)}
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.levelDescription}>{level.description}</Text>

            {!level.unlocked && (
              <View style={styles.unlockInfo}>
                {level.requiresPayment && (
                  <Text style={styles.unlockText}>{APP_STRINGS.LEVEL_SELECTION.PREMIUM_REQUIRED}</Text>
                )}
                {level.requiresAd && (
                  <Text style={styles.unlockText}>📺 Watch {level.adDuration}s Ad</Text>
                )}
              </View>
            )}

            {level.bestTime && typeof level.bestTime === 'number' && (
              <Text style={styles.bestTime}>Best: {level.bestTime}s</Text>
            )}
          </LinearGradient>
          
          {/* Solved Badge */}
          <SolvedBadge 
            solved={level.solved || false}
            completionTime={level.completionTime || undefined}
            difficulty={level.difficulty || 'Beginner'}
          />
          
          {/* Replay Hint for Solved Levels */}
          {level.unlocked && level.solved && (
            <View style={styles.replayContainer}>
              <Text style={styles.replayText}>🔄 Tap to replay!</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />   
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}, {scale: scaleAnim}],
          },
        ]}>
        <View style={styles.headerTop}>
          <AppHeader 
          title={APP_STRINGS.LEVEL_SELECTION.HEADER_TITLE}
          subtitle={APP_STRINGS.LEVEL_SELECTION.HEADER_SUBTITLE} 
        />
          <View style={styles.headerButtons}>
            {onPuzzlePacksSelect && (
              <TouchableOpacity
                style={styles.puzzlePacksButton}
                onPress={onPuzzlePacksSelect}
              >
                <Text style={styles.puzzlePacksButtonText}>🧩</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setIsSidebarVisible(true)}
            >
              <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Animated.View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {isLoadingLevels ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>🔄 Loading levels from Firebase...</Text>
          </View>
        ) : (
          levelsWithProgress.map((level, index) => renderLevelCard(level, index))
        )}
        
        {onPuzzlePacksSelect && (
          <TouchableOpacity style={styles.puzzlePacksCard} onPress={onPuzzlePacksSelect}>
            <LinearGradient
              colors={['#8B5CF6', '#A78BFA']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.puzzlePacksGradient}>
              <View style={styles.puzzlePacksHeader}>
                <Text style={styles.puzzlePacksIcon}>🧩</Text>
                <View style={styles.puzzlePacksInfo}>
                  <Text style={styles.puzzlePacksTitle}>Puzzle Packs</Text>
                  <Text style={styles.puzzlePacksSubtitle}>
                   {APP_STRINGS.LEVEL_SELECTION.LEVELS.EXTRA_CHALLENGES.description}
                  </Text>
                </View>
                <Text style={styles.puzzlePacksArrow}>→</Text>
              </View>
              <Text style={styles.puzzlePacksDescription}>
               {APP_STRINGS.LEVEL_SELECTION.UNLOCK_THEMED_PUZZLES}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>{APP_STRINGS.LEVEL_SELECTION.FOOTER_TEXT}</Text>
        </View>
      </ScrollView>
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: designTokens.spacing.xl,
    paddingTop: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing.lg,
    alignItems: 'center',
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: designTokens.spacing.md,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puzzlePacksButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.interactive.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.sm,
    ...designTokens.elevation.medium,
  },
  puzzlePacksButtonText: {
    fontSize: 20,
    color: colors.text.inverse,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...designTokens.elevation.subtle,
  },
  menuButtonText: {
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.xxxl,
  },
  levelCardContainer: {
    marginBottom: designTokens.spacing.lg,
    alignItems: 'center',
  },
  levelCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: designTokens.borderRadius.xl,
    ...designTokens.elevation.medium,
    overflow: 'visible',
  },
  lockedCard: {
    opacity: 0.7,
  },
  cardGradient: {
    flex: 1,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.lg,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  levelIcon: {
    fontSize: 32,
    marginRight: designTokens.spacing.md,
  },
  levelDetails: {
    flex: 1,
  },
  levelName: {
    fontSize: designTokens.typography.fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text.inverse,
    fontFamily: 'Nunito-Bold',
  },
  levelDifficulty: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.inverse,
    fontFamily: 'Nunito-Medium',
    opacity: 0.9,
    marginTop: designTokens.spacing.xs,
  },
  levelMeta: {
    alignItems: 'flex-end',
  },
  levelNumber: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text.inverse,
    fontFamily: 'Nunito-Bold',
    opacity: 0.8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: designTokens.spacing.xs,
  },
  star: {
    fontSize: 14,
    marginHorizontal: 1,
  },
  levelDescription: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.inverse,
    fontFamily: 'Nunito-Regular',
    opacity: 0.9,
    marginTop: designTokens.spacing.sm,
  },
  unlockInfo: {
    marginTop: designTokens.spacing.sm,
  },
  unlockText: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: colors.text.inverse,
    fontFamily: 'Nunito-SemiBold',
    opacity: 0.9,
  },
  bestTime: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: colors.text.inverse,
    fontFamily: 'Nunito-Medium',
    opacity: 0.8,
    textAlign: 'right',
    marginTop: designTokens.spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingTop: designTokens.spacing.xl,
  },
  footerText: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.secondary,
    fontFamily: 'Nunito-Medium',
    opacity: 0.7,
  },
  puzzlePacksCard: {
    width: CARD_WIDTH,
    height: 120,
    borderRadius: designTokens.borderRadius.xl,
    ...designTokens.elevation.medium,
    marginBottom: designTokens.spacing.lg,
    alignSelf: 'center',
  },
  puzzlePacksGradient: {
    flex: 1,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.lg,
    justifyContent: 'space-between',
  },
  puzzlePacksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puzzlePacksIcon: {
    fontSize: 28,
    marginRight: designTokens.spacing.md,
  },
  puzzlePacksInfo: {
    flex: 1,
  },
  puzzlePacksTitle: {
    fontSize: designTokens.typography.fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text.inverse,
    fontFamily: 'Nunito-Bold',
  },
  puzzlePacksSubtitle: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.inverse,
    fontFamily: 'Nunito-Medium',
    opacity: 0.9,
    marginTop: 2,
  },
  puzzlePacksArrow: {
    fontSize: 24,
    color: colors.text.inverse,
    fontWeight: 'bold',
  },
  puzzlePacksDescription: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: colors.text.inverse,
    fontFamily: 'Nunito-Regular',
    opacity: 0.8,
    marginTop: designTokens.spacing.sm,
  },
  replayContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: designTokens.borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.interactive.primary,
  },
  replayText: {
    fontSize: 11,
    color: colors.interactive.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: designTokens.spacing.xl * 2,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default LevelSelectionScreen;