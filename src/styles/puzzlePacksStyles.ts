import { StyleSheet } from "react-native";
import { DESIGN_SYSTEM } from "../core/theme/designSystem";

export const createPuzzlePacksStyles = (colors: any) => StyleSheet.create({
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: DESIGN_SYSTEM.spacing.lg,
  },
  subtitle: {
    fontSize: 16,
    color: colors?.text?.secondary || '#4338ca',
    marginBottom: DESIGN_SYSTEM.spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  packCard: {
    backgroundColor: colors?.background?.secondary || '#f8fafc',
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
    padding: DESIGN_SYSTEM.spacing.lg,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    borderLeftWidth: 4,
    ...DESIGN_SYSTEM.elevation.medium,
  },
  packCardLocked: {
    opacity: 0.6,
    backgroundColor: colors?.background?.surface || '#f1f5f9',
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
    color: colors?.text?.primary || '#161618',
    marginBottom: 4,
  },
  packDescription: {
    fontSize: 14,
    color: colors?.text?.secondary || '#4338ca',
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
    color: colors?.text?.secondary || '#4338ca',
    fontWeight: '600',
  },
  requirement: {
    fontSize: 12,
    color: colors?.feedback?.warning || '#c4810c',
    fontStyle: 'italic',
  },
  playHint: {
    fontSize: 14,
    color: colors?.interactive?.primary || '#212121',
    fontWeight: '600',
    textAlign: 'right',
  },
  textLocked: {
    color: colors?.text?.muted || '#64748b',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.xl,
    marginTop: DESIGN_SYSTEM.spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: colors?.text?.secondary || '#4338ca',
    textAlign: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  progressText: {
    fontSize: 16,
    color: colors?.interactive?.primary || '#212121',
    fontWeight: '600',
  },
});

// Legacy export for backward compatibility
export const styles = createPuzzlePacksStyles({} as any);
