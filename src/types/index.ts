export interface Cell {
  id: string;
  row: number;
  col: number;
  number?: number;
  isDrawn: boolean;
}

export interface Puzzle {
  id: string;
  gridSize: number;
  cells: Cell[];
  numberedCells: { [key: string]: number };
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