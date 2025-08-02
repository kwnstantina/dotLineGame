import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useAppTheme } from '../contexts/ThemeContext';
import { 
  createLightAnimation, 
  createPulseAnimation, 
  createShimmerAnimation,
  createGlowAnimation,
  LightAnimationConfig,
  LIGHT_PRESETS 
} from '../utils/lightAnimations';

export type AnimationType = 'light' | 'pulse' | 'shimmer' | 'glow';
export type PresetType = keyof typeof LIGHT_PRESETS;

interface LightAnimationProps {
  children?: React.ReactNode;
  type?: AnimationType;
  preset?: PresetType;
  config?: LightAnimationConfig;
  style?: any;
  autoStart?: boolean;
  loop?: boolean;
}

export const LightAnimation: React.FC<LightAnimationProps> = ({
  children,
  type = 'light',
  preset = 'subtle',
  config,
  style,
  autoStart = true,
  loop = false,
}) => {
  const { colors } = useAppTheme();
  const lightValue = useRef(new Animated.Value(0.3)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0.3)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const presetConfig = LIGHT_PRESETS[preset];
  const finalConfig = { ...presetConfig, ...config };

  useEffect(() => {
    if (autoStart) {
      startAnimation();
    }
    return () => {
      stopAnimation();
    };
  }, [type, preset, autoStart]);

  const startAnimation = () => {
    stopAnimation();
    
    switch (type) {
      case 'light':
        animationRef.current = createLightAnimation(lightValue, finalConfig, loop);
        break;
      case 'pulse':
        animationRef.current = createPulseAnimation(scaleValue, finalConfig, loop);
        break;
      case 'shimmer':
        animationRef.current = createShimmerAnimation(lightValue, finalConfig);
        break;
      case 'glow':
        animationRef.current = createGlowAnimation(opacityValue, scaleValue, finalConfig, loop);
        break;
    }
    
    animationRef.current?.start();
  };

  const stopAnimation = () => {
    animationRef.current?.stop();
  };

  const getAnimatedStyle = () => {
    const baseStyle = {
      transform: [{ scale: scaleValue }],
    };

    switch (type) {
      case 'light':
        return {
          ...baseStyle,
          backgroundColor: lightValue.interpolate({
            inputRange: [0, 1],
            outputRange: Array.from(finalConfig.colors ?? [colors.background.primary, colors.primary.oceanWhite]),
          }),
        };
      case 'pulse':
        return baseStyle;
      case 'shimmer':
        return {
          ...baseStyle,
          opacity: lightValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
          }),
        };
      case 'glow':
        return {
          ...baseStyle,
          opacity: opacityValue,
          shadowColor: colors.primary.purple,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 8,
          shadowOpacity: opacityValue,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getAnimatedStyle(),
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

interface MinimalLightBackgroundProps {
  children?: React.ReactNode;
  style?: any;
  intensity?: 'minimal' | 'subtle' | 'medium';
}

export const MinimalLightBackground: React.FC<MinimalLightBackgroundProps> = ({
  children,
  style,
  intensity = 'minimal',
}) => {
  const { colors } = useAppTheme();
  const lightValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(lightValue, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(lightValue, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    );
    
    animation.start();
    return () => animation.stop();
  }, []);

  const getBackgroundColor = () => {
    const intensityMap = {
      minimal: [colors.background.primary, colors.background.surface],
      subtle: [colors.background.primary, colors.primary.oceanWhite],
      medium: [colors.primary.oceanWhite, colors.primary.purpleLight],
    };

    return lightValue.interpolate({
      inputRange: [0, 1],
      outputRange: intensityMap[intensity],
    });
  };

  return (
    <Animated.View
      style={[
        styles.backgroundContainer,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  backgroundContainer: {
    flex: 1,
  },
});

export default LightAnimation;