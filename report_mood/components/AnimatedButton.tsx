import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';


interface AnimatedButtonProps{
    children:React.ReactNode;
}

export const AnimatedButton = ({children} : AnimatedButtonProps) => {
    const shakeAnimation = useSharedValue(0);
 
  useEffect(() => {
    const triggerShake = () => {
     
        shakeAnimation.value = withSequence(
          withTiming(-5, { duration: 50 }),
          withTiming(5, { duration: 50 }),
          withTiming(-5, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
       
    };

    const interval = setInterval(() => {
      triggerShake();
    }, 10000); 

    return () => clearInterval(interval); 
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
        {children}
    </Animated.View>
  );
}


