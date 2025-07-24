import {colors} from '../theme/colors';
import { APP_STRINGS } from '../constants/strings';

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
  solved?: boolean;
  completionTime?: number;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: APP_STRINGS.LEVEL_SELECTION.LEVELS.FIRST_STEPS.name,
    difficulty: 'Beginner',
    gridSize: 3,
    unlocked: true,
    requiresPayment: false,
    requiresAd: false,
    adDuration: 0,
    stars: 0,
    description: APP_STRINGS.LEVEL_SELECTION.LEVELS.FIRST_STEPS.description,
    icon: APP_STRINGS.LEVEL_SELECTION.LEVELS.FIRST_STEPS.icon,
    solved: true,
    completionTime: 45,
  },
  {
    id: 2,
    name: APP_STRINGS.LEVEL_SELECTION.LEVELS.GETTING_WARMER.name,
    difficulty: 'Beginner',
    gridSize: 4,
    unlocked: true,
    requiresPayment: false,
    requiresAd: false,
    adDuration: 0,
    stars: 0,
    description: APP_STRINGS.LEVEL_SELECTION.LEVELS.GETTING_WARMER.description,
    icon: APP_STRINGS.LEVEL_SELECTION.LEVELS.GETTING_WARMER.icon,
  },
  {
    id: 3,
    name: APP_STRINGS.LEVEL_SELECTION.LEVELS.STEADY_PROGRESS.name,
    difficulty: 'Intermediate',
    gridSize: 5,
    unlocked: true,
    requiresPayment: false,
    requiresAd: false,
    adDuration: 0,
    stars: 1,
    description: APP_STRINGS.LEVEL_SELECTION.LEVELS.STEADY_PROGRESS.description,
    icon: APP_STRINGS.LEVEL_SELECTION.LEVELS.STEADY_PROGRESS.icon,
    solved: true,
    completionTime: 120,
  },
  {
    id: 4,
    name: APP_STRINGS.LEVEL_SELECTION.LEVELS.MIND_BENDER.name,
    difficulty: 'Advanced',
    gridSize: 6,
    unlocked: false,
    requiresPayment: false,
    requiresAd: true,
    adDuration: 20,
    stars: 2,
    description: APP_STRINGS.LEVEL_SELECTION.LEVELS.MIND_BENDER.description,
    icon: APP_STRINGS.LEVEL_SELECTION.LEVELS.MIND_BENDER.icon,
  },
  {
    id: 5,
    name: APP_STRINGS.LEVEL_SELECTION.LEVELS.EXPERT_ZONE.name,
    difficulty: 'Advanced',
    gridSize: 7,
    unlocked: false,
    requiresPayment: false,
    requiresAd: true,
    adDuration: 30,
    stars: 2,
    description: APP_STRINGS.LEVEL_SELECTION.LEVELS.EXPERT_ZONE.description,
    icon: APP_STRINGS.LEVEL_SELECTION.LEVELS.EXPERT_ZONE.icon,
  },
  {
    id: 6,
    name: APP_STRINGS.LEVEL_SELECTION.LEVELS.MASTER_CLASS.name,
    difficulty: 'Expert',
    gridSize: 8,
    unlocked: false,
    requiresPayment: true,
    requiresAd: false,
    adDuration: 0,
    stars: 3,
    description: APP_STRINGS.LEVEL_SELECTION.LEVELS.MASTER_CLASS.description,
    icon: APP_STRINGS.LEVEL_SELECTION.LEVELS.MASTER_CLASS.icon,
  },
];

export const getDifficultyLevel = (size: number) => {
  if (size <= 3) { return APP_STRINGS.DIFFICULTY.BEGINNER; }
  if (size <= 5) { return APP_STRINGS.DIFFICULTY.INTERMEDIATE; }
  if (size <= 7) { return APP_STRINGS.DIFFICULTY.ADVANCED; }
  return APP_STRINGS.DIFFICULTY.EXPERT;
};

export const getDifficultyColor = (size: number) => {
  if (size <= 3) { return colors.feedback.success; }
  if (size <= 5) { return colors.feedback.warning; }
  if (size <= 7) { return colors.feedback.error; }
  return colors.interactive.accent;
};

export const getDifficultyGradient = (difficulty: string) => {
  switch (difficulty) {
    case APP_STRINGS.DIFFICULTY.BEGINNER:
      return ['#10B981', '#34D399'];
    case APP_STRINGS.DIFFICULTY.INTERMEDIATE:
      return ['#F59E0B', '#FBBF24'];
    case APP_STRINGS.DIFFICULTY.ADVANCED:
      return ['#EF4444', '#F87171'];
    case APP_STRINGS.DIFFICULTY.EXPERT:
      return ['#8B5CF6', '#A78BFA'];
    default:
      return ['#6B7280', '#9CA3AF'];
  }
};