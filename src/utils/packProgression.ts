// ⚠️ DEPRECATED: This file has been moved to ../core/services/packProgressionService.ts
// This file provides backward compatibility during migration
// Please update your imports to use the new location

import {
  checkPackProgression as newCheckPackProgression,
  getPackUnlockStatus as newGetPackUnlockStatus,
  getPackCompletionStats as newGetPackCompletionStats,
  getPackUnlockMessage as newGetPackUnlockMessage,
  getNewlyUnlockedPacks as newGetNewlyUnlockedPacks,
  processLevelCompletion as newProcessLevelCompletion,
  getPackUnlockRequirements as newGetPackUnlockRequirements,
  processPuzzleCompletion as newProcessPuzzleCompletion,
  trackPuzzleReplay as newTrackPuzzleReplay,
  getReplayRecommendations as newGetReplayRecommendations,
  shouldRedirectToPackPuzzles as newShouldRedirectToPackPuzzles,
  getUserPackSummary as newGetUserPackSummary,
  type PackProgressionResult,
  type PackCompletionStats,
  type PackUnlockStatus,
  type PuzzleReplayInfo,
  type ReplayRecommendation,
  type PackRedirectSuggestion,
  type UserPackSummary,
  type PuzzleCompletionResult,
} from '../core/services/packProgressionService';

// Re-export types for backward compatibility
export type {
  PackProgressionResult,
  PackCompletionStats,
  PackUnlockStatus,
  PuzzleReplayInfo,
  ReplayRecommendation,
  PackRedirectSuggestion,
  UserPackSummary,
  PuzzleCompletionResult,
};

// Re-export all functions for backward compatibility
export const checkPackProgression = newCheckPackProgression;
export const getPackUnlockStatus = newGetPackUnlockStatus;
export const getPackCompletionStats = newGetPackCompletionStats;
export const getPackUnlockMessage = newGetPackUnlockMessage;
export const getNewlyUnlockedPacks = newGetNewlyUnlockedPacks;
export const processLevelCompletion = newProcessLevelCompletion;
export const getPackUnlockRequirements = newGetPackUnlockRequirements;
export const processPuzzleCompletion = newProcessPuzzleCompletion;
export const trackPuzzleReplay = newTrackPuzzleReplay;
export const getReplayRecommendations = newGetReplayRecommendations;
export const shouldRedirectToPackPuzzles = newShouldRedirectToPackPuzzles;
export const getUserPackSummary = newGetUserPackSummary;

// Legacy constants for backward compatibility
export const PACK_UNLOCK_MILESTONES = {
  0: ['starterPack'],
  3: ['challengePack'],
  5: ['expertPack'],
} as const;

// Legacy function for backward compatibility
export const unlockPuzzlePack = async (packId: string, userLevel: number): Promise<boolean> => {
  console.log(`✅ Pack unlocked: ${packId} at user level ${userLevel}`);
  return true;
};

console.warn(
  '⚠️ Deprecated: utils/packProgression.ts has been moved to core/services/packProgressionService.ts. ' +
  'Please update your imports to use the new location.'
);