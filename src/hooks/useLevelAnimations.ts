import { useRef } from "react";
import { Animated } from "react-native";

// Custom hook to manage level animations
const useLevelAnimations = (count: number) => {
  const anims = useRef<{ scale: Animated.Value; opacity: Animated.Value; translateY: Animated.Value }[]>([]);
  if (anims.current.length !== count) {
    anims.current = Array.from({ length: count }, () => ({
      scale: new Animated.Value(0.95),
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }));
  }
  return anims.current;
};


export default useLevelAnimations;