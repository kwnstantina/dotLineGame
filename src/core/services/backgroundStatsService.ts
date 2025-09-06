import { 
  doc, collection, getDoc, setDoc, getDocs, query, writeBatch, getFirestore, serverTimestamp
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { getCurrentUser } from '../../utils/auth';

// Firestore Database Reference
const getDb = () => getFirestore(getApp());

// Aggregated statistics for efficient querying
export interface AggregatedUserStats {
  userId: string;
  displayName: string;
  
  // Level statistics
  totalLevelsCompleted: number;
  bestLevelTime: number; // Fastest level completion
  averageLevelTime: number;
  totalLevelPlayTime: number;
  levelEfficiencySum: number; // Sum of all level efficiencies
  levelCompletionCount: number; // Count for averaging
  
  // Puzzle statistics  
  totalPuzzlesCompleted: number;
  bestPuzzleTime: number; // Fastest puzzle completion
  averagePuzzleTime: number;
  totalPuzzlePlayTime: number;
  puzzleEfficiencySum: number; // Sum of all puzzle efficiencies
  puzzleCompletionCount: number; // Count for averaging
  
  // Overall statistics
  totalPlayTime: number;
  averageEfficiency: number; // Computed from efficiency sums
  totalStarsEarned: number;
  totalPacksUnlocked: number;
  
  // Achievement statistics
  achievementsUnlocked: number;
  
  // Update tracking
  lastCalculated: Date;
  calculationVersion: number; // For cache invalidation
}

// Global leaderboard cache for fast access
export interface GlobalLeaderboards {
  puzzleCompletions: Array<{userId: string, displayName: string, value: number}>;
  levelCompletions: Array<{userId: string, displayName: string, value: number}>;
  starsEarned: Array<{userId: string, displayName: string, value: number}>;
  efficiency: Array<{userId: string, displayName: string, value: number}>;
  achievements: Array<{userId: string, displayName: string, value: number}>;
  bestPuzzleTimes: Array<{userId: string, displayName: string, puzzleId: string, completionTime: number, stars: number, efficiency: number}>;
  bestLevelTimes: Array<{userId: string, displayName: string, levelId: number, completionTime: number, stars: number, efficiency: number}>;
  lastUpdated: Date;
}

export class BackgroundStatsService {

  // Calculate aggregated stats for a single user
  async calculateUserAggregatedStats(userId: string): Promise<AggregatedUserStats | null> {
    try {
      const db = getDb();
      const userProgressRef = doc(db, 'userProgress', userId);
      const userProgressDoc = await getDoc(userProgressRef);
      
      if (!userProgressDoc.exists()) {
        return null;
      }
      
      const data = userProgressDoc.data();
      if (!data) return null;

      // Initialize aggregation variables
      let totalLevelsCompleted = 0;
      let bestLevelTime = Infinity;
      let totalLevelPlayTime = 0;
      let levelEfficiencySum = 0;
      let levelCompletionCount = 0;
      
      let totalPuzzlesCompleted = 0;
      let bestPuzzleTime = Infinity;
      let totalPuzzlePlayTime = 0;
      let puzzleEfficiencySum = 0;
      let puzzleCompletionCount = 0;
      
      let totalStarsEarned = 0;

      // Process level progress
      if (data.levelProgress) {
        Object.entries(data.levelProgress).forEach(([levelId, levelData]: [string, any]) => {
          if (levelData && levelData.solved) {
            totalLevelsCompleted++;
            
            if (levelData.bestTime && levelData.bestTime > 0) {
              bestLevelTime = Math.min(bestLevelTime, levelData.bestTime);
              totalLevelPlayTime += levelData.bestTime;
              levelCompletionCount++;
            }
            
            if (levelData.efficiency && levelData.efficiency > 0) {
              levelEfficiencySum += levelData.efficiency;
            }
            
            if (levelData.stars && levelData.stars > 0) {
              totalStarsEarned += levelData.stars;
            }
          }
        });
      }

      // Process puzzle completions
      if (data.puzzleCompletions) {
        Object.entries(data.puzzleCompletions).forEach(([puzzleId, puzzleData]: [string, any]) => {
          if (puzzleData && puzzleData.isValid) {
            totalPuzzlesCompleted++;
            
            if (puzzleData.bestTime && puzzleData.bestTime > 0) {
              bestPuzzleTime = Math.min(bestPuzzleTime, puzzleData.bestTime);
              totalPuzzlePlayTime += puzzleData.bestTime;
              puzzleCompletionCount++;
            }
            
            if (puzzleData.bestEfficiency && puzzleData.bestEfficiency > 0) {
              puzzleEfficiencySum += puzzleData.bestEfficiency;
            } else if (puzzleData.efficiency && puzzleData.efficiency > 0) {
              puzzleEfficiencySum += puzzleData.efficiency;
            }
            
            if (puzzleData.bestStars && puzzleData.bestStars > 0) {
              totalStarsEarned += puzzleData.bestStars;
            } else if (puzzleData.stars && puzzleData.stars > 0) {
              totalStarsEarned += puzzleData.stars;
            }
          }
        });
      }

      // Calculate averages
      const averageLevelTime = levelCompletionCount > 0 ? totalLevelPlayTime / levelCompletionCount : 0;
      const averagePuzzleTime = puzzleCompletionCount > 0 ? totalPuzzlePlayTime / puzzleCompletionCount : 0;
      const totalPlayTime = totalLevelPlayTime + totalPuzzlePlayTime;
      
      // Calculate overall efficiency (weighted average)
      const totalEfficiencySum = levelEfficiencySum + puzzleEfficiencySum;
      const totalCompletionCount = levelCompletionCount + puzzleCompletionCount;
      const averageEfficiency = totalCompletionCount > 0 ? Math.round(totalEfficiencySum / totalCompletionCount) : 0;

      // Get achievement count
      const achievementsUnlocked = await this.getUserAchievementCount(userId);

      const aggregatedStats: AggregatedUserStats = {
        userId,
        displayName: data.displayName || `Player ${userId.slice(-4).toUpperCase()}`,
        
        // Level stats
        totalLevelsCompleted,
        bestLevelTime: bestLevelTime === Infinity ? 0 : bestLevelTime,
        averageLevelTime: Math.round(averageLevelTime),
        totalLevelPlayTime,
        levelEfficiencySum,
        levelCompletionCount,
        
        // Puzzle stats
        totalPuzzlesCompleted,
        bestPuzzleTime: bestPuzzleTime === Infinity ? 0 : bestPuzzleTime,
        averagePuzzleTime: Math.round(averagePuzzleTime),
        totalPuzzlePlayTime,
        puzzleEfficiencySum,
        puzzleCompletionCount,
        
        // Overall stats
        totalPlayTime,
        averageEfficiency,
        totalStarsEarned,
        totalPacksUnlocked: data.totalPacksUnlocked || 0,
        
        // Achievement stats
        achievementsUnlocked,
        
        // Tracking
        lastCalculated: new Date(),
        calculationVersion: 1,
      };

      return aggregatedStats;
    } catch (error) {
      console.error('Error calculating user aggregated stats:', error);
      return null;
    }
  }

  // Get achievement count for a user
  private async getUserAchievementCount(userId: string): Promise<number> {
    try {
      const db = getDb();
      const userAchievementsRef = collection(db, 'userAchievements');
      const querySnapshot = await getDocs(query(userAchievementsRef));
      
      let count = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === userId && data.isUnlocked) {
          count++;
        }
      });
      
      return count;
    } catch (error) {
      console.error('Error getting user achievement count:', error);
      return 0;
    }
  }

  // Update aggregated stats for a single user
  async updateUserAggregatedStats(userId: string): Promise<void> {
    try {
      const aggregatedStats = await this.calculateUserAggregatedStats(userId);
      if (!aggregatedStats) return;

      const db = getDb();
      const aggregatedStatsRef = doc(db, 'aggregatedStats', userId);
      
      await setDoc(aggregatedStatsRef, {
        ...aggregatedStats,
        lastCalculated: serverTimestamp(),
      });
      
      console.log(`Updated aggregated stats for user ${userId}`);
    } catch (error) {
      console.error('Error updating user aggregated stats:', error);
    }
  }

  // Batch update all users' aggregated stats
  async updateAllUsersAggregatedStats(): Promise<void> {
    try {
      const db = getDb();
      const userProgressRef = collection(db, 'userProgress');
      const userProgressSnapshot = await getDocs(userProgressRef);
      
      const batch = writeBatch(db);
      let batchCount = 0;
      const maxBatchSize = 500; // Firestore batch limit

      for (const userDoc of userProgressSnapshot.docs) {
        const userId = userDoc.id;
        const aggregatedStats = await this.calculateUserAggregatedStats(userId);
        
        if (aggregatedStats) {
          const aggregatedStatsRef = doc(db, 'aggregatedStats', userId);
          batch.set(aggregatedStatsRef, {
            ...aggregatedStats,
            lastCalculated: serverTimestamp(),
          });
          
          batchCount++;
          
          // Execute batch when it reaches the limit
          if (batchCount >= maxBatchSize) {
            await batch.commit();
            console.log(`Committed batch of ${batchCount} aggregated stats updates`);
            batchCount = 0;
          }
        }
      }
      
      // Commit remaining updates
      if (batchCount > 0) {
        await batch.commit();
        console.log(`Committed final batch of ${batchCount} aggregated stats updates`);
      }
      
      console.log('Completed updating all users aggregated stats');
    } catch (error) {
      console.error('Error updating all users aggregated stats:', error);
    }
  }

  // Generate global leaderboards from aggregated stats
  async generateGlobalLeaderboards(): Promise<GlobalLeaderboards> {
    try {
      const db = getDb();
      const aggregatedStatsRef = collection(db, 'aggregatedStats');
      const aggregatedStatsSnapshot = await getDocs(aggregatedStatsRef);
      
      const userStats: AggregatedUserStats[] = [];
      
      aggregatedStatsSnapshot.forEach((doc) => {
        const data = doc.data() as AggregatedUserStats;
        if (data) {
          userStats.push(data);
        }
      });

      // Sort and create leaderboards
      const puzzleCompletions = userStats
        .filter(u => u.totalPuzzlesCompleted > 0)
        .sort((a, b) => b.totalPuzzlesCompleted - a.totalPuzzlesCompleted)
        .slice(0, 100)
        .map(u => ({
          userId: u.userId,
          displayName: u.displayName,
          value: u.totalPuzzlesCompleted
        }));

      const levelCompletions = userStats
        .filter(u => u.totalLevelsCompleted > 0)
        .sort((a, b) => b.totalLevelsCompleted - a.totalLevelsCompleted)
        .slice(0, 100)
        .map(u => ({
          userId: u.userId,
          displayName: u.displayName,
          value: u.totalLevelsCompleted
        }));

      const starsEarned = userStats
        .filter(u => u.totalStarsEarned > 0)
        .sort((a, b) => b.totalStarsEarned - a.totalStarsEarned)
        .slice(0, 100)
        .map(u => ({
          userId: u.userId,
          displayName: u.displayName,
          value: u.totalStarsEarned
        }));

      const efficiency = userStats
        .filter(u => u.averageEfficiency > 0)
        .sort((a, b) => b.averageEfficiency - a.averageEfficiency)
        .slice(0, 100)
        .map(u => ({
          userId: u.userId,
          displayName: u.displayName,
          value: u.averageEfficiency
        }));

      const achievements = userStats
        .filter(u => u.achievementsUnlocked > 0)
        .sort((a, b) => b.achievementsUnlocked - a.achievementsUnlocked)
        .slice(0, 100)
        .map(u => ({
          userId: u.userId,
          displayName: u.displayName,
          value: u.achievementsUnlocked
        }));

      const bestPuzzleTimes = userStats
        .filter(u => u.bestPuzzleTime > 0 && u.bestPuzzleTime < Infinity)
        .sort((a, b) => a.bestPuzzleTime - b.bestPuzzleTime)
        .slice(0, 100)
        .map(u => ({
          userId: u.userId,
          displayName: u.displayName,
          puzzleId: 'best_overall',
          completionTime: u.bestPuzzleTime,
          stars: 3, // Placeholder
          efficiency: u.averageEfficiency
        }));

      const bestLevelTimes = userStats
        .filter(u => u.bestLevelTime > 0 && u.bestLevelTime < Infinity)
        .sort((a, b) => a.bestLevelTime - b.bestLevelTime)
        .slice(0, 100)
        .map(u => ({
          userId: u.userId,
          displayName: u.displayName,
          puzzleId: `level_best`,
          levelId: 1, // Placeholder - would need more detailed tracking
          completionTime: u.bestLevelTime,
          stars: 3, // Placeholder
          efficiency: u.averageEfficiency
        }));

      return {
        puzzleCompletions,
        levelCompletions,
        starsEarned,
        efficiency,
        achievements,
        bestPuzzleTimes,
        bestLevelTimes,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error generating global leaderboards:', error);
      return {
        puzzleCompletions: [],
        levelCompletions: [],
        starsEarned: [],
        efficiency: [],
        achievements: [],
        bestPuzzleTimes: [],
        bestLevelTimes: [],
        lastUpdated: new Date(),
      };
    }
  }

  // Cache global leaderboards in Firestore
  async cacheGlobalLeaderboards(): Promise<void> {
    try {
      const leaderboards = await this.generateGlobalLeaderboards();
      const db = getDb();
      const leaderboardRef = doc(db, 'globalData', 'leaderboards');
      
      await setDoc(leaderboardRef, {
        ...leaderboards,
        lastUpdated: serverTimestamp(),
      });
      
      console.log('Cached global leaderboards to Firestore');
    } catch (error) {
      console.error('Error caching global leaderboards:', error);
    }
  }

  // Trigger update for current user after completing a level/puzzle
  async triggerUserStatsUpdate(): Promise<void> {
    try {
      const user = getCurrentUser();
      if (!user) return;
      
      // Update in background without waiting
      setTimeout(async () => {
        await this.updateUserAggregatedStats(user.uid);
      }, 1000); // Delay to avoid blocking UI
      
    } catch (error) {
      console.error('Error triggering user stats update:', error);
    }
  }

  // Get cached aggregated stats (much faster than recalculating)
  async getCachedUserStats(userId: string): Promise<AggregatedUserStats | null> {
    try {
      const db = getDb();
      const aggregatedStatsRef = doc(db, 'aggregatedStats', userId);
      const doc_snapshot = await getDoc(aggregatedStatsRef);
      
      if (doc_snapshot.exists()) {
        const data = doc_snapshot.data() as AggregatedUserStats;
        return {
          ...data,
          lastCalculated: data.lastCalculated || new Date(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cached user stats:', error);
      return null;
    }
  }

  // Get cached global leaderboards (much faster than recalculating)
  async getCachedGlobalLeaderboards(): Promise<GlobalLeaderboards | null> {
    try {
      const db = getDb();
      const leaderboardRef = doc(db, 'globalData', 'leaderboards');
      const doc_snapshot = await getDoc(leaderboardRef);
      
      if (doc_snapshot.exists()) {
        const data = doc_snapshot.data() as GlobalLeaderboards;
        return {
          ...data,
          lastUpdated: data.lastUpdated || new Date(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting cached global leaderboards:', error);
      return null;
    }
  }
}

// Singleton instance
let backgroundStatsServiceInstance: BackgroundStatsService | null = null;

export const getBackgroundStatsService = (): BackgroundStatsService => {
  if (!backgroundStatsServiceInstance) {
    backgroundStatsServiceInstance = new BackgroundStatsService();
  }
  return backgroundStatsServiceInstance;
};

// Export convenience functions
export const updateUserAggregatedStats = (userId: string) => getBackgroundStatsService().updateUserAggregatedStats(userId);
export const triggerUserStatsUpdate = () => getBackgroundStatsService().triggerUserStatsUpdate();
export const getCachedUserStats = (userId: string) => getBackgroundStatsService().getCachedUserStats(userId);
export const getCachedGlobalLeaderboards = () => getBackgroundStatsService().getCachedGlobalLeaderboards();