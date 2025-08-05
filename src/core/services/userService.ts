import { 
  doc, collection, getDoc, setDoc, getDocs, query, where, getFirestore 
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import type { UserProgress} from '../models/user';
import type { CompletionResult } from '../models/game';
import { PACK_UNLOCK_REQUIREMENTS } from '../constants/game';
import { getCurrentUser } from '../../utils/auth';

// Firestore Database Reference
const getDb = () => getFirestore(getApp());

// User Progress Service
export class UserService {
  
  // Initialize default user progress
  private async initializeUserProgress(userId: string): Promise<UserProgress> {
    const now = new Date();
    const defaultProgress: UserProgress = {
      userId,
      levelProgress: {},
      packProgress: {},
      puzzleCompletions: {},
      totalLevelsCompleted: 0,
      totalPacksUnlocked: 1,
      totalPuzzlesCompleted: 0,
      totalStarsEarned: 0,
      averageEfficiency: 0,
      totalPlayTime: 0,
      lastUpdated: now,
    };

    // Initialize starter pack as unlocked
    const starterPackId = Object.keys(PACK_UNLOCK_REQUIREMENTS)[0];
    defaultProgress.packProgress[starterPackId] = {
      packId: starterPackId,
      isUnlocked: true,
      unlockedAt: now,
      puzzlesCompleted: 0,
      totalPuzzles: 10,
      completionPercentage: 0,
      bestOverallStars: 0,
      averageEfficiency: 0,
      totalPlayTime: 0,
    };

    return defaultProgress;
  }

  // Ensure user progress exists, create if needed
  private async ensureUserProgressExists(userId: string): Promise<UserProgress> {
    const db = getDb();
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressDoc = await getDoc(userProgressRef);

    if (userProgressDoc.exists()) {
      const data = userProgressDoc.data();
      if (!data) {
        const newProgress = await this.initializeUserProgress(userId);
        await setDoc(userProgressRef, newProgress);
        return newProgress;
      }
      return this.sanitizeUserProgress(data, userId);
    }

    const newProgress = await this.initializeUserProgress(userId);
    await setDoc(userProgressRef, newProgress);
    return newProgress;
  }

  // Get user progress from Firestore
  async getUserProgress(): Promise<UserProgress | null> {
    try {
      const user = getCurrentUser();
      if (!user?.uid) return null;

      const db = getDb();
      const userProgressRef = doc(db, 'userProgress', user.uid);
      const userProgressDoc = await getDoc(userProgressRef);

      if (userProgressDoc.exists()) {
        const data = userProgressDoc.data();
        if (!data) {
          const newProgress = await this.initializeUserProgress(user.uid);
          await setDoc(userProgressRef, newProgress);
          return newProgress;
        }
        return this.sanitizeUserProgress(data, user.uid);
      }

      const newProgress = await this.initializeUserProgress(user.uid);
      await setDoc(userProgressRef, newProgress);
      return newProgress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  }

  // Save level completion
  async saveLevelCompletion(levelId: number, completionTime: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const user = getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Sanitize completion time to avoid undefined values
      const sanitizedCompletionTime = completionTime || 0;

      const userProgress = await this.ensureUserProgressExists(user.uid);
      const now = new Date();
      const levelKey = levelId.toString();
      const currentLevelProgress = userProgress.levelProgress[levelKey];
      
      if (currentLevelProgress) {
        userProgress.levelProgress[levelKey] = {
          ...currentLevelProgress,
          solved: true,
          completionTime: sanitizedCompletionTime,
          bestTime: currentLevelProgress.bestTime
            ? Math.min(currentLevelProgress.bestTime, sanitizedCompletionTime)
            : sanitizedCompletionTime,
          attempts: currentLevelProgress.attempts + 1,
          lastCompletedAt: now,
        };
      } else {
        userProgress.levelProgress[levelKey] = {
          solved: true,
          completionTime: sanitizedCompletionTime,
          bestTime: sanitizedCompletionTime,
          attempts: 1,
          firstCompletedAt: now,
          lastCompletedAt: now,
        };
        userProgress.totalLevelsCompleted += 1;
      }

      userProgress.lastUpdated = now;
      const db = getDb();
      const userProgressRef = doc(db, 'userProgress', user.uid);
      
      // Filter out undefined values before saving to Firestore
      const sanitizedUserProgress = Object.fromEntries(
        Object.entries(userProgress).filter(([_, value]) => value !== undefined)
      );
      
      await setDoc(userProgressRef, sanitizedUserProgress);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Save puzzle completion with enhanced tracking
  async savePuzzleCompletion(
    puzzleId: string, 
    completionResult: CompletionResult,
    packId?: string
  ): Promise<{ success: boolean; error: string | null; newlyUnlockedPacks?: string[] }> {
    try {
      const user = getCurrentUser();
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      const userProgress = await this.ensureUserProgressExists(user.uid);
      const now = new Date();

      // Sanitize completion result to ensure no undefined values
      const sanitizedResult = {
        isValid: completionResult.isValid || false,
        completionTime: completionResult.completionTime || 0,
        moveCount: completionResult.moveCount || 0,
        efficiency: completionResult.efficiency || 0,
        stars: completionResult.stars || 0,
        errors: completionResult.errors || []
      };

      // Update or create puzzle completion record
      const existingCompletion = userProgress.puzzleCompletions[puzzleId];
      const isFirstCompletion = !existingCompletion;
      
      if (existingCompletion) {
        // Update existing completion with better stats
        userProgress.puzzleCompletions[puzzleId] = {
          ...existingCompletion,
          attempts: existingCompletion.attempts + 1,
          bestTime: Math.min(existingCompletion.bestTime, sanitizedResult.completionTime),
          bestStars: Math.max(existingCompletion.bestStars, sanitizedResult.stars),
          bestEfficiency: Math.max(existingCompletion.bestEfficiency, sanitizedResult.efficiency),
          lastCompletedAt: now,
          // Update current completion data
          isValid: sanitizedResult.isValid,
          completionTime: sanitizedResult.completionTime,
          moveCount: sanitizedResult.moveCount,
          efficiency: sanitizedResult.efficiency,
          stars: sanitizedResult.stars,
        };
      } else {
        // Create new completion record
        userProgress.puzzleCompletions[puzzleId] = {
          puzzleId,
          packId: packId || undefined,
          isValid: sanitizedResult.isValid,
          completionTime: sanitizedResult.completionTime,
          moveCount: sanitizedResult.moveCount,
          efficiency: sanitizedResult.efficiency,
          stars: sanitizedResult.stars,
          attempts: 1,
          bestTime: sanitizedResult.completionTime,
          bestStars: sanitizedResult.stars,
          bestEfficiency: sanitizedResult.efficiency,
          firstCompletedAt: now,
          lastCompletedAt: now,
        };
        
        userProgress.totalPuzzlesCompleted += 1;
      }

      // Update pack progress if applicable
      if (packId && userProgress.packProgress[packId]) {
        const packProgress = userProgress.packProgress[packId];
        
        if (isFirstCompletion) {
          packProgress.puzzlesCompleted += 1;
          packProgress.completionPercentage = Math.round(
            (packProgress.puzzlesCompleted / packProgress.totalPuzzles) * 100
          );
        }
        
        // Update pack statistics
        const packCompletions = Object.values(userProgress.puzzleCompletions)
          .filter(comp => comp.packId === packId);
        
        packProgress.bestOverallStars = Math.max(
          ...packCompletions.map(comp => comp.bestStars)
        );
        packProgress.averageEfficiency = Math.round(
          packCompletions.reduce((sum, comp) => sum + comp.bestEfficiency, 0) / packCompletions.length
        );
        packProgress.totalPlayTime += sanitizedResult.completionTime;
        
        userProgress.packProgress[packId] = packProgress;
      }

      // Update overall statistics
      userProgress.totalStarsEarned = Object.values(userProgress.puzzleCompletions)
        .reduce((sum, comp) => sum + comp.bestStars, 0);
      
      const allCompletions = Object.values(userProgress.puzzleCompletions);
      userProgress.averageEfficiency = allCompletions.length > 0 
        ? Math.round(allCompletions.reduce((sum, comp) => sum + comp.bestEfficiency, 0) / allCompletions.length)
        : 0;
      
      userProgress.totalPlayTime += sanitizedResult.completionTime;
      
      // Check for newly unlocked packs
      const newlyUnlockedPacks = await this.checkAndUnlockPacks(userProgress);
      
      userProgress.lastUpdated = now;
      const db = getDb();
      const userProgressRef = doc(db, 'userProgress', user.uid);
      
      // Filter out undefined values before saving to Firestore
      const sanitizedUserProgress = Object.fromEntries(
        Object.entries(userProgress).filter(([_, value]) => value !== undefined)
      );
      
      await setDoc(userProgressRef, sanitizedUserProgress);

      // Save individual completion record for detailed history
      const completionRef = doc(
        getDb(), 
        'puzzleCompletions', 
        `${user.uid}_${puzzleId}_${Date.now()}`
      );
      
      // Use the already sanitized result for the completion record
      await setDoc(completionRef, {
        userId: user.uid,
        puzzleId,
        packId: packId || undefined,
        ...sanitizedResult,
        completedAt: now,
      });

      return { 
        success: true, 
        error: null, 
        newlyUnlockedPacks: newlyUnlockedPacks.length > 0 ? newlyUnlockedPacks : undefined 
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Get level progress for specific level
  async getLevelProgress(levelId: number) {
    try {
      const userProgress = await this.getUserProgress();
      if (!userProgress) return null;
      
      const levelKey = levelId.toString();
      return userProgress.levelProgress[levelKey] || null;
    } catch (error) {
      console.error('Error getting level progress:', error);
      return null;
    }
  }

  // Check if level is solved
  async isLevelSolved(levelId: number): Promise<boolean> {
    try {
      const levelProgress = await this.getLevelProgress(levelId);
      return levelProgress?.solved || false;
    } catch (error) {
      return false;
    }
  }

  // Get puzzle completions for user
  async getPuzzleCompletions(puzzleId?: string): Promise<any[]> {
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let completionsQuery;
      
      if (puzzleId) {
        completionsQuery = query(
          collection(getDb(), 'puzzleCompletions'),
          where('userId', '==', user.uid),
          where('puzzleId', '==', puzzleId)
        );
      } else {
        completionsQuery = query(
          collection(getDb(), 'puzzleCompletions'),
          where('userId', '==', user.uid)
        );
      }

      const completionsSnapshot = await getDocs(completionsQuery);
      const completions: any[] = [];

      completionsSnapshot.forEach((doc: { data: () => any; }) => {
        completions.push(doc.data());
      });

      // Sort by completedAt in memory to avoid composite index requirement
      return completions.sort((a, b) => {
        const aTime = a.completedAt?.toDate?.() || new Date(a.completedAt) || new Date(0);
        const bTime = b.completedAt?.toDate?.() || new Date(b.completedAt) || new Date(0);
        return bTime.getTime() - aTime.getTime(); // descending order
      });
    } catch (error) {
      console.error('Error getting puzzle completions:', error);
      return [];
    }
  }

  // Check and unlock packs based on user progress
  private async checkAndUnlockPacks(userProgress: UserProgress): Promise<string[]> {
    const newlyUnlockedPacks: string[] = [];
    
    try {
      if (!userProgress.packProgress) {
        userProgress.packProgress = {};
      }
      
      // Check each pack unlock requirement
      for (const [packId, requirements] of Object.entries(PACK_UNLOCK_REQUIREMENTS)) {
        const isCurrentlyUnlocked = userProgress.packProgress[packId]?.isUnlocked || false;
        
        if (isCurrentlyUnlocked) continue;
        
        // Check unlock criteria
        const shouldUnlock = (requirements as any).alwaysUnlocked === true ||
          userProgress.totalLevelsCompleted >= requirements.levelsRequired;
        
        if (shouldUnlock) {
          // Initialize pack progress
          const totalPuzzles = 10; // Default puzzle count
          
          userProgress.packProgress[packId] = {
            packId,
            isUnlocked: true,
            unlockedAt: new Date(),
            puzzlesCompleted: 0,
            totalPuzzles,
            completionPercentage: 0,
            bestOverallStars: 0,
            averageEfficiency: 0,
            totalPlayTime: 0,
          };
          
          userProgress.totalPacksUnlocked += 1;
          userProgress.lastUnlockedPack = packId;
          
          newlyUnlockedPacks.push(packId);
        }
      }
      
      return newlyUnlockedPacks;
    } catch (error) {
      console.error('Error checking pack unlocks:', error);
      return [];
    }
  }

  // Sanitize user progress data
  private sanitizeUserProgress(data: any, userId: string): UserProgress {
    if (!data || typeof data !== 'object') {
      return {
        userId,
        levelProgress: {},
        packProgress: {},
        puzzleCompletions: {},
        totalLevelsCompleted: 0,
        totalPacksUnlocked: 0,
        totalPuzzlesCompleted: 0,
        totalStarsEarned: 0,
        averageEfficiency: 0,
        totalPlayTime: 0,
        lastUpdated: new Date(),
      };
    }

    const sanitized: any = {
      userId,
      levelProgress: (data.levelProgress && typeof data.levelProgress === 'object') ? data.levelProgress : {},
      packProgress: (data.packProgress && typeof data.packProgress === 'object') ? data.packProgress : {},
      puzzleCompletions: (data.puzzleCompletions && typeof data.puzzleCompletions === 'object') ? data.puzzleCompletions : {},
      totalLevelsCompleted: typeof data.totalLevelsCompleted === 'number' ? data.totalLevelsCompleted : 0,
      totalPacksUnlocked: typeof data.totalPacksUnlocked === 'number' ? data.totalPacksUnlocked : 0,
      totalPuzzlesCompleted: typeof data.totalPuzzlesCompleted === 'number' ? data.totalPuzzlesCompleted : 0,
      totalStarsEarned: typeof data.totalStarsEarned === 'number' ? data.totalStarsEarned : 0,
      averageEfficiency: typeof data.averageEfficiency === 'number' ? data.averageEfficiency : 0,
      totalPlayTime: typeof data.totalPlayTime === 'number' ? data.totalPlayTime : 0,
      lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
    };

    // Only add optional fields if they have valid values
    if (typeof data.lastUnlockedPack === 'string') {
      sanitized.lastUnlockedPack = data.lastUnlockedPack;
    }
    if (data.nextUnlockRequirement) {
      sanitized.nextUnlockRequirement = data.nextUnlockRequirement;
    }

    return sanitized;
  }
}

// Singleton instance
let userServiceInstance: UserService | null = null;

export const getUserService = (): UserService => {
  if (!userServiceInstance) {
    userServiceInstance = new UserService();
  }
  return userServiceInstance;
};

// Export convenience functions
export const getUserProgress = () => getUserService().getUserProgress();
export const getPuzzleCompletions = (puzzleId?: string) => getUserService().getPuzzleCompletions(puzzleId);
export const savePuzzleCompletion = (puzzleId: string, completionData: any) => getUserService().savePuzzleCompletion(puzzleId, completionData);