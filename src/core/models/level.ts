export interface Level {
  id: number;
  name: string;
  difficulty: 'Exercise'| 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  gridSize: number;
  unlocked: boolean;
  requiresPayment: boolean;
  requiresAd: boolean;
  adDuration: number; // in seconds
  stars: number;
  bestTime?: number;
  description: string;
  icon: string;
  solved?: boolean;
  completionTime?: number;
}

// Level interface for Firebase storage
export interface FirebaseLevel {
  id: number;
  name: string;
  difficulty: 'Exercise' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  gridSize: number;
  unlocked: boolean;
  requiresPayment: boolean;
  requiresAd: boolean;
  adDuration: number;
  stars: number;
  description: string;
  icon: string;
  order: number; // For level ordering
  createdAt: Date;
  updatedAt: Date;
}