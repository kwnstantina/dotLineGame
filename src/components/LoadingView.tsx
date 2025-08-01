import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar, Animated} from 'react-native';
import { COLORS, DESIGN_SYSTEM } from '../core/theme/designSystem';
import { APP_STRINGS } from '../constants/strings';

interface LoadingViewProps {
  fadeAnim: Animated.Value;
}

const LoadingView: React.FC<LoadingViewProps> = ({fadeAnim}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background.primary} />
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.loadingDot, {opacity: fadeAnim}]} />
        <Text style={styles.loadingText}>{APP_STRINGS.GAME.LOADING_TEXT}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
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
    backgroundColor: COLORS.interactive.primary,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.text.muted,
    fontWeight: '500',
    fontFamily: 'Nunito-Medium',
  },
});

export default LoadingView;