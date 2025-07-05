import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';
import {colors, designTokens} from '../theme/colors';

interface ErrorViewProps {
  onRetry: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({onRetry}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ Failed to load puzzle</Text>
        <TouchableOpacity style={[styles.modernButton, styles.retryButton]} onPress={onRetry}>
          <Text style={styles.buttonText}>🔄 Retry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: colors.feedback.error,
    textAlign: 'center',
    marginBottom: designTokens.spacing.lg,
    fontFamily: 'Nunito-Medium',
  },
  modernButton: {
    paddingVertical: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.xl,
    borderRadius: designTokens.borderRadius.xl,
    ...designTokens.elevation.low,
  },
  retryButton: {
    backgroundColor: colors.interactive.primary,
  },
  buttonText: {
    fontSize: designTokens.typography.fontSizes.md,
    fontWeight: '600',
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.inverse,
  },
});

export default ErrorView;