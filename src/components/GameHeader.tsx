import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, designTokens } from '../theme/colors';
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
    marginBottom: designTokens.spacing.xl,
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
    gap: designTokens.spacing.md,
  },
  levelText: {
    fontSize: designTokens.typography.fontSizes.lg,
    color: colors.text.primary,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
  },
  difficultyText: {
    fontSize: designTokens.typography.fontSizes.md,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
  },
  helpButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: colors.interactive.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...designTokens.elevation.low,
    shadowColor: colors.game.shadow,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  helpIcon: {
    fontSize: designTokens.typography.fontSizes.lg,
    color: colors.text.inverse,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
  },
});

export default GameHeader;