import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { useAppSettings } from '../contexts/AppProviders';
import { TYPOGRAPHY, BORDER_RADIUS, SPACING } from '../core/theme/themeSystem';
import { getUserProgress } from '../core/services/userService';
import { calculateAchievementProgress, initializeAchievements, getAchievementStats } from '../core/services/achievementService';
import { AchievementProgress, AchievementStats } from '../core/models/achievement';
import ThemeLoadingView from '../components/ThemeLoadingView';
import { useAuth } from '../contexts/AuthContext';


interface AchievementItemProps {
  title: string;
  description: string;
  isUnlocked: boolean;
  progress?: number;
  total?: number;
  icon: string;
  colors: any;
}

const AchievementItem: React.FC<AchievementItemProps> = ({
  title,
  description,
  isUnlocked,
  progress,
  total,
  icon,
  colors,
}) => {
  const styles = createItemStyles(colors);
  
  return (
    <View style={[styles.achievementCard, !isUnlocked && styles.lockedCard]}>
      <View style={styles.iconContainer}>
        <Text style={[styles.icon, !isUnlocked && styles.lockedIcon]}>
          {isUnlocked ? icon : '🔒'}
        </Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, !isUnlocked && styles.lockedText]}>
          {title}
        </Text>
        <Text style={[styles.description, !isUnlocked && styles.lockedDescription]}>
          {description}
        </Text>
        
        {progress !== undefined && total && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min((progress / total) * 100, 100)}%` },
                  !isUnlocked && styles.lockedProgress
                ]} 
              />
            </View>
            <Text style={[styles.progressText, !isUnlocked && styles.lockedText]}>
              {progress}/{total}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

interface AchievementsScreenProps {
  onBack?: () => void;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ onBack }) => {
  const { colors } = useAppSettings();
  const { user } = useAuth();
  const styles = createStyles(colors);
  const [achievements, setAchievements] = useState<AchievementProgress[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setLoading(false);
          return;
        }

        // Initialize achievements in Firestore if they don't exist
        await initializeAchievements();
        
        // Get user progress
        const userProgress = await getUserProgress();
        if (!userProgress) {
          setLoading(false);
          return;
        }

        // Calculate achievement progress based on user data
        const [achievementProgress, achievementStats] = await Promise.all([
          calculateAchievementProgress(userProgress),
          getAchievementStats(user.uid)
        ]);

        setAchievements(achievementProgress);
        setStats(achievementStats);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [user]);


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemeLoadingView />
        </View>
      </SafeAreaView>
    );
  }

  if (!user || achievements.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load achievements</Text>
          <Text style={styles.errorSubtext}>
            {!user ? 'Please sign in to view achievements' : 'Please check your connection and try again'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {onBack && (
            <Pressable style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>←</Text>
            </Pressable>
          )}
          <Text style={styles.headerTitle}>Achievements</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {achievements.filter(a => a.isUnlocked).length} of {achievements.length} unlocked
          {stats && (
            <Text style={styles.pointsText}> • {stats.totalPoints} points</Text>
          )}
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {achievements.map((achievement) => (
          <AchievementItem
            key={achievement.achievementId}
            title={achievement.title}
            description={achievement.description}
            isUnlocked={achievement.isUnlocked}
            progress={achievement.progress}
            total={achievement.maxProgress}
            icon={achievement.icon}
            colors={colors}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.background?.primary || '#F8F8FF',
  },
  header: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors?.border?.primary || '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: colors?.background?.surface || '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    color: colors?.text?.primary || '#161618',
    fontWeight: TYPOGRAPHY.fontWeights.bold,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xxxl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: colors?.text?.primary || '#161618',
    flex: 1,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.text?.muted || '#64748b',
  },
  pointsText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.primary?.purple || '#6366f1',
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.primary || '#161618',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  errorSubtext: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.text?.muted || '#64748b',
    textAlign: 'center',
  },
});

const createItemStyles = (colors: any) => StyleSheet.create({
  achievementCard: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  lockedCard: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: colors?.primary?.purple || '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  icon: {
    fontSize: 24,
  },
  lockedIcon: {
    opacity: 0.5,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.primary || '#161618',
    marginBottom: SPACING.xs,
  },
  lockedText: {
    color: colors?.text?.muted || '#64748b',
  },
  description: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: colors?.text?.muted || '#64748b',
    lineHeight: TYPOGRAPHY.lineHeights.normal * TYPOGRAPHY.fontSizes.sm,
    marginBottom: SPACING.md,
  },
  lockedDescription: {
    opacity: 0.7,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors?.border?.subtle || '#F9FAFB',
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors?.primary?.purple || '#6366f1',
    borderRadius: BORDER_RADIUS.sm,
  },
  lockedProgress: {
    backgroundColor: colors?.text?.muted || '#64748b',
  },
  progressText: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: colors?.text?.primary || '#161618',
    minWidth: 40,
    textAlign: 'right',
  },
});

export default AchievementsScreen;