import type {
  PackProgressionResult,
  PackCompletionStats,
  PackUnlockStatus,
  PuzzleReplayInfo,
  ReplayRecommendation,
  PackRedirectSuggestion,
  UserPackSummary,
  PuzzleCompletionResult,
  PackUnlockRequirement,
} from '../models/packProgression';
import { PACK_UNLOCK_REQUIREMENTS } from '../constants/game';
import { getUserService } from './userService';
import { createPuzzlePacks } from './puzzleService';

// Re-export types for convenience
export type {
  PackProgressionResult,
  PackCompletionStats,
  PackUnlockStatus,
  PuzzleReplayInfo,
  ReplayRecommendation,
  PackRedirectSuggestion,
  UserPackSummary,
  PuzzleCompletionResult,
  PackUnlockRequirement,
};

export class PackProgressionService {
  private userService = getUserService();

  // Level milestones that unlock puzzle packs
  private readonly PACK_UNLOCK_MILESTONES = {
    0: ['starterPack'],     // Always available
    3: ['challengePack'],   // Unlocks at level 3
    5: ['expertPack'],      // Unlocks at level 5
  } as const;

  // Get pack unlock requirements for UI display
  getPackUnlockRequirements(): { [key: string]: { levelsRequired: number; description: string } } {
    return {
      starterPack: { 
        levelsRequired: 0, 
        description: 'Available immediately' 
      },
      challengePack: { 
        levelsRequired: 3, 
        description: 'Complete 3 levels to unlock' 
      },
      expertPack: { 
        levelsRequired: 5, 
        description: 'Complete 5 levels to unlock' 
      },
    };
  }

  // Check pack progression after level completion
  async checkPackProgression(completedLevel: number): Promise<PackProgressionResult> {
    try {
      const userProgress = await this.userService.getUserProgress();
      
      if (!userProgress) {
        console.warn('⚠️ No user progress found for pack progression check');
        return {
          unlockedPacks: ['starterPack'],
          newlyUnlockedPacks: [],
          userLevel: 0
        };
      }
      
      const userLevel = userProgress.totalLevelsCompleted || 0;
      const packCodes = {
        starterPack: 'starterPack',
        challengePack: 'challengePack', 
        expertPack: 'expertPack'
      };
      const allPacks = createPuzzlePacks(packCodes);
      
      const unlockedPacks: string[] = [];
      const newlyUnlockedPacks: string[] = [];
      const currentPackProgress = userProgress.packProgress || {};
      
      for (const pack of allPacks) {
        if (!pack || !pack.id) {
          console.warn('⚠️ Invalid pack data:', pack);
          continue;
        }
        
        const wasUnlocked = currentPackProgress[pack.id]?.isUnlocked || pack.isUnlocked || false;
        const shouldBeUnlocked = this.shouldPackBeUnlocked(pack.id, userLevel);
        
        if (shouldBeUnlocked) {
          unlockedPacks.push(pack.id);
          
          if (!wasUnlocked) {
            newlyUnlockedPacks.push(pack.id);
            await this.unlockPuzzlePack(pack.id, userLevel);
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
        unlockedPacks: ['starterPack'],
        newlyUnlockedPacks: [],
        userLevel: 0
      };
    }
  }

  // Check if pack should be unlocked based on user level
  private shouldPackBeUnlocked(packId: string, userLevel: number): boolean {
    const requirements = PACK_UNLOCK_REQUIREMENTS[packId as keyof typeof PACK_UNLOCK_REQUIREMENTS];
    if (!requirements) return false;
    
    return (requirements as any).alwaysUnlocked === true || 
           userLevel >= requirements.levelsRequired;
  }

  // Get pack unlock status with user progress
  async getPackUnlockStatus(): Promise<PackUnlockStatus> {
    try {
      const userProgress = await this.userService.getUserProgress();
      
      if (!userProgress) {
        console.warn('⚠️ No user progress found for pack unlock status');
        return {
          packs: createPuzzlePacks({
          starterPack: 'starterPack',
          challengePack: 'challengePack', 
          expertPack: 'expertPack'
        }),
          userLevel: 0,
          unlockedPackIds: ['starterPack']
        };
      }
      
      const userLevel = userProgress.totalLevelsCompleted || 0;
      const packCodes = {
        starterPack: 'starterPack',
        challengePack: 'challengePack', 
        expertPack: 'expertPack'
      };
      const allPacks = createPuzzlePacks(packCodes);
      const unlockedPackIds: string[] = [];
      
      const packsWithStatus = allPacks.map((pack) => {
        const isUnlocked = pack.isUnlocked || this.shouldPackBeUnlocked(pack.id, userLevel);
        
        if (isUnlocked) {
          unlockedPackIds.push(pack.id);
        }
        
        return {
          ...pack,
          isUnlocked
        };
      });
      
      return {
        packs: packsWithStatus,
        userLevel,
        unlockedPackIds
      };
    } catch (error) {
      console.error('Error getting pack unlock status:', error);
      return {
        packs: createPuzzlePacks({
          starterPack: 'starterPack',
          challengePack: 'challengePack', 
          expertPack: 'expertPack'
        }),
        userLevel: 0,
        unlockedPackIds: ['starterPack']
      };
    }
  }

  // Calculate pack completion percentage
  async getPackCompletionStats(packId: string): Promise<PackCompletionStats> {
    try {
      const userProgress = await this.userService.getUserProgress();
      const packCodes = {
        starterPack: 'starterPack',
        challengePack: 'challengePack', 
        expertPack: 'expertPack'
      };
      const packs = createPuzzlePacks(packCodes);
      const pack = packs.find(p => p.id === packId);
      
      if (!pack) {
        return { completed: 0, total: 0, percentage: 0 };
      }
      
      const total = pack.puzzles.length;
      let completed = 0;
      
      if (userProgress?.puzzleCompletions) {
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
  }

  // Get pack unlock notification message
  getPackUnlockMessage(packId: string): string {
    const packMessages: { [key: string]: string } = {
      starterPack: '🌟 Welcome to the Starter Pack!',
      challengePack: '⚡ Challenge Pack Unlocked!',
      expertPack: '🏆 Expert Pack Unlocked!'
    };
    
    return packMessages[packId] || '🎉 New Puzzle Pack Unlocked!';
  }

  // Check if completing a specific level unlocks new packs
  getNewlyUnlockedPacks(completedLevel: number): string[] {
    const milestone = this.PACK_UNLOCK_MILESTONES[completedLevel as keyof typeof this.PACK_UNLOCK_MILESTONES];
    return milestone ? [...milestone] : [];
  }

  // Unlock a puzzle pack and update user progress
  private async unlockPuzzlePack(packId: string, userLevel: number): Promise<boolean> {
    try {
      // This would typically call Firebase service to update pack unlock status
      console.log(`✅ Pack unlocked: ${packId} at user level ${userLevel}`);
      return true;
    } catch (error) {
      console.error('Error unlocking pack:', packId, error);
      return false;
    }
  }

  // Process level completion and return newly unlocked packs
  async processLevelCompletion(levelId: number): Promise<string[]> {
    try {
      const progressResult = await this.checkPackProgression(levelId);
      return progressResult.newlyUnlockedPacks;
    } catch (error) {
      console.error('Error processing level completion:', error);
      return [];
    }
  }

  // Handle puzzle completion within a pack
  async processPuzzleCompletion(_puzzleId: string, packId: string): Promise<PuzzleCompletionResult> {
    try {
      const stats = await this.getPackCompletionStats(packId);
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
  }

  // Track puzzle replay and improvements
  async trackPuzzleReplay(puzzleId: string, _packId: string): Promise<PuzzleReplayInfo> {
    try {
      const userProgress = await this.userService.getUserProgress();
      
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
  }

  // Get replay recommendations for a pack
  async getReplayRecommendations(packId: string): Promise<ReplayRecommendation[]> {
    try {
      const userProgress = await this.userService.getUserProgress();
      const packCodes = {
        starterPack: 'starterPack',
        challengePack: 'challengePack', 
        expertPack: 'expertPack'
      };
      const packs = createPuzzlePacks(packCodes);
      const pack = packs.find(p => p.id === packId);
      
      if (!pack || !userProgress?.puzzleCompletions) {
        return [];
      }
      
      const recommendations: ReplayRecommendation[] = [];
      
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
  }

  // Check if user should be redirected to pack puzzles after level completion
  async shouldRedirectToPackPuzzles(completedLevel: number): Promise<PackRedirectSuggestion> {
    try {
      const progressResult = await this.checkPackProgression(completedLevel);
      
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
        for (const packId of progressResult.unlockedPacks) {
          const stats = await this.getPackCompletionStats(packId);
          if (stats.percentage < 100) {
            return {
              shouldRedirect: true,
              suggestedPackId: packId,
              reason: `Continue your progress in ${packId} (${stats.completed}/${stats.total} completed)`
            };
          }
        }
      }
      
      return { shouldRedirect: false };
    } catch (error) {
      console.error('Error checking pack redirect:', error);
      return { shouldRedirect: false };
    }
  }

  // Get user's pack progression summary
  async getUserPackSummary(): Promise<UserPackSummary> {
    try {
      const packCodes = {
        starterPack: 'starterPack',
        challengePack: 'challengePack', 
        expertPack: 'expertPack'
      };
      const allPacks = createPuzzlePacks(packCodes);
      const userProgress = await this.userService.getUserProgress();
      
      const totalPacks = allPacks.length;
      let unlockedPacks = 0;
      let completedPacks = 0;
      let totalPuzzlesCompleted = 0;
      
      const userLevel = userProgress?.totalLevelsCompleted || 0;
      
      for (const pack of allPacks) {
        const isUnlocked = this.shouldPackBeUnlocked(pack.id, userLevel);
        if (isUnlocked) {
          unlockedPacks++;
          
          const stats = await this.getPackCompletionStats(pack.id);
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
  }
}

// Singleton instance
let packProgressionServiceInstance: PackProgressionService | null = null;

export const getPackProgressionService = (): PackProgressionService => {
  if (!packProgressionServiceInstance) {
    packProgressionServiceInstance = new PackProgressionService();
  }
  return packProgressionServiceInstance;
};

// Export functions for backward compatibility
export const checkPackProgression = (completedLevel: number) => 
  getPackProgressionService().checkPackProgression(completedLevel);

export const getPackUnlockStatus = () => 
  getPackProgressionService().getPackUnlockStatus();

export const getPackCompletionStats = (packId: string) => 
  getPackProgressionService().getPackCompletionStats(packId);

export const getPackUnlockMessage = (packId: string) => 
  getPackProgressionService().getPackUnlockMessage(packId);

export const getNewlyUnlockedPacks = (completedLevel: number) => 
  getPackProgressionService().getNewlyUnlockedPacks(completedLevel);

export const processLevelCompletion = (levelId: number) => 
  getPackProgressionService().processLevelCompletion(levelId);

export const getPackUnlockRequirements = () => 
  getPackProgressionService().getPackUnlockRequirements();

export const processPuzzleCompletion = (puzzleId: string, packId: string) => 
  getPackProgressionService().processPuzzleCompletion(puzzleId, packId);

export const trackPuzzleReplay = (puzzleId: string, packId: string) => 
  getPackProgressionService().trackPuzzleReplay(puzzleId, packId);

export const getReplayRecommendations = (packId: string) => 
  getPackProgressionService().getReplayRecommendations(packId);

export const shouldRedirectToPackPuzzles = (completedLevel: number) => 
  getPackProgressionService().shouldRedirectToPackPuzzles(completedLevel);

export const getUserPackSummary = () => 
  getPackProgressionService().getUserPackSummary();