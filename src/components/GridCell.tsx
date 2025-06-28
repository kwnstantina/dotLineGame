import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {Cell} from '../types';
import {colors, designTokens, withOpacity} from '../theme/colors';

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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (isHighlighted) {
      Animated.spring(scaleAnim, {
        toValue: 1.02,
        useNativeDriver: true,
        tension: 200,
        friction: 8,
      }).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 200,
          friction: 8,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isActive, isHighlighted, scaleAnim, glowAnim]);
  const getCellBackgroundColor = () => {
    if (isActive) return colors.game.cellActive;
    if (cell.isDrawn) {
      const opacity = pathIndex ? Math.max(0.3, 1 - (pathIndex * 0.03)) : 1;
      return withOpacity(colors.game.cellDrawn, opacity);
    }
    if (isHighlighted) return colors.game.cellHighlight;
    if (cell.number) return colors.game.cellNumber;
    return colors.game.cellDefault;
  };

  const getBorderColor = () => {
    if (isActive) return colors.interactive.primary;
    if (cell.isDrawn) return colors.game.cellDrawn;
    if (cell.number) return colors.interactive.primary;
    return colors.border.primary;
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
      <Animated.View
        style={[
          styles.cell,
          {
            backgroundColor: getCellBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: cell.number ? 2 : 1,
            shadowOpacity: cell.number ? 0.3 : 0.1,
            elevation: cell.number ? 4 : 2,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        {isActive && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: colors.game.pathGlow,
                borderRadius: designTokens.borderRadius.lg,
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
              },
            ]}
          />
        )}
        {cell.number && (
          <Animated.View 
            style={[
              styles.numberContainer,
              {
                transform: [{scale: isActive ? 1.1 : 1}],
              }
            ]}>
            <Text style={[
              styles.number,
              {color: cell.isDrawn ? colors.text.inverse : colors.text.primary}
            ]}>
              {cell.number}
            </Text>
          </Animated.View>
        )}
        {cell.isDrawn && !cell.number && (
          <Animated.View 
            style={[
              styles.dot,
              {
                transform: [{scale: isActive ? 1.2 : 1}],
              }
            ]} 
          />
        )}
      </Animated.View>
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
    borderRadius: designTokens.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  numberContainer: {
    backgroundColor: colors.background.surface,
    borderRadius: designTokens.borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...designTokens.elevation.subtle,
    borderWidth: 2,
    borderColor: colors.border.subtle,
  },
  number: {
    fontSize: designTokens.typography.fontSizes.md,
    fontWeight: '700',
    fontFamily: 'Nunito-Bold',
    lineHeight: designTokens.typography.lineHeights.tight * designTokens.typography.fontSizes.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: designTokens.borderRadius.full,
    backgroundColor: colors.background.surface,
    ...designTokens.elevation.subtle,
    borderWidth: 2,
    borderColor: colors.border.subtle,
  },
});

export default GridCell;