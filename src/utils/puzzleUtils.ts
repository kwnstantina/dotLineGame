import {Cell, Puzzle} from '../types';

export const createSamplePuzzle = (): Puzzle => {
  const gridSize = 5;
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

  // Add numbered cells for a more interesting solvable puzzle
  // Solution path: 1(0,0) → 2(1,0) → 3(2,1) → 4(3,2) → 5(4,4)
  const numberedCells: {[key: string]: number} = {
    '0-0': 1,  // Top-left corner
    '1-0': 2,  // One down from start
    '2-1': 3,  // Center-left area  
    '3-2': 4,  // Lower-center
    '4-4': 5,  // Bottom-right corner
  };

  // Update cells with numbers
  cells.forEach(cell => {
    if (numberedCells[cell.id]) {
      cell.number = numberedCells[cell.id];
    }
  });

  return {
    id: 'sample-puzzle-1',
    gridSize,
    cells,
    numberedCells,
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