import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity} from 'react-native';
import { DESIGN_SYSTEM } from '../core/theme/designSystem';
import { useAppTheme } from '../contexts/ThemeContext';
import { APP_STRINGS } from '../constants/strings';

interface ErrorViewProps {
  onRetry: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({onRetry}) => {
  const { colors } = useAppTheme();

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
      marginBottom: DESIGN_SYSTEM.spacing.lg,
      fontFamily: 'Nunito-Medium',
    },
    modernButton: {
      paddingVertical: DESIGN_SYSTEM.spacing.lg,
      paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
      borderRadius: DESIGN_SYSTEM.borderRadius.xl,
      ...DESIGN_SYSTEM.elevation.low,
    },
    retryButton: {
      backgroundColor: colors.interactive.primary,
    },
    buttonText: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
      fontWeight: '600',
      fontFamily: 'Nunito-SemiBold',
      color: colors.text.inverse,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{APP_STRINGS.GAME.ERROR_TEXT}</Text>
        <TouchableOpacity style={[styles.modernButton, styles.retryButton]} onPress={onRetry}>
          <Text style={styles.buttonText}>{APP_STRINGS.GAME.RETRY_BUTTON}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default ErrorView;