import { 
  doc, collection, getDoc, setDoc, getDocs, query, where, orderBy, getFirestore 
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { Puzzle, PuzzlePack, CompletionResult } from '../types';
import { FirebaseLevel, UserProgress } from './types';
import { puzzlePackCodes } from '../constants/codes';
import {getCurrentUser} from './auth';

// --- Firestore Database Reference ---
const getDb = () => getFirestore(getApp());

// --- User Progress ---
export const saveLevelCompletion = async (levelId: number, completionTime: number) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    const db = getDb();
    const userProgressRef = doc(db, 'userProgress', user.uid);
    const userProgressDoc = await getDoc(userProgressRef);
    let userProgress: UserProgress;
    const now = new Date();

    if (userProgressDoc.exists()) {
      const existingProgress = userProgressDoc.data();
      userProgress = {
        userId: user.uid,
        levelProgress: existingProgress?.levelProgress || {},
        packProgress: existingProgress?.packProgress || {},
        puzzleCompletions: existingProgress?.puzzleCompletions || {},
        totalLevelsCompleted: existingProgress?.totalLevelsCompleted || 0,
        totalPacksUnlocked: existingProgress?.totalPacksUnlocked || 0,
        totalPuzzlesCompleted: existingProgress?.totalPuzzlesCompleted || 0,
        totalStarsEarned: existingProgress?.totalStarsEarned || 0,
        averageEfficiency: existingProgress?.averageEfficiency || 0,
        totalPlayTime: existingProgress?.totalPlayTime || 0,
        lastUpdated: existingProgress?.lastUpdated?.toDate?.() || now,
        lastUnlockedPack: existingProgress?.lastUnlockedPack,
        nextUnlockRequirement: existingProgress?.nextUnlockRequirement,
      } as UserProgress;
      const levelKey = levelId.toString();
      const currentLevelProgress = userProgress.levelProgress[levelKey];
      if (currentLevelProgress) {
        userProgress.levelProgress[levelKey] = {
          ...currentLevelProgress,
          solved: true,
          completionTime,
          bestTime: currentLevelProgress.bestTime
            ? Math.min(currentLevelProgress.bestTime, completionTime)
            : completionTime,
          attempts: currentLevelProgress.attempts + 1,
          lastCompletedAt: now,
        };
      } else {
        userProgress.levelProgress[levelKey] = {
          solved: true,
          completionTime,
          bestTime: completionTime,
          attempts: 1,
          firstCompletedAt: now,
          lastCompletedAt: now,
        };
        userProgress.totalLevelsCompleted += 1;
      }
    } else {
      userProgress = {
        userId: user.uid,
        levelProgress: {
          [levelId.toString()]: {
            solved: true,
            completionTime,
            bestTime: completionTime,
            attempts: 1,
            firstCompletedAt: now,
            lastCompletedAt: now,
          },
        },
        packProgress: {},
        puzzleCompletions: {},
        totalLevelsCompleted: 1,
        totalPacksUnlocked: 0,
        totalPuzzlesCompleted: 0,
        totalStarsEarned: 0,
        averageEfficiency: 0,
        totalPlayTime: 0,
        lastUpdated: now,
      };
    }
    userProgress.lastUpdated = now;
    await setDoc(userProgressRef, userProgress);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const initializeUserProgress = async (userId: string): Promise<UserProgress> => {
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
  defaultProgress.packProgress[puzzlePackCodes.starterPack] = {
    packId: puzzlePackCodes.starterPack,
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
};

export const getUserProgress = async (): Promise<UserProgress | null> => {
  try {
    const user = getCurrentUser();
    if (!user || !user.uid) return null;
    const db = getDb();
    const userProgressRef = doc(db, 'userProgress', user.uid);
    const userProgressDoc = await getDoc(userProgressRef);

    if (userProgressDoc.exists()) {
      const data = userProgressDoc.data();
      if (!data) {
        const newProgress = await initializeUserProgress(user.uid);
        await setDoc(userProgressRef, newProgress);
        return newProgress;
      }
      return sanitizeUserProgress(data, user.uid);
    }
    const newProgress = await initializeUserProgress(user.uid);
    await setDoc(userProgressRef, newProgress);
    return newProgress;
  } catch (error: any) {
    return null;
  }
};

// --- Level Management ---
export const saveLevel = async (level: Omit<FirebaseLevel, 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error: string | null }> => {
  try {
    const db = getDb();
    const levelRef = doc(db, 'levels', level.id.toString());
    const now = new Date();
    await setDoc(levelRef, { ...level, createdAt: now, updatedAt: now });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getAllLevels = async (): Promise<FirebaseLevel[]> => {
  try {
    const db = getDb();
    const levelsQuery = query(collection(db, 'levels'), orderBy('order', 'asc'));
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
  } catch (error: any) {
    return [];
  }
};

export const getLevel = async (levelId: number): Promise<FirebaseLevel | null> => {
  try {
    const db = getDb();
    const levelRef = doc(db, 'levels', levelId.toString());
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
  } catch (error: any) {
    return null;
  }
};

export const initializeDefaultLevels = async (): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { LEVELS } = await import('./levels');
    const savePromises = LEVELS.map((level, index) => {
      const firebaseLevel: Omit<FirebaseLevel, 'createdAt' | 'updatedAt'> = {
        id: level.id,
        name: level.name,
        difficulty: level.difficulty,
        gridSize: level.gridSize,
        unlocked: level.unlocked,
        requiresPayment: level.requiresPayment,
        requiresAd: level.requiresAd,
        adDuration: level.adDuration,
        stars: level.stars,
        description: level.description,
        icon: level.icon,
        order: index + 1,
      };
      return saveLevel(firebaseLevel);
    });
    await Promise.all(savePromises);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getLevelsWithProgress = async (): Promise<(FirebaseLevel & { solved?: boolean; completionTime?: number; bestTime?: number })[]> => {
  try {
    const [levels, userProgress] = await Promise.all([
      getAllLevels(),
      getUserProgress(),
    ]);
    if (levels.length === 0) {
      await initializeDefaultLevels();
      return await getAllLevels();
    }
    return levels.map((level, index) => {
      let isLevelUnlocked = level?.unlocked ?? false;
      if (index > 0 && userProgress?.levelProgress && levels[index - 1]) {
        const previousLevelId = levels[index - 1].id?.toString();
        if (previousLevelId) {
          const previousLevelProgress = userProgress.levelProgress[previousLevelId];
          if (previousLevelProgress?.solved) isLevelUnlocked = true;
        }
      }
      if (level?.id && level.id <= 2) isLevelUnlocked = true;
      const levelProgress = userProgress?.levelProgress?.[level?.id?.toString() || ''];
      return {
        ...level,
        unlocked: isLevelUnlocked,
        solved: levelProgress?.solved ?? false,
        completionTime: levelProgress?.completionTime || undefined,
        bestTime: levelProgress?.bestTime || undefined,
      };
    });
  } catch (error: any) {
    return [];
  }
};

// --- User Progress Sanitization ---
const sanitizeUserProgress = (data: any, userId: string): UserProgress => {
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
  return {
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
    lastUnlockedPack: typeof data.lastUnlockedPack === 'string' ? data.lastUnlockedPack : undefined,
    nextUnlockRequirement: data.nextUnlockRequirement || undefined,
  };
};

// --- Firebase Collections Initialization ---
export const initializeFirebaseCollections = async (): Promise<{ success: boolean; error: string | null }> => {
  try {
    const existingLevels = await getAllLevels();
    if (existingLevels.length === 0) await initializeDefaultLevels();
    const existingPacks = await getAllPuzzlePacks();
    if (existingPacks.length === 0) {
      const { createPuzzlePacks } = await import('./puzzleUtils');
      const defaultPacks = createPuzzlePacks();
      for (const pack of defaultPacks) await savePuzzlePack(pack);
    }
    const user = getCurrentUser();
    if (user) await getUserProgress();
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// --- Level Progress ---
export const getLevelProgress = async (levelId: number) => {
  try {
    const userProgress = await getUserProgress();
    if (!userProgress) return null;
    const levelKey = levelId.toString();
    return userProgress.levelProgress[levelKey] || null;
  } catch (error: any) {
    return null;
  }
};

export const isLevelSolved = async (levelId: number): Promise<boolean> => {
  try {
    const levelProgress = await getLevelProgress(levelId);
    return levelProgress?.solved || false;
  } catch (error: any) {
    return false;
  }
};

// --- Puzzle & Pack Management ---
export const savePuzzle = async (puzzle: Puzzle): Promise<{ success: boolean; error: string | null }> => {
  try {
    const db = getDb();
    const puzzleRef = doc(db, 'puzzles', puzzle.id);
    await setDoc(puzzleRef, { ...puzzle, createdAt: new Date(), updatedAt: new Date() });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getPuzzle = async (puzzleId: string): Promise<Puzzle | null> => {
  try {
    const db = getDb();
    const puzzleRef = doc(db, 'puzzles', puzzleId);
    const puzzleDoc = await getDoc(puzzleRef);
    if (puzzleDoc.exists()) return puzzleDoc.data() as Puzzle;
    return null;
  } catch (error: any) {
    return null;
  }
};

export const savePuzzlePack = async (pack: PuzzlePack): Promise<{ success: boolean; error: string | null }> => {
  try {
    const db = getDb();
    const packRef = doc(db, 'puzzlePacks', pack.id);
    await setDoc(packRef, { ...pack, createdAt: new Date(), updatedAt: new Date() });
    for (const puzzle of pack.puzzles) await savePuzzle({ ...puzzle, packId: pack.id });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getPuzzlePack = async (packId: string): Promise<PuzzlePack | null> => {
  try {
    const db = getDb();
    const packRef = doc(db, 'puzzlePacks', packId);
    const packDoc = await getDoc(packRef);
    if (packDoc.exists()) {
      const packData = packDoc.data() as PuzzlePack;
      const puzzlesQuery = query(
        collection(db, 'puzzles'),
        where('packId', '==', packId),
        orderBy('createdAt', 'asc')
      );
      const puzzlesSnapshot = await getDocs(puzzlesQuery);
      const puzzles: Puzzle[] = [];
      puzzlesSnapshot.forEach((docSnap) => puzzles.push(docSnap.data() as Puzzle));
      return { ...packData, puzzles };
    }
    return null;
  } catch (error: any) {
    return null;
  }
};

export const getAllPuzzlePacks = async (): Promise<PuzzlePack[]> => {
  try {
    const db = getDb();
    const packsQuery = query(collection(db, 'puzzlePacks'), orderBy('createdAt', 'asc'));
    const packsSnapshot = await getDocs(packsQuery);
    const packs: PuzzlePack[] = [];
    for (const docSnap of packsSnapshot.docs) {
      const packData = docSnap.data() as PuzzlePack;
      const puzzlesQuery = query(
        collection(db, 'puzzles'),
        where('packId', '==', packData.id),
        orderBy('createdAt', 'asc')
      );
      const puzzlesSnapshot = await getDocs(puzzlesQuery);
      const puzzles: Puzzle[] = [];
      puzzlesSnapshot.forEach((puzzleDoc) => puzzles.push(puzzleDoc.data() as Puzzle));
      packs.push({ ...packData, puzzles });
    }
    return packs;
  } catch (error: any) {
    return [];
  }
};

// Enhanced puzzle completion saving with full progress tracking
export const savePuzzleCompletion = async (
  puzzleId: string, 
  completionResult: CompletionResult,
  packId?: string
): Promise<{ success: boolean; error: string | null; newlyUnlockedPacks?: string[] }> => {
  try {
    const user = getCurrentUser();
    if (!user ||  !user.uid) {
      throw new Error('User not authenticated');
    }

    const userProgressRef = doc(getDb(), 'userProgress', user.uid);
    const userProgressDoc = await getDoc(userProgressRef);
    const now = new Date();

    let userProgress: UserProgress;
    
    if (userProgressDoc.exists()) {
      const existingProgress = userProgressDoc.data();
      
      // Ensure data exists and is valid
      if (!existingProgress) {
        console.warn('⚠️ Document exists but has no data, creating new progress');
        userProgress = {
          userId: user.uid,
          levelProgress: {},
          packProgress: {},
          puzzleCompletions: {},
          totalLevelsCompleted: 0,
          totalPacksUnlocked: 0,
          totalPuzzlesCompleted: 0,
          totalStarsEarned: 0,
          averageEfficiency: 0,
          totalPlayTime: 0,
          lastUpdated: now,
        };
      } else {
        userProgress = {
          userId: user.uid,
          levelProgress: existingProgress.levelProgress || {},
          packProgress: existingProgress.packProgress || {},
          puzzleCompletions: existingProgress.puzzleCompletions || {},
          totalLevelsCompleted: existingProgress.totalLevelsCompleted || 0,
          totalPacksUnlocked: existingProgress.totalPacksUnlocked || 0,
          totalPuzzlesCompleted: existingProgress.totalPuzzlesCompleted || 0,
          totalStarsEarned: existingProgress.totalStarsEarned || 0,
          averageEfficiency: existingProgress.averageEfficiency || 0,
          totalPlayTime: existingProgress.totalPlayTime || 0,
          lastUpdated: existingProgress.lastUpdated?.toDate?.() || now,
          lastUnlockedPack: existingProgress.lastUnlockedPack,
          nextUnlockRequirement: existingProgress.nextUnlockRequirement,
        } as UserProgress;
      }
    } else {
      // Create new progress document
      userProgress = {
        userId: user.uid,
        levelProgress: {},
        packProgress: {},
        puzzleCompletions: {},
        totalLevelsCompleted: 0,
        totalPacksUnlocked: 0,
        totalPuzzlesCompleted: 0,
        totalStarsEarned: 0,
        averageEfficiency: 0,
        totalPlayTime: 0,
        lastUpdated: now,
      };
    }

    // Update or create puzzle completion record
    const existingCompletion = userProgress.puzzleCompletions[puzzleId];
    const isFirstCompletion = !existingCompletion;
    
    if (existingCompletion) {
      // Update existing completion with better stats
      userProgress.puzzleCompletions[puzzleId] = {
        ...existingCompletion,
        attempts: existingCompletion.attempts + 1,
        bestTime: Math.min(existingCompletion.bestTime, completionResult.completionTime),
        bestStars: Math.max(existingCompletion.bestStars, completionResult.stars),
        bestEfficiency: Math.max(existingCompletion.bestEfficiency, completionResult.efficiency),
        lastCompletedAt: now,
        // Update current completion data
        isValid: completionResult.isValid,
        completionTime: completionResult.completionTime,
        moveCount: completionResult.moveCount,
        efficiency: completionResult.efficiency,
        stars: completionResult.stars,
      };
    } else {
      // Create new completion record
      userProgress.puzzleCompletions[puzzleId] = {
        puzzleId,
        packId,
        isValid: completionResult.isValid,
        completionTime: completionResult.completionTime,
        moveCount: completionResult.moveCount,
        efficiency: completionResult.efficiency,
        stars: completionResult.stars,
        attempts: 1,
        bestTime: completionResult.completionTime,
        bestStars: completionResult.stars,
        bestEfficiency: completionResult.efficiency,
        firstCompletedAt: now,
        lastCompletedAt: now,
      };
      
      // Increment total puzzles completed
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
      packProgress.totalPlayTime += completionResult.completionTime;
      
      userProgress.packProgress[packId] = packProgress;
    }

    // Update overall statistics
    userProgress.totalStarsEarned = Object.values(userProgress.puzzleCompletions)
      .reduce((sum, comp) => sum + comp.bestStars, 0);
    
    const allCompletions = Object.values(userProgress.puzzleCompletions);
    userProgress.averageEfficiency = allCompletions.length > 0 
      ? Math.round(allCompletions.reduce((sum, comp) => sum + comp.bestEfficiency, 0) / allCompletions.length)
      : 0;
    
    userProgress.totalPlayTime += completionResult.completionTime;
    
    // Check for newly unlocked packs based on level completion
    const newlyUnlockedPacks = await checkAndUnlockPacks(userProgress);
    
    userProgress.lastUpdated = now;
    await setDoc(userProgressRef, userProgress);

    // Also save individual completion record for detailed history
    const completionRef = doc(
      getDb(), 
      'puzzleCompletions', 
      `${user.uid}_${puzzleId}_${Date.now()}`
    );
    
    await setDoc(completionRef, {
      userId: user.uid,
      puzzleId,
      packId,
      ...completionResult,
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
};

// Get puzzle completions for user
export const getPuzzleCompletions = async (puzzleId?: string): Promise<any[]> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    let completionsQuery;
    
    if (puzzleId) {
      // Query with specific puzzle ID - avoid composite index by not using orderBy
      completionsQuery = query(
        collection(getDb(), 'puzzleCompletions'),
        where('userId', '==', user.uid),
        where('puzzleId', '==', puzzleId)
      );
    } else {
      // Query all completions for user - avoid composite index by not using orderBy
      completionsQuery = query(
        collection(getDb(), 'puzzleCompletions'),
        where('userId', '==', user.uid)
      );
    }

    const completionsSnapshot = await getDocs(completionsQuery);
    const completions: any[] = [];

    completionsSnapshot.forEach((doc) => {
      completions.push(doc.data());
    });

    // Sort by completedAt in memory to avoid composite index requirement
    return completions.sort((a, b) => {
      const aTime = a.completedAt?.toDate?.() || new Date(a.completedAt) || new Date(0);
      const bTime = b.completedAt?.toDate?.() || new Date(b.completedAt) || new Date(0);
      return bTime.getTime() - aTime.getTime(); // descending order
    });
  } catch (error: any) {
    console.error('Error getting puzzle completions:', error);
    return [];
  }
};

// Check if puzzle pack should be unlocked
export const checkPuzzlePackUnlock = async (packId: string): Promise<boolean> => {
  try {
    const pack = await getPuzzlePack(packId);
    if (!pack || pack.isUnlocked) {
      return pack?.isUnlocked || false;
    }

    if (!pack.requiredLevel) {
      return true;
    }

    const userProgress = await getUserProgress();
    if (!userProgress) {
      return false;
    }

    return userProgress.totalLevelsCompleted >= pack.requiredLevel;
  } catch (error: any) {
    console.error('Error checking puzzle pack unlock:', error);
    return false;
  }
};

// Pack unlock criteria and logic
const PACK_UNLOCK_REQUIREMENTS = {
  [puzzlePackCodes.starterPack]: { levelsRequired: 0, alwaysUnlocked: true },
  [puzzlePackCodes.challengePack]: { levelsRequired: 3 },
  [puzzlePackCodes.expertPack]: { levelsRequired: 5 },
} as const;

// Check and unlock packs based on user progress
const checkAndUnlockPacks = async (userProgress: UserProgress): Promise<string[]> => {
  const newlyUnlockedPacks: string[] = [];
  
  try {
    // Initialize pack progress if it doesn't exist
    if (!userProgress.packProgress) {
      userProgress.packProgress = {};
    }
    
    // Check each pack unlock requirement
    for (const [packId, requirements] of Object.entries(PACK_UNLOCK_REQUIREMENTS)) {
      const isCurrentlyUnlocked = userProgress.packProgress[packId]?.isUnlocked || false;
      
      // Skip if already unlocked
      if (isCurrentlyUnlocked) {continue;}
      
      // Check unlock criteria
      const shouldUnlock = (requirements as any).alwaysUnlocked === true ||
        userProgress.totalLevelsCompleted >= requirements.levelsRequired;
      
      if (shouldUnlock) {
        // Initialize pack progress
        const packPuzzles = await getPuzzlesByPackId(packId);
        const totalPuzzles = packPuzzles.length;
        
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
        
        // Set next unlock requirement
        const nextPack = getNextUnlockablePack(userProgress.totalLevelsCompleted);
        if (nextPack) {
          userProgress.nextUnlockRequirement = {
            packId: nextPack.packId,
            levelsRequired: nextPack.levelsRequired,
            currentLevels: userProgress.totalLevelsCompleted,
          };
        }
        
        newlyUnlockedPacks.push(packId);
      }
    }
    
    return newlyUnlockedPacks;
  } catch (error) {
    console.error('Error checking pack unlocks:', error);
    return [];
  }
};

// Get puzzles by pack ID (helper function)
const getPuzzlesByPackId = async (packId: string): Promise<any[]> => {
  try {
    // Try to get from Firebase first
    const pack = await getPuzzlePack(packId);
    if (pack) {
      return pack.puzzles;
    }
    
    // Fallback to local pack creation
    const { createPuzzlePacks } = await import('./puzzleUtils');
    const localPacks = createPuzzlePacks();
    const localPack = localPacks.find(p => p.id === packId);
    return localPack?.puzzles || [];
  } catch (error) {
    console.error('Error getting puzzles for pack:', packId, error);
    return [];
  }
};

// Get next unlockable pack based on current level
const getNextUnlockablePack = (currentLevels: number): { packId: string; levelsRequired: number } | null => {
  const sortedPacks = Object.entries(PACK_UNLOCK_REQUIREMENTS)
    .filter(([_, req]) => !(('alwaysUnlocked' in req) && req.alwaysUnlocked) && req.levelsRequired > currentLevels)
    .sort(([_, a], [__, b]) => a.levelsRequired - b.levelsRequired);
  
  if (sortedPacks.length > 0) {
    const [packId, requirements] = sortedPacks[0];
    return { packId, levelsRequired: requirements.levelsRequired };
  }
  
  return null;
};

// Update pack unlock status in user progress
export const updatePackUnlockStatus = async (packId: string, isUnlocked: boolean): Promise<boolean> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const userProgressRef = doc(getFirestore(), 'userProgress', user.uid);
    const userProgressDoc = await getDoc(userProgressRef);
    
    if (!userProgressDoc.exists()) {
      console.error('User progress document does not exist');
      return false;
    }

    const progressData = userProgressDoc.data();
    if (!progressData) {
      console.error('User progress document has no data');
      return false;
    }

    const userProgress = {
      userId: user.uid,
      levelProgress: progressData.levelProgress || {},
      packProgress: progressData.packProgress || {},
      puzzleCompletions: progressData.puzzleCompletions || {},
      totalLevelsCompleted: progressData.totalLevelsCompleted || 0,
      totalPacksUnlocked: progressData.totalPacksUnlocked || 0,
      totalPuzzlesCompleted: progressData.totalPuzzlesCompleted || 0,
      totalStarsEarned: progressData.totalStarsEarned || 0,
      averageEfficiency: progressData.averageEfficiency || 0,
      totalPlayTime: progressData.totalPlayTime || 0,
      lastUpdated: progressData.lastUpdated?.toDate?.() || new Date(),
      lastUnlockedPack: progressData.lastUnlockedPack,
      nextUnlockRequirement: progressData.nextUnlockRequirement,
    } as UserProgress;
    
    // Initialize pack progress if it doesn't exist
    if (!userProgress.packProgress) {
      userProgress.packProgress = {};
    }

    // Get pack information for total puzzles count
    const packPuzzles = await getPuzzlesByPackId(packId);
    const totalPuzzles = packPuzzles.length;

    // Update or create pack progress
    if (!userProgress.packProgress[packId]) {
      userProgress.packProgress[packId] = {
        packId,
        isUnlocked,
        unlockedAt: isUnlocked ? new Date() : undefined,
        puzzlesCompleted: 0,
        totalPuzzles,
        completionPercentage: 0,
        bestOverallStars: 0,
        averageEfficiency: 0,
        totalPlayTime: 0,
      };

      if (isUnlocked) {
        userProgress.totalPacksUnlocked = (userProgress.totalPacksUnlocked || 0) + 1;
        userProgress.lastUnlockedPack = packId;
      }
    } else {
      userProgress.packProgress[packId].isUnlocked = isUnlocked;
      if (isUnlocked && !userProgress.packProgress[packId].unlockedAt) {
        userProgress.packProgress[packId].unlockedAt = new Date();
        userProgress.totalPacksUnlocked = (userProgress.totalPacksUnlocked || 0) + 1;
        userProgress.lastUnlockedPack = packId;
      }
    }

    userProgress.lastUpdated = new Date();
    await setDoc(userProgressRef, userProgress);

    return true;
  } catch (error: any) {
    console.error('Error updating pack unlock status:', error);
    return false;
  }
};