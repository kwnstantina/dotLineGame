// Achievement system models

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'puzzle' | 'level' | 'efficiency' | 'speed' | 'collection' | 'time' | 'special';
  type: 'single' | 'progress' | 'milestone';
  
  // Unlock conditions
  condition: {
    type: 'puzzles_completed' | 'levels_completed' | 'stars_earned' | 'packs_unlocked' | 
          'average_efficiency' | 'fastest_time' | 'perfect_completions' | 'total_play_time' |
          'consecutive_perfects' | 'first_completion' | 'custom';
    target?: number;
    threshold?: number;
    customCondition?: string; // For complex conditions
  };
  
  // Reward information
  reward?: {
    type: 'badge' | 'title' | 'unlock' | 'cosmetic';
    value?: string;
  };
  
  // Metadata
  isActive: boolean;
  sortOrder: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number; // Achievement points for gamification
  
  // Time-based constraints
  timeLimit?: number; // For time-limited achievements
  expiresAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  
  // Progress tracking
  currentValue: number; // Current metric value (e.g., puzzles completed)
  lastUpdated: Date;
  
  // Additional metadata
  metadata?: {
    [key: string]: any; // For storing additional progress data
  };
}

export interface AchievementProgress {
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  progressPercentage: number;
  rarity: string;
  points: number;
  unlockedAt?: Date;
}

export interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  totalPoints: number;
  completionPercentage: number;
  rareAchievements: number;
  recentUnlocks: UserAchievement[];
}

export interface AchievementNotification {
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  points: number;
  unlockedAt: Date;
}