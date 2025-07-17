import React, {useState, useCallback, useEffect} from 'react';
import {
  View, 
  StyleSheet, 
  Dimensions, 
  Vibration
} from 'react-native';
import {
  Gesture,
  GestureDetector
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import GridCell from './GridCell';
import {Cell, Position} from '../types';
import {colors, designTokens} from '../theme/colors';

interface GameGridProps {
  cells: Cell[];
  gridSize: number;
  onPathUpdate: (path: string[]) => void;
  drawnPath: string[];
}

const {width: screenWidth} = Dimensions.get('window');
const GRID_PADDING = 30;
const GRID_WIDTH = screenWidth - (GRID_PADDING * 1);


const GameGrid: React.FC<GameGridProps> = ({
  cells,
  gridSize,
  onPathUpdate,
  drawnPath,
}) => {
  const cellSize = GRID_WIDTH / gridSize;
  
  // Simple, working state management
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [highlightedCell, setHighlightedCell] = useState<string | null>(null);
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [svgPath, setSvgPath] = useState<string>('');
  
  const scaleAnim = useSharedValue(1);
  const gridOpacity = useSharedValue(1);

  const getCellAtPosition = useCallback((x: number, y: number): Cell | null => {
    // Convert screen coordinates to grid coordinates
    // The coordinates are relative to the grid container
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    // Ensure we're within grid bounds
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      return cells.find(cell => cell.row === row && cell.col === col) || null;
    }
    return null;
  }, [cells, cellSize, gridSize]);

  const getCellCenter = useCallback((cell: Cell): Position => {
    // SVG coordinates are relative to the grid, not the container
    return {
      x: cell.col * cellSize + cellSize / 2,
      y: cell.row * cellSize + cellSize / 2,
    };
  }, [cellSize]);

  const createSvgPath = useCallback((pathIds: string[]): string => {
    if (pathIds.length < 1) return '';
    
    const pathString = pathIds.map((cellId, index) => {
      const cell = cells.find(c => c.id === cellId);
      if (!cell) return '';
      
      const center = getCellCenter(cell);
      return index === 0 ? `M ${center.x} ${center.y}` : `L ${center.x} ${center.y}`;
    }).filter(Boolean).join(' ');
    
    return pathString;
  }, [cells, getCellCenter]);

  // Update currentPath when drawnPath prop changes
  useEffect(() => {
    setCurrentPath(drawnPath);
    if (drawnPath.length > 0) {
      setSvgPath(createSvgPath(drawnPath));
    } else {
      setSvgPath('');
    }
  }, [drawnPath, createSvgPath]);

  const isAdjacent = useCallback((cell1Id: string, cell2Id: string): boolean => {
    const cell1 = cells.find(c => c.id === cell1Id);
    const cell2 = cells.find(c => c.id === cell2Id);
    
    if (!cell1 || !cell2) return false;
    
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }, [cells]);

  const canAddToPath = useCallback((cellId: string, path: string[]): boolean => {
    if (path.includes(cellId)) return false;
    if (path.length === 0) return true;
    return isAdjacent(path[path.length - 1], cellId);
  }, [isAdjacent]);


  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleAnim.value}],
      opacity: gridOpacity.value,
    };
  });

  // Helper functions that can be called from runOnJS
  const startPath = useCallback((cellId: string) => {
    setActiveCell(cellId);
    setHighlightedCell(cellId);
    const newPath = [cellId];
    setCurrentPath(newPath);
    setSvgPath(createSvgPath(newPath));
    Vibration.vibrate([0, 10]);
    // Use setTimeout to move the state update outside the render cycle
    setTimeout(() => onPathUpdate(newPath), 0);
  }, [onPathUpdate, createSvgPath]);

  const continuePath = useCallback((cellId: string) => {
    setHighlightedCell(cellId);
    setCurrentPath(prevPath => {
      // Only continue if we're already drawing and this cell can be added
      if (prevPath.length > 0 && canAddToPath(cellId, prevPath)) {
        const newPath = [...prevPath, cellId];
        setSvgPath(createSvgPath(newPath));
        setActiveCell(cellId);
        Vibration.vibrate([0, 3]);
        // Use setTimeout to move the state update outside the render cycle
        setTimeout(() => onPathUpdate(newPath), 0);
        return newPath;
      }
      return prevPath;
    });
  }, [canAddToPath, onPathUpdate, createSvgPath]);

  const endPath = useCallback(() => {
    setHighlightedCell(null);
    setActiveCell(null);
  }, []);

  // Optimized gesture handlers to prevent memory leaks
  const handleGestureBegin = useCallback((x: number, y: number) => {
    console.log('Gesture begin at:', x, y, 'cellSize:', cellSize);
    const cell = getCellAtPosition(x, y);
    console.log('Found cell:', cell?.id, 'at row:', cell?.row, 'col:', cell?.col);
    if (cell) {
      startPath(cell.id);
    }
  }, [getCellAtPosition, startPath, cellSize]);

  const handleGestureUpdate = useCallback((x: number, y: number) => {
    const cell = getCellAtPosition(x, y);
    if (cell) {
      continuePath(cell.id);
    }
  }, [getCellAtPosition, continuePath]);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      scaleAnim.value = withSpring(1.05, {
        damping: 10,
        stiffness: 300,
      });
      gridOpacity.value = withTiming(0.95, {
        duration: 200,
      });
      
      runOnJS(handleGestureBegin)(event.x, event.y);
    })
    .onUpdate((event) => {
      runOnJS(handleGestureUpdate)(event.x, event.y);
    })
    .onEnd(() => {
      scaleAnim.value = withSpring(1, {
        damping: 10,
        stiffness: 300,
      });
      gridOpacity.value = withTiming(1, {
        duration: 200,
      });
      runOnJS(endPath)();
    })
    .onFinalize(() => {
      scaleAnim.value = withSpring(1, {
        damping: 10,
        stiffness: 300,
      });
      gridOpacity.value = withTiming(1, {
        duration: 200,
      });
      runOnJS(endPath)();
    });

  const updatedCells = cells.map((cell) => {
    const pathIndex = currentPath.indexOf(cell.id);
    return {
      ...cell,
      isDrawn: pathIndex !== -1,
    };
  });

  return (
    <Animated.View style={[styles.gridContainer, animatedStyle]}>
      <GestureDetector gesture={panGesture}>
        <View style={[styles.grid, {width: GRID_WIDTH, height: GRID_WIDTH}]}>
        
        {/* SVG Path Overlay */}
        <Svg 
          style={styles.svgOverlay}
          width={GRID_WIDTH} 
          height={GRID_WIDTH}>
          {svgPath && (
            <>
              {/* Glow effect */}
              <Path
                d={svgPath}
                stroke={colors.game.pathGlow}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={0.6}
              />
              {/* Main path */}
              <Path
                d={svgPath}
                stroke={colors.game.pathStroke}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={0.95}
              />
            </>
          )}
        </Svg>
        
        {/* Grid Cells */}
        {updatedCells.map((cell) => {
          const pathIndex = currentPath.indexOf(cell.id);
          return (
            <View
              key={cell.id}
              style={[
                styles.cellContainer,
                {
                  position: 'absolute',
                  left: cell.col * cellSize,
                  top: cell.row * cellSize,
                },
              ]}>
              <GridCell 
                cell={cell} 
                cellSize={cellSize}
                isHighlighted={highlightedCell === cell.id}
                isActive={activeCell === cell.id}
                pathIndex={pathIndex}
              />
            </View>
          );
        })}
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    alignSelf: 'center',
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: colors.background.card,
    padding: designTokens.spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...designTokens.elevation.medium,
  },
  grid: {
    backgroundColor: colors.game.shadow,
    borderRadius: designTokens.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    overflow: 'hidden',
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    borderRadius: designTokens.borderRadius.md,
  },
  cellContainer: {
    zIndex: 2,
  },
});

export default GameGrid;