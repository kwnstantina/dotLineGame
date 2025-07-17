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

interface LevelSelectionScreenProps {
  onLevelSelect: (level: Level) => void;
}

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 140;

const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({onLevelSelect}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const levelAnimations = useRef(
    LEVELS.map(() => ({
      scale: new Animated.Value(0.95),
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  useEffect(() => {
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

    Animated.parallel(staggeredAnimations).start();
  }, []);

  const handleLevelPress = (level: Level) => {
    if (!level.unlocked) {
      if (level.requiresPayment) {
        Alert.alert(
          '💎 Premium Level',
          `Unlock "${level.name}" with premium access!`,
          [
            {text: 'Maybe Later', style: 'cancel'},
            {text: 'Unlock Premium', onPress: handlePremiumUnlock},
          ]
        );
      } else if (level.requiresAd) {
        Alert.alert(
          '📺 Watch Ad to Play',
          `Watch a ${level.adDuration}-second ad to unlock "${level.name}"?`,
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Watch Ad', onPress: () => handleAdWatch(level)},
          ]
        );
      }
      return;
    }

    // Level selection animation
    const levelIndex = LEVELS.findIndex(l => l.id === level.id);
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

    setTimeout(() => onLevelSelect(level), 400);
  };

  const handlePremiumUnlock = () => {
    // Simulate premium unlock process
    Alert.alert('Premium Feature', 'This would integrate with your payment system!');
  };

  const handleAdWatch = (level: Level) => {
    // Simulate ad watching
    Alert.alert(
      '📺 Ad Loading...',
      `Starting ${level.adDuration}-second ad...`,
      [
        {
          text: 'Skip (Debug)',
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
    return Array.from({length: 3}, (_, i) => (
      <Text key={i} style={[styles.star, {opacity: i < stars ? 1 : 0.3}]}>
        ⭐
      </Text>
    ));
  };

  const renderLevelCard = (level: Level, index: number) => {
    const isLocked = !level.unlocked;
    const gradient = getDifficultyGradient(level.difficulty);
    const animation = levelAnimations[index];

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
          activeOpacity={0.8}>
          <LinearGradient
            colors={isLocked ? ['#6B7280', '#9CA3AF'] : gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.cardGradient}>
            
            <View style={styles.cardHeader}>
              <View style={styles.levelInfo}>
                <Text style={styles.levelIcon}>{isLocked ? '🔒' : level.icon}</Text>
                <View style={styles.levelDetails}>
                  <Text style={styles.levelName}>{level.name}</Text>
                  <Text style={styles.levelDifficulty}>
                    {level.difficulty} • {level.gridSize}×{level.gridSize}
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
                  <Text style={styles.unlockText}>💎 Premium Required</Text>
                )}
                {level.requiresAd && (
                  <Text style={styles.unlockText}>📺 Watch {level.adDuration}s Ad</Text>
                )}
              </View>
            )}

            {level.bestTime && (
              <Text style={styles.bestTime}>Best: {level.bestTime}s</Text>
            )}
          </LinearGradient>
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
          title="Choose Your Challenge" 
          subtitle="Select a level to begin your journey" 
        />
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsSidebarVisible(true)}
          >
            <Text style={styles.menuButtonText}>☰</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {LEVELS.map((level, index) => renderLevelCard(level, index))}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>More levels coming soon! 🚀</Text>
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
});

export default LevelSelectionScreen;