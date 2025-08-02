import { Animated, Easing } from 'react-native';
import { COLORS } from '../core/theme/designSystem';

export interface LightAnimationConfig {
  duration?: number;
  delay?: number;
  intensity?: number;
  useNativeDriver?: boolean;
}

export const createLightAnimation = (
  animatedValue: Animated.Value,
  config: LightAnimationConfig = {},
  loop: boolean = false
): Animated.CompositeAnimation => {
  const {
    duration = 1500,
    delay = 0,
    intensity = 1,
    useNativeDriver = true
  } = config;

  const animation = Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: intensity,
      duration: duration / 2,
      delay,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver,
    }),
    Animated.timing(animatedValue, {
      toValue: 0.3,
      duration: duration / 2,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver,
    }),
  ]);

  return loop ? Animated.loop(animation) : animation;
};

export const createPulseAnimation = (
  animatedValue: Animated.Value,
  config: LightAnimationConfig = {},
  loop: boolean = false
): Animated.CompositeAnimation => {
  const {
    duration = 2000,
    delay = 0,
    intensity = 1.05,
    useNativeDriver = true
  } = config;

  const animation = Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: intensity,
      duration: duration / 2,
      delay,
      easing: Easing.bezier(0.4, 0, 0.6, 1),
      useNativeDriver,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: duration / 2,
      easing: Easing.bezier(0.4, 0, 0.6, 1),
      useNativeDriver,
    }),
  ]);

  return loop ? Animated.loop(animation) : animation;
};

export const createShimmerAnimation = (
  animatedValue: Animated.Value,
  config: LightAnimationConfig = {}
): Animated.CompositeAnimation => {
  const {
    duration = 1800,
    delay = 0,
    useNativeDriver = true
  } = config;

  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.linear,
      useNativeDriver,
    })
  );
};

export const createGlowAnimation = (
  opacity: Animated.Value,
  scale: Animated.Value,
  config: LightAnimationConfig = {},
  loop: boolean = false
): Animated.CompositeAnimation => {
  const {
    duration = 1200,
    delay = 0,
    useNativeDriver = true
  } = config;

  const animation = Animated.parallel([
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0.8,
        duration: duration / 2,
        delay,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver,
      }),
      Animated.timing(opacity, {
        toValue: 0.2,
        duration: duration / 2,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver,
      }),
    ]),
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: duration / 2,
        delay,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver,
      }),
    ]),
  ]);

  return loop ? Animated.loop(animation) : animation;
};

export const createEntranceAnimation = (
  opacity: Animated.Value,
  translateY: Animated.Value,
  scale: Animated.Value,
  config: LightAnimationConfig = {}
): Animated.CompositeAnimation => {
  const {
    duration = 600,
    delay = 0,
    useNativeDriver = true
  } = config;

  return Animated.parallel([
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver,
    }),
    Animated.timing(translateY, {
      toValue: 0,
      duration,
      delay,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver,
    }),
    Animated.timing(scale, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      useNativeDriver,
    }),
  ]);
};

export const getLightGradient = (animatedValue: Animated.Value, colors: string[] = [COLORS.primary.black, COLORS.primary.purple]) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: colors,
  });
};

export const getLightOpacity = (animatedValue: Animated.Value, range: [number, number] = [0.3, 1]) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: range,
  });
};

export const LIGHT_PRESETS = {
  subtle: {
    duration: 2000,
    intensity: 0.7,
    colors: [COLORS.background.primary, COLORS.primary.oceanWhite],
  },
  medium: {
    duration: 1500,
    intensity: 0.9,
    colors: [COLORS.primary.oceanWhite, COLORS.primary.purpleLight],
  },
  strong: {
    duration: 1000,
    intensity: 1,
    colors: [COLORS.primary.purple, COLORS.primary.purpleDark],
  },
  minimal: {
    duration: 3000,
    intensity: 0.5,
    colors: [COLORS.background.surface, COLORS.primary.oceanWhite],
  },
} as const;