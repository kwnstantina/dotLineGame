# Integration Guide: Puzzle Packs & Enhanced Game Features

This guide explains how the new puzzle pack system integrates with your existing game screens and provides the complete user flow.

## 🗺️ Navigation Flow

### Complete User Journey
```
App Start
    ↓
LevelSelectionScreen
    ├─→ GameScreen (level mode) ─→ Level Completion ─→ Pack Unlock Notifications
    └─→ PuzzlePacksScreen ─→ PackPuzzlesScreen ─→ GameScreen (pack mode)
```

## 🔧 Integration Components

### 1. **LevelSelectionScreen** (Modified)
**File**: `src/screens/LevelSelectionScreen.tsx`

#### New Features Added:
- **Puzzle Packs Button** (🧩) - Top-right header button
- **Puzzle Packs Card** - Promotional card at bottom of level list
- **Progress-based unlocking** - Shows available packs based on user level

#### Props Changes:
```typescript
interface LevelSelectionScreenProps {
  onLevelSelect: (level: Level) => void;
  onPuzzlePacksSelect?: () => void; // NEW
  refreshTrigger?: number;
}
```

#### Integration Points:
- Displays puzzle packs access when `onPuzzlePacksSelect` prop is provided
- Shows attractive promotional card with gradient styling
- Header button provides quick access to puzzle packs

### 2. **GameScreen** (Enhanced)
**File**: `src/screens/GameScreen.tsx`

#### New Features Added:
- **Dual Mode Support** - Handles both level and pack puzzles
- **Enhanced Completion Detection** - Uses new `validatePuzzleCompletion()`
- **Obstacle Support** - Renders puzzles with blocked cells
- **Performance Analytics** - Shows stars, efficiency, and detailed feedback

#### Props Changes:
```typescript
interface GameScreenProps {
  level?: Level;
  puzzle?: Puzzle; // NEW - Direct puzzle from packs
  onBackToLevels?: () => void;
  onLevelComplete?: (levelId: number, completionTime: number) => void;
  onPuzzleComplete?: (puzzleId: string, completionTime: number) => void; // NEW
  gameMode?: 'level' | 'pack'; // NEW - Distinguishes modes
}
```

#### Behavior Changes:
- **Level Mode**: Generates random puzzles with increasing difficulty
- **Pack Mode**: Uses provided puzzle with obstacles and themes
- **Smart Loading**: Selects appropriate puzzle based on mode
- **Completion Tracking**: Saves both level and puzzle completions

### 3. **New Screen Components**

#### **PuzzlePacksScreen**
**File**: `src/screens/PuzzlePacksScreen.tsx`

- **Pack Selection Interface** with theme-based styling
- **Lock/Unlock Status** with clear visual indicators
- **Progress Requirements** showing unlock conditions
- **Firebase Integration** for cloud-stored packs

#### **PackPuzzlesScreen**
**File**: `src/screens/PackPuzzlesScreen.tsx`

- **Grid Layout** of puzzles within selected pack
- **Difficulty Indicators** with color-coded visual cues
- **Completion Tracking** showing stars and times
- **Progress Overview** for pack completion status

### 4. **Navigation System**
**File**: `src/navigation/AppNavigator.tsx`

#### Complete State Management:
```typescript
type NavigationState = 
  | { screen: 'levelSelection' }
  | { screen: 'puzzlePacks' }
  | { screen: 'packPuzzles'; pack: PuzzlePack }
  | { screen: 'game'; level?: Level; puzzle?: Puzzle; gameMode: 'level' | 'pack' };
```

#### Key Features:
- **State-based Navigation** - Single source of truth for app flow
- **Automatic Pack Unlocking** - Checks progression after level completion
- **Unlock Notifications** - Shows alerts for newly available content
- **Refresh Management** - Updates UI when user progress changes

## 🔄 Pack Progression System

### **Unlock Milestones**
```typescript
const PACK_UNLOCK_MILESTONES = {
  1: ['starter-pack'],     // Always available
  3: ['challenge-pack'],   // Unlocks at level 3
  5: ['expert-pack'],      // Unlocks at level 5
};
```

### **Progression Logic**
**File**: `src/utils/packProgression.ts`

1. **Level Completion** → Check user's total completed levels
2. **Pack Evaluation** → Compare against required levels
3. **Unlock Detection** → Identify newly available packs
4. **Notification Display** → Show achievement alerts
5. **UI Update** → Refresh level selection with new options

## 🎯 Usage Examples

### Basic App Integration
```typescript
// In your main App.tsx or navigation setup
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return <AppNavigator />;
};
```

### Manual Navigation Setup
```typescript
// If you prefer manual navigation control
const [currentScreen, setCurrentScreen] = useState('levelSelection');
const [selectedPack, setSelectedPack] = useState<PuzzlePack | null>(null);

const handleLevelSelect = (level: Level) => {
  setCurrentScreen('game');
  // Pass level to GameScreen
};

const handlePuzzlePacksSelect = () => {
  setCurrentScreen('puzzlePacks');
};

const handlePackSelect = (pack: PuzzlePack) => {
  setSelectedPack(pack);
  setCurrentScreen('packPuzzles');
};
```

### Level Completion with Pack Progression
```typescript
const handleLevelComplete = async (levelId: number, completionTime: number) => {
  // Save level completion
  await saveLevelCompletion(levelId, completionTime);
  
  // Check for newly unlocked packs
  const progression = await checkPackProgression(levelId);
  
  if (progression.newlyUnlockedPacks.length > 0) {
    // Show unlock notification
    Alert.alert(
      'New Content Unlocked! 🎉',
      getPackUnlockMessage(progression.newlyUnlockedPacks[0])
    );
  }
};
```

## 📱 User Experience Flow

### 1. **Level Play Flow**
```
LevelSelectionScreen
    ↓ (User taps level)
GameScreen (level mode)
    ↓ (Puzzle completed)
Success with stars/efficiency
    ↓ (If milestone reached)
Pack Unlock Notification
    ↓ (User can choose)
Continue Playing OR Check Puzzle Packs
```

### 2. **Pack Play Flow**
```
LevelSelectionScreen
    ↓ (User taps puzzle pack button)
PuzzlePacksScreen
    ↓ (User selects unlocked pack)
PackPuzzlesScreen
    ↓ (User selects puzzle)
GameScreen (pack mode)
    ↓ (Puzzle completed)
Back to pack or continue with next puzzle
```

## 🎨 Visual Integration

### **LevelSelectionScreen Changes**
- Added **puzzle pack button** (🧩) in header next to menu
- Added **promotional card** with purple gradient at bottom
- Both elements only appear when `onPuzzlePacksSelect` prop is provided

### **GameScreen Enhancements**
- **Obstacle cells** render with dark background and ✕ symbol
- **Enhanced feedback** shows efficiency percentage and star count
- **Mode-appropriate headers** display different info for level vs pack

### **New Visual Elements**
- **Pack cards** with theme-based color coding
- **Lock indicators** with clear unlock requirements
- **Progress tracking** with completion percentages
- **Star ratings** consistent across all screens

## 🔐 Firebase Integration Points

### **Data Storage**
- **Puzzle packs** stored in `puzzlePacks` collection
- **Individual puzzles** stored in `puzzles` collection
- **User completions** tracked in `puzzleCompletions` collection
- **Level progress** maintained in existing `userProgress` collection

### **Sync Points**
- **Pack loading** - Fetches from Firebase with local fallback
- **Completion saving** - Stores both level and puzzle completions
- **Unlock checking** - Validates against user progress
- **Cross-device sync** - All progress maintained in cloud

## 🚀 Getting Started

### 1. **Replace Your Main Navigation**
```typescript
// Replace your existing navigation with:
import AppNavigator from './src/navigation/AppNavigator';

// In your App component:
return <AppNavigator />;
```

### 2. **Update LevelSelectionScreen Usage**
```typescript
// Add puzzle packs support:
<LevelSelectionScreen
  onLevelSelect={handleLevelSelect}
  onPuzzlePacksSelect={handlePuzzlePacksSelect} // NEW
  refreshTrigger={refreshTrigger}
/>
```

### 3. **Initialize Default Packs** (Optional)
```typescript
// Run once to set up default packs in Firebase:
import { createPuzzlePacks, savePuzzlePack } from './src/utils/puzzleUtils';

const initializePacks = async () => {
  const packs = createPuzzlePacks();
  for (const pack of packs) {
    await savePuzzlePack(pack);
  }
};
```

## 📊 Benefits

1. **Progressive Content Unlocking** - Keeps users engaged with new challenges
2. **Enhanced Gameplay** - Obstacles add strategic complexity
3. **Performance Tracking** - Stars and efficiency encourage improvement
4. **Cloud Synchronization** - Progress maintained across devices
5. **Modular Design** - Easy to add new packs and puzzle types
6. **Seamless Integration** - Works with existing level system

The integration is designed to enhance your existing game while maintaining backward compatibility. Users can continue playing levels normally, with puzzle packs providing additional optional content that unlocks based on their progress.