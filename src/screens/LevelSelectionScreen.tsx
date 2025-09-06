import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSettings } from '../contexts/AppProviders';
import { LEVELS, Level } from '../utils/levels';
import Sidebar from '../components/Sidebar';
import SolvedBadge from '../components/SolvedBadge';
import { getUserProgress } from '../core/services/userService';
import { getLevelsWithProgress } from '../core/services/levelService';
import { APP_STRINGS, formatPremiumUnlockMessage, formatAdUnlockMessage, formatAdLoadingMessage } from '../constants/strings';
import { UserProgress } from '../core/models/user';
import { FirebaseLevel } from '../core/models/level';
import { createLevelSelectionStyles } from '../styles/levelSelectionStyles';
import { useSnackbar } from '../components/SnackbarProvider';
import ThemeLoadingView from '../components/ThemeLoadingView';
import BackgroundCurve from '../components/BackgroundCurve';

interface LevelSelectionScreenProps {
  onLevelSelect: (level: Level) => void;
  onPuzzlePacksSelect?: () => void;
  refreshTrigger?: number;
  onNavigateToStatistics?: () => void;
  onNavigateToAchievements?: () => void;
  onNavigateToHelpTutorial?: () => void;
  onNavigateToContactUs?: () => void;
  onNavigateToPrivacyPolicy?: () => void;
  onNavigateToTermsOfService?: () => void;
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
    difficulty: APP_STRINGS.DIFFICULTY.BEGINNER,
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
    difficulty: APP_STRINGS.DIFFICULTY.BEGINNER,
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
  onNavigateToStatistics,
  onNavigateToAchievements,
  onNavigateToHelpTutorial,
  onNavigateToContactUs,
  onNavigateToPrivacyPolicy,
  onNavigateToTermsOfService,
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

  // Theme context for colors
  const { colors, isLoading: themeLoading } = useAppSettings();

  // Early return for theme loading
  if (themeLoading) {
    return <ThemeLoadingView />;
  }

  // Validate colors object before using it
  const validateColors = (colors: any) => {
    if (!colors) return false;
    return !!(colors.background && colors.text && colors.interactive && colors.primary);
  };

  if (!validateColors(colors)) {
    console.warn('Colors not properly initialized:', colors);
    return <ThemeLoadingView />;
  }

  // Styles with theme
  const levelSelectionStyles = createLevelSelectionStyles(colors);

  // Snackbar context
  const { showSnackbar } = useSnackbar();

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

  // Animation helpers
  const animateScreen = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
    ]).start();
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
        showSnackbar(
          `${APP_STRINGS.LEVEL_SELECTION.PREMIUM_DIALOG_TITLE}: ${formatPremiumUnlockMessage(level.name)}`,
          APP_STRINGS.DIALOG_ACTIONS.UNLOCK_PREMIUM,
          handlePremiumUnlock,
          5000
        );
      } else if (level.requiresAd) {
        showSnackbar(
          `${APP_STRINGS.LEVEL_SELECTION.AD_DIALOG_TITLE}: ${formatAdUnlockMessage(level.name, level.adDuration)}`,
          APP_STRINGS.DIALOG_ACTIONS.WATCH_AD,
          () => handleAdWatch(level),
          5000
        );
      }
      return;
    }
    onLevelSelect(level);
  };

  const handlePremiumUnlock = () => {
    showSnackbar(
      `${APP_STRINGS.PREMIUM.FEATURE_ALERT}: ${APP_STRINGS.PREMIUM.INTEGRATION_MESSAGE}`,
      undefined,
      undefined,
      4000
    );
  };

  const handleAdWatch = (level: Level) => {
    showSnackbar(
      `${APP_STRINGS.AD_LOADING.TITLE}: ${formatAdLoadingMessage(level.adDuration)}`,
      APP_STRINGS.DIALOG_ACTIONS.SKIP_DEBUG,
      () => onLevelSelect({ ...level, unlocked: true }),
      6000
    );
  };

  // Enhanced render functions
  const renderStars = (difficulty: number, maxStars = 5) => {
    return Array.from({ length: maxStars }, (_, index) => (
      <Text
        key={index}
        style={[
          levelSelectionStyles.star,
          index < difficulty ? levelSelectionStyles.filledStar : levelSelectionStyles.emptyStar
        ]}
      >
        ★
      </Text>
    ));
  };

  const renderLevelCard = (level: Level, index: number) => {
    if (!level?.id || !level.name) return null;
    const isLocked = !level.unlocked;
    const isSolved = !!level.solved;
    const difficultyStars = level.stars || 1;
    const progress = 0; // Could be calculated from level completion data if available

    // Dynamic gradient colors based on level state
    const getGradientColors = () => {
      if (isSolved) {
        return ['rgba(16, 185, 129,1)', 'rgba(5, 150, 105,1)'];
      } else if (isLocked) {
        return ['rgba(75, 85, 99, 1)', 'rgba(55, 65, 81, 1)'];
      } else {
        return ['rgba(139, 92, 246, 1)', 'rgba(124, 58, 237, 1)'];
      }
    };

    return (
      <View key={level.id} style={levelSelectionStyles.levelCardContainer}>
        <TouchableOpacity
          style={[levelSelectionStyles.levelCard, isLocked && levelSelectionStyles.lockedCard]}
          onPress={() => handleLevelPress(level)}
          activeOpacity={1}
        >
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              levelSelectionStyles.cardGradient,
              isSolved && levelSelectionStyles.completedCardGradient
            ]}
          >
            <View style={levelSelectionStyles.cardHeader}>
              <View style={levelSelectionStyles.levelInfo}>
                <Text style={levelSelectionStyles.levelIcon}>
                  {isLocked ? '🔒' : level.icon || '🎯'}
                </Text>
                <View style={levelSelectionStyles.levelDetails}>
                  <Text style={levelSelectionStyles.levelName}>
                    {level.name} {isSolved && !isLocked ? '(Replay)' : ''}
                  </Text>
                  <Text style={levelSelectionStyles.levelDifficulty}>
                    {level.difficulty || APP_STRINGS.DIFFICULTY.BEGINNER} • {level.gridSize || 3}×{level.gridSize || 3}
                  </Text>
                  {level.description && (
                    <Text style={levelSelectionStyles.levelDescription}>{level.description}</Text>
                  )}
                </View>
              </View>
              <View style={levelSelectionStyles.levelMeta}>
                <Text style={levelSelectionStyles.levelNumber}>#{level.id}</Text>
                <View style={levelSelectionStyles.starsContainer}>
                  {renderStars(difficultyStars)}
                </View>
              </View>
            </View>

            {/* Progress indicator for partially completed levels */}
            {progress > 0 && progress < 100 && (
              <View style={levelSelectionStyles.progressBar}>
                <View 
                  style={[levelSelectionStyles.progressFill, { width: `${progress}%` }]}
                />
              </View>
            )}

            {/* Unlock requirements */}
            {!level.unlocked && (
              <View style={levelSelectionStyles.unlockInfo}>
                {level.requiresPayment && (
                  <Text style={levelSelectionStyles.unlockText}>💎 {APP_STRINGS.LEVEL_SELECTION.PREMIUM_REQUIRED}</Text>
                )}
                {level.requiresAd && (
                  <Text style={levelSelectionStyles.unlockText}>📺 Watch {level.adDuration}s Ad to unlock</Text>
                )}
              </View>
            )}

            {/* Best time */}
            {typeof level.bestTime === 'number' && (
              <Text style={levelSelectionStyles.bestTime}>Best: {level.bestTime}s</Text>
            )}

            {/* Replay indicator */}
            {/* {level.unlocked && level.solved && (
              <View style={levelSelectionStyles.replayContainer}>
                <Text style={levelSelectionStyles.replayText}>🔄 REPLAY</Text>
              </View>
            )} */}
          </LinearGradient>

          {/* Completion badge */}
          {isSolved && (
            <View style={levelSelectionStyles.completedBadge}>
              <Text style={levelSelectionStyles.completedBadgeText}>✓</Text>
            </View>
          )}

          {/* Lock badge */}
          {isLocked && (
            <View style={levelSelectionStyles.lockedBadge}>
              <Text style={levelSelectionStyles.lockedBadgeText}>🔒</Text>
            </View>
          )}

          <SolvedBadge
            solved={!!level.solved}
            completionTime={level.completionTime}
            difficulty={level.difficulty || APP_STRINGS.DIFFICULTY.BEGINNER}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // Main render
  return (
    <SafeAreaView style={levelSelectionStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <BackgroundCurve />     
      <Animated.View
        style={[
          levelSelectionStyles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
        ]}
      >
        <View style={levelSelectionStyles.headerTop}>
          <View style={levelSelectionStyles.headerTitle}>
            <Text style={levelSelectionStyles.mainTitle}>
              {APP_STRINGS.LEVEL_SELECTION.HEADER_TITLE}
            </Text>
            <Text style={levelSelectionStyles.subtitle}>
              {APP_STRINGS.LEVEL_SELECTION.HEADER_SUBTITLE}
            </Text>
          </View>
          
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
            <Text style={levelSelectionStyles.loadingText}>{APP_STRINGS.LOADING_ADVENTURE}</Text>
          </View>
        ) : (
          levelsWithProgress.map((level, index) => renderLevelCard(level, index))
        )}

        {onPuzzlePacksSelect && (
          <TouchableOpacity style={levelSelectionStyles.puzzlePacksCard} onPress={onPuzzlePacksSelect}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 1)', 'rgba(124, 58, 237,1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={levelSelectionStyles.puzzlePacksGradient}
            >
              <View style={levelSelectionStyles.puzzlePacksHeader}>
                <Text style={levelSelectionStyles.puzzlePacksIcon}>🧩</Text>
                <View style={levelSelectionStyles.puzzlePacksInfo}>
                  <Text style={levelSelectionStyles.puzzlePacksTitle}>{APP_STRINGS.PACKS.TITLE}</Text>
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
        onNavigateToStatistics={onNavigateToStatistics}
        onNavigateToAchievements={onNavigateToAchievements}
        onNavigateToHelpTutorial={onNavigateToHelpTutorial}
        onNavigateToContactUs={onNavigateToContactUs}
        onNavigateToPrivacyPolicy={onNavigateToPrivacyPolicy}
        onNavigateToTermsOfService={onNavigateToTermsOfService}
      />
    </SafeAreaView>
  );
};

export default LevelSelectionScreen;