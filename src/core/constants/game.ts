// Game-related constants
export const GAME_CONSTANTS = {
  MIN_GRID_SIZE: 3,
  MAX_GRID_SIZE: 8,
  MIN_COMPLETION_TIME: 5, // seconds
  MAX_COMPLETION_TIME: 600, // 10 minutes
  OPTIMAL_COMPLETION_TIME: 300, // 5 minutes
  
  // Scoring constants
  MAX_STARS: 3,
  EFFICIENCY_THRESHOLDS: {
    THREE_STARS: 95,
    TWO_STARS: 85,
  },
  TIME_BONUS_THRESHOLDS: {
    THREE_STARS: 180, // 3 minutes bonus
    TWO_STARS: 60,    // 1 minute bonus
  },
  
  // Puzzle generation
  MAX_OBSTACLE_PERCENTAGE: 0.15,
  MIN_NUMBERED_CELLS: 2,
  MAX_NUMBERED_CELLS: 6,
  MAX_GENERATION_ATTEMPTS: 50,
} as const;

// Difficulty-based settings
export const DIFFICULTY_SETTINGS = {
  easy: {
    obstacleMultiplier: 0,
    minGridSize: 3,
    maxGridSize: 4,
  },
  medium: {
    obstacleMultiplier: 0.3,
    minGridSize: 4,
    maxGridSize: 5,
  },
  hard: {
    obstacleMultiplier: 0.6,
    minGridSize: 5,
    maxGridSize: 6,
  },
  expert: {
    obstacleMultiplier: 1.0,
    minGridSize: 6,
    maxGridSize: 8,
  },
} as const;

// Pack unlock requirements
export const PACK_UNLOCK_REQUIREMENTS = {
  starterPack: { levelsRequired: 0, alwaysUnlocked: true },
  challengePack: { levelsRequired: 3 },
  expertPack: { levelsRequired: 5 },
} as const;