import { 
  doc, collection, getDoc, setDoc, getDocs, query, where, getFirestore, writeBatch
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import type { Achievement, UserAchievement, AchievementProgress, AchievementStats } from '../models/achievement';
import type { UserProgress } from '../models/user';
import { getCurrentUser } from '../../utils/auth';

// Firestore Database Reference
const getDb = () => getFirestore(getApp());

export class AchievementService {

  // Initialize default achievements in Firestore
  async initializeAchievements(): Promise<void> {
    try {
      const db = getDb();
      const achievementsRef = collection(db, 'achievements');
      const snapshot = await getDocs(achievementsRef);
      
      // If achievements already exist, don't reinitialize
      if (!snapshot.empty) {
        return;
      }

      const defaultAchievements: Achievement[] = [
        {
          id: 'first_puzzle',
          title: 'First Steps',
          description: 'Complete your first puzzle',
          icon: '🎯',
          category: 'puzzle',
          type: 'single',
          condition: { type: 'puzzles_completed', target: 1 },
          isActive: true,
          sortOrder: 1,
          rarity: 'common',
          points: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'first_level',
          title: 'Level Up',
          description: 'Complete your first level',
          icon: '⭐',
          category: 'level',
          type: 'single',
          condition: { type: 'levels_completed', target: 1 },
          isActive: true,
          sortOrder: 2,
          rarity: 'common',
          points: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'speed_demon',
          title: 'Speed Demon',
          description: 'Complete a puzzle in under 30 seconds',
          icon: '⚡',
          category: 'speed',
          type: 'single',
          condition: { type: 'fastest_time', threshold: 30000 },
          isActive: true,
          sortOrder: 10,
          rarity: 'uncommon',
          points: 25,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'puzzle_novice',
          title: 'Puzzle Novice',
          description: 'Complete 10 puzzles',
          icon: '🧩',
          category: 'puzzle',
          type: 'progress',
          condition: { type: 'puzzles_completed', target: 10 },
          isActive: true,
          sortOrder: 3,
          rarity: 'common',
          points: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'puzzle_master',
          title: 'Puzzle Master',
          description: 'Complete 50 puzzles',
          icon: '🎓',
          category: 'puzzle',
          type: 'progress',
          condition: { type: 'puzzles_completed', target: 50 },
          isActive: true,
          sortOrder: 4,
          rarity: 'rare',
          points: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'level_conqueror',
          title: 'Level Conqueror',
          description: 'Complete 25 levels',
          icon: '👑',
          category: 'level',
          type: 'progress',
          condition: { type: 'levels_completed', target: 25 },
          isActive: true,
          sortOrder: 5,
          rarity: 'rare',
          points: 40,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'perfectionist',
          title: 'Perfectionist',
          description: 'Complete 10 puzzles with perfect scores',
          icon: '💎',
          category: 'efficiency',
          type: 'progress',
          condition: { type: 'perfect_completions', target: 10 },
          isActive: true,
          sortOrder: 8,
          rarity: 'epic',
          points: 75,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'star_collector',
          title: 'Star Collector',
          description: 'Earn 100 stars',
          icon: '🌟',
          category: 'collection',
          type: 'progress',
          condition: { type: 'stars_earned', target: 100 },
          isActive: true,
          sortOrder: 6,
          rarity: 'rare',
          points: 60,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'pack_explorer',
          title: 'Pack Explorer',
          description: 'Unlock 5 puzzle packs',
          icon: '📦',
          category: 'collection',
          type: 'progress',
          condition: { type: 'packs_unlocked', target: 5 },
          isActive: true,
          sortOrder: 7,
          rarity: 'uncommon',
          points: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'efficiency_expert',
          title: 'Efficiency Expert',
          description: 'Maintain 80% average efficiency',
          icon: '🎯',
          category: 'efficiency',
          type: 'milestone',
          condition: { type: 'average_efficiency', threshold: 80 },
          isActive: true,
          sortOrder: 9,
          rarity: 'rare',
          points: 45,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'time_traveler',
          title: 'Time Traveler',
          description: 'Play for 60 minutes total',
          icon: '⏰',
          category: 'time',
          type: 'progress',
          condition: { type: 'total_play_time', target: 3600000 },
          isActive: true,
          sortOrder: 11,
          rarity: 'uncommon',
          points: 35,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Batch write achievements
      const batch = writeBatch(db);
      defaultAchievements.forEach(achievement => {
        const achievementRef = doc(db, 'achievements', achievement.id);
        batch.set(achievementRef, achievement);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error initializing achievements:', error);
    }
  }

  // Get all achievements from Firestore
  async getAllAchievements(): Promise<Achievement[]> {
    try {
      const db = getDb();
      const achievementsRef = collection(db, 'achievements');
      const querySnapshot = await getDocs(achievementsRef);
      
      const achievements: Achievement[] = [];
      querySnapshot.forEach((docSnapshot: { data: () => any; }) => {
        const data = docSnapshot.data();
        achievements.push({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Achievement);
      });

      return achievements.sort((a, b) => a.sortOrder - b.sortOrder);
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  // Get user's achievement progress
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      const db = getDb();
      const userAchievementsRef = collection(db, 'userAchievements');
      const q = query(userAchievementsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const userAchievements: UserAchievement[] = [];
      querySnapshot.forEach((docSnapshot: { data: () => any; }) => {
        const data = docSnapshot.data();
        userAchievements.push({
          ...data,
          unlockedAt: data.unlockedAt?.toDate(),
          lastUpdated: data.lastUpdated?.toDate() || new Date(),
        } as UserAchievement);
      });

      return userAchievements;
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  // Calculate achievement progress based on user progress
  async calculateAchievementProgress(userProgress: UserProgress): Promise<AchievementProgress[]> {
    try {
      const user = getCurrentUser();
      if (!user) return [];

      const [achievements, userAchievements] = await Promise.all([
        this.getAllAchievements(),
        this.getUserAchievements(user.uid)
      ]);

      const userAchievementMap = new Map(
        userAchievements.map(ua => [ua.achievementId, ua])
      );

      const achievementProgress: AchievementProgress[] = achievements.map(achievement => {
        const userAchievement = userAchievementMap.get(achievement.id);
        const progress = this.calculateProgress(achievement, userProgress);
        const isUnlocked = userAchievement?.isUnlocked || progress.isComplete;

        return {
          achievementId: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category,
          isUnlocked,
          progress: progress.current,
          maxProgress: progress.max,
          progressPercentage: progress.max > 0 ? Math.round((progress.current / progress.max) * 100) : 0,
          rarity: achievement.rarity,
          points: achievement.points,
          unlockedAt: userAchievement?.unlockedAt,
        };
      });

      return achievementProgress;
    } catch (error) {
      console.error('Error calculating achievement progress:', error);
      return [];
    }
  }

  // Calculate progress for a specific achievement
  private calculateProgress(achievement: Achievement, userProgress: UserProgress): { current: number; max: number; isComplete: boolean } {
    const condition = achievement.condition;
    let current = 0;
    let max = condition.target || condition.threshold || 1;

    switch (condition.type) {
      case 'puzzles_completed':
        current = userProgress.totalPuzzlesCompleted || 0;
        break;
      case 'levels_completed':
        current = userProgress.totalLevelsCompleted || 0;
        break;
      case 'stars_earned':
        current = userProgress.totalStarsEarned || 0;
        break;
      case 'packs_unlocked':
        current = userProgress.totalPacksUnlocked || 0;
        break;
      case 'average_efficiency':
        current = userProgress.averageEfficiency || 0;
        max = condition.threshold || 100;
        break;
      case 'total_play_time':
        current = Math.floor((userProgress.totalPlayTime || 0) / 60000); // Convert to minutes
        max = Math.floor((condition.target || 0) / 60000);
        break;
      case 'fastest_time':
        const completions = Object.values(userProgress.puzzleCompletions || {});
        const bestTimes = completions.map(comp => comp.bestTime).filter(time => time > 0);
        const fastestTime = bestTimes.length > 0 ? Math.min(...bestTimes) : Infinity;
        current = fastestTime < (condition.threshold || Infinity) ? 1 : 0;
        max = 1;
        break;
      case 'perfect_completions':
        const perfectComps = Object.values(userProgress.puzzleCompletions || {}).filter(comp => 
          comp.bestStars >= 3 || comp.bestEfficiency >= 90
        );
        current = perfectComps.length;
        break;
      default:
        current = 0;
        max = 1;
    }

    const isComplete = achievement.condition.threshold 
      ? current >= (condition.threshold || 0)
      : current >= (condition.target || 1);

    return {
      current: Math.min(current, max),
      max,
      isComplete
    };
  }

  // Update user achievement progress
  async updateUserAchievements(userProgress: UserProgress): Promise<string[]> {
    try {
      const user = getCurrentUser();
      if (!user) return [];

      const achievementProgress = await this.calculateAchievementProgress(userProgress);
      const newlyUnlocked: string[] = [];
      const db = getDb();

      for (const progress of achievementProgress) {
        if (progress.isUnlocked && !progress.unlockedAt) {
          // This is a newly unlocked achievement
          const userAchievementRef = doc(db, 'userAchievements', `${user.uid}_${progress.achievementId}`);
          const userAchievement: UserAchievement = {
            userId: user.uid,
            achievementId: progress.achievementId,
            isUnlocked: true,
            unlockedAt: new Date(),
            progress: progress.progress,
            maxProgress: progress.maxProgress,
            currentValue: progress.progress,
            lastUpdated: new Date(),
          };

          await setDoc(userAchievementRef, userAchievement);
          newlyUnlocked.push(progress.achievementId);
        } else if (!progress.isUnlocked) {
          // Update progress for locked achievements
          const userAchievementRef = doc(db, 'userAchievements', `${user.uid}_${progress.achievementId}`);
          const existingDoc = await getDoc(userAchievementRef);

          if (existingDoc.exists()) {
            const userAchievement: UserAchievement = {
              ...existingDoc.data() as UserAchievement,
              progress: progress.progress,
              currentValue: progress.progress,
              lastUpdated: new Date(),
            };
            await setDoc(userAchievementRef, userAchievement);
          } else {
            // Create new progress record
            const userAchievement: UserAchievement = {
              userId: user.uid,
              achievementId: progress.achievementId,
              isUnlocked: false,
              progress: progress.progress,
              maxProgress: progress.maxProgress,
              currentValue: progress.progress,
              lastUpdated: new Date(),
            };
            await setDoc(userAchievementRef, userAchievement);
          }
        }
      }

      return newlyUnlocked;
    } catch (error) {
      console.error('Error updating user achievements:', error);
      return [];
    }
  }

  // Get achievement statistics
  async getAchievementStats(userId: string): Promise<AchievementStats> {
    try {
      const user = getCurrentUser();
      if (!user) {
        return {
          totalAchievements: 0,
          unlockedAchievements: 0,
          totalPoints: 0,
          completionPercentage: 0,
          rareAchievements: 0,
          recentUnlocks: [],
        };
      }

      const userProgress = await import('./userService').then(service => service.getUserProgress());
      if (!userProgress) {
        return {
          totalAchievements: 0,
          unlockedAchievements: 0,
          totalPoints: 0,
          completionPercentage: 0,
          rareAchievements: 0,
          recentUnlocks: [],
        };
      }

      const achievementProgress = await this.calculateAchievementProgress(userProgress);
      const unlockedAchievements = achievementProgress.filter(a => a.isUnlocked);
      const rareAchievements = unlockedAchievements.filter(a => 
        ['rare', 'epic', 'legendary'].includes(a.rarity)
      );

      const userAchievements = await this.getUserAchievements(userId);
      const recentUnlocks = userAchievements
        .filter(ua => ua.isUnlocked && ua.unlockedAt)
        .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
        .slice(0, 5);

      return {
        totalAchievements: achievementProgress.length,
        unlockedAchievements: unlockedAchievements.length,
        totalPoints: unlockedAchievements.reduce((sum, a) => sum + a.points, 0),
        completionPercentage: achievementProgress.length > 0 
          ? Math.round((unlockedAchievements.length / achievementProgress.length) * 100) 
          : 0,
        rareAchievements: rareAchievements.length,
        recentUnlocks,
      };
    } catch (error) {
      console.error('Error getting achievement stats:', error);
      return {
        totalAchievements: 0,
        unlockedAchievements: 0,
        totalPoints: 0,
        completionPercentage: 0,
        rareAchievements: 0,
        recentUnlocks: [],
      };
    }
  }
}

// Singleton instance
let achievementServiceInstance: AchievementService | null = null;

export const getAchievementService = (): AchievementService => {
  if (!achievementServiceInstance) {
    achievementServiceInstance = new AchievementService();
  }
  return achievementServiceInstance;
};

// Export convenience functions
export const initializeAchievements = () => getAchievementService().initializeAchievements();
export const getAllAchievements = () => getAchievementService().getAllAchievements();
export const calculateAchievementProgress = (userProgress: UserProgress) => getAchievementService().calculateAchievementProgress(userProgress);
export const updateUserAchievements = (userProgress: UserProgress) => getAchievementService().updateUserAchievements(userProgress);
export const getAchievementStats = (userId: string) => getAchievementService().getAchievementStats(userId);