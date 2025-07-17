import { colors as baseColors } from './colors';

export const theme = {
  colors: {
    primary: baseColors.primary.ocean,
    secondary: baseColors.primary.purple,
    background: baseColors.background.primary,
    surface: baseColors.background.surface,
    text: baseColors.text.primary,
    textSecondary: baseColors.text.secondary,
    textMuted: baseColors.text.muted,
    textInverted: baseColors.text.inverse,
    border: baseColors.border.primary,
    success: baseColors.feedback.success,
    warning: baseColors.feedback.warning,
    error: baseColors.feedback.error,
    info: baseColors.feedback.info,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

export type Theme = typeof theme;