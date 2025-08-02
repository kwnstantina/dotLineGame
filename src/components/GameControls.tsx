import React from 'react';
import {View, Text, StyleSheet,Pressable} from 'react-native';
import {DESIGN_SYSTEM} from '../core/theme/designSystem';
import { useAppTheme } from '../contexts/ThemeContext';
import { APP_STRINGS } from '../constants/strings';

interface GameControlsProps {
  drawnPathLength: number;
  onReset: () => void;
  onSubmit: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  drawnPathLength,
  onReset,
  onSubmit,
}) => {
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    controlsContainer: {
      flexDirection: 'row',
      gap: DESIGN_SYSTEM.spacing.md,
      marginVertical: DESIGN_SYSTEM.spacing.lg,
      paddingHorizontal: DESIGN_SYSTEM.spacing.xs,
    },
    modernButton: {
      flex: 1,
      paddingVertical: DESIGN_SYSTEM.spacing.sm,
      paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
      borderRadius: DESIGN_SYSTEM.borderRadius.xl,
      ...DESIGN_SYSTEM.elevation.low,
    },
    primaryButton: {
      backgroundColor: colors.interactive.primary,
    },
    secondaryButton: {
      backgroundColor: colors.background.card,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    disabledButton: {
      backgroundColor: colors.interactive.disabled,
      borderColor: colors.interactive.disabled,
      ...DESIGN_SYSTEM.elevation.none,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: DESIGN_SYSTEM.spacing.sm,
    },
    buttonIcon: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
      color: colors.text.inverse,
    },
    buttonText: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
      fontWeight: '600',
      fontFamily: 'Nunito-SemiBold',
    },
    primaryButtonText: {
      color: colors.text.inverse,
    },
    secondaryButtonText: {
      color: colors.text.primary,
    },
    disabledButtonText: {
      color: colors.text.muted,
    },
  });

  return (
    <View style={styles.controlsContainer}>
      <Pressable
        style={[
          styles.modernButton,
          styles.secondaryButton,
          drawnPathLength === 0 && styles.disabledButton
        ]}
        onPress={onReset}
        disabled={drawnPathLength === 0}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonIcon}>{APP_STRINGS.GAME.RESET_ICON}</Text>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>{APP_STRINGS.GAME.RESET_TEXT}</Text>
        </View>
      </Pressable>

      <Pressable
        style={[
          styles.modernButton, 
          styles.primaryButton,
          drawnPathLength === 0 && styles.disabledButton
        ]}
        onPress={onSubmit}
        disabled={drawnPathLength === 0}>
        <View style={styles.buttonContent}>
          <Text style={styles.buttonIcon}>{APP_STRINGS.GAME.SUBMIT_ICON}</Text>
          <Text style={[
            styles.buttonText,
            styles.primaryButtonText,
            drawnPathLength === 0 && styles.disabledButtonText
          ]}>{APP_STRINGS.GAME.SUBMIT_TEXT}</Text>
        </View>
      </Pressable>
    </View>
  );
};


export default GameControls;