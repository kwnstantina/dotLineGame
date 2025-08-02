import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DESIGN_SYSTEM} from '../core/theme/designSystem';
import { useAppTheme } from '../contexts/ThemeContext';

interface GameStatsProps {
  cellsFilled: number;
  totalCells: number;
}

const GameStats: React.FC<GameStatsProps> = ({
  cellsFilled,
  totalCells,
}) => {
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    statsGrid: {
      flexDirection: 'row',
      gap: DESIGN_SYSTEM.spacing.md,
      marginBottom: DESIGN_SYSTEM.spacing.xxl,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.background.surface,
      borderRadius: DESIGN_SYSTEM.borderRadius.xl,
      padding: DESIGN_SYSTEM.spacing.sm,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border.subtle,
      ...DESIGN_SYSTEM.elevation.subtle,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: DESIGN_SYSTEM.borderRadius.lg,
      backgroundColor: colors.feedback.infoLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: DESIGN_SYSTEM.spacing.md,
    },
    statEmoji: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
    },
    statValue: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.xxl,
      fontWeight: 'bold',
      color: colors.text.primary,
      fontFamily: 'Nunito-Bold',
      lineHeight: DESIGN_SYSTEM.typography.lineHeights.tight * DESIGN_SYSTEM.typography.fontSizes.xxl,
    },
    statLabel: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.xs,
      color: colors.text.muted,
      marginTop: DESIGN_SYSTEM.spacing.xs,
      fontFamily: 'Nunito-Regular',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <View style={styles.statIcon}>
          <Text style={styles.statEmoji}>📊</Text>
        </View>
        <Text style={styles.statValue}>{cellsFilled}</Text>
        <Text style={styles.statLabel}>Cells Filled</Text>
      </View>
      <View style={styles.statCard}>
        <View style={styles.statIcon}>
          <Text style={styles.statEmoji}>🎯</Text>
        </View>
        <Text style={styles.statValue}>{totalCells}</Text>
        <Text style={styles.statLabel}>Total Cells</Text>
      </View>
    </View>
  );
};


export default GameStats;