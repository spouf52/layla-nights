import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { colors } from '@/constants/theme';

const stars = [
  { top: '24%', left: '15%', size: 8, opacity: 0.5 },
  { top: '19%', left: '73%', size: 13, opacity: 0.8 },
  { top: '35%', left: '87%', size: 6, opacity: 0.55 },
  { top: '47%', left: '7%', size: 5, opacity: 0.4 },
  { top: '64%', left: '10%', size: 10, opacity: 0.65 },
  { top: '76%', left: '23%', size: 5, opacity: 0.45 },
  { top: '72%', left: '77%', size: 8, opacity: 0.6 },
  { top: '56%', left: '91%', size: 11, opacity: 0.7 },
  { top: '13%', left: '31%', size: 5, opacity: 0.42 },
  { top: '15%', left: '57%', size: 7, opacity: 0.5 },
  { top: '28%', left: '91%', size: 4, opacity: 0.38 },
  { top: '41%', left: '18%', size: 4, opacity: 0.35 },
  { top: '43%', left: '78%', size: 5, opacity: 0.42 },
  { top: '52%', left: '95%', size: 4, opacity: 0.35 },
  { top: '61%', left: '18%', size: 6, opacity: 0.48 },
  { top: '67%', left: '89%', size: 5, opacity: 0.44 },
  { top: '83%', left: '37%', size: 4, opacity: 0.35 },
  { top: '81%', left: '63%', size: 6, opacity: 0.42 },
  { top: '30%', left: '5%', size: 3, opacity: 0.3 },
  { top: '88%', left: '14%', size: 4, opacity: 0.32 },
] as const;

type Star = (typeof stars)[number];

function ShimmerStar({ star, index }: { star: Star; index: number }) {
  const shimmer = useSharedValue(0.2);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      shimmer.set(0.55);
      return;
    }

    const cycle = 1700 + (index % 5) * 220;
    const delay = (index % 6) * 180;
    shimmer.set(withDelay(delay, withRepeat(withSequence(
      withTiming(1, { duration: cycle * 0.42, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.12, { duration: cycle * 0.58, easing: Easing.inOut(Easing.ease) }),
    ), -1, false)));
  }, [index, reducedMotion, shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: star.opacity * (0.42 + shimmer.get() * 0.58),
    transform: [{ scale: 0.84 + shimmer.get() * 0.2 }],
  }));

  return (
    <Animated.Text style={[styles.star, { top: star.top, left: star.left, fontSize: star.size }, animatedStyle]}>
      ✦
    </Animated.Text>
  );
}

export function LaunchScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {stars.map((star, index) => <ShimmerStar key={index} star={star} index={index} />)}
      </View>
      <Image source={require('../../assets/brand/layla-logo-launch.png')} contentFit="contain" accessibilityLabel="LAŸLA logo" style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  star: { position: 'absolute', color: colors.accentBright, fontWeight: '600' },
  logo: { width: 320, height: 320 },
});
