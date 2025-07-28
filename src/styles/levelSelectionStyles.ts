import { Dimensions, StyleSheet } from "react-native";
import { colors, designTokens } from "../theme/colors";


const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 140;

export const levelSelectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: designTokens.spacing.xl,
    paddingTop: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing.lg,
    alignItems: 'center',
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: designTokens.spacing.md,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puzzlePacksButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.interactive.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.sm,
    ...designTokens.elevation.medium,
  },
  puzzlePacksButtonText: {
    fontSize: 20,
    color: colors.text.inverse,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...designTokens.elevation.subtle,
  },
  menuButtonText: {
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.xxxl,
  },
  levelCardContainer: {
    marginBottom: designTokens.spacing.lg,
    alignItems: 'center',
  },
  levelCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: designTokens.borderRadius.xl,
    ...designTokens.elevation.medium,
    overflow: 'visible',
  },
  lockedCard: {
    opacity: 0.7,
  },
  cardGradient: {
    flex: 1,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.lg,
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
    marginRight: designTokens.spacing.md,
  },
  levelDetails: {
    flex: 1,
  },
  levelName: {
    fontSize: designTokens.typography.fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text.inverse,
    fontFamily: 'Nunito-Bold',
  },
  levelDifficulty: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.inverse,
    fontFamily: 'Nunito-Medium',
    opacity: 0.9,
    marginTop: designTokens.spacing.xs,
  },
  levelMeta: {
    alignItems: 'flex-end',
  },
  levelNumber: {
    fontSize: designTokens.typography.fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text.inverse,
    fontFamily: 'Nunito-Bold',
    opacity: 0.8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: designTokens.spacing.xs,
  },
  star: {
    fontSize: 14,
    marginHorizontal: 1,
  },
  levelDescription: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.inverse,
    fontFamily: 'Nunito-Regular',
    opacity: 0.9,
    marginTop: designTokens.spacing.sm,
  },
  unlockInfo: {
    marginTop: designTokens.spacing.sm,
  },
  unlockText: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: colors.text.inverse,
    fontFamily: 'Nunito-SemiBold',
    opacity: 0.9,
  },
  bestTime: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: colors.text.inverse,
    fontFamily: 'Nunito-Medium',
    opacity: 0.8,
    textAlign: 'right',
    marginTop: designTokens.spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingTop: designTokens.spacing.xl,
  },
  footerText: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.secondary,
    fontFamily: 'Nunito-Medium',
    opacity: 0.7,
  },
  puzzlePacksCard: {
    width: CARD_WIDTH,
    height: 120,
    borderRadius: designTokens.borderRadius.xl,
    ...designTokens.elevation.medium,
    marginBottom: designTokens.spacing.lg,
    alignSelf: 'center',
  },
  puzzlePacksGradient: {
    flex: 1,
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.lg,
    justifyContent: 'space-between',
  },
  puzzlePacksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puzzlePacksIcon: {
    fontSize: 28,
    marginRight: designTokens.spacing.md,
  },
  puzzlePacksInfo: {
    flex: 1,
  },
  puzzlePacksTitle: {
    fontSize: designTokens.typography.fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text.inverse,
    fontFamily: 'Nunito-Bold',
  },
  puzzlePacksSubtitle: {
    fontSize: designTokens.typography.fontSizes.md,
    color: colors.text.inverse,
    fontFamily: 'Nunito-Medium',
    opacity: 0.9,
    marginTop: 2,
  },
  puzzlePacksArrow: {
    fontSize: 24,
    color: colors.text.inverse,
    fontWeight: 'bold',
  },
  puzzlePacksDescription: {
    fontSize: designTokens.typography.fontSizes.sm,
    color: colors.text.inverse,
    fontFamily: 'Nunito-Regular',
    opacity: 0.8,
    marginTop: designTokens.spacing.sm,
  },
  replayContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: designTokens.borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.interactive.primary,
  },
  replayText: {
    fontSize: 11,
    color: colors.interactive.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: designTokens.spacing.xl * 2,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
