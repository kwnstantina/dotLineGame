import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, designTokens} from '../theme/colors';

interface GameStatsProps {
  cellsFilled: number;
  totalCells: number;
}

const GameStats: React.FC<GameStatsProps> = ({
  cellsFilled,
  totalCells,
}) => {
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

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    gap: designTokens.spacing.md,
    marginBottom: designTokens.spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
    ...designTokens.elevation.subtle,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: colors.feedback.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  statEmoji: {
    fontSize: designTokens.typography.fontSizes.lg,
  },
  statValue: {
    fontSize: designTokens.typography.fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    fontFamily: 'Nunito-Bold',
    lineHeight: designTokens.typography.lineHeights.tight * designTokens.typography.fontSizes.xxl,
  },
  statLabel: {
    fontSize: designTokens.typography.fontSizes.xs,
    color: colors.text.muted,
    marginTop: designTokens.spacing.xs,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
});

export default GameStats;