import React from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {COLORS, DESIGN_SYSTEM} from '../core/theme/designSystem';

interface GameProgressProps {
  cellsFilled: number;
  totalCells: number;
  progressPercentage: number;
  progressAnim: Animated.Value;
  progressColor: string;
}

const GameProgress: React.FC<GameProgressProps> = ({
  cellsFilled,
  totalCells,
  progressPercentage,
  progressAnim,
  progressColor,
}) => {
  return (
    <View style={styles.container}>
      {/* Progress Bar Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View 
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: progressColor,
                }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{cellsFilled}</Text>
          <Text style={styles.statLabel}>Filled</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalCells}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.card,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    padding: DESIGN_SYSTEM.spacing.lg,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    borderWidth: 1,
    borderColor: COLORS.border.subtle,
    ...DESIGN_SYSTEM.elevation.subtle,
  },
  progressSection: {
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  progressLabel: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
    fontWeight: '500',
    color: COLORS.text.secondary,
    fontFamily: 'Nunito-Medium',
  },
  progressPercentage: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
    fontWeight: '700',
    color: COLORS.text.primary,
    fontFamily: 'Nunito-Bold',
  },
  progressBarContainer: {
    marginTop: DESIGN_SYSTEM.spacing.xs,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.border.secondary,
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: DESIGN_SYSTEM.borderRadius.full,
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: DESIGN_SYSTEM.spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    fontFamily: 'Nunito-Bold',
    lineHeight: DESIGN_SYSTEM.typography.lineHeights.tight * DESIGN_SYSTEM.typography.fontSizes.xl,
  },
  statLabel: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.sm,
    color: COLORS.text.muted,
    marginTop: DESIGN_SYSTEM.spacing.xs,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border.secondary,
    marginHorizontal: DESIGN_SYSTEM.spacing.md,
  },
});

export default GameProgress;