import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar, Animated} from 'react-native';
import { DESIGN_SYSTEM } from '../core/theme/designSystem';
import { useAppTheme } from '../contexts/ThemeContext';
import { APP_STRINGS } from '../constants/strings';

interface LoadingViewProps {
  fadeAnim: Animated.Value;
}

const LoadingView: React.FC<LoadingViewProps> = ({fadeAnim}) => {
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingDot: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.interactive.primary,
      marginBottom: DESIGN_SYSTEM.spacing.lg,
    },
    loadingText: {
      fontSize: 18,
      color: colors.text.muted,
      fontWeight: '500',
      fontFamily: 'Nunito-Medium',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.loadingDot, {opacity: fadeAnim}]} />
        <Text style={styles.loadingText}>{APP_STRINGS.GAME.LOADING_TEXT}</Text>
      </View>
    </SafeAreaView>
  );
};


export default LoadingView;