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
  packInfo: {
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: COLORS.background.secondary,
  },
  packIcon: {
    fontSize: 48,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  packDescription: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  puzzleCount: {
    fontSize: 14,
    color: COLORS.text.muted,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: DESIGN_SYSTEM.spacing.lg,
  },
  puzzleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  puzzleCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    padding: DESIGN_SYSTEM.spacing.md,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    ...DESIGN_SYSTEM.elevation.low,
  },
  puzzleCardCompleted: {
    borderWidth: 2,
    borderColor: COLORS.feedback.success,
  },
  puzzleCardImprovement: {
    borderWidth: 2,
    borderColor: COLORS.feedback.warning,
    backgroundColor: COLORS.background.surface,
  },
  puzzleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  puzzleNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  difficultyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  puzzleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  difficulty: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  completionInfo: {
    alignItems: 'center',
  },
  stars: {
    fontSize: 16,
    marginBottom: 4,
  },
  completionTime: {
    fontSize: 12,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  playHint: {
    fontSize: 12,
    color: COLORS.interactive.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  replayHint: {
    fontSize: 11,
    color: COLORS.interactive.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
  improvementHint: {
    fontSize: 10,
    color: COLORS.feedback.warning,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4,
  },
  recommendationsSection: {
    backgroundColor: COLORS.background.surface,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    padding: DESIGN_SYSTEM.spacing.md,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.feedback.warning,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: DESIGN_SYSTEM.spacing.xs,
  },
  recommendationsSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  recommendationItem: {
    fontSize: 13,
    color: COLORS.text.primary,
    marginBottom: 4,
    paddingLeft: DESIGN_SYSTEM.spacing.sm,
  },
});