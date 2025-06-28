import React, {useState, useRef} from 'react';
import {
  View, 
  StyleSheet, 
  Dimensions, 
  PanResponder, 
  Animated,
  Vibration
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import GridCell from './GridCell';
import {Cell, Position} from '../types';

interface GameGridProps {
  cells: Cell[];
  gridSize: number;
  onPathUpdate: (path: string[]) => void;
  drawnPath: string[];
}

const {width: screenWidth} = Dimensions.get('window');
const GRID_PADDING = 20;
const GRID_WIDTH = screenWidth - GRID_PADDING * 2;

const GameGrid: React.FC<GameGridProps> = ({
  cells,
  gridSize,
  onPathUpdate,
  drawnPath,
}) => {
  const cellSize = GRID_WIDTH / gridSize;
  
  const [currentPath, setCurrentPath] = useState<string[]>(drawnPath);
  const [highlightedCell, setHighlightedCell] = useState<string | null>(null);
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [svgPath, setSvgPath] = useState<string>('');
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const gridOpacity = useRef(new Animated.Value(1)).current;

  const getCellAtPosition = (x: number, y: number): Cell | null => {
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);
    
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      return cells.find(cell => cell.row === row && cell.col === col) || null;
    }
    return null;
  };

  const getCellCenter = (cell: Cell): Position => {
    return {
      x: cell.col * cellSize + cellSize / 2,
      y: cell.row * cellSize + cellSize / 2,
    };
  };

  const createSvgPath = (pathIds: string[]): string => {
    if (pathIds.length < 2) return '';
    
    const pathString = pathIds.map((cellId, index) => {
      const cell = cells.find(c => c.id === cellId);
      if (!cell) return '';
      
      const center = getCellCenter(cell);
      return index === 0 ? `M ${center.x} ${center.y}` : `L ${center.x} ${center.y}`;
    }).join(' ');
    
    return pathString;
  };

  const isAdjacent = (cell1Id: string, cell2Id: string): boolean => {
    const cell1 = cells.find(c => c.id === cell1Id);
    const cell2 = cells.find(c => c.id === cell2Id);
    
    if (!cell1 || !cell2) return false;
    
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const canAddToPath = (cellId: string, path: string[]): boolean => {
    if (path.includes(cellId)) return false;
    if (path.length === 0) return true;
    return isAdjacent(path[path.length - 1], cellId);
  };

  const animateScale = (scale: number) => {
    Animated.spring(scaleAnim, {
      toValue: scale,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const animateGridOpacity = (opacity: number) => {
    Animated.timing(gridOpacity, {
      toValue: opacity,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: (evt) => {
      const {locationX, locationY} = evt.nativeEvent;
      const cell = getCellAtPosition(locationX, locationY);
      
      if (cell) {
        setIsDragging(true);
        setActiveCell(cell.id);
        const newPath = [cell.id];
        setCurrentPath(newPath);
        onPathUpdate(newPath);
        setSvgPath(createSvgPath(newPath));
        
        animateScale(1.05);
        animateGridOpacity(0.95);
        Vibration.vibrate(10);
      }
    },
    
    onPanResponderMove: (evt) => {
      const {locationX, locationY} = evt.nativeEvent;
      const cell = getCellAtPosition(locationX, locationY);
      
      if (cell) {
        setHighlightedCell(cell.id);
        
        if (canAddToPath(cell.id, currentPath)) {
          const newPath = [...currentPath, cell.id];
          setCurrentPath(newPath);
          onPathUpdate(newPath);
          setSvgPath(createSvgPath(newPath));
          setActiveCell(cell.id);
          Vibration.vibrate(5);
        }
      } else {
        setHighlightedCell(null);
      }
    },
    
    onPanResponderRelease: () => {
      setIsDragging(false);
      setHighlightedCell(null);
      setActiveCell(null);
      animateScale(1);
      animateGridOpacity(1);
    },
  });

  const updatedCells = cells.map((cell, index) => {
    const pathIndex = currentPath.indexOf(cell.id);
    return {
      ...cell,
      isDrawn: pathIndex !== -1,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.gridContainer,
          {
            transform: [{scale: scaleAnim}],
            opacity: gridOpacity,
          }
        ]}>
        <View
          style={[styles.grid, {width: GRID_WIDTH, height: GRID_WIDTH}]}
          {...panResponder.panHandlers}>
          
          {/* SVG Path Overlay */}
          <Svg 
            style={styles.svgOverlay}
            width={GRID_WIDTH} 
            height={GRID_WIDTH}>
            {svgPath && (
              <Path
                d={svgPath}
                stroke="#4CAF50"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={0.8}
              />
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
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: GRID_PADDING,
  },
  gridContainer: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  grid: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#E3F2FD',
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  cellContainer: {
    zIndex: 2,
  },
});

export default GameGrid;