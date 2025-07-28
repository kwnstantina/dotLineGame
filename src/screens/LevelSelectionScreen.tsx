import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../theme/colors';
import {LEVELS, Level, getDifficultyGradient} from '../utils/levels';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import SolvedBadge from '../components/SolvedBadge';
import { getUserProgress, getLevelsWithProgress } from '../utils/firebase';
import { APP_STRINGS, formatPremiumUnlockMessage, formatAdUnlockMessage, formatAdLoadingMessage } from '../constants/strings';
import { useSettings } from '../contexts/SettingsContext';
import { UserProgress, FirebaseLevel } from '../utils/types';
import { levelSelectionStyles } from '../styles/levelSelectionStyles';
import useLevelAnimations from '../hooks/useLevelAnimations';

interface LevelSelectionScreenProps {
  onLevelSelect: (level: Level) => void;
  onPuzzlePacksSelect?: () => void;
  refreshTrigger?: number;
}



// Create fallback levels if Firebase data is not available
const createFallbackLevels = () =>
  LEVELS.map(level => ({
    ...level,
    unlocked: level.id <= 2 ? true : level.unlocked,
    solved: false,
  })) as (FirebaseLevel & { solved?: boolean; completionTime?: number; bestTime?: number })[];

// Create emergency levels for development or testing
const createEmergencyLevels = () => [
  {
    id: 1,
    name: 'Level 1',
    difficulty: APP_STRINGS.DIFFICULTY.BEGINNER ,
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
    difficulty:APP_STRINGS.DIFFICULTY.BEGINNER,
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
  },
] as (FirebaseLevel & { solved?: boolean; completionTime?: number; bestTime?: number })[];

const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({
  onLevelSelect,
  onPuzzlePacksSelect,
  refreshTrigger,
}) => {
  // Animation states
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // UI states
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [_userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [levelsWithProgress, setLevelsWithProgress] = useState<(FirebaseLevel & { solved?: boolean; completionTime?: number; bestTime?: number })[]>([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(true);

  // Settings context
  const { isDarkMode, setIsDarkMode, isSoundEnabled, setIsSoundEnabled } = useSettings();

  // Animations for each level card
  const levelAnimations = useLevelAnimations(levelsWithProgress.length);

  // Initial load and animation
  useEffect(() => {
    const initializeScreen = async () => {
      await loadUserProgress();
    };
    initializeScreen();
    animateScreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh progress when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) loadUserProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Animate level cards when they are loaded
  useEffect(() => {
    if (!isLoadingLevels && levelsWithProgress.length > 0 && levelAnimations.length > 0) {
      animateLevelCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingLevels, levelsWithProgress.length, levelAnimations.length]);

  // Animation helpers
  const animateScreen = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
    ]).start();
  };

  const animateLevelCards = () => {
    const staggered = levelAnimations.map((anim, idx) =>
      Animated.parallel([
        Animated.timing(anim.opacity, { toValue: 1, duration: 600, delay: idx * 100, useNativeDriver: true }),
        Animated.spring(anim.scale, { toValue: 1, tension: 100, friction: 8, delay: idx * 100, useNativeDriver: true }),
        Animated.spring(anim.translateY, { toValue: 0, tension: 100, friction: 8, delay: idx * 100, useNativeDriver: true }),
      ])
    );
    Animated.parallel(staggered).start();
  };

  // Data loading logic
  const loadUserProgress = async () => {
    setIsLoadingLevels(true);
    try {
      const levels = await getLevelsWithProgress();
      const progress = await getUserProgress();
      setUserProgress(progress);
      if (!levels || levels.length === 0) throw new Error('No levels found');
      setLevelsWithProgress(levels);
    } catch {
      try {
        setLevelsWithProgress(createFallbackLevels());
      } catch {
        setLevelsWithProgress(createEmergencyLevels());
      }
    } finally {
      setIsLoadingLevels(false);
    }
  };

  // Handlers
  const handleLevelPress = (level: Level) => {
    if (!level?.id) return;
    if (!level.unlocked) {
      if (level.requiresPayment) {
        Alert.alert(
          APP_STRINGS.LEVEL_SELECTION.PREMIUM_DIALOG_TITLE,
          formatPremiumUnlockMessage(level.name),
          [
            { text: APP_STRINGS.DIALOG_ACTIONS.MAYBE_LATER, style: 'cancel' },
            { text: APP_STRINGS.DIALOG_ACTIONS.UNLOCK_PREMIUM, onPress: handlePremiumUnlock },
          ]
        );
      } else if (level.requiresAd) {
        Alert.alert(
          APP_STRINGS.LEVEL_SELECTION.AD_DIALOG_TITLE,
          formatAdUnlockMessage(level.name, level.adDuration),
          [
            { text: APP_STRINGS.DIALOG_ACTIONS.CANCEL, style: 'cancel' },
            { text: APP_STRINGS.DIALOG_ACTIONS.WATCH_AD, onPress: () => handleAdWatch(level) },
          ]
        );
      }
      return;
    }
    const idx = levelsWithProgress.findIndex(l => l.id === level.id);
    Animated.sequence([
      Animated.timing(levelAnimations[idx].scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(levelAnimations[idx].scale, { toValue: 1.05, duration: 200, useNativeDriver: true }),
      Animated.timing(levelAnimations[idx].scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setTimeout(() => onLevelSelect(level), 400);
  };

  const handlePremiumUnlock = () => {
    Alert.alert(APP_STRINGS.PREMIUM.FEATURE_ALERT, APP_STRINGS.PREMIUM.INTEGRATION_MESSAGE);
  };

  const handleAdWatch = (level: Level) => {
    Alert.alert(
      APP_STRINGS.AD_LOADING.TITLE,
      formatAdLoadingMessage(level.adDuration),
      [
        {
          text: APP_STRINGS.DIALOG_ACTIONS.SKIP_DEBUG,
          onPress: () => onLevelSelect({ ...level, unlocked: true }),
        },
      ]
    );
  };

  // Render helpers
  const renderStars = (stars: number) =>
    Array.from({ length: stars }, (_, i) => (
      <Text key={i} style={[levelSelectionStyles.star, { opacity: i < stars ? 1 : 0.3 }]}>⭐</Text>
    ));

  const renderLevelCard = (level: Level, index: number) => {
    if (!level?.id || !level.name) return null;
    const isLocked = !level.unlocked;
    const isSolved = !!level.solved;
    const gradient = getDifficultyGradient(level.difficulty || APP_STRINGS.DIFFICULTY.BEGINNER);
    const animation = levelAnimations[index] || {
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
    };
    return (
      <Animated.View
        key={level.id}
        style={[
          levelSelectionStyles.levelCardContainer,
          {
            opacity: animation.opacity,
            transform: [{ scale: animation.scale }, { translateY: animation.translateY }],
          },
        ]}
      >
        <TouchableOpacity
          style={[levelSelectionStyles.levelCard, isLocked && levelSelectionStyles.lockedCard]}
          onPress={() => handleLevelPress(level)}
          activeOpacity={isLocked ? 1 : 0.8}
        >
          <LinearGradient
            colors={isLocked ? ['#6B7280', '#9CA3AF'] : gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={levelSelectionStyles.cardGradient}
          >
            <View style={levelSelectionStyles.cardHeader}>
              <View style={levelSelectionStyles.levelInfo}>
                <Text style={levelSelectionStyles.levelIcon}>
                  {isLocked ? '🔒' : isSolved ? '✅' : level.icon || '🎮'}
                </Text>
                <View style={levelSelectionStyles.levelDetails}>
                  <Text style={levelSelectionStyles.levelName}>
                    {level.name} {isSolved && !isLocked ? '(Replay)' : ''}
                  </Text>
                  <Text style={levelSelectionStyles.levelDifficulty}>
                    {level.difficulty || APP_STRINGS.DIFFICULTY.BEGINNER} • {level.gridSize || 3}×{level.gridSize || 3}
                  </Text>
                </View>
              </View>
              <View style={levelSelectionStyles.levelMeta}>
                <Text style={levelSelectionStyles.levelNumber}>#{level.id}</Text>
                {level.unlocked && (
                  <View style={levelSelectionStyles.starsContainer}>{renderStars(level.stars)}</View>
                )}
              </View>
            </View>
            <Text style={levelSelectionStyles.levelDescription}>{level.description}</Text>
            {!level.unlocked && (
              <View style={levelSelectionStyles.unlockInfo}>
                {level.requiresPayment && (
                  <Text style={levelSelectionStyles.unlockText}>{APP_STRINGS.LEVEL_SELECTION.PREMIUM_REQUIRED}</Text>
                )}
                {level.requiresAd && (
                  <Text style={levelSelectionStyles.unlockText}>📺 Watch {level.adDuration}s Ad</Text>
                )}
              </View>
            )}
            {typeof level.bestTime === 'number' && (
              <Text style={levelSelectionStyles.bestTime}>Best: {level.bestTime}s</Text>
            )}
          </LinearGradient>
          <SolvedBadge
            solved={!!level.solved}
            completionTime={level.completionTime}
            difficulty={level.difficulty || APP_STRINGS.DIFFICULTY.BEGINNER}
          />
          {level.unlocked && level.solved && (
            <View style={levelSelectionStyles.replayContainer}>
              <Text style={levelSelectionStyles.replayText}>🔄 Tap to replay!</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Main render
  return (
    <SafeAreaView style={levelSelectionStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <Animated.View
        style={[
          levelSelectionStyles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
        ]}
      >
        <View style={levelSelectionStyles.headerTop}>
          <AppHeader
            title={APP_STRINGS.LEVEL_SELECTION.HEADER_TITLE}
            subtitle={APP_STRINGS.LEVEL_SELECTION.HEADER_SUBTITLE}
          />
          <View style={levelSelectionStyles.headerButtons}>
            {onPuzzlePacksSelect && (
              <TouchableOpacity
                style={levelSelectionStyles.puzzlePacksButton}
                onPress={onPuzzlePacksSelect}
              >
                <Text style={levelSelectionStyles.puzzlePacksButtonText}>🧩</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={levelSelectionStyles.menuButton}
              onPress={() => setIsSidebarVisible(true)}
            >
              <Text style={levelSelectionStyles.menuButtonText}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      <ScrollView
        style={levelSelectionStyles.scrollView}
        contentContainerStyle={levelSelectionStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoadingLevels ? (
          <View style={levelSelectionStyles.loadingContainer}>
            <Text style={levelSelectionStyles.loadingText}>🔄 Loading levels from Firebase...</Text>
          </View>
        ) : (
          levelsWithProgress.map((level, index) => renderLevelCard(level, index))
        )}
        {onPuzzlePacksSelect && (
          <TouchableOpacity style={levelSelectionStyles.puzzlePacksCard} onPress={onPuzzlePacksSelect}>
            <LinearGradient
              colors={['#8B5CF6', '#A78BFA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={levelSelectionStyles.puzzlePacksGradient}
            >
              <View style={levelSelectionStyles.puzzlePacksHeader}>
                <Text style={levelSelectionStyles.puzzlePacksIcon}>🧩</Text>
                <View style={levelSelectionStyles.puzzlePacksInfo}>
                  <Text style={levelSelectionStyles.puzzlePacksTitle}>Puzzle Packs</Text>
                  <Text style={levelSelectionStyles.puzzlePacksSubtitle}>
                    {APP_STRINGS.LEVEL_SELECTION.LEVELS.EXTRA_CHALLENGES.description}
                  </Text>
                </View>
                <Text style={levelSelectionStyles.puzzlePacksArrow}>→</Text>
              </View>
              <Text style={levelSelectionStyles.puzzlePacksDescription}>
                {APP_STRINGS.LEVEL_SELECTION.UNLOCK_THEMED_PUZZLES}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        <View style={levelSelectionStyles.footer}>
          <Text style={levelSelectionStyles.footerText}>{APP_STRINGS.LEVEL_SELECTION.FOOTER_TEXT}</Text>
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

export default LevelSelectionScreen;