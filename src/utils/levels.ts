import { COLORS} from '../core/theme/designSystem';
import { APP_STRINGS } from '../constants/strings';

export interface Level {
  id: number;
  name: string;
  difficulty:'Exercise'| 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
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
    difficulty:'Exercise',
    gridSize: 3,
    unlocked: true,
    requiresPayment: false,
    requiresAd: false,
    adDuration: 0,
    stars: 0,
    description: APP_STRINGS.LEVEL_SELECTION.LEVELS.FIRST_STEPS.description,
    icon: APP_STRINGS.LEVEL_SELECTION.LEVELS.FIRST_STEPS.icon,
    solved: false,
    completionTime: 45,
  },
  {
    id: 2,
    name: APP_STRINGS.LEVEL_SELECTION.LEVELS.GETTING_WARMER.name,
    difficulty:APP_STRINGS.DIFFICULTY.BEGINNER,
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
    difficulty: APP_STRINGS.DIFFICULTY.INTERMEDIATE,
    gridSize: 5,
    unlocked: true,
    requiresPayment: false,
    requiresAd: false,
    adDuration: 0,
    stars: 1,
    description: APP_STRINGS.LEVEL_SELECTION.LEVELS.STEADY_PROGRESS.description,
    icon: APP_STRINGS.LEVEL_SELECTION.LEVELS.STEADY_PROGRESS.icon,
    solved: false,
    completionTime: 120,
  },
  {
    id: 4,
    name: APP_STRINGS.LEVEL_SELECTION.LEVELS.MIND_BENDER.name,
    difficulty: APP_STRINGS.DIFFICULTY.ADVANCED,
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
    difficulty: APP_STRINGS.DIFFICULTY.ADVANCED,
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
    difficulty: APP_STRINGS.DIFFICULTY.EXPERT,
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
  if (size <= 3) { return COLORS.feedback.success; }
  if (size <= 5) { return COLORS.feedback.warning; }
  if (size <= 7) { return COLORS.feedback.error; }
  return COLORS.interactive.accent;
};

export const getDifficultyGradient = (difficulty: string) => {
  switch (difficulty) {
    case APP_STRINGS.DIFFICULTY.BEGINNER:
      return [COLORS.primary.oceanWhite,COLORS.background.surface];
    case APP_STRINGS.DIFFICULTY.INTERMEDIATE:
      return [COLORS.primary.purpleDark, COLORS.primary.oceanWhite];
    case APP_STRINGS.DIFFICULTY.ADVANCED:
      return [COLORS.primary.purple, COLORS.primary.purpleLight];
    case APP_STRINGS.DIFFICULTY.EXPERT:
      return [COLORS.primary.black, COLORS.text.primary];
    default:
      return [COLORS.feedback.info, COLORS.feedback.info];
  }
};