import React from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {colors, designTokens} from '../theme/colors';

interface ProgressCardProps {
  progressPercentage: number;
  progressAnim: Animated.Value;
  progressColor: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  progressPercentage,
  progressAnim,
  progressColor,
}) => {
  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Progress</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
        </View>
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
  );
};

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: colors.background.card,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border.primary,
    ...designTokens.elevation.subtle,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  progressTitle: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: '300',
    color: colors.text.primary,
    fontFamily: 'Nunito-SemiBold',
  },
  progressBadge: {
    backgroundColor: colors.feedback.successLight,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
  },
  progressPercentage: {
    fontSize: designTokens.typography.fontSizes.sm,
    fontWeight: '600',
    color: colors.feedback.success,
    fontFamily: 'Nunito-Bold',
  },
  progressBarContainer: {
    marginTop: designTokens.spacing.sm,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: colors.border.secondary,
    borderRadius: designTokens.borderRadius.lg,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: designTokens.borderRadius.lg,
  },
});

export default ProgressCard;