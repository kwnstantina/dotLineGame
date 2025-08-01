import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, DESIGN_SYSTEM } from '../core/theme/designSystem';
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
    marginHorizontal: DESIGN_SYSTEM.spacing.xl,
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
    marginHorizontal: DESIGN_SYSTEM.spacing.lg,
    ...DESIGN_SYSTEM.elevation.low,
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: DESIGN_SYSTEM.borderRadius.xxl,

  },
  titleTextContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.lg,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Bold',
    color: COLORS.text.primary,
    lineHeight: DESIGN_SYSTEM.typography.lineHeights.tight * DESIGN_SYSTEM.typography.fontSizes.xxxl,
  },
  subtitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
    color: COLORS.text.secondary,
    fontWeight: '600',
    fontFamily: 'Nunito-Medium',
    marginTop: DESIGN_SYSTEM.spacing.xs,
  },
});

export default AppHeader;