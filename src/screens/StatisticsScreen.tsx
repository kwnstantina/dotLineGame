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
import { getStatisticsData, StatisticsData, LeaderboardEntry, BestTimeEntry } from '../core/services/statisticsService';
import ThemeLoadingView from '../components/ThemeLoadingView';

interface StatisticsScreenProps {
  onBack?: () => void;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  colors: any;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, colors }) => {
  const styles = createStatCardStyles(colors);
  
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

interface LeaderboardCardProps {
  title: string;
  entries: LeaderboardEntry[];
  icon: string;
  colors: any;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ title, entries, icon, colors }) => {
  const styles = createLeaderboardStyles(colors);
  
  return (
    <View style={styles.leaderboardCard}>
      <View style={styles.leaderboardHeader}>
        <Text style={styles.leaderboardIcon}>{icon}</Text>
        <Text style={styles.leaderboardTitle}>{title}</Text>
      </View>
      
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No data available</Text>
        </View>
      ) : (
        entries.slice(0, 5).map((entry) => (
          <View 
            key={entry.userId} 
            style={[styles.leaderboardEntry, entry.isCurrentUser && styles.currentUserEntry]}
          >
            <View style={styles.rankContainer}>
              <Text style={[styles.rankText, entry.isCurrentUser && styles.currentUserText]}>
                #{entry.rank}
              </Text>
            </View>
            <View style={styles.entryContent}>
              <Text style={[styles.entryName, entry.isCurrentUser && styles.currentUserText]} numberOfLines={1}>
                {entry.displayName}
              </Text>
            </View>
            <Text style={[styles.entryValue, entry.isCurrentUser && styles.currentUserText]}>
              {entry.value.toLocaleString()}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

interface BestTimesCardProps {
  title: string;
  entries: BestTimeEntry[];
  icon: string;
  colors: any;
}

const BestTimesCard: React.FC<BestTimesCardProps> = ({ title, entries, icon, colors }) => {
  const styles = createBestTimesStyles(colors);
  
  const formatTime = (milliseconds: number): string => {
    // Handle invalid or zero values
    if (!milliseconds || milliseconds <= 0) {
      return '--';
    }
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Show decimal seconds for very fast times
    if (totalSeconds < 10) {
      const decimalSeconds = (milliseconds / 1000).toFixed(1);
      return `${decimalSeconds}s`;
    }
    
    return `${totalSeconds}s`;
  };
  
  return (
    <View style={styles.bestTimesCard}>
      <View style={styles.bestTimesHeader}>
        <Text style={styles.bestTimesIcon}>{icon}</Text>
        <Text style={styles.bestTimesTitle}>{title}</Text>
      </View>
      
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No times recorded</Text>
        </View>
      ) : (
        entries.slice(0, 5).map((entry, index) => (
          <View 
            key={`${entry.userId}-${entry.puzzleId}-${index}`} 
            style={[styles.bestTimeEntry, entry.isCurrentUser && styles.currentUserEntry]}
          >
            <View style={styles.timeRankContainer}>
              <Text style={[styles.timeRankText, entry.isCurrentUser && styles.currentUserText]}>
                #{index + 1}
              </Text>
            </View>
            <View style={styles.timeEntryContent}>
              <Text style={[styles.timeEntryName, entry.isCurrentUser && styles.currentUserText]} numberOfLines={1}>
                {entry.displayName}
              </Text>
              <View style={styles.timeDetails}>
                <Text style={[styles.timeDetailText, entry.isCurrentUser && styles.currentUserText]}>
                  {entry.stars}⭐ • {entry.efficiency}% • {entry.moveCount} moves
                </Text>
              </View>
            </View>
            <Text style={[styles.timeValue, entry.isCurrentUser && styles.currentUserText]}>
              {formatTime(entry.completionTime)}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ onBack }) => {
  const { colors } = useAppSettings();
  const styles = createStyles(colors);
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        const data = await getStatisticsData();
        setStatisticsData(data);
      } catch (error) {
        console.error('Error loading statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemeLoadingView />
        </View>
      </SafeAreaView>
    );
  }

  if (!statisticsData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load statistics</Text>
          <Text style={styles.errorSubtext}>Please check your connection and try again</Text>
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
          <Text style={styles.headerTitle}>Statistics</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Global leaderboards and best times
        </Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Global Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Global Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Players"
              value={statisticsData.globalStats.totalUsers.toLocaleString()}
              icon="👥"
              colors={colors}
            />
            <StatCard
              title="Puzzles Solved"
              value={statisticsData.globalStats.totalPuzzlesSolved.toLocaleString()}
              icon="🧩"
              colors={colors}
            />
            <StatCard
              title="Levels Completed"
              value={statisticsData.globalStats.totalLevelsSolved.toLocaleString()}
              icon="⭐"
              colors={colors}
            />
            <StatCard
              title="Average Play Time"
              value={`${statisticsData.globalStats.averagePlayTime}m`}
              subtitle="per player"
              icon="⏰"
              colors={colors}
            />
          </View>
        </View>

        {/* Leaderboards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leaderboards</Text>
          
          <LeaderboardCard
            title="Most Puzzles Completed"
            entries={statisticsData.leaderboards.puzzleCompletions}
            icon="🧩"
            colors={colors}
          />
          
          <LeaderboardCard
            title="Most Levels Completed"
            entries={statisticsData.leaderboards.levelCompletions}
            icon="⭐"
            colors={colors}
          />
          
          <LeaderboardCard
            title="Most Stars Earned"
            entries={statisticsData.leaderboards.starsEarned}
            icon="🌟"
            colors={colors}
          />
          
          <LeaderboardCard
            title="Highest Efficiency"
            entries={statisticsData.leaderboards.efficiency}
            icon="🎯"
            colors={colors}
          />
          
          <LeaderboardCard
            title="Most Achievements"
            entries={statisticsData.leaderboards.achievements}
            icon="🏆"
            colors={colors}
          />
        </View>

        {/* Best Times Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Times</Text>
          
          <BestTimesCard
            title="Fastest Puzzle Completions"
            entries={statisticsData.bestTimes.puzzles}
            icon="⚡"
            colors={colors}
          />
          
          <BestTimesCard
            title="Fastest Level Completions"
            entries={statisticsData.bestTimes.levels}
            icon="🏃"
            colors={colors}
          />
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.xxxxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xxl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: colors?.text?.primary || '#161618',
    marginBottom: SPACING.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.sm,
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

const createStatCardStyles = (colors: any) => StyleSheet.create({
  statCard: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.sm,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '45%',
    maxWidth: '48%',
    flex: 1,
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: colors?.text?.primary || '#161618',
  },
  statTitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: colors?.text?.muted || '#64748b',
    marginTop: SPACING.xs,
  },
  statSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.xs,
    color: colors?.text?.muted || '#64748b',
    opacity: 0.8,
  },
});

const createLeaderboardStyles = (colors: any) => StyleSheet.create({
  leaderboardCard: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  leaderboardIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  leaderboardTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.primary || '#161618',
    flex: 1,
  },
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors?.border?.subtle || '#F9FAFB',
  },
  currentUserEntry: {
    backgroundColor: colors?.primary?.purple + '10' || 'rgba(99, 102, 241, 0.1)',
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.muted || '#64748b',
  },
  entryContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  entryName: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: colors?.text?.primary || '#161618',
  },
  entryValue: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: colors?.primary?.purple || '#6366f1',
  },
  currentUserText: {
    color: colors?.primary?.purple || '#6366f1',
  },
  emptyState: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.text?.muted || '#64748b',
    fontStyle: 'italic',
  },
});

const createBestTimesStyles = (colors: any) => StyleSheet.create({
  bestTimesCard: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    shadowColor: colors?.game?.shadow || 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  bestTimesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  bestTimesIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  bestTimesTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.primary || '#161618',
    flex: 1,
  },
  bestTimeEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors?.border?.subtle || '#F9FAFB',
  },
  currentUserEntry: {
    backgroundColor: colors?.primary?.purple + '10' || 'rgba(99, 102, 241, 0.1)',
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  timeRankContainer: {
    width: 40,
    alignItems: 'center',
  },
  timeRankText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: colors?.text?.muted || '#64748b',
  },
  timeEntryContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  timeEntryName: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
    color: colors?.text?.primary || '#161618',
    marginBottom: SPACING.xs,
  },
  timeDetails: {
    flexDirection: 'row',
  },
  timeDetailText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: colors?.text?.muted || '#64748b',
  },
  timeValue: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: colors?.primary?.purple || '#6366f1',
  },
  currentUserText: {
    color: colors?.primary?.purple || '#6366f1',
  },
  emptyState: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.text?.muted || '#64748b',
    fontStyle: 'italic',
  },
});

export default StatisticsScreen;