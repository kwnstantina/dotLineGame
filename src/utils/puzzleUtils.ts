import {Cell, Puzzle, CompletionResult, PuzzlePack} from '../types';

export const createSamplePuzzle = (gridSize: number = 5, difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'easy'): Puzzle => {
  const cells: Cell[] = [];
  
  // Create all cells
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
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
  const { numberedCells, obstacles } = generatePuzzleLayout(gridSize, difficulty);
  
  // Update cells with numbers and obstacles
  cells.forEach(cell => {
    if (numberedCells[cell.id]) {
      cell.number = numberedCells[cell.id];
    }
    if (obstacles.includes(cell.id)) {
      cell.isObstacle = true;
    }
  });

  return {
    id: `puzzle-${gridSize}x${gridSize}-${difficulty}-${Date.now()}`,
    gridSize,
    cells,
    numberedCells,
    obstacles,
    difficulty,
    isUnlocked: true,
  };
};

export const createMultiplePuzzles = (): Puzzle[] => {
  return [
    createSamplePuzzle(),
    // Add more puzzles here for variety
    createAdvancedPuzzle(),
  ];
};

export const createAdvancedPuzzle = (): Puzzle => {
  const gridSize = 6;
  const cells: Cell[] = [];
  
  // Create all cells
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      cells.push({
        id: `${row}-${col}`,
        row,
        col,
        isDrawn: false,
      });
    }
  }

  // More challenging 6x6 puzzle
  const numberedCells: {[key: string]: number} = {
    '0-0': 1,
    '2-5': 2,
    '4-2': 3,
    '1-1': 4,
    '5-5': 5,
    '3-0': 6,
  };

  // Update cells with numbers
  cells.forEach(cell => {
    if (numberedCells[cell.id]) {
      cell.number = numberedCells[cell.id];
    }
  });

  return {
  id: 'advanced-puzzle-1',
  gridSize,
  cells,
  numberedCells,
  difficulty: 'medium'
};
};

export const validatePath = (path: string[], puzzle: Puzzle): boolean => {
  if (!puzzle) return false;
  
  // Check if all cells are filled
  if (path.length !== puzzle.gridSize * puzzle.gridSize) {
    return false;
  }
  
  // Check continuity
  for (let i = 1; i < path.length; i++) {
    const currentCell = puzzle.cells.find(c => c.id === path[i]);
    const prevCell = puzzle.cells.find(c => c.id === path[i - 1]);
    
    if (!currentCell || !prevCell) return false;
    
    const rowDiff = Math.abs(currentCell.row - prevCell.row);
    const colDiff = Math.abs(currentCell.col - prevCell.col);
    
    // Check if adjacent
    if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) {
      return false;
    }
  }
  
  // Check if numbered cells are visited in order
  const numberedCellIds = Object.keys(puzzle.numberedCells).sort(
    (a, b) => puzzle.numberedCells[a] - puzzle.numberedCells[b]
  );
  
  let currentNumberIndex = 0;
  for (const cellId of path) {
    if (puzzle.numberedCells[cellId]) {
      if (cellId !== numberedCellIds[currentNumberIndex]) {
        return false;
      }
      currentNumberIndex++;
    }
  }
  
  // Check if all numbered cells were visited
  return currentNumberIndex === numberedCellIds.length;
};

// Generate puzzle layout with numbered cells and obstacles based on difficulty
export const generatePuzzleLayout = (gridSize: number, difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
  const numberedCells: {[key: string]: number} = {};
  const obstacles: string[] = [];
  
  // Base numbered cells generation
  const numNumbers = Math.min(gridSize, 6);
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
    } while (usedPositions.has(newPos) && attempts < 50);
    
    if (!usedPositions.has(newPos)) {
      positions.push(newPos);
      usedPositions.add(newPos);
    }
  }
  
  return positions;
};

// Generate obstacle positions that don't block the solution path
const generateObstaclePositions = (gridSize: number, numberedPositions: string[], obstacleCount: number): string[] => {
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
    } while (usedPositions.has(obstaclePos) && attempts < 30);
    
    if (!usedPositions.has(obstaclePos)) {
      obstacles.push(obstaclePos);
      usedPositions.add(obstaclePos);
    }
  }
  
  return obstacles;
};

// Get obstacle count based on difficulty
const getObstacleCount = (gridSize: number, difficulty: 'easy' | 'medium' | 'hard' | 'expert'): number => {
  const maxObstacles = Math.floor(gridSize * gridSize * 0.15); // Max 15% of grid
  
  switch (difficulty) {
    case 'easy': return 0;
    case 'medium': return Math.floor(maxObstacles * 0.3);
    case 'hard': return Math.floor(maxObstacles * 0.6);
    case 'expert': return maxObstacles;
    default: return 0;
  }
};

// Enhanced completion detection with detailed results
export const validatePuzzleCompletion = (path: string[], puzzle: Puzzle, startTime: number): CompletionResult => {
  const errors: string[] = [];
  let isValid = true;
  
  if (!puzzle) {
    return {
      isValid: false,
      completionTime: 0,
      moveCount: 0,
      efficiency: 0,
      stars: 0,
      errors: ['Puzzle not found']
    };
  }
  
  const completionTime = Math.floor((Date.now() - startTime) / 1000);
  const totalCells = puzzle.gridSize * puzzle.gridSize;
  const availableCells = totalCells - (puzzle.obstacles?.length || 0);
  
  // Check if all available cells are filled
  if (path.length !== availableCells) {
    errors.push(`Expected ${availableCells} cells, got ${path.length}`);
    isValid = false;
  }
  
  // Check for obstacles in path
  const obstacleHit = path.find(cellId => puzzle.obstacles?.includes(cellId));
  if (obstacleHit) {
    errors.push(`Path goes through obstacle at ${obstacleHit}`);
    isValid = false;
  }
  
  // Check continuity
  for (let i = 1; i < path.length; i++) {
    const currentCell = puzzle.cells.find(c => c.id === path[i]);
    const prevCell = puzzle.cells.find(c => c.id === path[i - 1]);
    
    if (!currentCell || !prevCell) {
      errors.push(`Invalid cell reference at position ${i}`);
      isValid = false;
      continue;
    }
    
    const rowDiff = Math.abs(currentCell.row - prevCell.row);
    const colDiff = Math.abs(currentCell.col - prevCell.col);
    
    if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) {
      errors.push(`Non-adjacent cells at positions ${i-1} and ${i}`);
      isValid = false;
    }
  }
  
  // Check numbered cells order
  const numberedCellIds = Object.keys(puzzle.numberedCells).sort(
    (a, b) => puzzle.numberedCells[a] - puzzle.numberedCells[b]
  );
  
  let currentNumberIndex = 0;
  for (const cellId of path) {
    if (puzzle.numberedCells[cellId]) {
      if (cellId !== numberedCellIds[currentNumberIndex]) {
        errors.push(`Numbered cells visited out of order`);
        isValid = false;
        break;
      }
      currentNumberIndex++;
    }
  }
  
  if (currentNumberIndex !== numberedCellIds.length) {
    errors.push(`Not all numbered cells visited`);
    isValid = false;
  }
  
  // Calculate efficiency and stars
  const optimalMoves = availableCells;
  const efficiency = Math.min(100, Math.round((optimalMoves / path.length) * 100));
  const timeBonus = Math.max(0, 300 - completionTime); // Bonus for completing under 5 minutes
  
  let stars = 0;
  if (isValid) {
    if (efficiency >= 95 && timeBonus > 180) stars = 3;
    else if (efficiency >= 85 && timeBonus > 60) stars = 2;
    else stars = 1;
  }
  
  return {
    isValid,
    completionTime,
    moveCount: path.length,
    efficiency,
    stars,
    errors
  };
};

// Generate multiple puzzles for a level
export const generatePuzzlesForLevel = (level: number, count: number = 5): Puzzle[] => {
  const puzzles: Puzzle[] = [];
  const gridSize = Math.min(3 + Math.floor(level / 2), 8);
  
  const difficulties: ('easy' | 'medium' | 'hard' | 'expert')[] = ['easy', 'medium', 'hard', 'expert'];
  
  for (let i = 0; i < count; i++) {
    const difficultyIndex = Math.min(Math.floor(level / 3), difficulties.length - 1);
    const difficulty = difficulties[difficultyIndex];
    
    puzzles.push(createSamplePuzzle(gridSize, difficulty));
  }
  
  return puzzles;
};

// Create puzzle packs
export const createPuzzlePacks = (): PuzzlePack[] => {
  return [
    {
      id: 'starter-pack',
      name: 'Starter Pack',
      description: 'Perfect for beginners',
      puzzles: generatePuzzlesForLevel(1, 10),
      isUnlocked: true,
      icon: '🌟',
      theme: 'green'
    },
    {
      id: 'challenge-pack',
      name: 'Challenge Pack',
      description: 'Test your skills',
      puzzles: generatePuzzlesForLevel(3, 8),
      isUnlocked: false,
      requiredLevel: 3,
      icon: '⚡',
      theme: 'orange'
    },
    {
      id: 'expert-pack',
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