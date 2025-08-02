import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {DESIGN_SYSTEM} from '../core/theme/designSystem';
import { useAppTheme } from '../contexts/ThemeContext';

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
  const { colors } = useAppTheme();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      left: DESIGN_SYSTEM.spacing.lg,
      right: DESIGN_SYSTEM.spacing.lg,
      bottom: DESIGN_SYSTEM.spacing.xxl,
      backgroundColor: colors.background.surface,
      borderRadius: DESIGN_SYSTEM.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
      paddingVertical: DESIGN_SYSTEM.spacing.md,
      minHeight: 64,
      ...DESIGN_SYSTEM.elevation.high,
      borderWidth: 1,
      borderColor: colors.border.primary,
      zIndex: 1000,
    },
    message: {
      color: colors.text.primary,
      fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
      fontFamily: 'Nunito-Medium',
      lineHeight: DESIGN_SYSTEM.typography.lineHeights.relaxed * DESIGN_SYSTEM.typography.fontSizes.md,
      flex: 1,
    },
    actionButton: {
      marginLeft: DESIGN_SYSTEM.spacing.lg,
      paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
      paddingVertical: DESIGN_SYSTEM.spacing.sm,
      backgroundColor: colors.interactive.primary,
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
      minWidth: 88,
      alignItems: 'center',
      justifyContent: 'center',
      ...DESIGN_SYSTEM.elevation.subtle,
    },
    actionLabel: {
      color: colors.text.inverse,
      fontWeight: '600',
      fontFamily: 'Nunito-SemiBold',
      fontSize: DESIGN_SYSTEM.typography.fontSizes.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  });

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
          duration: DESIGN_SYSTEM.transitions.normal,
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
          duration: DESIGN_SYSTEM.transitions.fast,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: DESIGN_SYSTEM.transitions.fast,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: DESIGN_SYSTEM.transitions.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, duration, onDismiss, opacity, scale, translateY]);

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


export default Snackbar;
