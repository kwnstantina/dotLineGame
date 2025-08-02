import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {Cell} from '../core/models/game';
import {TYPOGRAPHY, BORDER_RADIUS, ELEVATION, TRANSITIONS, withOpacity} from '../core/theme/designSystem';
import { useAppTheme } from '../contexts/ThemeContext';
import { LightAnimation } from './LightAnimation';

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
  const { colors } = useAppTheme();
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
          duration: TRANSITIONS.normal,
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
          duration: TRANSITIONS.fast,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isActive, isHighlighted, scaleAnim, glowAnim]);
  const getCellBackgroundColor = () => {
    if (cell.isObstacle) {
      return colors.text.secondary;
    }
    if (isActive) {
      return colors.interactive.primary;
    }
    if (cell.isDrawn) {
      // Create a linear gradient effect from primary to secondary based on path index
      const progress = pathIndex ? Math.min(pathIndex * 0.1, 0.8) : 0;
      const baseColor = colors.primary.black;
      const targetColor = colors.primary.purple;
      
      // Interpolate between ocean blue and purple based on progress
      const r1 = parseInt(baseColor.slice(1, 3), 16);
      const g1 = parseInt(baseColor.slice(3, 5), 16);
      const b1 = parseInt(baseColor.slice(5, 7), 16);
      
      const r2 = parseInt(targetColor.slice(1, 3), 16);
      const g2 = parseInt(targetColor.slice(3, 5), 16);
      const b2 = parseInt(targetColor.slice(5, 7), 16);
      
      const r = Math.round(r1 + (r2 - r1) * progress);
      const g = Math.round(g1 + (g2 - g1) * progress);
      const b = Math.round(b1 + (b2 - b1) * progress);
      
      return `rgb(${r}, ${g}, ${b})`;
    }
    if (isHighlighted) {
      return colors.game.cellHighlight;
    }
    if (cell.number) {
      return colors.primary.purple;
    }
    return colors.game.cellDefault;
  };

  const getBorderColor = () => {
    if (isActive) {
      return colors.interactive.primary;
    }
    if (cell.isDrawn) {
      // Use complementary colors for borders to enhance the linear effect
      const progress = pathIndex ? Math.min(pathIndex * 0.15, 0.9) : 0;
      return progress > 0.5 ? colors.primary.purpleLight : colors.primary.purple;
    }
    if (cell.number) {
      return colors.interactive.primary;
    }
    return colors.border.primary;
  };

  const styles = StyleSheet.create({
    cellContainer: {
      padding: 0.5,
    },
    cell: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    numberContainer: {
      backgroundColor: colors.background.card,
      borderRadius: BORDER_RADIUS.full,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      ...ELEVATION.low,
      borderWidth: 2,
      borderColor: colors.interactive.primary,
    },
    number: {
      fontSize: TYPOGRAPHY.fontSizes.md,
      fontWeight: TYPOGRAPHY.fontWeights.semibold,
      fontFamily: 'Nunito-Bold',
      lineHeight: TYPOGRAPHY.lineHeights.tight * TYPOGRAPHY.fontSizes.md,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: BORDER_RADIUS.full,
      backgroundColor: colors.primary.purple,
      ...ELEVATION.subtle,
      borderWidth: 2,
      borderColor: colors.primary.purple,
    },
    obstacleIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 24,
      height: 24,
    },
    obstacleText: {
      fontSize: TYPOGRAPHY.fontSizes.xl,
      fontWeight: TYPOGRAPHY.fontWeights.bold,
      color: colors.text.inverse,
    },
  });

  const getLightAnimationType = () => {
    if (cell.number) return 'glow';
    if (isActive) return 'pulse';
    if (cell.isDrawn) return 'shimmer';
    return 'light';
  };

  const getLightPreset = () => {
    if (cell.number) return 'medium';
    if (isActive) return 'strong';
    if (cell.isDrawn) return 'subtle';
    return 'minimal';
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
      <LightAnimation
        type={getLightAnimationType()}
        preset={getLightPreset()}
        config={{ 
          duration: cell.number ? 1000 : isActive ? 800 : 1500,
          intensity: cell.isDrawn ? 0.6 : 0.8 
        }}
        autoStart={isActive || cell.isDrawn || !!cell.number}
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
        ]}
      >
        {isActive && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: pathIndex && pathIndex > 5 ? colors.primary.purpleLight : colors.primary.purple,
                borderRadius: BORDER_RADIUS.lg,
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.4],
                }),
              },
            ]}
          />
        )}
        {cell.isDrawn && !isActive && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: pathIndex && pathIndex > 5 ? 
                  withOpacity(colors.primary.purple, 0.1) : 
                  withOpacity(colors.primary.purpleLight, 0.1),
                borderRadius: BORDER_RADIUS.lg,
                opacity: 0.6,
              },
            ]}
          />
        )}
        {cell.isObstacle && (
          <View style={styles.obstacleIcon}>
            <Text style={styles.obstacleText}>✕</Text>
          </View>
        )}
        {cell.number && !cell.isObstacle && (
          <Animated.View 
            style={[
              styles.numberContainer,
              {
                transform: [{scale: isActive ? 1.1 : 1}],
              }
            ]}>
            <Text style={[
              styles.number,
              {color: cell.isDrawn ? colors.text.primary : colors.text.primary}
            ]}>
              {cell.number}
            </Text>
          </Animated.View>
        )}
        {cell.isDrawn && !cell.number && !cell.isObstacle && (
          <Animated.View 
            style={[
              styles.dot,
              {
                transform: [{scale: isActive ? 1.1 : 1}],
                backgroundColor: pathIndex && pathIndex > 5 ? colors.primary.purpleLight : colors.primary.purple,
                borderColor: pathIndex && pathIndex > 5 ? colors.primary.purple : colors.primary.purpleLight,
              }
            ]} 
          />
        )}
      </LightAnimation>
    </View>
  );
};


export default GridCell;