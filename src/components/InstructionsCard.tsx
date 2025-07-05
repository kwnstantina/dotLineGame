import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, designTokens} from '../theme/colors';

const InstructionsCard: React.FC = () => {
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

const styles = StyleSheet.create({
  instructionsCard: {
    backgroundColor: colors.background.card,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.xl,
    marginBottom: designTokens.spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...designTokens.elevation.subtle,
  },
  instructionsHeader: {
    marginBottom: designTokens.spacing.md,
  },
  instructionsTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  instructions: {
    fontSize: designTokens.typography.fontSizes.sm,
    textAlign: 'center',
    color: colors.text.muted,
    lineHeight: designTokens.typography.lineHeights.relaxed * designTokens.typography.fontSizes.sm,
    fontFamily: 'Nunito-Regular',
    marginBottom: designTokens.spacing.lg,
  },
  instructionsBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: designTokens.spacing.sm,
  },
  badge: {
    backgroundColor: colors.interactive.secondary,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
  },
  badgeText: {
    fontSize: designTokens.typography.fontSizes.xs,
    fontWeight: '600',
    color: colors.text.inverse,
    fontFamily: 'Nunito-SemiBold',
  },
});

export default InstructionsCard;