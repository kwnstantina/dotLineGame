import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Cell} from '../types';

interface GridCellProps {
  cell: Cell;
  cellSize: number;
  isHighlighted?: boolean;
  isActive?: boolean;
  pathIndex?: number;
}

const GridCell: React.FC<GridCellProps> = ({
  cell, 
  cellSize, 
  isHighlighted = false,
  isActive = false,
  pathIndex
}) => {
  const getCellBackgroundColor = () => {
    if (isActive) return '#FF6B6B';
    if (cell.isDrawn) {
      const opacity = pathIndex ? Math.max(0.3, 1 - (pathIndex * 0.03)) : 1;
      return `rgba(76, 175, 80, ${opacity})`;
    }
    if (isHighlighted) return '#FFE082';
    if (cell.number) return '#E3F2FD';
    return '#F8F9FA';
  };

  const getBorderColor = () => {
    if (isActive) return '#FF1744';
    if (cell.isDrawn) return '#388E3C';
    if (cell.number) return '#1976D2';
    return '#E0E0E0';
  };

  return (
    <View
      style={[
        styles.cellContainer,
        {
          width: cellSize,
          height: cellSize,
        },
      ]}>
      <View
        style={[
          styles.cell,
          {
            backgroundColor: getCellBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: cell.number ? 2 : 1,
            shadowOpacity: cell.number ? 0.3 : 0.1,
            elevation: cell.number ? 4 : 2,
          },
        ]}>
        {cell.number && (
          <View style={styles.numberContainer}>
            <Text style={[
              styles.number,
              {color: cell.isDrawn ? '#FFFFFF' : '#1976D2'}
            ]}>
              {cell.number}
            </Text>
          </View>
        )}
        {cell.isDrawn && !cell.number && (
          <View style={styles.dot} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    padding: 1,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
  },
  numberContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});

export default GridCell;