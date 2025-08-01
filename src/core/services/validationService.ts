import { VALIDATION_CONSTANTS, ERROR_MESSAGES } from '../constants/validation';
import { GAME_CONSTANTS } from '../constants/game';
import type { Puzzle } from '../models/puzzle';
import type { CompletionResult } from '../models/game';

// Email validation
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email.trim()) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (email.length < VALIDATION_CONSTANTS.EMAIL_MIN_LENGTH || 
      email.length > VALIDATION_CONSTANTS.EMAIL_MAX_LENGTH) {
    return { isValid: false, message: ERROR_MESSAGES.INVALID_EMAIL };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: ERROR_MESSAGES.INVALID_EMAIL };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH) {
    return { isValid: false, message: ERROR_MESSAGES.WEAK_PASSWORD };
  }
  
  if (password.length > VALIDATION_CONSTANTS.PASSWORD_MAX_LENGTH) {
    return { isValid: false, message: 'Password is too long' };
  }
  
  return { isValid: true };
};

// Password confirmation validation
export const validatePasswordConfirmation = (
  password: string, 
  confirmPassword: string
): { isValid: boolean; message?: string } => {
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  
  return { isValid: true };
};

// Complete auth form validation
export const validateAuthForm = (
  email: string,
  password: string,
  confirmPassword?: string,
  mode: 'login' | 'register' | 'forgot' = 'login'
): { isValid: boolean; message?: string } => {
  // For forgot password, only validate email
  if (mode === 'forgot') {
    return validateEmail(email);
  }

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  // For registration, validate password confirmation
  if (mode === 'register' && confirmPassword !== undefined) {
    const confirmValidation = validatePasswordConfirmation(password, confirmPassword);
    if (!confirmValidation.isValid) {
      return confirmValidation;
    }
  }

  return { isValid: true };
};

// Game path validation
export const validatePath = (path: string[], puzzle: Puzzle): boolean => {
  if (!puzzle) return false;
  
  // Check minimum path length
  if (path.length < VALIDATION_CONSTANTS.PATH_MIN_LENGTH) {
    return false;
  }
  
  // Check if all available cells are filled
  const totalCells = puzzle.gridSize * puzzle.gridSize;
  const availableCells = totalCells - (puzzle.obstacles?.length || 0);
  if (path.length !== availableCells) {
    return false;
  }
  
  // Check for obstacles in path
  if (puzzle.obstacles?.some(obstacle => path.includes(obstacle))) {
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

// Enhanced completion validation with detailed results
export const validatePuzzleCompletion = (
  path: string[], 
  puzzle: Puzzle, 
  startTime: number
): CompletionResult => {
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
  
  // Validate completion time
  if (completionTime > VALIDATION_CONSTANTS.MAX_COMPLETION_TIME) {
    errors.push('Completion time exceeded maximum allowed');
    isValid = false;
  }
  
  // Check if all available cells are filled
  if (path.length !== availableCells) {
    errors.push(`Expected ${availableCells} cells, got ${path.length}`);
    isValid = false;
  }
  
  // Check for obstacles in path
  const obstacleHit = path.find(cellId => puzzle.obstacles?.includes(cellId));
  if (obstacleHit) {
    errors.push(ERROR_MESSAGES.OBSTACLE_HIT);
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
      errors.push(ERROR_MESSAGES.INVALID_PATH);
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
        errors.push(ERROR_MESSAGES.WRONG_ORDER);
        isValid = false;
        break;
      }
      currentNumberIndex++;
    }
  }
  
  if (currentNumberIndex !== numberedCellIds.length) {
    errors.push(ERROR_MESSAGES.INCOMPLETE_PATH);
    isValid = false;
  }
  
  // Calculate efficiency and stars
  const optimalMoves = availableCells;
  const efficiency = Math.min(
    VALIDATION_CONSTANTS.MAX_EFFICIENCY, 
    Math.round((optimalMoves / path.length) * 100)
  );
  const timeBonus = Math.max(0, GAME_CONSTANTS.OPTIMAL_COMPLETION_TIME - completionTime);
  
  let stars = 0;
  if (isValid) {
    if (efficiency >= GAME_CONSTANTS.EFFICIENCY_THRESHOLDS.THREE_STARS && 
        timeBonus > GAME_CONSTANTS.TIME_BONUS_THRESHOLDS.THREE_STARS) {
      stars = 3;
    } else if (efficiency >= GAME_CONSTANTS.EFFICIENCY_THRESHOLDS.TWO_STARS && 
               timeBonus > GAME_CONSTANTS.TIME_BONUS_THRESHOLDS.TWO_STARS) {
      stars = 2;
    } else {
      stars = 1;
    }
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