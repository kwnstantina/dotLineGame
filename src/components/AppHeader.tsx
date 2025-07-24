import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, designTokens } from '../theme/colors';
import { APP_STRINGS } from '../constants/strings';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title = APP_STRINGS.TITLE, 
  subtitle = APP_STRINGS.TAGLINE 
}) => {
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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginHorizontal: designTokens.spacing.xl,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: designTokens.spacing.lg,
    ...designTokens.elevation.low,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: designTokens.borderRadius.xxl,

  },
  titleTextContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
    color: colors.text.primary,
    lineHeight: designTokens.typography.lineHeights.tight * designTokens.typography.fontSizes.xxxl,
  },
  subtitle: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.secondary,
    fontWeight: '600',
    fontFamily: 'Nunito-Medium',
    marginTop: designTokens.spacing.xs,
  },
});

export default AppHeader;