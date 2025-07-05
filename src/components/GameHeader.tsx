import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, designTokens} from '../theme/colors';

const GameHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎯</Text>
        </View>
        <View style={styles.titleTextContainer}>
          <Text style={styles.title}>Dot Line</Text>
          <Text style={styles.subtitle}>Connect • Fill • Win</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: designTokens.spacing.xl,
    marginBottom: designTokens.spacing.xxl,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: designTokens.borderRadius.xl,
    backgroundColor: colors.interactive.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.lg,
    ...designTokens.elevation.low,
  },
  icon: {
    fontSize: 28,
  },
  titleTextContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: designTokens.typography.fontSizes.xxxl,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
    lineHeight: designTokens.typography.lineHeights.tight * designTokens.typography.fontSizes.xxxl,
  },
  subtitle: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.secondary,
    fontWeight: '500',
    fontFamily: 'Nunito-Medium',
    marginTop: designTokens.spacing.xs,
  },
});

export default GameHeader;