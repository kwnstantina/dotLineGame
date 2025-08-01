// Pack progression related types and interfaces

export interface PackProgressionResult {
  unlockedPacks: string[];
  newlyUnlockedPacks: string[];
  userLevel: number;
}

export interface PackCompletionStats {
  completed: number;
  total: number;
  percentage: number;
}

export interface PackUnlockStatus {
  packs: import('./puzzle').PuzzlePack[];
  userLevel: number;
  unlockedPackIds: string[];
}

export interface PuzzleReplayInfo {
  isImprovement: boolean;
  previousBestTime?: number;
  previousBestStars?: number;
  replayCount: number;
}

export interface ReplayRecommendation {
  puzzleId: string;
  reason: string;
  currentStars: number;
  potentialImprovement: string;
}

export interface PackRedirectSuggestion {
  shouldRedirect: boolean;
  suggestedPackId?: string;
  reason?: string;
}

export interface UserPackSummary {
  totalPacks: number;
  unlockedPacks: number;
  completedPacks: number;
  totalPuzzlesCompleted: number;
  overallProgress: number;
}

export interface PuzzleCompletionResult {
  packCompleted: boolean;
  newCompletionPercentage: number;
  totalCompleted: number;
  totalPuzzles: number;
}

// Pack unlock milestone configuration
export interface PackUnlockMilestone {
  level: number;
  packIds: string[];
  description?: string;
}

// Pack unlock requirement configuration
export interface PackUnlockRequirement {
  packId: string;
  levelsRequired: number;
  description: string;
  alwaysUnlocked?: boolean;
}

// Pack progression state for tracking user's journey
export interface PackProgressionState {
  currentLevel: number;
  unlockedPacks: Set<string>;
  packsWithProgress: Map<string, PackCompletionStats>;
  lastUnlockLevel?: number;
  nextMilestoneLevel?: number;
  nextMilestoneReward?: string[];
}

// Detailed pack analytics for insights
export interface PackAnalytics {
  packId: string;
  totalPlayTime: number;
  averageCompletionTime: number;
  bestEfficiencyScore: number;
  totalAttempts: number;
  perfectSolutions: number;
  improvementOpportunities: ReplayRecommendation[];
  progressTrend: 'improving' | 'stable' | 'declining';
}

// Pack recommendation system
export interface PackRecommendation {
  packId: string;
  reason: 'newly_unlocked' | 'incomplete' | 'improvement_opportunity' | 'perfect_candidate';
  priority: 'high' | 'medium' | 'low';
  estimatedTimeToComplete?: number;
  potentialRewards?: string[];
  userLevel: number;
}

// Pack unlock notification data
export interface PackUnlockNotification {
  packId: string;
  packName: string;
  unlockedAt: Date;
  triggerLevel: number;
  celebrationMessage: string;
  previewPuzzleCount: number;
  difficultyLevel: string;
  estimatedPlayTime?: number;
}

// User pack journey tracking
export interface UserPackJourney {
  totalJourneyTime: number;
  packsCompleted: string[];
  currentFocusPack?: string;
  milestoneProgress: {
    level: number;
    achievement: string;
    unlockedFeatures: string[];
  }[];
  nextGoals: {
    description: string;
    targetLevel: number;
    reward: string;
  }[];
}

// Pack difficulty progression
export interface PackDifficultyProgression {
  packId: string;
  baseDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
  adaptiveDifficulty: number; // 1-10 scale
  userPerformanceRating: number;
  recommendedNextDifficulty: 'easier' | 'same' | 'harder';
  difficultyTrend: 'increasing' | 'stable' | 'decreasing';
}