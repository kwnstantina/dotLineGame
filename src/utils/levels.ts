import {colors} from '../theme/colors';

export interface Level {
  id: number;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  gridSize: number;
  unlocked: boolean;
  requiresPayment: boolean;
  requiresAd: boolean;
  adDuration: number; // in seconds
  stars: number;
  bestTime?: number;
  description: string;
  icon: string;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'First Steps',
    difficulty: 'Beginner',
    gridSize: 3,
    unlocked: true,
    requiresPayment: false,
    requiresAd: false,
    adDuration: 0,
    stars: 0,
    description: 'Learn the basics with a simple 3×3 grid',
    icon: '🌟',
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
    description: 'Step up to a 4×4 challenge',
    icon: '🔥',
  },
  {
    id: 3,
    name: 'Steady Progress',
    difficulty: 'Intermediate',
    gridSize: 5,
    unlocked: true,
    requiresPayment: false,
    requiresAd: false,
    adDuration: 0,
    stars: 0,
    description: 'Master the 5×5 grid like a pro',
    icon: '⚡',
  },
  {
    id: 4,
    name: 'Mind Bender',
    difficulty: 'Advanced',
    gridSize: 6,
    unlocked: false,
    requiresPayment: false,
    requiresAd: true,
    adDuration: 20,
    stars: 0,
    description: 'Challenge yourself with 6×6 complexity',
    icon: '🧠',
  },
  {
    id: 5,
    name: 'Expert Zone',
    difficulty: 'Advanced',
    gridSize: 7,
    unlocked: false,
    requiresPayment: false,
    requiresAd: true,
    adDuration: 30,
    stars: 0,
    description: 'Only for the most dedicated players',
    icon: '💎',
  },
  {
    id: 6,
    name: 'Master Class',
    difficulty: 'Expert',
    gridSize: 8,
    unlocked: false,
    requiresPayment: true,
    requiresAd: false,
    adDuration: 0,
    stars: 0,
    description: 'The ultimate puzzle experience',
    icon: '👑',
  },
];

export const getDifficultyLevel = (size: number) => {
  if (size <= 3) return 'Beginner';
  if (size <= 5) return 'Intermediate';
  if (size <= 7) return 'Advanced';
  return 'Expert';
};

export const getDifficultyColor = (size: number) => {
  if (size <= 3) return colors.feedback.success;
  if (size <= 5) return colors.feedback.warning;
  if (size <= 7) return colors.feedback.error;
  return colors.interactive.accent;
};

export const getDifficultyGradient = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return ['#10B981', '#34D399'];
    case 'Intermediate':
      return ['#F59E0B', '#FBBF24'];
    case 'Advanced':
      return ['#EF4444', '#F87171'];
    case 'Expert':
      return ['#8B5CF6', '#A78BFA'];
    default:
      return ['#6B7280', '#9CA3AF'];
  }
};