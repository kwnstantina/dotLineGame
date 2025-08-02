import { Dimensions, StyleSheet } from "react-native";
import { DESIGN_SYSTEM } from "../core/theme/designSystem";

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 140;

export const createLevelSelectionStyles = (colors: any) => {
 

  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.background?.primary || '#FFFFF0',
  },
  header: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.xl,
    paddingTop: DESIGN_SYSTEM.spacing.xl,
    paddingBottom: DESIGN_SYSTEM.spacing.lg,
    alignItems: 'center',
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: DESIGN_SYSTEM.spacing.md,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puzzlePacksButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors?.interactive?.accent || '#a5b4fc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DESIGN_SYSTEM.spacing.sm,
    ...DESIGN_SYSTEM.elevation.medium,
  },
  puzzlePacksButtonText: {
    fontSize: 20,
    color: colors?.text?.inverse || '#FFFFF0',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors?.background?.surface || '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    ...DESIGN_SYSTEM.elevation.subtle,
  },
  menuButtonText: {
    fontSize: 18,
    color: colors?.text?.primary || '#161618',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingBottom: DESIGN_SYSTEM.spacing.xxxl,
  },
  levelCardContainer: {
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    alignItems: 'center',
  },
  levelCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    ...DESIGN_SYSTEM.elevation.medium,
    overflow: 'visible',
  },
  lockedCard: {
    opacity: 0.7,
  },
  cardGradient: {
    flex: 1,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    padding: DESIGN_SYSTEM.spacing.lg,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  levelIcon: {
    fontSize: 32,
    marginRight: DESIGN_SYSTEM.spacing.md,
  },
  levelDetails: {
    flex: 1,
  },
  levelName: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.xl,
    fontWeight: 'bold',
    color: colors?.text?.inverse || '#FFFFF0',
    fontFamily: 'Nunito-Bold',
  },
  levelDifficulty: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
    color: colors?.text?.inverse || '#FFFFF0',
    fontFamily: 'Nunito-Medium',
    opacity: 0.9,
    marginTop: DESIGN_SYSTEM.spacing.xs,
  },
  levelMeta: {
    alignItems: 'flex-end',
  },
  levelNumber: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.lg,
    fontWeight: 'bold',
    color: colors?.text?.inverse || '#FFFFF0',
    fontFamily: 'Nunito-Bold',
    opacity: 0.8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: DESIGN_SYSTEM.spacing.xs,
  },
  star: {
    fontSize: 14,
    marginHorizontal: 1,
  },
  levelDescription: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
    color: colors?.text?.inverse || '#FFFFF0',
    fontFamily: 'Nunito-Regular',
    opacity: 0.9,
    marginTop: DESIGN_SYSTEM.spacing.sm,
  },
  unlockInfo: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
  },
  unlockText: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.sm,
    color: colors?.text?.inverse || '#FFFFF0',
    fontFamily: 'Nunito-SemiBold',
    opacity: 0.9,
  },
  bestTime: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.sm,
    color: colors?.text?.inverse || '#FFFFF0',
    fontFamily: 'Nunito-Medium',
    opacity: 0.8,
    textAlign: 'right',
    marginTop: DESIGN_SYSTEM.spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingTop: DESIGN_SYSTEM.spacing.xl,
  },
  footerText: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
    color: colors?.text?.secondary || '#4338ca',
    fontFamily: 'Nunito-Medium',
    opacity: 0.7,
  },
  puzzlePacksCard: {
    width: CARD_WIDTH,
    height: 120,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    ...DESIGN_SYSTEM.elevation.medium,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    alignSelf: 'center',
  },
  puzzlePacksGradient: {
    flex: 1,
    borderRadius: DESIGN_SYSTEM.borderRadius.xl,
    padding: DESIGN_SYSTEM.spacing.lg,
    justifyContent: 'space-between',
  },
  puzzlePacksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puzzlePacksIcon: {
    fontSize: 28,
    marginRight: DESIGN_SYSTEM.spacing.md,
  },
  puzzlePacksInfo: {
    flex: 1,
  },
  puzzlePacksTitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.xl,
    fontWeight: 'bold',
    color: colors?.text?.inverse || '#FFFFF0',
    fontFamily: 'Nunito-Bold',
  },
  puzzlePacksSubtitle: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.md,
    color: colors?.text?.inverse || '#FFFFF0',
    fontFamily: 'Nunito-Medium',
    opacity: 0.9,
    marginTop: 2,
  },
  puzzlePacksArrow: {
    fontSize: 24,
    color: colors?.text?.inverse || '#FFFFF0',
    fontWeight: 'bold',
  },
  puzzlePacksDescription: {
    fontSize: DESIGN_SYSTEM.typography.fontSizes.sm,
    color: colors?.text?.inverse || '#FFFFF0',
    fontFamily: 'Nunito-Regular',
    opacity: 0.8,
    marginTop: DESIGN_SYSTEM.spacing.sm,
  },
  replayContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors?.background?.primary || '#FFFFF0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
    borderWidth: 1,
    borderColor: colors?.interactive?.primary || '#212121',
  },
  replayText: {
    fontSize: 11,
    color: colors?.interactive?.primary || '#212121',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.xl * 2,
  },
  loadingText: {
    fontSize: 16,
    color: colors?.text?.secondary || '#4338ca',
    textAlign: 'center',
    fontWeight: '500',
  },
  });
};

// Legacy export for backward compatibility  
export const levelSelectionStyles = createLevelSelectionStyles({} as any);
