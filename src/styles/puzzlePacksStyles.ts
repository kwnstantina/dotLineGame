import { StyleSheet } from "react-native";
import { COLORS, DESIGN_SYSTEM } from "../core/theme/designSystem";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.secondary,
  },
  backButton: {
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    paddingRight: DESIGN_SYSTEM.spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.interactive.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: DESIGN_SYSTEM.spacing.lg,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  packCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    padding: DESIGN_SYSTEM.spacing.lg,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    borderLeftWidth: 4,
    ...DESIGN_SYSTEM.elevation.medium,
  },
  packCardLocked: {
    opacity: 0.6,
    backgroundColor: COLORS.background.surface,
  },
  packHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  packIcon: {
    fontSize: 32,
    marginRight: DESIGN_SYSTEM.spacing.md,
  },
  packInfo: {
    flex: 1,
  },
  packName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  packDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  lockIcon: {
    fontSize: 24,
  },
  packDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  packCount: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  requirement: {
    fontSize: 12,
    color: COLORS.feedback.warning,
    fontStyle: 'italic',
  },
  playHint: {
    fontSize: 14,
    color: COLORS.interactive.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  textLocked: {
    color: COLORS.text.muted,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.xl,
    marginTop: DESIGN_SYSTEM.spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  progressText: {
    fontSize: 16,
    color: COLORS.interactive.primary,
    fontWeight: '600',
  },
});
