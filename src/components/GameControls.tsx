import React from 'react';
import {View, Text, StyleSheet,Pressable} from 'react-native';
import {colors, designTokens} from '../theme/colors';
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

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    gap: designTokens.spacing.md,
    marginVertical: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.xs,
  },
  modernButton: {
    flex: 1,
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.xl,
    ...designTokens.elevation.low,
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
    ...designTokens.elevation.none,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: designTokens.spacing.sm,
  },
  buttonIcon: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.inverse,
  },
  buttonText: {
    fontSize: designTokens.typography.fontSizes.md,
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

export default GameControls;