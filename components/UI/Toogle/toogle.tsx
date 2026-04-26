import { useTheme } from "@/context/ThemeContext";
import React, { useRef } from "react";
import { Animated, TouchableWithoutFeedback } from "react-native";
import { useToggleStyles } from "./toogle.styles";

interface ToggleProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

export default function Toggle({
  value,
  onValueChange,
}: ToggleProps & { onValueChange: (newValue: boolean) => void }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  function onChange(newValue: boolean) {
    onValueChange(newValue);
  }

  const toggle = () => {
    Animated.timing(anim, {
      toValue: value ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    onChange(!value);
  };

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });

  const { colors } = useTheme();
  const styles = useToggleStyles();

  return (
    <TouchableWithoutFeedback onPress={toggle}>
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.textMuted, colors.primary],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
