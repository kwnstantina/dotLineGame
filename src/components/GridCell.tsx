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
  isPuzzleComplete?: boolean;
}

const GridCell: React.FC<GridCellProps> = ({
  cell, 
  cellSize, 
  isHighlighted = false,
  isActive = false,
  pathIndex,
  isPuzzleComplete = false
}) => {
  const { colors } = useAppTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const completionAnim = useRef(new Animated.Value(0)).current;
  const completionAnimRef = useRef(false);
  
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

  // Completion animation effect
  useEffect(() => {
    if (isPuzzleComplete && cell.isDrawn && !completionAnimRef.current) {
      completionAnimRef.current = true;
      Animated.sequence([
        Animated.timing(completionAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(completionAnim, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isPuzzleComplete, cell.isDrawn, completionAnim]);

  const getCellBackgroundColor = () => {
    if (cell.isObstacle) {
      return colors.text.secondary;
    }
    if (isActive) {
      // After completion, use darker tune for active cells
      if (isPuzzleComplete && completionAnimRef.current) {
        return colors.primary.black;
      }
      // Use darker color for selected cells
      return colors.primary.purpleDark;
    }
    if (cell.isDrawn) {
      // Create a smoother linear gradient effect using darker colors from the palette
      const progress = pathIndex ? Math.min(pathIndex * 0.08, 0.9) : 0;
      const baseColor = colors.primary.purple; // Darker ocean blue
      const targetColor = colors.primary.purpleDark; // Darker purple
      
      // Interpolate between darker ocean blue and darker purple for smoother gradient
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
      return colors.primary.purpleDark;
    }
    return colors.game.cellDefault;
  };

  const getBorderColor = () => {
    if (isActive) {
      return colors.interactive.primary;
    }
    if (cell.isDrawn) {
      // Use darker complementary colors for borders to enhance the linear effect
      const progress = pathIndex ? Math.min(pathIndex * 0.12, 0.9) : 0;
      return progress > 0.5 ? colors.primary.purpleDark : colors.primary.oceanWhite;
    }
    if (cell.number) {
      return colors.primary.purpleDark;
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
      backgroundColor: colors?.background?.card,
      borderRadius: BORDER_RADIUS.full,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      ...ELEVATION.low,
      borderWidth: 2,
      borderColor: colors?.interactive?.primary,
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
      backgroundColor: colors?.primary?.purpleDark,
      ...ELEVATION.subtle,
      borderWidth: 2,
      borderColor: colors?.primary?.purpleDark,
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
      color: colors?.text?.inverse,
    },
  });

  const getLightAnimationType = () => {
    if (cell.number) return 'glow';
    if (isActive) return 'light';
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
        loop={false}
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
                backgroundColor: isPuzzleComplete && completionAnimRef.current ?
                  colors.primary.black :
                  (pathIndex && pathIndex > 5 ? colors.primary.purpleDark : colors.primary.oceanWhite),
                borderRadius: BORDER_RADIUS.lg,
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            ]}
          />
        )}
        {isPuzzleComplete && cell.isDrawn && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: colors.feedback.success,
                borderRadius: BORDER_RADIUS.lg,
                opacity: completionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.8],
                }),
                transform: [{
                  scale: completionAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.1, 1],
                  }),
                }],
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
                  withOpacity(colors.primary.purpleDark, 0.15) : 
                  withOpacity(colors.primary.oceanWhite, 0.15),
                borderRadius: BORDER_RADIUS.lg,
                opacity: 0.7,
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
                backgroundColor: pathIndex && pathIndex > 5 ? colors.primary.purpleDark : colors.primary.oceanWhite,
                borderColor: pathIndex && pathIndex > 5 ? colors.primary.oceanWhite : colors.primary.purpleDark,
              }
            ]} 
          />
        )}
      </LightAnimation>
    </View>
  );
};


export default GridCell;