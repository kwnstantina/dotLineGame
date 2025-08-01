import React from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {DESIGN_SYSTEM} from '../core/theme/designSystem';
import { useAppTheme } from '../contexts/ThemeContext';

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
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    progressCard: {
      backgroundColor: colors.background.card,
      borderRadius: DESIGN_SYSTEM.borderRadius.xl,
      padding: DESIGN_SYSTEM.spacing.md,
      marginBottom: DESIGN_SYSTEM.spacing.md,
      borderWidth: 1.5,
      borderColor: colors.border.primary,
      ...DESIGN_SYSTEM.elevation.subtle,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: DESIGN_SYSTEM.spacing.md,
    },
    progressTitle: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.lg,
      fontWeight: '300',
      color: colors.text.primary,
      fontFamily: 'Nunito-SemiBold',
    },
    progressBadge: {
      backgroundColor: colors.feedback.successLight,
      paddingHorizontal: DESIGN_SYSTEM.spacing.md,
      paddingVertical: DESIGN_SYSTEM.spacing.xs,
      borderRadius: DESIGN_SYSTEM.borderRadius.full,
    },
    progressPercentage: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.sm,
      fontWeight: '600',
      color: colors.feedback.success,
      fontFamily: 'Nunito-Bold',
    },
    progressBarContainer: {
      marginTop: DESIGN_SYSTEM.spacing.sm,
    },
    progressBarBackground: {
      height: 12,
      backgroundColor: colors.border.secondary,
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    },
  });

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


export default ProgressCard;