import { 
  collection, getDocs, query, orderBy, limit, where, getFirestore, doc, getDoc
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { getCurrentUser } from '../../utils/auth';
import { getCachedGlobalLeaderboards, getCachedUserStats, AggregatedUserStats, getBackgroundStatsService } from './backgroundStatsService';
import { getUserService } from './userService';

// Firestore Database Reference
const getDb = () => getFirestore(getApp());

export interface GlobalUserStats {
  userId: string;
  displayName?: string;
  email?: string;
  totalPuzzlesCompleted: number;
  totalLevelsCompleted: number;
  totalStarsEarned: number;
  totalPacksUnlocked: number;
  averageEfficiency: number;
  totalPlayTime: number;
  achievementsUnlocked: number;
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  value: number;
  rank: number;
  isCurrentUser: boolean;
}

export interface BestTimeEntry {
  userId: string;
  displayName: string;
  puzzleId: string;
  levelId?: number;
  completionTime: number;
  moveCount: number;
  efficiency: number;
  stars: number;
  completedAt: Date;
  isCurrentUser: boolean;
}

export interface UserLeaderboardData {
  userId: string;
  displayName: string;
  totalLevelsCompleted: number;
  totalPuzzlesCompleted: number;
  totalStarsEarned: number;
  averageEfficiency: number;
  achievements: number;
}

export interface StatisticsData {
  globalStats: {
    totalUsers: number;
    totalPuzzlesSolved: number;
    totalLevelsSolved: number;
    averagePlayTime: number;
  };
  leaderboards: {
    puzzleCompletions: LeaderboardEntry[];
    levelCompletions: LeaderboardEntry[];
    starsEarned: LeaderboardEntry[];
    efficiency: LeaderboardEntry[];
    achievements: LeaderboardEntry[];
  };
  bestTimes: {
    puzzles: BestTimeEntry[];
    levels: BestTimeEntry[];
  };
}

export class StatisticsService {

  // Get global user statistics (from cached aggregated data for performance)
  async getGlobalUserStats(): Promise<GlobalUserStats[]> {
    try {
      const db = getDb();
      const aggregatedStatsRef = collection(db, 'aggregatedStats');
      const querySnapshot = await getDocs(aggregatedStatsRef);
      
      const globalStats: GlobalUserStats[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          globalStats.push({
            userId: data.userId || docSnapshot.id,
            displayName: data.displayName || 'Anonymous Player',
            email: data.email,
            totalPuzzlesCompleted: data.totalPuzzlesCompleted || 0,
            totalLevelsCompleted: data.totalLevelsCompleted || 0,
            totalStarsEarned: data.totalStarsEarned || 0,
            totalPacksUnlocked: data.totalPacksUnlocked || 0,
            averageEfficiency: data.averageEfficiency || 0,
            totalPlayTime: data.totalPlayTime || 0,
            achievementsUnlocked: data.achievementsUnlocked || 0,
            lastUpdated: data.lastCalculated?.toDate() || new Date(),
          });
        }
      });

      // Fallback to userProgress collection if aggregated stats not available
      if (globalStats.length === 0) {
        return await this.getGlobalUserStatsFromUserProgress();
      }

      return globalStats;
    } catch (error) {
      console.error('Error getting global user stats from aggregated data:', error);
      return await this.getGlobalUserStatsFromUserProgress();
    }
  }

  // Fallback method to get stats from userProgress (slower)
  private async getGlobalUserStatsFromUserProgress(): Promise<GlobalUserStats[]> {
    try {
      const db = getDb();
      const userProgressRef = collection(db, 'userProgress');
      const querySnapshot = await getDocs(userProgressRef);
      
      const globalStats: GlobalUserStats[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          globalStats.push({
            userId: data.userId || docSnapshot.id,
            displayName: data.displayName || 'Anonymous Player',
            email: data.email,
            totalPuzzlesCompleted: data.totalPuzzlesCompleted || 0,
            totalLevelsCompleted: data.totalLevelsCompleted || 0,
            totalStarsEarned: data.totalStarsEarned || 0,
            totalPacksUnlocked: data.totalPacksUnlocked || 0,
            averageEfficiency: data.averageEfficiency || 0,
            totalPlayTime: data.totalPlayTime || 0,
            achievementsUnlocked: 0,
            lastUpdated: data.lastUpdated?.toDate() || new Date(),
          });
        }
      });

      return globalStats;
    } catch (error) {
      console.error('Error getting global user stats from userProgress:', error);
      return [];
    }
  }

  // Get achievement counts for all users
  async getGlobalAchievementCounts(): Promise<Map<string, number>> {
    try {
      const db = getDb();
      const userAchievementsRef = collection(db, 'userAchievements');
      const q = query(userAchievementsRef, where('isUnlocked', '==', true));
      const querySnapshot = await getDocs(q);
      
      const achievementCounts = new Map<string, number>();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data?.userId) {
          const currentCount = achievementCounts.get(data.userId) || 0;
          achievementCounts.set(data.userId, currentCount + 1);
        }
      });

      return achievementCounts;
    } catch (error) {
      console.error('Error getting achievement counts:', error);
      return new Map();
    }
  }

  // Get leaderboard for a specific metric
  async getLeaderboard(metric: 'puzzles' | 'levels' | 'stars' | 'efficiency' | 'achievements', topN: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const currentUser = getCurrentUser();
      const globalStats = await this.getGlobalUserStats();
      
      let achievementCounts = new Map<string, number>();
      if (metric === 'achievements') {
        achievementCounts = await this.getGlobalAchievementCounts();
      }

      // Add achievement counts to global stats
      const enrichedStats = globalStats.map(stat => ({
        ...stat,
        achievementsUnlocked: achievementCounts.get(stat.userId) || 0,
      }));

      // Sort based on metric
      let sortedStats: GlobalUserStats[] = [];
      switch (metric) {
        case 'puzzles':
          sortedStats = enrichedStats.sort((a, b) => b.totalPuzzlesCompleted - a.totalPuzzlesCompleted);
          break;
        case 'levels':
          sortedStats = enrichedStats.sort((a, b) => b.totalLevelsCompleted - a.totalLevelsCompleted);
          break;
        case 'stars':
          sortedStats = enrichedStats.sort((a, b) => b.totalStarsEarned - a.totalStarsEarned);
          break;
        case 'efficiency':
          sortedStats = enrichedStats.sort((a, b) => b.averageEfficiency - a.averageEfficiency);
          break;
        case 'achievements':
          sortedStats = enrichedStats.sort((a, b) => b.achievementsUnlocked - a.achievementsUnlocked);
          break;
      }

      // Get the value for each user based on metric
      const getValue = (stat: GlobalUserStats): number => {
        switch (metric) {
          case 'puzzles': return stat.totalPuzzlesCompleted;
          case 'levels': return stat.totalLevelsCompleted;
          case 'stars': return stat.totalStarsEarned;
          case 'efficiency': return stat.averageEfficiency;
          case 'achievements': return stat.achievementsUnlocked;
          default: return 0;
        }
      };

      // Create leaderboard entries
      const leaderboard: LeaderboardEntry[] = sortedStats
        .filter(stat => getValue(stat) > 0) // Only include users with progress
        .slice(0, topN)
        .map((stat, index) => ({
          userId: stat.userId,
          displayName: stat.displayName || 'Anonymous Player',
          value: getValue(stat),
          rank: index + 1,
          isCurrentUser: currentUser?.uid === stat.userId,
        }));

      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // Get best times for puzzles and levels
  async getBestTimes(type: 'puzzles' | 'levels', topN: number = 10): Promise<BestTimeEntry[]> {
    try {
      const currentUser = getCurrentUser();
      
      // Get best times from userProgress collection which has the actual data
      const bestTimes = await this.getBestTimesFromUserProgress(type, topN);
      
      if (bestTimes.length > 0) {
        return bestTimes;
      }

      // If no data from userProgress, try puzzleCompletions collection
      return await this.getBestTimesFromCompletions(type, topN);
    } catch (error) {
      console.error('Error getting best times:', error);
      return [];
    }
  }

  // Get best times from individual completion records
  private async getBestTimesFromCompletions(type: 'puzzles' | 'levels', topN: number): Promise<BestTimeEntry[]> {
    try {
      const currentUser = getCurrentUser();
      const db = getDb();
      const completionsRef = collection(db, 'puzzleCompletions');
      
      let querySnapshot;
      try {
        // Try to get ordered by completion time
        const q = query(
          completionsRef, 
          orderBy('completionTime', 'asc'), 
          limit(topN * 3)
        );
        querySnapshot = await getDocs(q);
      } catch (orderError) {
        console.warn('Could not order by completionTime, getting all documents:', orderError);
        querySnapshot = await getDocs(completionsRef);
      }
      
      const allTimes: BestTimeEntry[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data && data.completionTime && data.completionTime > 0 && data.userId) {
          const shouldInclude = type === 'levels' ? !!data.levelId : !!data.puzzleId;
          
          if (shouldInclude) {
            allTimes.push({
              userId: data.userId,
              displayName: this.getCachedDisplayName(data.userId),
              puzzleId: data.puzzleId || 'unknown',
              levelId: data.levelId,
              completionTime: data.completionTime,
              moveCount: data.moveCount || 0,
              efficiency: Math.round(data.efficiency || 0),
              stars: data.stars || 0,
              completedAt: data.completedAt?.toDate() || new Date(),
              isCurrentUser: currentUser?.uid === data.userId,
            });
          }
        }
      });

      // Sort and deduplicate
      return this.processAndDeduplicateTimes(allTimes, topN);
    } catch (error) {
      console.error('Error getting times from completions:', error);
      return [];
    }
  }

  // Get best times from user progress data (primary source)
  private async getBestTimesFromUserProgress(type: 'puzzles' | 'levels', topN: number): Promise<BestTimeEntry[]> {
    try {
      const currentUser = getCurrentUser();
      const db = getDb();
      const userProgressRef = collection(db, 'userProgress');
      const querySnapshot = await getDocs(userProgressRef);
      
      const allTimes: BestTimeEntry[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data && data.userId) {
          const userId = data.userId || docSnapshot.id;
          const displayName = this.getCachedDisplayName(userId);
          
          if (type === 'levels' && data.levelProgress) {
            // Extract level completion data
            Object.entries(data.levelProgress).forEach(([levelId, levelData]: [string, any]) => {
              if (levelData && levelData.bestTime && levelData.bestTime > 0) {
                allTimes.push({
                  userId,
                  displayName,
                  puzzleId: `level_${levelId}`,
                  levelId: parseInt(levelId, 10),
                  completionTime: levelData.bestTime,
                  moveCount: levelData.moveCount || 0,
                  efficiency: levelData.efficiency || 85,
                  stars: levelData.stars || 3,
                  completedAt: levelData.lastCompletedAt?.toDate() || data.lastUpdated?.toDate() || new Date(),
                  isCurrentUser: currentUser?.uid === userId,
                });
              }
            });
          } else if (type === 'puzzles' && data.puzzleCompletions) {
            // Extract puzzle completion data
            Object.entries(data.puzzleCompletions).forEach(([puzzleId, puzzleData]: [string, any]) => {
              if (puzzleData && puzzleData.bestTime && puzzleData.bestTime > 0) {
                allTimes.push({
                  userId,
                  displayName,
                  puzzleId,
                  levelId: puzzleData.levelId,
                  completionTime: puzzleData.bestTime,
                  moveCount: puzzleData.moveCount || 0,
                  efficiency: Math.round(puzzleData.bestEfficiency || puzzleData.efficiency || 85),
                  stars: puzzleData.bestStars || puzzleData.stars || 3,
                  completedAt: puzzleData.lastCompletedAt?.toDate() || data.lastUpdated?.toDate() || new Date(),
                  isCurrentUser: currentUser?.uid === userId,
                });
              }
            });
          }
        }
      });

      return this.processAndDeduplicateTimes(allTimes, topN);
    } catch (error) {
      console.error('Error getting best times from user progress:', error);
      return [];
    }
  }

  // Process and deduplicate times, keeping only the best for each puzzle/level
  private processAndDeduplicateTimes(allTimes: BestTimeEntry[], topN: number): BestTimeEntry[] {
    // Sort by completion time (fastest first)
    const sortedTimes = allTimes.sort((a, b) => a.completionTime - b.completionTime);
    const bestTimes: BestTimeEntry[] = [];
    const seenKeys = new Set<string>();
    
    for (const time of sortedTimes) {
      // Create unique key for each puzzle/level
      const key = time.levelId 
        ? `level_${time.levelId}` 
        : `puzzle_${time.puzzleId}`;
      
      // Only include the best time for each puzzle/level
      if (!seenKeys.has(key) && bestTimes.length < topN) {
        seenKeys.add(key);
        bestTimes.push(time);
      }
    }
    
    return bestTimes;
  }

  // Provide some fallback demo data so the UI isn't empty
  private getFallbackBestTimes(type: 'puzzles' | 'levels', topN: number): BestTimeEntry[] {
    const fallbackTimes: BestTimeEntry[] = [];
    
    // Create some sample data to demonstrate the UI
    for (let i = 0; i < Math.min(topN, 5); i++) {
      fallbackTimes.push({
        userId: `demo_user_${i}`,
        displayName: `Player ${(1000 + i).toString().slice(-3)}`,
        puzzleId: `demo_${type}_${i}`,
        levelId: type === 'levels' ? i + 1 : undefined,
        completionTime: (15 + i * 5) * 1000, // 15s, 20s, 25s, etc.
        moveCount: 12 + i * 2,
        efficiency: 95 - i * 5,
        stars: 3 - Math.floor(i / 2),
        completedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Days ago
        isCurrentUser: false,
      });
    }

    return fallbackTimes;
  }

  // Get user leaderboard data with current user highlighting
  async getUserLeaderboardData(): Promise<UserLeaderboardData | null> {
    try {
      const user = getCurrentUser();
      if (!user?.uid) return null;

      // Try to get cached aggregated stats first
      const backgroundStatsService = getBackgroundStatsService();
      const cachedStats = await backgroundStatsService.getCachedUserStats(user.uid);
      
      if (cachedStats) {
        return {
          userId: user.uid,
          displayName: cachedStats.displayName,
          totalLevelsCompleted: cachedStats.totalLevelsCompleted,
          totalPuzzlesCompleted: cachedStats.totalPuzzlesCompleted,
          totalStarsEarned: cachedStats.totalStarsEarned,
          averageEfficiency: cachedStats.averageEfficiency,
          achievements: cachedStats.achievementsUnlocked,
        };
      }

      // Fallback to real-time calculation if no cached data
      const userProgress = await getUserService().getUserProgress();
      if (!userProgress) return null;

      return {
        userId: user.uid,
        displayName: user.displayName || `Player ${user.uid.slice(-4).toUpperCase()}`,
        totalLevelsCompleted: userProgress.totalLevelsCompleted || 0,
        totalPuzzlesCompleted: userProgress.totalPuzzlesCompleted || 0,
        totalStarsEarned: userProgress.totalStarsEarned || 0,
        averageEfficiency: userProgress.averageEfficiency || 0,
        achievements: 0, // Will be populated by achievement service
      };
    } catch (error) {
      console.error('Error getting user leaderboard data:', error);
      return null;
    }
  }

  // Get comprehensive statistics data
  async getStatisticsData(): Promise<StatisticsData> {
    try {
      // Try to get cached leaderboards first for performance
      const backgroundStatsService = getBackgroundStatsService();
      const cachedLeaderboards = await backgroundStatsService.getCachedGlobalLeaderboards();
      
      if (cachedLeaderboards && cachedLeaderboards.puzzleCompletions.length > 0) {
        // Calculate total users from all leaderboards (get unique users)
        const allUserIds = new Set([
          ...cachedLeaderboards.puzzleCompletions.map(entry => entry.userId),
          ...cachedLeaderboards.levelCompletions.map(entry => entry.userId),
          ...cachedLeaderboards.starsEarned.map(entry => entry.userId),
          ...cachedLeaderboards.efficiency.map(entry => entry.userId),
          ...cachedLeaderboards.achievements.map(entry => entry.userId),
        ]);
        
        // Use cached data to build the response
        return {
          globalStats: {
            totalUsers: allUserIds.size,
            totalPuzzlesSolved: cachedLeaderboards.puzzleCompletions.reduce((sum, entry) => sum + entry.value, 0),
            totalLevelsSolved: cachedLeaderboards.levelCompletions.reduce((sum, entry) => sum + entry.value, 0),
            averagePlayTime: 0, // TODO: Calculate from cached data
          },
          leaderboards: {
            puzzleCompletions: this.addCurrentUserFlags(cachedLeaderboards.puzzleCompletions),
            levelCompletions: this.addCurrentUserFlags(cachedLeaderboards.levelCompletions),
            starsEarned: this.addCurrentUserFlags(cachedLeaderboards.starsEarned),
            efficiency: this.addCurrentUserFlags(cachedLeaderboards.efficiency),
            achievements: this.addCurrentUserFlags(cachedLeaderboards.achievements),
          },
          bestTimes: {
            puzzles: this.addCurrentUserFlagsToBestTimes(cachedLeaderboards.bestPuzzleTimes),
            levels: this.addCurrentUserFlagsToBestTimes(cachedLeaderboards.bestLevelTimes),
          },
        };
      }

      // Fallback to real-time calculation if no cached data
      const [
        globalStats,
        puzzleLeaderboard,
        levelLeaderboard,
        starsLeaderboard,
        efficiencyLeaderboard,
        achievementsLeaderboard,
        puzzleBestTimes,
        levelBestTimes,
      ] = await Promise.all([
        this.getGlobalUserStats(),
        this.getLeaderboard('puzzles'),
        this.getLeaderboard('levels'),
        this.getLeaderboard('stars'),
        this.getLeaderboard('efficiency'),
        this.getLeaderboard('achievements'),
        this.getBestTimes('puzzles'),
        this.getBestTimes('levels'),
      ]);

      const totalUsers = globalStats.length;
      const totalPuzzlesSolved = globalStats.reduce((sum, stat) => sum + stat.totalPuzzlesCompleted, 0);
      const totalLevelsSolved = globalStats.reduce((sum, stat) => sum + stat.totalLevelsCompleted, 0);
      const averagePlayTime = totalUsers > 0 
        ? Math.round(globalStats.reduce((sum, stat) => sum + stat.totalPlayTime, 0) / totalUsers / 60000) // Convert to minutes
        : 0;

      return {
        globalStats: {
          totalUsers,
          totalPuzzlesSolved,
          totalLevelsSolved,
          averagePlayTime,
        },
        leaderboards: {
          puzzleCompletions: puzzleLeaderboard,
          levelCompletions: levelLeaderboard,
          starsEarned: starsLeaderboard,
          efficiency: efficiencyLeaderboard,
          achievements: achievementsLeaderboard,
        },
        bestTimes: {
          puzzles: puzzleBestTimes,
          levels: levelBestTimes,
        },
      };
    } catch (error) {
      console.error('Error getting statistics data:', error);
      
      // Try to get fallback data from userProgress collection directly
      try {
        console.log('Attempting fallback statistics calculation...');
        const globalStats = await this.getGlobalUserStats();
        const totalUsers = globalStats.length;
        
        if (totalUsers > 0) {
          return {
            globalStats: {
              totalUsers,
              totalPuzzlesSolved: globalStats.reduce((sum, stat) => sum + stat.totalPuzzlesCompleted, 0),
              totalLevelsSolved: globalStats.reduce((sum, stat) => sum + stat.totalLevelsCompleted, 0),
              averagePlayTime: Math.round(globalStats.reduce((sum, stat) => sum + stat.totalPlayTime, 0) / totalUsers / 60000),
            },
            leaderboards: {
              puzzleCompletions: await this.getLeaderboard('puzzles'),
              levelCompletions: await this.getLeaderboard('levels'),
              starsEarned: await this.getLeaderboard('stars'),
              efficiency: await this.getLeaderboard('efficiency'),
              achievements: await this.getLeaderboard('achievements'),
            },
            bestTimes: {
              puzzles: await this.getBestTimes('puzzles'),
              levels: await this.getBestTimes('levels'),
            },
          };
        }
      } catch (fallbackError) {
        console.error('Fallback statistics also failed:', fallbackError);
      }
      
      return {
        globalStats: {
          totalUsers: 0,
          totalPuzzlesSolved: 0,
          totalLevelsSolved: 0,
          averagePlayTime: 0,
        },
        leaderboards: {
          puzzleCompletions: [],
          levelCompletions: [],
          starsEarned: [],
          efficiency: [],
          achievements: [],
        },
        bestTimes: {
          puzzles: this.getFallbackBestTimes('puzzles', 5),
          levels: this.getFallbackBestTimes('levels', 5),
        },
      };
    }
  }

  // Helper method to add current user flags to leaderboard entries
  private addCurrentUserFlags(entries: Array<{userId: string, displayName: string, value: number}>): LeaderboardEntry[] {
    const currentUser = getCurrentUser();
    return entries.map((entry, index) => ({
      userId: entry.userId,
      displayName: entry.displayName,
      value: entry.value,
      rank: index + 1,
      isCurrentUser: currentUser?.uid === entry.userId,
    }));
  }

  // Helper method to add current user flags to best time entries
  private addCurrentUserFlagsToBestTimes(entries: Array<{userId: string, displayName: string, puzzleId: string, completionTime: number, stars: number, efficiency: number, levelId?: number}>): BestTimeEntry[] {
    const currentUser = getCurrentUser();
    return entries.map(entry => ({
      userId: entry.userId,
      displayName: entry.displayName,
      puzzleId: entry.puzzleId,
      levelId: entry.levelId,
      completionTime: entry.completionTime,
      moveCount: 0, // Not available in cached data
      efficiency: entry.efficiency,
      stars: entry.stars,
      completedAt: new Date(), // TODO: Get from cached data if available
      isCurrentUser: currentUser?.uid === entry.userId,
    }));
  }

  // Helper method to get display name
  private getDisplayName(userId: string): string {
    // Create a readable player name from userId
    if (userId && userId.length >= 4) {
      return `Player ${userId.slice(-4).toUpperCase()}`;
    }
    return 'Anonymous Player';
  }

  // Cache display names to avoid repeated processing
  private displayNameCache = new Map<string, string>();

  private getCachedDisplayName(userId: string): string {
    if (!this.displayNameCache.has(userId)) {
      this.displayNameCache.set(userId, this.getDisplayName(userId));
    }
    return this.displayNameCache.get(userId)!;
  }
}

// Singleton instance
let statisticsServiceInstance: StatisticsService | null = null;

export const getStatisticsService = (): StatisticsService => {
  if (!statisticsServiceInstance) {
    statisticsServiceInstance = new StatisticsService();
  }
  return statisticsServiceInstance;
};

// Export convenience functions
export const getStatisticsData = () => getStatisticsService().getStatisticsData();
export const getLeaderboard = (metric: 'puzzles' | 'levels' | 'stars' | 'efficiency' | 'achievements', topN?: number) => 
  getStatisticsService().getLeaderboard(metric, topN);
export const getBestTimes = (type: 'puzzles' | 'levels', topN?: number) => 
  getStatisticsService().getBestTimes(type, topN);
export const getUserLeaderboardData = () => getStatisticsService().getUserLeaderboardData();