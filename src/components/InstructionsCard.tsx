import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DESIGN_SYSTEM} from '../core/theme/designSystem';
import { useAppTheme } from '../contexts/ThemeContext';

const InstructionsCard: React.FC = () => {
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    instructionsCard: {
      backgroundColor: colors.background.card,
      borderRadius: DESIGN_SYSTEM.borderRadius.xl,
      padding: DESIGN_SYSTEM.spacing.xl,
      marginBottom: DESIGN_SYSTEM.spacing.xxl,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      ...DESIGN_SYSTEM.elevation.subtle,
    },
    instructionsHeader: {
      marginBottom: DESIGN_SYSTEM.spacing.md,
    },
    instructionsTitle: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.lg,
      fontWeight: '600',
      fontFamily: 'Nunito-SemiBold',
      color: colors.text.primary,
      textAlign: 'center',
    },
    instructions: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.sm,
      textAlign: 'center',
      color: colors.text.muted,
      lineHeight: DESIGN_SYSTEM.typography.lineHeights.relaxed * DESIGN_SYSTEM.typography.fontSizes.sm,
      fontFamily: 'Nunito-Regular',
      marginBottom: DESIGN_SYSTEM.spacing.lg,
    },
    instructionsBadges: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: DESIGN_SYSTEM.spacing.sm,
    },
    badge: {
      backgroundColor: colors.interactive.secondary,
      paddingHorizontal: DESIGN_SYSTEM.spacing.md,
      paddingVertical: DESIGN_SYSTEM.spacing.xs,
      borderRadius: DESIGN_SYSTEM.borderRadius.full,
    },
    badgeText: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.xs,
      fontWeight: '600',
      color: colors.text.inverse,
      fontFamily: 'Nunito-SemiBold',
    },
  });

  return (
    <View style={styles.instructionsCard}>
      <View style={styles.instructionsHeader}>
        <Text style={styles.instructionsTitle}>How to Play</Text>
      </View>
      <Text style={styles.instructions}>
        Draw a continuous line connecting numbers 1→2→3→4→5 that fills all cells
      </Text>
      <View style={styles.instructionsBadges}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Connect</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Fill All</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Win</Text>
        </View>
      </View>
    </View>
  );
};


export default InstructionsCard;