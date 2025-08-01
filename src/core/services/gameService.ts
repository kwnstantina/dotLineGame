import type { GameState, Position } from '../models/game';
import type { Puzzle } from '../models/puzzle';
import { validatePath, validatePuzzleCompletion } from './validationService';
import { GAME_CONSTANTS } from '../constants/game';

// Game state management
export class GameService {
  private gameState: GameState = {
    puzzle: null,
    drawnPath: [],
    isCompleted: false,
    isLoading: false,
  };
  
  private startTime: number = 0;
  private subscribers: Array<(state: GameState) => void> = [];

  // Subscribe to game state changes
  subscribe(callback: (state: GameState) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers of state changes
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback({ ...this.gameState }));
  }

  // Initialize game with puzzle
  initializeGame(puzzle: Puzzle): void {
    this.gameState = {
      puzzle,
      drawnPath: [],
      isCompleted: false,
      isLoading: false,
    };
    this.startTime = Date.now();
    this.notifySubscribers();
  }

  // Get current game state
  getGameState(): GameState {
    return { ...this.gameState };
  }

  // Add cell to path
  addCellToPath(cellId: string): boolean {
    if (!this.gameState.puzzle || this.gameState.isCompleted) {
      return false;
    }

    const cell = this.gameState.puzzle.cells.find(c => c.id === cellId);
    if (!cell || cell.isObstacle) {
      return false;
    }

    // Check if cell is already in path
    if (this.gameState.drawnPath.includes(cellId)) {
      return false;
    }

    // Check if cell is adjacent to last cell in path
    if (this.gameState.drawnPath.length > 0) {
      const lastCellId = this.gameState.drawnPath[this.gameState.drawnPath.length - 1];
      const lastCell = this.gameState.puzzle.cells.find(c => c.id === lastCellId);
      
      if (lastCell && !this.areCellsAdjacent(cell, lastCell)) {
        return false;
      }
    }

    this.gameState.drawnPath.push(cellId);
    this.checkCompletion();
    this.notifySubscribers();
    return true;
  }

  // Remove cell from path (undo last move)
  undoLastMove(): boolean {
    if (this.gameState.drawnPath.length === 0 || this.gameState.isCompleted) {
      return false;
    }

    this.gameState.drawnPath.pop();
    this.gameState.isCompleted = false;
    this.notifySubscribers();
    return true;
  }

  // Clear entire path
  clearPath(): void {
    if (this.gameState.isCompleted) {
      return;
    }

    this.gameState.drawnPath = [];
    this.gameState.isCompleted = false;
    this.notifySubscribers();
  }

  // Check if current path is complete and valid
  private checkCompletion(): void {
    if (!this.gameState.puzzle) return;

    const totalCells = this.gameState.puzzle.gridSize * this.gameState.puzzle.gridSize;
    const availableCells = totalCells - (this.gameState.puzzle.obstacles?.length || 0);

    // Check if all available cells are filled
    if (this.gameState.drawnPath.length === availableCells) {
      const isValid = validatePath(this.gameState.drawnPath, this.gameState.puzzle);
      this.gameState.isCompleted = isValid;
    }
  }

  // Get completion result
  getCompletionResult() {
    if (!this.gameState.puzzle || !this.gameState.isCompleted) {
      return null;
    }

    return validatePuzzleCompletion(
      this.gameState.drawnPath,
      this.gameState.puzzle,
      this.startTime
    );
  }

  // Check if two cells are adjacent
  private areCellsAdjacent(cell1: { row: number; col: number }, cell2: { row: number; col: number }): boolean {
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  // Get cells that can be added to current path
  getAvailableNextCells(): string[] {
    if (!this.gameState.puzzle || this.gameState.isCompleted) {
      return [];
    }

    if (this.gameState.drawnPath.length === 0) {
      // Any non-obstacle cell can be the first cell
      return this.gameState.puzzle.cells
        .filter(cell => !cell.isObstacle && !this.gameState.drawnPath.includes(cell.id))
        .map(cell => cell.id);
    }

    const lastCellId = this.gameState.drawnPath[this.gameState.drawnPath.length - 1];
    const lastCell = this.gameState.puzzle.cells.find(c => c.id === lastCellId);
    
    if (!lastCell) return [];

    return this.gameState.puzzle.cells
      .filter(cell => 
        !cell.isObstacle && 
        !this.gameState.drawnPath.includes(cell.id) &&
        this.areCellsAdjacent(cell, lastCell)
      )
      .map(cell => cell.id);
  }

  // Get hint for next numbered cell
  getNextNumberedCellHint(): string | null {
    if (!this.gameState.puzzle || this.gameState.isCompleted) {
      return null;
    }

    const numberedCellIds = Object.keys(this.gameState.puzzle.numberedCells).sort(
      (a, b) => this.gameState.puzzle!.numberedCells[a] - this.gameState.puzzle!.numberedCells[b]
    );

    // Find the next numbered cell that hasn't been visited
    for (const cellId of numberedCellIds) {
      if (!this.gameState.drawnPath.includes(cellId)) {
        return cellId;
      }
    }

    return null;
  }

  // Calculate current path efficiency
  getCurrentEfficiency(): number {
    if (!this.gameState.puzzle || this.gameState.drawnPath.length === 0) {
      return 0;
    }

    const totalCells = this.gameState.puzzle.gridSize * this.gameState.puzzle.gridSize;
    const availableCells = totalCells - (this.gameState.puzzle.obstacles?.length || 0);
    const currentMoves = this.gameState.drawnPath.length;
    
    return Math.round((availableCells / Math.max(currentMoves, availableCells)) * 100);
  }

  // Reset game to initial state
  reset(): void {
    if (this.gameState.puzzle) {
      this.initializeGame(this.gameState.puzzle);
    }
  }

  // Get current play time in seconds
  getCurrentPlayTime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }
}

// Singleton instance
let gameServiceInstance: GameService | null = null;

export const getGameService = (): GameService => {
  if (!gameServiceInstance) {
    gameServiceInstance = new GameService();
  }
  return gameServiceInstance;
};

// Utility functions for game logic
export const GameUtils = {
  // Calculate cell position from grid coordinates
  getCellPosition(row: number, col: number, cellSize: number, gridOffset: Position = { x: 0, y: 0 }): Position {
    return {
      x: gridOffset.x + (col * cellSize),
      y: gridOffset.y + (row * cellSize),
    };
  },

  // Calculate grid coordinates from touch position
  getGridCoordinates(touchPosition: Position, cellSize: number, gridOffset: Position = { x: 0, y: 0 }): { row: number; col: number } {
    return {
      row: Math.floor((touchPosition.y - gridOffset.y) / cellSize),
      col: Math.floor((touchPosition.x - gridOffset.x) / cellSize),
    };
  },

  // Check if position is within grid bounds
  isValidGridPosition(row: number, col: number, gridSize: number): boolean {
    return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
  },

  // Generate cell ID from coordinates
  getCellId(row: number, col: number): string {
    return `${row}-${col}`;
  },

  // Parse cell ID to coordinates
  parseCellId(cellId: string): { row: number; col: number } {
    const [row, col] = cellId.split('-').map(Number);
    return { row, col };
  },

  // Calculate optimal grid size for screen
  calculateOptimalCellSize(screenWidth: number, screenHeight: number, gridSize: number, padding: number = 20): number {
    const availableWidth = screenWidth - (padding * 2);
    const availableHeight = screenHeight - (padding * 2);
    const maxCellSize = Math.min(availableWidth, availableHeight) / gridSize;
    
    return Math.max(
      GAME_CONSTANTS.MIN_GRID_SIZE * 10, // Minimum cell size based on grid
      Math.min(80, Math.floor(maxCellSize)) // Maximum 80px per cell
    );
  },
};