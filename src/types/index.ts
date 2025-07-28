export interface Cell {
  id: string;
  row: number;
  col: number;
  number?: number;
  isDrawn: boolean;
  isObstacle?: boolean;
}

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

export interface GameState {
  puzzle: Puzzle | null;
  drawnPath: string[];
  isCompleted: boolean;
  isLoading: boolean;
}

export interface Position {
  x: number;
  y: number;
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

export interface CompletionResult {
  isValid: boolean;
  completionTime: number;
  moveCount: number;
  efficiency: number;
  stars: number;
  errors: string[];
}