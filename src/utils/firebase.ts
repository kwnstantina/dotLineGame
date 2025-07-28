import auth from '@react-native-firebase/auth';
import firestore, { doc, collection, getDoc, setDoc, getDocs, query, where, orderBy,getFirestore } from '@react-native-firebase/firestore';
import { getApps, initializeApp ,getApp} from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FIREBASE_PROJECT_ID, FIREBASE_WEB_API_KEY, FIREBASE_PROJECT_NUMBER, GOOGLE_WEB_CLIENT_ID } from '@env';
import { Puzzle, PuzzlePack, CompletionResult } from '../types';

export const initializeFirebase = () => {
  if (getApps().length === 0) {
    try {
      // Initialize Firebase with environment variables
      const config = {
        projectId: FIREBASE_PROJECT_ID,
        apiKey: FIREBASE_WEB_API_KEY,
        appId: `1:${FIREBASE_PROJECT_NUMBER}:android:${FIREBASE_PROJECT_ID}`,
      };  
      
      initializeApp(config);
      
      // Initialize Google Sign-In
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
      });
      console.log('Google Sign-In configured');
      
 
      // Initialize Firebase collections after successful connection
      setTimeout(() => {
        initializeFirebaseCollections();
      }, 1000); // Small delay to ensure connection is stable
    } catch (error) {
      console.error('Firebase initialization failed:', error);
    }
  } else {
    console.log('Firebase already initialized');
  }
};


export const fetchDailyPuzzle = async () => {
  // TODO: Implement Firestore fetching
  // For now, return null to use hardcoded puzzle
  return null;
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await auth().sendPasswordResetEmail(email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    // Check if device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    // Get the user's ID token
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult.data?.idToken;
    
    if (!idToken) {
      throw new Error('No ID token received from Google Sign-In');
    }
    
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
    // Sign-in the user with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    
    // Handle specific error codes
    if (error.code === 'auth/account-exists-with-different-credential') {
      return { user: null, error: 'An account already exists with the same email address but different sign-in credentials.' };
    }
    
    return { user: null, error: error.message || 'Google sign-in failed' };
  }
};

export const getCurrentUser = () => {
  const auth = getAuth(getApp());
  return auth.currentUser;
};
export const onAuthStateChanged = (callback: (user: any) => void) => {
  const auth = getAuth(getApp());
  return auth.onAuthStateChanged(callback);
};

// Individual puzzle completion data
export interface PuzzleCompletion {
  puzzleId: string;
  packId?: string;
  isValid: boolean;
  completionTime: number;
  moveCount: number;
  efficiency: number;
  stars: number;
  attempts: number;
  bestTime: number;
  bestStars: number;
  bestEfficiency: number;
  firstCompletedAt: Date;
  lastCompletedAt: Date;
}

// Pack progress tracking
export interface PackProgress {
  packId: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  puzzlesCompleted: number;
  totalPuzzles: number;
  completionPercentage: number;
  bestOverallStars: number;
  averageEfficiency: number;
  totalPlayTime: number;
}

// Enhanced user progress data structure
export interface UserProgress {
  userId: string;
  // Level progress (existing)
  levelProgress: {
    [levelId: string]: {
      solved: boolean;
      completionTime?: number;
      bestTime?: number;
      attempts: number;
      firstCompletedAt?: Date;
      lastCompletedAt?: Date;
    };
  };
  // Puzzle pack progress (new)
  packProgress: {
    [packId: string]: PackProgress;
  };
  // Individual puzzle completions (new)
  puzzleCompletions: {
    [puzzleId: string]: PuzzleCompletion;
  };
  // Summary statistics
  totalLevelsCompleted: number;
  totalPacksUnlocked: number;
  totalPuzzlesCompleted: number;
  totalStarsEarned: number;
  averageEfficiency: number;
  totalPlayTime: number;
  // Progression tracking
  lastUnlockedPack?: string;
  nextUnlockRequirement?: {
    packId: string;
    levelsRequired: number;
    currentLevels: number;
  };
  lastUpdated: Date;
}

// Save level completion data
export const saveLevelCompletion = async (levelId: number, completionTime: number) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
     const db = getFirestore(getApp());

    const userProgressRef = doc(db, 'userProgress', user.uid);
    const userProgressDoc = await getDoc(userProgressRef);

    let userProgress: UserProgress;
    const now = new Date();

    if (userProgressDoc.exists()) {
      // Update existing progress
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
        // Ensure all new fields exist (backward compatibility)
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
      
      const levelKey = levelId.toString();
      const currentLevelProgress = userProgress.levelProgress[levelKey];

      if (currentLevelProgress) {
        // Update existing level progress
        userProgress.levelProgress[levelKey] = {
          ...currentLevelProgress,
          solved: true,
          completionTime,
          bestTime: currentLevelProgress.bestTime ? 
            Math.min(currentLevelProgress.bestTime, completionTime) : completionTime,
          attempts: currentLevelProgress.attempts + 1,
          lastCompletedAt: now,
        };
      } else {
        // First time completing this level
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
      // Create new progress document
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

// Initialize default user progress for new users
const initializeUserProgress = async (userId: string): Promise<UserProgress> => {
  const now = new Date();
  const defaultProgress: UserProgress = {
    userId,
    levelProgress: {},
    packProgress: {},
    puzzleCompletions: {},
    totalLevelsCompleted: 0,
    totalPacksUnlocked: 1, // Starter pack unlocked by default
    totalPuzzlesCompleted: 0,
    totalStarsEarned: 0,
    averageEfficiency: 0,
    totalPlayTime: 0,
    lastUpdated: now,
  };

  // Initialize starter pack as unlocked
  defaultProgress.packProgress['starter-pack'] = {
    packId: 'starter-pack',
    isUnlocked: true,
    unlockedAt: now,
    puzzlesCompleted: 0,
    totalPuzzles: 10, // Default starter pack size
    completionPercentage: 0,
    bestOverallStars: 0,
    averageEfficiency: 0,
    totalPlayTime: 0,
  };

  return defaultProgress;
};

// Retrieve user progress with automatic initialization for new users
export const getUserProgress = async (): Promise<UserProgress | null> => {
  try {
    const user = getCurrentUser();
    if (!user || !user.uid) {
      console.warn('No authenticated user found');
      return null;
    }

    const userProgressRef = doc(firestore(), 'userProgress', user.uid);
    const userProgressDoc = await getDoc(userProgressRef);

    if (userProgressDoc.exists()) {
      const data = userProgressDoc.data();
      
      // Check if data exists and is valid
      if (!data) {
        console.warn('📄 Document exists but has no data, initializing...');
        const newProgress = await initializeUserProgress(user.uid);
        await setDoc(userProgressRef, newProgress);
        return newProgress;
      }
      
      // Sanitize and validate the data
      const progress = sanitizeUserProgress(data, user.uid);

      console.log('✅ User progress loaded successfully for user:', user.uid);
      return progress;
    }

    // No progress exists - initialize new user
    console.log('🆕 Initializing new user progress for user:', user.uid);
    const newProgress = await initializeUserProgress(user.uid);
    
    // Save the initialized progress to Firebase
    await setDoc(userProgressRef, newProgress);
    console.log('💾 New user progress saved to Firebase');
    
    return newProgress;
  } catch (error: any) {
    console.error('❌ Error retrieving/initializing user progress:', error);
    console.error('Error details:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack?.split('\n').slice(0, 3).join('\n')
    });
    return null;
  }
};

// Firebase Level Management System

// Level interface for Firebase storage
export interface FirebaseLevel {
  id: number;
  name: string;
  difficulty: 'Exercise' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  gridSize: number;
  unlocked: boolean;
  requiresPayment: boolean;
  requiresAd: boolean;
  adDuration: number;
  stars: number;
  description: string;
  icon: string;
  order: number; // For level ordering
  createdAt: Date;
  updatedAt: Date;
}

// Save a level to Firebase
export const saveLevel = async (level: Omit<FirebaseLevel, 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error: string | null }> => {
  try {
    const levelRef = doc(firestore(), 'levels', level.id.toString());
    const now = new Date();
    
    await setDoc(levelRef, {
      ...level,
      createdAt: now,
      updatedAt: now,
    });

    console.log(`✅ Level ${level.id} saved to Firebase`);
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Error saving level:', error);
    return { success: false, error: error.message };
  }
};

// Get all levels from Firebase, sorted by order
export const getAllLevels = async (): Promise<FirebaseLevel[]> => {
  try {
    const db = getFirestore(getApp());
    const levelsQuery = query(
      collection(db, 'levels'),
      orderBy('order', 'asc')
    );
    
    const levelsSnapshot = await getDocs(levelsQuery);
    const levels: FirebaseLevel[] = [];
    
    levelsSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Ensure data exists and has required fields
      if (data && data.name && data.difficulty) {
        levels.push({
          id: parseInt(doc.id),
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
          order: data.order || parseInt(doc.id),
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        } as FirebaseLevel);
      } else {
        console.warn(`⚠️ Invalid level data for document ${doc.id}:`, data);
      }
    });
    
    console.log(`📚 Retrieved ${levels.length} levels from Firebase`);
    return levels;
  } catch (error: any) {
    console.error('❌ Error retrieving levels:', error);
    return [];
  }
};

// Get a specific level from Firebase
export const getLevel = async (levelId: number): Promise<FirebaseLevel | null> => {
  try {
    const levelRef = doc(firestore(), 'levels', levelId.toString());
    const levelDoc = await getDoc(levelRef);

    if (levelDoc.exists()) {
      const data = levelDoc.data();
      
      // Ensure data exists and is valid
      if (!data || !data.name) {
        console.warn(`⚠️ Invalid level data for level ${levelId}:`, data);
        return null;
      }
      
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
    console.error(`❌ Error getting level ${levelId}:`, error);
    return null;
  }
};

// Initialize default levels in Firebase (called once during setup)
export const initializeDefaultLevels = async (): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Import levels from the existing structure
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
    console.log('🎮 All default levels initialized in Firebase');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Error initializing default levels:', error);
    return { success: false, error: error.message };
  }
};

// Get levels with user progress merged
export const getLevelsWithProgress = async (): Promise<(FirebaseLevel & { solved?: boolean; completionTime?: number; bestTime?: number })[]> => {
  try {
    const [levels, userProgress] = await Promise.all([
      getAllLevels(),
      getUserProgress(),
    ]);

    if (levels.length === 0) {
      // Initialize levels if none exist
      console.log('🔄 No levels found, initializing default levels...');
      await initializeDefaultLevels();
      return await getAllLevels();
    }

    // Merge user progress with levels
    const levelsWithProgress = levels.map((level, index) => {
      let isLevelUnlocked = level?.unlocked ?? false;
      
      // Progressive unlocking logic
      if (index > 0 && userProgress?.levelProgress && levels[index - 1]) {
        const previousLevelId = levels[index - 1].id?.toString();
        if (previousLevelId) {
          const previousLevelProgress = userProgress.levelProgress[previousLevelId];
          if (previousLevelProgress?.solved) {
            isLevelUnlocked = true;
          }
        }
      }
      
      // Always keep first few levels unlocked
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

    console.log('🎯 Levels merged with user progress:', {
      totalLevels: levelsWithProgress.length,
      unlockedLevels: levelsWithProgress.filter(l => l.unlocked).length,
      solvedLevels: levelsWithProgress.filter(l => l.solved).length,
    });

    return levelsWithProgress;
  } catch (error: any) {
    console.error('❌ Error getting levels with progress:', error);
    return [];
  }
};

// Validate and sanitize user progress data
const sanitizeUserProgress = (data: any, userId: string): UserProgress => {
  if (!data || typeof data !== 'object') {
    console.warn('⚠️ Invalid user progress data, creating default');
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

// Initialize Firebase collections and ensure default data exists
export const initializeFirebaseCollections = async (): Promise<{ success: boolean; error: string | null }> => {
  try {
    console.log('🔄 Initializing Firebase collections...');
    
    // Check if levels exist, if not initialize them
    const existingLevels = await getAllLevels();
    if (existingLevels.length === 0) {
      console.log('📚 No levels found, initializing default levels...');
      await initializeDefaultLevels();
    } else {
      console.log(`✅ Found ${existingLevels.length} existing levels in Firebase`);
    }
    
    // Check if puzzle packs exist, if not initialize them
    const existingPacks = await getAllPuzzlePacks();
    if (existingPacks.length === 0) {
      console.log('🧩 No puzzle packs found, initializing default packs...');
      const { createPuzzlePacks } = await import('./puzzleUtils');
      const defaultPacks = createPuzzlePacks();
      
      for (const pack of defaultPacks) {
        await savePuzzlePack(pack);
      }
      console.log(`✅ Initialized ${defaultPacks.length} default puzzle packs`);
    } else {
      console.log(`✅ Found ${existingPacks.length} existing puzzle packs in Firebase`);
    }
    
    // Initialize user progress if user is authenticated
    const user = getCurrentUser();
    if (user) {
      console.log('👤 User authenticated, ensuring user progress exists...');
      await getUserProgress(); // This will auto-initialize if needed
    }
    
    console.log('✅ Firebase collections initialized successfully');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Error initializing Firebase collections:', error);
    return { success: false, error: error.message };
  }
};

// Get specific level progress
export const getLevelProgress = async (levelId: number) => {
  try {
    const userProgress = await getUserProgress();
    if (!userProgress) {
      return null;
    }

    const levelKey = levelId.toString();
    return userProgress.levelProgress[levelKey] || null;
  } catch (error: any) {
    console.error('Error retrieving level progress:', error);
    return null;
  }
};

// Check if level is solved
export const isLevelSolved = async (levelId: number): Promise<boolean> => {
  try {
    const levelProgress = await getLevelProgress(levelId);
    return levelProgress?.solved || false;
  } catch (error: any) {
    console.error('Error checking level solved status:', error);
    return false;
  }
};

// Save puzzle to Firebase
export const savePuzzle = async (puzzle: Puzzle): Promise<{ success: boolean; error: string | null }> => {
  try {
    const puzzleRef = doc(firestore(), 'puzzles', puzzle.id);
    await setDoc(puzzleRef, {
      ...puzzle,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get puzzle from Firebase
export const getPuzzle = async (puzzleId: string): Promise<Puzzle | null> => {
  try {
    const puzzleRef = doc(firestore(), 'puzzles', puzzleId);
    const puzzleDoc = await getDoc(puzzleRef);

    if (puzzleDoc.exists()) {
      return puzzleDoc.data() as Puzzle;
    }

    return null;
  } catch (error: any) {
    console.error('Error getting puzzle:', error);
    return null;
  }
};

// Save puzzle pack to Firebase
export const savePuzzlePack = async (pack: PuzzlePack): Promise<{ success: boolean; error: string | null }> => {
  try {
    const packRef = doc(firestore(), 'puzzlePacks', pack.id);
    await setDoc(packRef, {
      ...pack,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save individual puzzles
    for (const puzzle of pack.puzzles) {
      await savePuzzle({ ...puzzle, packId: pack.id });
    }

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get puzzle pack from Firebase
export const getPuzzlePack = async (packId: string): Promise<PuzzlePack | null> => {
  try {
    const packRef = doc(firestore(), 'puzzlePacks', packId);
    const packDoc = await getDoc(packRef);

    if (packDoc.exists()) {
      const packData = packDoc.data() as PuzzlePack;
      
      // Get puzzles for this pack
      const puzzlesQuery = query(
        collection(firestore(), 'puzzles'),
        where('packId', '==', packId),
        orderBy('createdAt', 'asc')
      );
      
      const puzzlesSnapshot = await getDocs(puzzlesQuery);
      const puzzles: Puzzle[] = [];
      
      puzzlesSnapshot.forEach((doc) => {
        puzzles.push(doc.data() as Puzzle);
      });
      
      return { ...packData, puzzles };
    }

    return null;
  } catch (error: any) {
    console.error('Error getting puzzle pack:', error);
    return null;
  }
};

// Get all puzzle packs
export const getAllPuzzlePacks = async (): Promise<PuzzlePack[]> => {
  try {
    const packsQuery = query(
      collection(firestore(), 'puzzlePacks'),
      orderBy('createdAt', 'asc')
    );
    
    const packsSnapshot = await getDocs(packsQuery);
    const packs: PuzzlePack[] = [];
    
    for (const doc of packsSnapshot.docs) {
      const packData = doc.data() as PuzzlePack;
      
      // Get puzzles for this pack
      const puzzlesQuery = query(
        collection(firestore(), 'puzzles'),
        where('packId', '==', packData.id),
        orderBy('createdAt', 'asc')
      );
      
      const puzzlesSnapshot = await getDocs(puzzlesQuery);
      const puzzles: Puzzle[] = [];
      
      puzzlesSnapshot.forEach((puzzleDoc) => {
        puzzles.push(puzzleDoc.data() as Puzzle);
      });
      
      packs.push({ ...packData, puzzles });
    }
    
    return packs;
  } catch (error: any) {
    console.error('Error getting puzzle packs:', error);
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

    const userProgressRef = doc(firestore(), 'userProgress', user.uid);
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
      firestore(), 
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

    let completionsQuery = query(
      collection(firestore(), 'puzzleCompletions'),
      where('userId', '==', user.uid),
      orderBy('completedAt', 'desc')
    );

    if (puzzleId) {
      completionsQuery = query(
        collection(firestore(), 'puzzleCompletions'),
        where('userId', '==', user.uid),
        where('puzzleId', '==', puzzleId),
        orderBy('completedAt', 'desc')
      );
    }

    const completionsSnapshot = await getDocs(completionsQuery);
    const completions: any[] = [];

    completionsSnapshot.forEach((doc) => {
      completions.push(doc.data());
    });

    return completions;
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
  'starter-pack': { levelsRequired: 0, alwaysUnlocked: true },
  'challenge-pack': { levelsRequired: 3 },
  'expert-pack': { levelsRequired: 5 },
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

    const userProgressRef = doc(firestore(), 'userProgress', user.uid);
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