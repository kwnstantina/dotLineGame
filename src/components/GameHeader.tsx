import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, designTokens } from '../theme/colors';
import { getDifficultyLevel, getDifficultyColor } from '../utils/levels';

interface GameHeaderProps {
  gridSize?: number;
  level?: number;
  onHelpPress?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ gridSize = 5, level = 1, onHelpPress }) => {


  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.titleTextContainer}>
          <Text style={styles.title}>DotLine</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Connect • Fill • Win</Text>
            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level {level}</Text>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(gridSize) }]}>
                {getDifficultyLevel(gridSize)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.helpButton}
        onPress={onHelpPress}>
        <Text style={styles.helpIcon}>?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: designTokens.spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: designTokens.spacing.xxl,
    ...designTokens.elevation.low,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: designTokens.borderRadius.xxl,
  },
  titleTextContainer: {
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: designTokens.spacing.xxl,
  },
  title: {
    fontSize: designTokens.typography.fontSizes.xxxl,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
    lineHeight: designTokens.typography.lineHeights.tight * designTokens.typography.fontSizes.xxxl,
  },
  subtitleContainer: {
    marginTop: designTokens.spacing.xs,
  },
  subtitle: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.secondary,
    fontWeight: '600',
    fontFamily: 'Nunito-Medium',
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: designTokens.spacing.xs,
    gap: designTokens.spacing.md,
  },
  levelText: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: colors.text.secondary,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
  },
  difficultyText: {
    fontSize: designTokens.typography.fontSizes.sm,
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