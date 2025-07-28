// src/models/user-progress.model.ts

export interface PuzzleCompletionDetail {
  completed: boolean;
  completionTime?: number;
  moves?: number;
  // ...add more fields as needed...
}

export interface UserProgress {
  // ...existing code...
  packsUnlocked: { [packId: string]: boolean };
  puzzleCompletions: {
    [packId: string]: {
      [puzzleId: string]: PuzzleCompletionDetail;
    };
  };
  // ...existing code...
}