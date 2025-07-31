import { getUserProgress, checkPuzzlePackUnlock } from './firebase';
import { createPuzzlePacks } from './puzzleUtils';
import { PuzzlePack } from '../types';
import { puzzlePackCodes } from '../constants/codes';
import { AUTH_CODES } from '../constants/authConstants';
import { APP_STRINGS } from '../constants/strings';

export interface PackProgressionResult {
  unlockedPacks: string[];
  newlyUnlockedPacks: string[];
  userLevel: number;
}

// Check pack progression after level completion
export const checkPackProgression = async (_completedLevel: number): Promise<PackProgressionResult> => {
  try {
    const userProgress = await getUserProgress();
    
    // Ensure user progress exists and has valid data
    if (!userProgress) {
      console.warn('⚠️ No user progress found for pack progression check');
      return {
        unlockedPacks: [puzzlePackCodes.starterPack], // Default to starter pack
        newlyUnlockedPacks: [],
        userLevel: 0
      };
    }
    
    const userLevel = userProgress.totalLevelsCompleted || 0;
    
    // Get all available packs
    const allPacks = createPuzzlePacks();
    
    // Check which packs should be unlocked
    const unlockedPacks: string[] = [];
    const newlyUnlockedPacks: string[] = [];
    
    // Get current unlock status from user progress
    const currentPackProgress = userProgress.packProgress || {};
    
    for (const pack of allPacks) {
      // Ensure pack data is valid
      if (!pack || !pack.id) {
        console.warn('⚠️ Invalid pack data:', pack);
        continue;
      }
      
      const wasUnlocked = currentPackProgress[pack.id]?.isUnlocked || pack.isUnlocked || false;
      const shouldBeUnlocked = await checkPuzzlePackUnlock(pack.id);
      
      if (shouldBeUnlocked) {
        unlockedPacks.push(pack.id);
        
        // If pack wasn't previously unlocked but should be now
        if (!wasUnlocked) {
          newlyUnlockedPacks.push(pack.id);
          
          // Trigger pack unlock in Firebase
          await unlockPuzzlePack(pack.id, userLevel);
        }
      }
    }
    
    return {
      unlockedPacks,
      newlyUnlockedPacks,
      userLevel
    };
  } catch (error) {
    console.error('Error checking pack progression:', error);
    return {
      unlockedPacks: [puzzlePackCodes.starterPack], // Fallback to starter pack
      newlyUnlockedPacks: [],
      userLevel: 0
    };
  }
};

// Get pack unlock requirements and user progress
export const getPackUnlockStatus = async (): Promise<{ 
  packs: PuzzlePack[]; 
  userLevel: number; 
  unlockedPackIds: string[] 
}> => {
  try {
    const userProgress = await getUserProgress();
    
    // Ensure user progress exists
    if (!userProgress) {
      console.warn('⚠️ No user progress found for pack unlock status');
      return {
        packs: createPuzzlePacks(),
        userLevel: 0,
        unlockedPackIds: [puzzlePackCodes.starterPack]
      };
    }
    
    const userLevel = userProgress.totalLevelsCompleted || 0;
    
    const allPacks = createPuzzlePacks();
    const unlockedPackIds: string[] = [];
    
    // Check unlock status for each pack
    const packsWithStatus = await Promise.all(
      allPacks.map(async (pack) => {
        const isUnlocked = pack.isUnlocked || 
          (pack.requiredLevel ? userLevel >= pack.requiredLevel : true);
        
        if (isUnlocked) {
          unlockedPackIds.push(pack.id);
        }
        
        return {
          ...pack,
          isUnlocked
        };
      })
    );
    
    return {
      packs: packsWithStatus,
      userLevel,
      unlockedPackIds
    };
  } catch (error) {
    console.error('Error getting pack unlock status:', error);
    return {
      packs: createPuzzlePacks(),
      userLevel: 0,
      unlockedPackIds: [puzzlePackCodes.starterPack]
    };
  }
};

// Calculate pack completion percentage
export const getPackCompletionStats = async (packId: string): Promise<{
  completed: number;
  total: number;
  percentage: number;
}> => {
  try {
    const { getUserProgress: getProgress } = await import('./firebase');
    const userProgress = await getProgress();
    
    const packs = createPuzzlePacks();
    const pack = packs.find(p => p.id === packId);
    
    if (!pack) {
      return { completed: 0, total: 0, percentage: 0 };
    }
    
    // Check Firebase for completed puzzles in this pack
    const total = pack.puzzles.length;
    let completed = 0;
    
    if (userProgress?.puzzleCompletions) {
      // Count completed puzzles in this pack
      completed = Object.values(userProgress.puzzleCompletions)
        .filter(completion => completion.packId === packId && completion.isValid)
        .length;
    }
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  } catch (error) {
    console.error('Error getting pack completion stats:', error);
    return { completed: 0, total: 0, percentage: 0 };
  }
};

// Get pack unlock notification message
export const getPackUnlockMessage = (packId: string): string => {
  const packMessages: { [key: string]: string } = {
   [puzzlePackCodes.starterPack]: APP_STRINGS.PACKS.STARTER_PACK,
   [puzzlePackCodes.challengePack]: APP_STRINGS.PACKS.CHALLENGE_PACK,
   [puzzlePackCodes.expertPack]: APP_STRINGS.PACKS.EXPERT_PACK
  };
  
  return packMessages[packId] || '🎉 New Puzzle Pack Unlocked!';
};

// Level milestones that unlock puzzle packs
export const PACK_UNLOCK_MILESTONES = {
  0: [puzzlePackCodes.starterPack],     // Always available
  3: [puzzlePackCodes.challengePack],   // Unlocks at level 3
  5: [puzzlePackCodes.expertPack],      // Unlocks at level 5
} as const;

// Check if completing a specific level unlocks new packs
export const getNewlyUnlockedPacks = (completedLevel: number): string[] => {
  const milestone = PACK_UNLOCK_MILESTONES[completedLevel as keyof typeof PACK_UNLOCK_MILESTONES];
  return milestone ? [...milestone] : [];
};

// Unlock a puzzle pack and update user progress
export const unlockPuzzlePack = async (packId: string, userLevel: number): Promise<boolean> => {
  try {
    const { updatePackUnlockStatus } = await import('./firebase');
    const success = await updatePackUnlockStatus(packId, true);
    
    if (success) {
      console.log(`✅ Pack unlocked: ${packId} at user level ${userLevel}`);
    }
    
    return success;
  } catch (error) {
    console.error('Error unlocking pack:', packId, error);
    return false;
  }
};

// Automatically check and unlock packs after level completion
export const processLevelCompletion = async (levelId: number): Promise<string[]> => {
  try {
    // Check for pack unlocks based on the completed level
    const progressResult = await checkPackProgression(levelId);
    
    // Return newly unlocked packs for notification purposes
    return progressResult.newlyUnlockedPacks;
  } catch (error) {
    console.error('Error processing level completion:', error);
    return [];
  }
};

// Get unlock requirements display for UI
export const getPackUnlockRequirements = (): { [key: string]: { levelsRequired: number; description: string } } => {
  return {
    [puzzlePackCodes.starterPack]: { 
      levelsRequired: 0, 
      description: 'Available immediately' 
    },
    [puzzlePackCodes.challengePack]: { 
      levelsRequired: 3, 
      description: 'Complete 3 levels to unlock' 
    },
    [puzzlePackCodes.expertPack]: { 
      levelsRequired: 5, 
      description: 'Complete 5 levels to unlock' 
    },
  };
};

// Handle puzzle completion within a pack and update pack progress
export const processPuzzleCompletion = async (puzzleId: string, packId: string): Promise<{
  packCompleted: boolean;
  newCompletionPercentage: number;
  totalCompleted: number;
  totalPuzzles: number;
}> => {
  try {
    const stats = await getPackCompletionStats(packId);
    const packCompleted = stats.percentage === 100;
    
    console.log(`📊 Pack ${packId} progress:`, {
      completed: stats.completed,
      total: stats.total,
      percentage: stats.percentage,
      packCompleted
    });
    
    return {
      packCompleted,
      newCompletionPercentage: stats.percentage,
      totalCompleted: stats.completed,
      totalPuzzles: stats.total
    };
  } catch (error) {
    console.error('Error processing puzzle completion:', error);
    return {
      packCompleted: false,
      newCompletionPercentage: 0,
      totalCompleted: 0,
      totalPuzzles: 0
    };
  }
};

// Track puzzle replay and improvements
export const trackPuzzleReplay = async (puzzleId: string, _packId: string): Promise<{
  isImprovement: boolean;
  previousBestTime?: number;
  previousBestStars?: number;
  replayCount: number;
}> => {
  try {
    const { getUserProgress } = await import('./firebase');
    const userProgress = await getUserProgress();
    
    if (!userProgress?.puzzleCompletions?.[puzzleId]) {
      return {
        isImprovement: false,
        replayCount: 0
      };
    }
    
    const completion = userProgress.puzzleCompletions[puzzleId];
    return {
      isImprovement: false, // This will be determined after new completion
      previousBestTime: completion.bestTime,
      previousBestStars: completion.bestStars,
      replayCount: completion.attempts || 1
    };
  } catch (error) {
    console.error('Error tracking puzzle replay:', error);
    return {
      isImprovement: false,
      replayCount: 0
    };
  }
};

// Get replay recommendations for a pack
export const getReplayRecommendations = async (packId: string): Promise<{
  puzzleId: string;
  reason: string;
  currentStars: number;
  potentialImprovement: string;
}[]> => {
  try {
    const { getUserProgress } = await import('./firebase');
    const userProgress = await getUserProgress();
    const packs = createPuzzlePacks();
    const pack = packs.find(p => p.id === packId);
    
    if (!pack || !userProgress?.puzzleCompletions) {
      return [];
    }
    
    const recommendations: {
      puzzleId: string;
      reason: string;
      currentStars: number;
      potentialImprovement: string;
    }[] = [];
    
    pack.puzzles.forEach(puzzle => {
      const completion = userProgress.puzzleCompletions[puzzle.id];
      if (completion && completion.isValid) {
        // Recommend replaying if less than 3 stars
        if (completion.bestStars < 3) {
          recommendations.push({
            puzzleId: puzzle.id,
            reason: 'Improve star rating',
            currentStars: completion.bestStars,
            potentialImprovement: `Aim for ${3 - completion.bestStars} more star${3 - completion.bestStars > 1 ? 's' : ''}`
          });
        }
        
        // Recommend replaying if efficiency is low
        if (completion.bestEfficiency < 80) {
          recommendations.push({
            puzzleId: puzzle.id,
            reason: 'Improve efficiency',
            currentStars: completion.bestStars,
            potentialImprovement: `Current: ${completion.bestEfficiency}%, aim for 90%+`
          });
        }
      }
    });
    
    return recommendations.slice(0, 3); // Return top 3 recommendations
  } catch (error) {
    console.error('Error getting replay recommendations:', error);
    return [];
  }
};

// Direct users to play packed puzzles after level completion
export const shouldRedirectToPackPuzzles = async (completedLevel: number): Promise<{
  shouldRedirect: boolean;
  suggestedPackId?: string;
  reason?: string;
}> => {
  try {
    const progressResult = await checkPackProgression(completedLevel);
    
    // If new packs were unlocked, suggest playing them
    if (progressResult.newlyUnlockedPacks.length > 0) {
      return {
        shouldRedirect: true,
        suggestedPackId: progressResult.newlyUnlockedPacks[0],
        reason: `New pack unlocked! Try the ${progressResult.newlyUnlockedPacks[0]} puzzles.`
      };
    }
    
    // If user has completed enough levels, suggest playing available packs
    if (completedLevel >= 2 && progressResult.unlockedPacks.length > 0) {
      // Find a pack with room for improvement
      const { checkPuzzlePackUnlock } = await import('./firebase');
      for (const packId of progressResult.unlockedPacks) {
        const isUnlocked = await checkPuzzlePackUnlock(packId);
        if (isUnlocked) {
          const stats = await getPackCompletionStats(packId);
          if (stats.percentage < 100) {
            return {
              shouldRedirect: true,
              suggestedPackId: packId,
              reason: `Continue your progress in ${packId} (${stats.completed}/${stats.total} completed)`
            };
          }
        }
      }
    }
    
    return { shouldRedirect: false };
  } catch (error) {
    console.error('Error checking pack redirect:', error);
    return { shouldRedirect: false };
  }
};

// Get user's pack progression summary
export const getUserPackSummary = async (): Promise<{
  totalPacks: number;
  unlockedPacks: number;
  completedPacks: number;
  totalPuzzlesCompleted: number;
  overallProgress: number;
}> => {
  try {
    const { checkPuzzlePackUnlock } = await import('./firebase');
    const allPacks = createPuzzlePacks();
    
    const totalPacks = allPacks.length;
    let unlockedPacks = 0;
    let completedPacks = 0;
    let totalPuzzlesCompleted = 0;
    
    for (const pack of allPacks) {
      const isUnlocked = await checkPuzzlePackUnlock(pack.id);
      if (isUnlocked) {
        unlockedPacks++;
        
        const stats = await getPackCompletionStats(pack.id);
        totalPuzzlesCompleted += stats.completed;
        
        if (stats.percentage === 100) {
          completedPacks++;
        }
      }
    }
    
    const overallProgress = totalPacks > 0 ? Math.round((completedPacks / totalPacks) * 100) : 0;
    
    return {
      totalPacks,
      unlockedPacks,
      completedPacks,
      totalPuzzlesCompleted,
      overallProgress
    };
  } catch (error) {
    console.error('Error getting user pack summary:', error);
    return {
      totalPacks: 0,
      unlockedPacks: 0,
      completedPacks: 0,
      totalPuzzlesCompleted: 0,
      overallProgress: 0
    };
  }
};