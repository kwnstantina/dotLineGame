import type { Cell } from './game';

export interface Puzzle {
  id: string;
  gridSize: number;
  cells: Cell[];
  numberedCells: { [key: string]: number };
  obstacles?: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  packId?: string;
  isUnlocked?: boolean;
}

export interface PuzzlePack {
  id: string;
  name: string;
  description: string;
  puzzles: Puzzle[];
  isUnlocked: boolean;
  requiredLevel?: number;
  icon: string;
  theme: string;
}