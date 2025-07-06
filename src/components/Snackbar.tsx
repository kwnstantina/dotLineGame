import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, designTokens} from '../theme/colors';

interface SnackbarProps {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  duration?: number; // ms
}

const Snackbar: React.FC<SnackbarProps> = ({
  visible,
  message,
  actionLabel = 'OK',
  onAction,
  onDismiss,
  duration = 3000,
}) => {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: designTokens.transitions.normal,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          onDismiss && onDismiss();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: designTokens.transitions.fast,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: designTokens.transitions.fast,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: designTokens.transitions.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) { return null; }
  return (
    <Animated.View 
      style={[
        styles.container, 
        {
          transform: [{translateY}, {scale}],
          opacity,
        }
      ]}>
      <Text style={styles.message}>{message}</Text>
      {onAction && (
        <TouchableOpacity 
          onPress={onAction} 
          style={styles.actionButton}
          activeOpacity={0.8}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: designTokens.spacing.lg,
    right: designTokens.spacing.lg,
    bottom: designTokens.spacing.xxl,
    backgroundColor: colors.background.surface,
    borderRadius: designTokens.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    minHeight: 64,
    ...designTokens.elevation.high,
    borderWidth: 1,
    borderColor: colors.border.primary,
    zIndex: 1000,
  },
  message: {
    color: colors.text.primary,
    fontSize: designTokens.typography.fontSizes.md,
    fontFamily: 'Nunito-Medium',
    lineHeight: designTokens.typography.lineHeights.relaxed * designTokens.typography.fontSizes.md,
    flex: 1,
  },
  actionButton: {
    marginLeft: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm,
    backgroundColor: colors.interactive.primary,
    borderRadius: designTokens.borderRadius.lg,
    minWidth: 88,
    alignItems: 'center',
    justifyContent: 'center',
    ...designTokens.elevation.subtle,
  },
  actionLabel: {
    color: colors.text.inverse,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
    fontSize: designTokens.typography.fontSizes.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default Snackbar;
