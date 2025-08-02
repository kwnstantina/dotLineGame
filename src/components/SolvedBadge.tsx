import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { DESIGN_SYSTEM } from '../core/theme/designSystem';
import { useAppTheme } from '../contexts/ThemeContext';

interface SolvedBadgeProps {
  solved: boolean;
  completionTime?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Exercise';
}

const SolvedBadge: React.FC<SolvedBadgeProps> = ({ 
  solved, 
  completionTime, 
  difficulty 
}) => {
  const { colors } = useAppTheme();
  const scaleAnim = useRef(new Animated.Value(solved ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (solved) {
      // Animate the badge appearance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: false,
            }),
          ])
        ),
      ]).start();
    }
  }, [solved]);

  const getBadgeColor = () => {
    switch (difficulty) {
      case 'Beginner':
        return colors.feedback.success;
      case 'Intermediate':
        return colors.feedback.warning;
      case 'Advanced':
        return colors.feedback.error;
      case 'Expert':
        return colors.interactive.accent;
      default:
        return colors.primary.black;
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: -5,
      right: -5,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    glowRing: {
      position: 'absolute',
      width: 35,
      height: 35,
      borderRadius: 17.5,
      borderWidth: 2,
      borderColor: colors.feedback.success,
    },
    badge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.feedback.success,
      justifyContent: 'center',
      alignItems: 'center',
      ...DESIGN_SYSTEM.elevation.medium,
      borderWidth: 2,
      borderColor: colors.background.card,
    },
    checkmark: {
      fontSize: 14,
      color: colors.text.inverse,
      fontWeight: 'bold',
      fontFamily: 'Nunito-Bold',
    },
    timeContainer: {
      position: 'absolute',
      top: 30,
      backgroundColor: colors.background.card,
      paddingHorizontal: DESIGN_SYSTEM.spacing.xs,
      paddingVertical: 2,
      borderRadius: DESIGN_SYSTEM.borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      ...DESIGN_SYSTEM.elevation.subtle,
    },
    timeText: {
      fontSize: 10,
      fontWeight: '600',
      fontFamily: 'Nunito-SemiBold',
      color: colors.feedback.success,
    },
    sparkle: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sparkle1: {
      top: -10,
      left: -10,
    },
    sparkle2: {
      bottom: -10,
      right: -10,
    },
    sparkleText: {
      fontSize: 12,
    },
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${seconds}s`;
  };

  if (!solved) {
    return null;
  }

  const badgeColor = getBadgeColor();
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Glowing ring */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            borderColor: badgeColor,
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8],
            }),
          },
        ]}
      />
      
      {/* Main badge */}
      <Animated.View
        style={[
          styles.badge,
          {
            backgroundColor: badgeColor,
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Text style={styles.checkmark}>✓</Text>
      </Animated.View>

      {/* Completion time */}
      {completionTime && (
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: badgeColor }]}>
            {formatTime(completionTime)}
          </Text>
        </View>
      )}

      {/* Sparkle effects */}
      <Animated.View
        style={[
          styles.sparkle,
          styles.sparkle1,
          {
            opacity: glowAnim,
            transform: [{ scale: glowAnim }],
          },
        ]}
      >
        <Text style={styles.sparkleText}>✨</Text>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.sparkle,
          styles.sparkle2,
          {
            opacity: glowAnim,
            transform: [{ scale: glowAnim }],
          },
        ]}
      >
        <Text style={styles.sparkleText}>⭐</Text>
      </Animated.View>
    </Animated.View>
  );
};


export default SolvedBadge;