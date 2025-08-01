import { 
  doc, collection, getDoc, setDoc, getDocs, query, orderBy, getFirestore 
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import type { Level, FirebaseLevel } from '../models/level';
import { getCurrentUser } from './authService';
import { getUserService } from './userService';

// Level data - this would typically come from a configuration file or database
const DEFAULT_LEVELS: Omit<FirebaseLevel, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 1,
    name: 'First Steps',
    difficulty: 'Exercise',
    gridSize: 3,
    unlocked: true,
    requiresPayment: false,
    requiresAd: false,
    adDuration: 0,
    stars: 0,
    description: 'Learn the basic mechanics of connecting dots',
    icon: '🎯',
    order: 1,
  },
  {
    id: 2,
    name: 'Getting Warmer',
    difficulty: 'Beginner',
    gridSize: 4,
    unlocked: true,
    requiresPayment: false,
    requiresAd: false,
    adDuration: 0,
    stars: 0,
    description: 'Simple patterns to build confidence',
    icon: '🌟',
    order: 2,
  },
  {
    id: 3,
    name: 'Steady Progress',
    difficulty: 'Beginner',
    gridSize: 4,
    unlocked: false,
    requiresPayment: false,
    requiresAd: false,
    adDuration: 0,
    stars: 0,
    description: 'More complex paths await',
    icon: '🚀',
    order: 3,
  },
  // Add more levels as needed
];

export class LevelService {
  private db = () => getFirestore(getApp());

  // Save a level to Firestore
  async saveLevel(level: Omit<FirebaseLevel, 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error: string | null }> {
    try {
      const levelRef = doc(this.db(), 'levels', level.id.toString());
      const now = new Date();
      await setDoc(levelRef, { ...level, createdAt: now, updatedAt: now });
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Get all levels from Firestore
  async getAllLevels(): Promise<FirebaseLevel[]> {
    try {
      const levelsQuery = query(collection(this.db(), 'levels'), orderBy('order', 'asc'));
      const levelsSnapshot = await getDocs(levelsQuery);
      const levels: FirebaseLevel[] = [];
      
      levelsSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.name && data.difficulty) {
          levels.push({
            id: parseInt(docSnap.id),
            name: data.name || 'Unnamed Level',
            difficulty: data.difficulty || 'Beginner',
            gridSize: data.gridSize || 3,
            unlocked: data.unlocked ?? false,
            requiresPayment: data.requiresPayment ?? false,
            requiresAd: data.requiresAd ?? false,
            adDuration: data.adDuration || 0,
            stars: data.stars || 0,
            description: data.description || '',
            icon: data.icon || '🎮',
            order: data.order || parseInt(docSnap.id),
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
          } as FirebaseLevel);
        }
      });
      
      return levels;
    } catch (error) {
      console.error('Error getting levels:', error);
      return [];
    }
  }

  // Get a specific level by ID
  async getLevel(levelId: number): Promise<FirebaseLevel | null> {
    try {
      const levelRef = doc(this.db(), 'levels', levelId.toString());
      const levelDoc = await getDoc(levelRef);
      
      if (levelDoc.exists()) {
        const data = levelDoc.data();
        if (!data || !data.name) return null;
        
        return {
          id: levelId,
          name: data.name || 'Unnamed Level',
          difficulty: data.difficulty || 'Beginner',
          gridSize: data.gridSize || 3,
          unlocked: data.unlocked ?? false,
          requiresPayment: data.requiresPayment ?? false,
          requiresAd: data.requiresAd ?? false,
          adDuration: data.adDuration || 0,
          stars: data.stars || 0,
          description: data.description || '',
          icon: data.icon || '🎮',
          order: data.order || levelId,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        } as FirebaseLevel;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting level:', error);
      return null;
    }
  }

  // Initialize default levels
  async initializeDefaultLevels(): Promise<{ success: boolean; error: string | null }> {
    try {
      const savePromises = DEFAULT_LEVELS.map((level) => this.saveLevel(level));
      await Promise.all(savePromises);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Get levels with user progress
  async getLevelsWithProgress(): Promise<(FirebaseLevel & { solved?: boolean; completionTime?: number; bestTime?: number })[]> {
    try {
      const userService = getUserService();
      const [levels, userProgress] = await Promise.all([
        this.getAllLevels(),
        userService.getUserProgress(),
      ]);

      // Initialize levels if none exist
      if (levels.length === 0) {
        await this.initializeDefaultLevels();
        return await this.getAllLevels();
      }

      return levels.map((level, index) => {
        let isLevelUnlocked = level?.unlocked ?? false;
        
        // Unlock based on previous level completion
        if (index > 0 && userProgress?.levelProgress && levels[index - 1]) {
          const previousLevelId = levels[index - 1].id?.toString();
          if (previousLevelId) {
            const previousLevelProgress = userProgress.levelProgress[previousLevelId];
            if (previousLevelProgress?.solved) {
              isLevelUnlocked = true;
            }
          }
        }
        
        // First two levels are always unlocked
        if (level?.id && level.id <= 2) {
          isLevelUnlocked = true;
        }
        
        const levelProgress = userProgress?.levelProgress?.[level?.id?.toString() || ''];
        
        return {
          ...level,
          unlocked: isLevelUnlocked,
          solved: levelProgress?.solved ?? false,
          completionTime: levelProgress?.completionTime || undefined,
          bestTime: levelProgress?.bestTime || undefined,
        };
      });
    } catch (error) {
      console.error('Error getting levels with progress:', error);
      return [];
    }
  }

  // Save level completion
  async saveLevelCompletion(levelId: number, completionTime: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const userService = getUserService();
      return await userService.saveLevelCompletion(levelId, completionTime);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Check if level is solved
  async isLevelSolved(levelId: number): Promise<boolean> {
    try {
      const userService = getUserService();
      return await userService.isLevelSolved(levelId);
    } catch (error) {
      return false;
    }
  }

  // Get level progress
  async getLevelProgress(levelId: number) {
    try {
      const userService = getUserService();
      return await userService.getLevelProgress(levelId);
    } catch (error) {
      return null;
    }
  }
}

// Singleton instance
let levelServiceInstance: LevelService | null = null;

export const getLevelService = (): LevelService => {
  if (!levelServiceInstance) {
    levelServiceInstance = new LevelService();
  }
  return levelServiceInstance;
};

// Export functions for backward compatibility
export const getAllLevels = () => getLevelService().getAllLevels();
export const getLevel = (levelId: number) => getLevelService().getLevel(levelId);
export const getLevelsWithProgress = () => getLevelService().getLevelsWithProgress();
export const saveLevelCompletion = (levelId: number, completionTime: number) => 
  getLevelService().saveLevelCompletion(levelId, completionTime);
export const isLevelSolved = (levelId: number) => getLevelService().isLevelSolved(levelId);
export const getLevelProgress = (levelId: number) => getLevelService().getLevelProgress(levelId);