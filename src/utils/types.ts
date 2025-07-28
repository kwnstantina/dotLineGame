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