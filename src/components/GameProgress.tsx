import React from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {colors, designTokens} from '../theme/colors';

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
    backgroundColor: colors.background.card,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...designTokens.elevation.subtle,
  },
  progressSection: {
    marginBottom: designTokens.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  progressLabel: {
    fontSize: designTokens.typography.fontSizes.md,
    fontWeight: '500',
    color: colors.text.secondary,
    fontFamily: 'Nunito-Medium',
  },
  progressPercentage: {
    fontSize: designTokens.typography.fontSizes.md,
    fontWeight: '700',
    color: colors.text.primary,
    fontFamily: 'Nunito-Bold',
  },
  progressBarContainer: {
    marginTop: designTokens.spacing.xs,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border.secondary,
    borderRadius: designTokens.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: designTokens.borderRadius.full,
  },
  statsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: designTokens.spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: designTokens.typography.fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    fontFamily: 'Nunito-Bold',
    lineHeight: designTokens.typography.lineHeights.tight * designTokens.typography.fontSizes.xl,
  },
  statLabel: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: colors.text.muted,
    marginTop: designTokens.spacing.xs,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border.secondary,
    marginHorizontal: designTokens.spacing.md,
  },
});

export default GameProgress;