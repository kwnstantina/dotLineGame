import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../core/theme/designSystem';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxxl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizes.xxxl - 4, // 28px
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSizes.md,
    backgroundColor: COLORS.background.surface,
    color: COLORS.text.primary,
  },
  button: {
    backgroundColor: COLORS.interactive.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  buttonText: {
    color: COLORS.text.inverse,
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border.primary,
  },
  dividerText: {
    marginHorizontal: SPACING.lg,
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.fontSizes.sm,
  },
  googleButton: {
    backgroundColor: COLORS.background.card,
    borderWidth: 1,
    borderColor: COLORS.feedback.error,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  googleButtonText: {
    color: COLORS.feedback.error,
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  linkText: {
    color: COLORS.interactive.primary,
    fontSize: TYPOGRAPHY.fontSizes.sm,
  },
});