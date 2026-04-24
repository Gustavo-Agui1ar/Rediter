import { Colors } from "@/styles/theme";
import React, { useRef } from "react";
import { Animated, TouchableWithoutFeedback } from "react-native";
import { styles } from "./toogle.styles";

interface ToggleProps {
  value: boolean;
}

export default function Toggle({ value }: ToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  function onChange(newValue: boolean) {
    value = newValue;
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

  return (
    <TouchableWithoutFeedback onPress={toggle}>
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [Colors.textMuted, Colors.primary],
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
