import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar, Animated} from 'react-native';
import {colors, designTokens} from '../theme/colors';

interface LoadingViewProps {
  fadeAnim: Animated.Value;
}

const LoadingView: React.FC<LoadingViewProps> = ({fadeAnim}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.loadingDot, {opacity: fadeAnim}]} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
};

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
    marginBottom: designTokens.spacing.lg,
  },
  loadingText: {
    fontSize: 18,
    color: colors.text.muted,
    fontWeight: '500',
    fontFamily: 'Nunito-Medium',
  },
});

export default LoadingView;