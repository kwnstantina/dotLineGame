// user-progress.model.ts

export interface PuzzleCompletionDetail {
  completed: boolean;
  completionTime?: number; // in seconds
  moves?: number;
  // Add more fields as needed
}

export interface UserProgress {
  // ...existing code...
  packsUnlocked: { [packId: string]: boolean }; // Track which packs are unlocked
  puzzleCompletions: {
    [packId: string]: {
      [puzzleId: string]: PuzzleCompletionDetail;
    };
  };
  // ...existing code...
}