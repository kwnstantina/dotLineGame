import { StyleSheet } from "react-native";
import { colors, designTokens } from "../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.secondary,
  },
  backButton: {
    paddingVertical: designTokens.spacing.sm,
    paddingRight: designTokens.spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.interactive.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: designTokens.spacing.lg,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: designTokens.spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  packCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    borderLeftWidth: 4,
    ...designTokens.elevation.medium,
  },
  packCardLocked: {
    opacity: 0.6,
    backgroundColor: colors.background.surface,
  },
  packHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  packIcon: {
    fontSize: 32,
    marginRight: designTokens.spacing.md,
  },
  packInfo: {
    flex: 1,
  },
  packName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  packDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  lockIcon: {
    fontSize: 24,
  },
  packDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  packCount: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  requirement: {
    fontSize: 12,
    color: colors.feedback.warning,
    fontStyle: 'italic',
  },
  playHint: {
    fontSize: 14,
    color: colors.interactive.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  textLocked: {
    color: colors.text.muted,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing.xl,
    marginTop: designTokens.spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  progressText: {
    fontSize: 16,
    color: colors.interactive.primary,
    fontWeight: '600',
  },
});
