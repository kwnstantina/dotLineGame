import { AppState, AppStateStatus } from 'react-native';
import { getBackgroundStatsService } from './backgroundStatsService';

interface TaskConfig {
  id: string;
  name: string;
  interval: number; // in milliseconds
  lastRun: Date | null;
  isRunning: boolean;
  priority: 'high' | 'medium' | 'low';
}

export class BackgroundTaskScheduler {
  private tasks: Map<string, TaskConfig> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private appStateSubscription: any = null;
  private isAppActive = true;

  constructor() {
    this.initializeDefaultTasks();
    this.setupAppStateListener();
  }

  private initializeDefaultTasks() {
    // High priority: Update current user stats after gameplay
    this.registerTask({
      id: 'user_stats_update',
      name: 'Update Current User Statistics',
      interval: 30 * 1000, // 30 seconds
      lastRun: null,
      isRunning: false,
      priority: 'high'
    });

    // Medium priority: Update global leaderboards
    this.registerTask({
      id: 'global_leaderboards',
      name: 'Update Global Leaderboards',
      interval: 5 * 60 * 1000, // 5 minutes
      lastRun: null,
      isRunning: false,
      priority: 'medium'
    });

    // Low priority: Full statistics recalculation
    this.registerTask({
      id: 'full_stats_recalc',
      name: 'Full Statistics Recalculation',
      interval: 30 * 60 * 1000, // 30 minutes
      lastRun: null,
      isRunning: false,
      priority: 'low'
    });
  }

  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      this.isAppActive = nextAppState === 'active';
      
      if (nextAppState === 'active') {
        // App became active, resume high priority tasks
        this.resumeHighPriorityTasks();
      } else if (nextAppState === 'background') {
        // App went to background, pause some tasks
        this.pauseLowPriorityTasks();
      }
    });
  }

  private registerTask(task: TaskConfig) {
    this.tasks.set(task.id, task);
  }

  // Start all background tasks
  public startTasks() {
    this.tasks.forEach((task) => {
      this.startTask(task.id);
    });
    
    // Trigger an immediate batch update to populate initial cached data
    setTimeout(() => {
      this.executeBatchUpdate();
    }, 5000); // 5 second delay after app start
  }

  // Stop all background tasks
  public stopTasks() {
    this.intervals.forEach((interval, taskId) => {
      clearInterval(interval);
      const task = this.tasks.get(taskId);
      if (task) {
        task.isRunning = false;
      }
    });
    this.intervals.clear();
  }

  // Start a specific task
  private startTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task || task.isRunning) return;

    // Skip low priority tasks if app is not active
    if (!this.isAppActive && task.priority === 'low') {
      return;
    }

    const interval = setInterval(async () => {
      await this.executeTask(taskId);
    }, task.interval);

    this.intervals.set(taskId, interval);
    task.isRunning = true;

    console.log(`Started background task: ${task.name} (${task.interval}ms interval)`);
  }

  // Stop a specific task
  private stopTask(taskId: string) {
    const interval = this.intervals.get(taskId);
    const task = this.tasks.get(taskId);
    
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(taskId);
    }
    
    if (task) {
      task.isRunning = false;
    }
  }

  // Execute a specific task
  private async executeTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;

    try {
      console.log(`Executing background task: ${task.name}`);
      
      const backgroundStatsService = getBackgroundStatsService();
      
      switch (taskId) {
        case 'user_stats_update':
          await backgroundStatsService.triggerUserStatsUpdate();
          break;
          
        case 'global_leaderboards':
          await backgroundStatsService.cacheGlobalLeaderboards();
          break;
          
        case 'full_stats_recalc':
          // Only run full recalculation when app is active and not during peak usage
          if (this.isAppActive && this.isLowUsageTime()) {
            await backgroundStatsService.updateAllUsersAggregatedStats();
            await backgroundStatsService.cacheGlobalLeaderboards();
          }
          break;
          
        default:
          console.warn(`Unknown task ID: ${taskId}`);
      }
      
      task.lastRun = new Date();
      console.log(`Completed background task: ${task.name}`);
      
    } catch (error) {
      console.error(`Error executing background task ${task.name}:`, error);
    }
  }

  // Check if it's a low usage time (e.g., not during peak hours)
  private isLowUsageTime(): boolean {
    const now = new Date();
    const hours = now.getHours();
    
    // Assume low usage between 2 AM and 6 AM
    return hours >= 2 && hours < 6;
  }

  // Resume high priority tasks when app becomes active
  private resumeHighPriorityTasks() {
    this.tasks.forEach((task, taskId) => {
      if (task.priority === 'high' && !task.isRunning) {
        this.startTask(taskId);
      }
    });
  }

  // Pause low priority tasks when app goes to background
  private pauseLowPriorityTasks() {
    this.tasks.forEach((task, taskId) => {
      if (task.priority === 'low' && task.isRunning) {
        this.stopTask(taskId);
      }
    });
  }

  // Manually trigger a task (useful for testing or immediate updates)
  public async triggerTask(taskId: string): Promise<void> {
    await this.executeTask(taskId);
  }

  // Get task status
  public getTaskStatus(taskId: string): TaskConfig | undefined {
    return this.tasks.get(taskId);
  }

  // Get all task statuses
  public getAllTaskStatuses(): TaskConfig[] {
    return Array.from(this.tasks.values());
  }

  // Update task interval
  public updateTaskInterval(taskId: string, newInterval: number) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    // Stop and restart with new interval
    if (task.isRunning) {
      this.stopTask(taskId);
      task.interval = newInterval;
      this.startTask(taskId);
    } else {
      task.interval = newInterval;
    }
  }

  // Cleanup
  public destroy() {
    this.stopTasks();
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
  }

  // Smart scheduling based on user activity
  public scheduleAfterUserActivity(taskId: string, delayMs: number = 5000) {
    setTimeout(() => {
      this.triggerTask(taskId);
    }, delayMs);
  }

  // Batch operations for efficiency
  public async executeBatchUpdate(): Promise<void> {
    try {
      console.log('Starting batch statistics update...');
      
      const backgroundStatsService = getBackgroundStatsService();
      
      // Execute multiple tasks in sequence for efficiency
      await backgroundStatsService.triggerUserStatsUpdate();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
      
      await backgroundStatsService.cacheGlobalLeaderboards();
      
      console.log('Completed batch statistics update');
    } catch (error) {
      console.error('Error in batch statistics update:', error);
    }
  }
}

// Singleton instance
let backgroundTaskSchedulerInstance: BackgroundTaskScheduler | null = null;

export const getBackgroundTaskScheduler = (): BackgroundTaskScheduler => {
  if (!backgroundTaskSchedulerInstance) {
    backgroundTaskSchedulerInstance = new BackgroundTaskScheduler();
  }
  return backgroundTaskSchedulerInstance;
};

// Initialize background tasks when app starts
export const initializeBackgroundTasks = () => {
  const scheduler = getBackgroundTaskScheduler();
  scheduler.startTasks();
  return scheduler;
};

// Cleanup background tasks when app shuts down
export const cleanupBackgroundTasks = () => {
  if (backgroundTaskSchedulerInstance) {
    backgroundTaskSchedulerInstance.destroy();
    backgroundTaskSchedulerInstance = null;
  }
};

// Trigger immediate stats update after user completes a level/puzzle
export const triggerImmediateStatsUpdate = () => {
  const scheduler = getBackgroundTaskScheduler();
  scheduler.scheduleAfterUserActivity('user_stats_update', 2000); // 2 second delay
};