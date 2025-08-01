import { Puzzle } from "./puzzle";

export interface Cell {
  id: string;
  row: number;
  col: number;
  number?: number;
  isDrawn: boolean;
  isObstacle?: boolean;
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

export interface CompletionResult {
  isValid: boolean;
  completionTime: number;
  moveCount: number;
  efficiency: number;
  stars: number;
  errors: string[];
}