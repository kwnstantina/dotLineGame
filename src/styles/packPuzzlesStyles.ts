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
  packInfo: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing.lg,
    backgroundColor: colors.background.secondary,
  },
  packIcon: {
    fontSize: 48,
    marginBottom: designTokens.spacing.sm,
  },
  packDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  puzzleCount: {
    fontSize: 14,
    color: colors.text.muted,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: designTokens.spacing.lg,
  },
  puzzleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  puzzleCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
    ...designTokens.elevation.low,
  },
  puzzleCardCompleted: {
    borderWidth: 2,
    borderColor: colors.feedback.success,
  },
  puzzleCardImprovement: {
    borderWidth: 2,
    borderColor: colors.feedback.warning,
    backgroundColor: colors.background.surface,
  },
  puzzleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  puzzleNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  difficultyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  puzzleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  difficulty: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: designTokens.spacing.sm,
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
    color: colors.text.secondary,
    fontWeight: '600',
  },
  playHint: {
    fontSize: 12,
    color: colors.interactive.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  replayHint: {
    fontSize: 11,
    color: colors.interactive.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
  improvementHint: {
    fontSize: 10,
    color: colors.feedback.warning,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4,
  },
  recommendationsSection: {
    backgroundColor: colors.background.surface,
    borderRadius: designTokens.borderRadius.md,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.feedback.warning,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: designTokens.spacing.xs,
  },
  recommendationsSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: designTokens.spacing.sm,
  },
  recommendationItem: {
    fontSize: 13,
    color: colors.text.primary,
    marginBottom: 4,
    paddingLeft: designTokens.spacing.sm,
  },
});