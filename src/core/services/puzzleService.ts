import type { Puzzle, PuzzlePack } from '../models/puzzle';
import type { Cell } from '../models/game';
import { GAME_CONSTANTS, DIFFICULTY_SETTINGS } from '../constants/game';

let puzzleCounter = 0;

// Generate random positions ensuring they create a solvable path
const generateRandomPositions = (gridSize: number, count: number): string[] => {
  const positions: string[] = [];
  const usedPositions = new Set<string>();
  
  // Start with corner or edge positions for better puzzle design
  const startPositions = [
    '0-0', `0-${gridSize-1}`,
    `${gridSize-1}-0`, `${gridSize-1}-${gridSize-1}`
  ];
  
  // Add first position
  const firstPos = startPositions[Math.floor(Math.random() * startPositions.length)];
  positions.push(firstPos);
  usedPositions.add(firstPos);
  
  // Generate remaining positions with some logic to spread them out
  for (let i = 1; i < count; i++) {
    let attempts = 0;
    let newPos: string;
    
    do {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      newPos = `${row}-${col}`;
      attempts++;
    } while (usedPositions.has(newPos) && attempts < GAME_CONSTANTS.MAX_GENERATION_ATTEMPTS);
    
    if (!usedPositions.has(newPos)) {
      positions.push(newPos);
      usedPositions.add(newPos);
    }
  }
  
  return positions;
};

// Generate obstacle positions that don't block the solution path
const generateObstaclePositions = (
  gridSize: number, 
  numberedPositions: string[], 
  obstacleCount: number
): string[] => {
  const obstacles: string[] = [];
  const usedPositions = new Set(numberedPositions);
  
  for (let i = 0; i < obstacleCount; i++) {
    let attempts = 0;
    let obstaclePos: string;
    
    do {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      obstaclePos = `${row}-${col}`;
      attempts++;
    } while (usedPositions.has(obstaclePos) && attempts < GAME_CONSTANTS.MAX_GENERATION_ATTEMPTS);
    
    if (!usedPositions.has(obstaclePos)) {
      obstacles.push(obstaclePos);
      usedPositions.add(obstaclePos);
    }
  }
  
  return obstacles;
};

// Get obstacle count based on difficulty
const getObstacleCount = (gridSize: number, difficulty: keyof typeof DIFFICULTY_SETTINGS): number => {
  const maxObstacles = Math.floor(gridSize * gridSize * GAME_CONSTANTS.MAX_OBSTACLE_PERCENTAGE);
  const settings = DIFFICULTY_SETTINGS[difficulty];
  
  return Math.floor(maxObstacles * settings.obstacleMultiplier);
};

// Generate puzzle layout with numbered cells and obstacles based on difficulty
export const generatePuzzleLayout = (
  gridSize: number, 
  difficulty: keyof typeof DIFFICULTY_SETTINGS
) => {
  const numberedCells: {[key: string]: number} = {};
  const obstacles: string[] = [];
  
  // Base numbered cells generation
  const numNumbers = Math.min(gridSize, GAME_CONSTANTS.MAX_NUMBERED_CELLS);
  const positions = generateRandomPositions(gridSize, numNumbers);
  
  positions.forEach((pos, index) => {
    numberedCells[pos] = index + 1;
  });
  
  // Add obstacles based on difficulty
  const obstacleCount = getObstacleCount(gridSize, difficulty);
  if (obstacleCount > 0) {
    const obstaclePositions = generateObstaclePositions(gridSize, positions, obstacleCount);
    obstacles.push(...obstaclePositions);
  }
  
  return { numberedCells, obstacles };
};

// Create a sample puzzle with specified parameters
export const createSamplePuzzle = (
  gridSize: number = 5, 
  difficulty: keyof typeof DIFFICULTY_SETTINGS = 'easy'
): Puzzle => {
  // Validate grid size
  const validatedGridSize = Math.max(
    GAME_CONSTANTS.MIN_GRID_SIZE,
    Math.min(gridSize, GAME_CONSTANTS.MAX_GRID_SIZE)
  );
  
  const cells: Cell[] = [];
  
  // Create all cells
  for (let row = 0; row < validatedGridSize; row++) {
    for (let col = 0; col < validatedGridSize; col++) {
      cells.push({
        id: `${row}-${col}`,
        row,
        col,
        isDrawn: false,
        isObstacle: false,
      });
    }
  }

  // Generate numbered cells and obstacles based on difficulty
  const { numberedCells, obstacles } = generatePuzzleLayout(validatedGridSize, difficulty);
  
  // Update cells with numbers and obstacles
  cells.forEach(cell => {
    if (numberedCells[cell.id]) {
      cell.number = numberedCells[cell.id];
    }
    if (obstacles.includes(cell.id)) {
      cell.isObstacle = true;
    }
  });

  // Generate unique ID using counter and timestamp to avoid duplicates
  puzzleCounter++;
  return {
    id: `puzzle-${validatedGridSize}x${validatedGridSize}-${difficulty}-${Date.now()}-${puzzleCounter}`,
    gridSize: validatedGridSize,
    cells,
    numberedCells,
    obstacles,
    difficulty,
    isUnlocked: true,
  };
};

// Create advanced puzzle (legacy method - kept for compatibility)
export const createAdvancedPuzzle = (): Puzzle => {
  return createSamplePuzzle(6, 'medium');
};

// Generate multiple puzzles for a level
export const generatePuzzlesForLevel = (level: number, count: number = 5): Puzzle[] => {
  const puzzles: Puzzle[] = [];
  const gridSize = Math.min(
    GAME_CONSTANTS.MIN_GRID_SIZE + Math.floor(level / 2), 
    GAME_CONSTANTS.MAX_GRID_SIZE
  );

  const difficulties: (keyof typeof DIFFICULTY_SETTINGS)[] = ['easy', 'medium', 'hard', 'expert'];

  for (let i = 0; i < count; i++) {
    const difficultyIndex = Math.min(Math.floor(level / 3), difficulties.length - 1);
    const difficulty = difficulties[difficultyIndex];
    
    puzzles.push(createSamplePuzzle(gridSize, difficulty));
  }
  
  return puzzles;
};

// Create multiple puzzles (legacy method - kept for compatibility)
export const createMultiplePuzzles = (): Puzzle[] => {
  return [
    createSamplePuzzle(),
    createAdvancedPuzzle(),
  ];
};

// Create puzzle packs with proper difficulty progression
export const createPuzzlePacks = (packCodes: Record<string, string>): PuzzlePack[] => {
  return [
    {
      id: packCodes.starterPack,
      name: 'Starter Pack',
      description: 'Perfect for beginners',
      puzzles: generatePuzzlesForLevel(1, 10),
      isUnlocked: true,
      icon: '🌟',
      theme: 'green'
    },
    {
      id: packCodes.challengePack,
      name: 'Challenge Pack',
      description: 'Test your skills',
      puzzles: generatePuzzlesForLevel(3, 8),
      isUnlocked: false,
      requiredLevel: 3,
      icon: '⚡',
      theme: 'orange'
    },
    {
      id: packCodes.expertPack,
      name: 'Expert Pack',
      description: 'For puzzle masters',
      puzzles: generatePuzzlesForLevel(5, 6),
      isUnlocked: false,
      requiredLevel: 5,
      icon: '🏆',
      theme: 'purple'
    }
  ];
};