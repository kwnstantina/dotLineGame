import { StyleSheet } from "react-native";
import { DESIGN_SYSTEM } from "../core/theme/designSystem";

export const createPackPuzzlesStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.background?.primary || '#FFFFF0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors?.background?.secondary || '#f8fafc',
  },
  backButton: {
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    paddingRight: DESIGN_SYSTEM.spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    color: colors?.interactive?.primary || '#212121',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors?.text?.primary || '#161618',
    flex: 1,
  },
  packInfo: {
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.lg,
    backgroundColor: colors?.background?.secondary || '#f8fafc',
  },
  packIcon: {
    fontSize: 48,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  packDescription: {
    fontSize: 16,
    color: colors?.text?.secondary || '#4338ca',
    textAlign: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  puzzleCount: {
    fontSize: 14,
    color: colors?.text?.muted || '#64748b',
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
    backgroundColor: colors?.background?.secondary || '#f8fafc',
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    padding: DESIGN_SYSTEM.spacing.md,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    ...DESIGN_SYSTEM.elevation.low,
  },
  puzzleCardCompleted: {
    borderWidth: 2,
    borderColor: colors?.feedback?.success || '#0fac78',
  },
  puzzleCardImprovement: {
    borderWidth: 2,
    borderColor: colors?.feedback?.warning || '#c4810c',
    backgroundColor: colors?.background?.surface || '#f1f5f9',
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
    color: colors?.text?.primary || '#161618',
  },
  difficultyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  puzzleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors?.text?.primary || '#161618',
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
    color: colors?.text?.secondary || '#4338ca',
    fontWeight: '600',
  },
  playHint: {
    fontSize: 12,
    color: colors?.interactive?.primary || '#212121',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  replayHint: {
    fontSize: 11,
    color: colors?.interactive?.secondary || '#6366f1',
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
    backgroundColor: colors?.background?.surface || '#f1f5f9',
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    padding: DESIGN_SYSTEM.spacing.md,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors?.feedback?.warning || '#c4810c',
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors?.text?.primary || '#161618',
    marginBottom: DESIGN_SYSTEM.spacing.xs,
  },
  recommendationsSubtitle: {
    fontSize: 14,
    color: colors?.text?.secondary || '#4338ca',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  recommendationItem: {
    fontSize: 13,
    color: colors?.text?.primary || '#161618',
    marginBottom: 4,
    paddingLeft: DESIGN_SYSTEM.spacing.sm,
  },
});

// Legacy export for backward compatibility
export const styles = createPackPuzzlesStyles({} as any);