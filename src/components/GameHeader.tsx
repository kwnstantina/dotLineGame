import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, DESIGN_SYSTEM } from '../core/theme/designSystem';
import { getDifficultyLevel, getDifficultyColor } from '../utils/levels';
import { APP_STRINGS, formatLevelTitle } from '../constants/strings';

interface GameHeaderProps {
  gridSize?: number;
  level?: number;
  onHelpPress?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ gridSize = 5, level = 1, onHelpPress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.gameInfo}>
        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>{formatLevelTitle(level)}</Text>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(gridSize) }]}>
            {getDifficultyLevel(gridSize)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.helpButton}
        onPress={onHelpPress}>
        <Text style={styles.helpIcon}>{APP_STRINGS.GAME.HELP_BUTTON}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: DESIGN_SYSTEM.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gameInfo: {
    flex: 1,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN_SYSTEM.spacing.md,
  },
  levelText: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.lg,
    color: COLORS.text.primary,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
  },
  difficultyText: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
  },
  helpButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: COLORS.interactive.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...DESIGN_SYSTEM.elevation.low,
    shadowColor: COLORS.game.shadow,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  helpIcon: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.lg,
    color: COLORS.text.inverse,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
  },
});

export default GameHeader;