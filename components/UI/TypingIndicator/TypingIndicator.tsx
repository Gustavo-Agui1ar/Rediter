import { memo, useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useStylesTyping } from "./TypingIndicator.style";

export default memo(function TypingIndicator({ color }: { color: string }) {
  const dot1Y = useSharedValue(0);
  const dot2Y = useSharedValue(0);
  const dot3Y = useSharedValue(0);
  const stylesTyping = useStylesTyping();

  useEffect(() => {
    const jumpConfig = {
      duration: 400,
      easing: Easing.bezier(0.4, 0, 0.6, 1),
    };

    const jumpSequence = withSequence(
      withTiming(-5, jumpConfig),
      withTiming(0, jumpConfig),
    );

    dot1Y.value = withRepeat(jumpSequence, -1);
    dot2Y.value = withDelay(150, withRepeat(jumpSequence, -1));
    dot3Y.value = withDelay(300, withRepeat(jumpSequence, -1));

    return () => {
      dot1Y.value = 0;
      dot2Y.value = 0;
      dot3Y.value = 0;
    };
  }, [dot1Y, dot2Y, dot3Y]);

  const animStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1Y.value }],
  }));
  const animStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2Y.value }],
  }));
  const animStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3Y.value }],
  }));

  const dotStyle = [stylesTyping.dot, { backgroundColor: color }];

  return (
    <View style={stylesTyping.dotContainer}>
      <Animated.View style={[dotStyle, animStyle1]} />
      <Animated.View style={[dotStyle, animStyle2]} />
      <Animated.View style={[dotStyle, animStyle3]} />
    </View>
  );
});
