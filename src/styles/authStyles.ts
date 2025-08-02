import { StyleSheet } from 'react-native';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../core/theme/designSystem';

export const createAuthStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.background?.primary || '#FFFFF0',
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
    color: colors?.text?.primary || '#161618',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: colors?.text?.secondary || '#4338ca',
    textAlign: 'center',
    marginBottom: SPACING.xxxl,
  },
  input: {
    borderWidth: 1,
    borderColor: colors?.border?.primary || '#E5E7EB',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSizes.md,
    backgroundColor: colors?.background?.surface || '#f1f5f9',
    color: colors?.text?.primary || '#161618',
  },
  button: {
    backgroundColor: colors?.interactive?.primary || '#212121',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  buttonText: {
    color: colors?.text?.inverse || '#FFFFF0',
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
    backgroundColor: colors.border.primary,
  },
  dividerText: {
    marginHorizontal: SPACING.lg,
    color: colors?.text?.secondary || '#4338ca',
    fontSize: TYPOGRAPHY.fontSizes.sm,
  },
  googleButton: {
    backgroundColor: colors?.background?.card || '#ffffff',
    borderWidth: 1,
    borderColor: colors?.feedback?.error || '#9e2828',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  googleButtonText: {
    color: colors?.feedback?.error || '#9e2828',
    fontSize: TYPOGRAPHY.fontSizes.md,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  linkText: {
    color: colors?.interactive?.primary || '#212121',
    fontSize: TYPOGRAPHY.fontSizes.sm,
  },
});

// Legacy export for backward compatibility
export const authStyles = createAuthStyles({} as any);