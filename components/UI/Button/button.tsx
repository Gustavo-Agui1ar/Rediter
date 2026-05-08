import { useLoading } from "@/context/loadingContext";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { useStylesButton } from "./button.style";

export type ButtonType = "fill" | "border" | "remove_fill" | "remove_border";

interface ButtonProps extends PressableProps {
  title: string;
  type?: ButtonType;
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  icon?: ReactNode;
}

export default function Button({
  title,
  type = "fill",
  size = "medium",
  style,
  disabled,
  icon,
  fullWidth = true,
  ...rest
}: ButtonProps) {
  const { loading } = useLoading();
  const styles = useStylesButton();

  const isDisabled = disabled || loading;

  const getTextColorStyle = () => {
    switch (type) {
      case "fill":
      case "remove_fill":
        return styles.textOnFill;
      case "remove_border":
        return styles.textRemove;
      case "border":
        return styles.textBorder;
      default:
        return {};
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case "small":
        return styles.textSmall;
      case "large":
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  const getPressedStyle = () => {
    switch (type) {
      case "fill":
        return styles.fillPressed;
      case "border":
        return styles.borderPressed;
      case "remove_fill":
        return styles.remove_fillPressed;
      case "remove_border":
        return styles.remove_borderPressed;
      default:
        return {};
    }
  };

  const textColorStyle = getTextColorStyle() as { color?: string };
  const indicatorColor = textColorStyle.color || "#FFF";

  return (
    <Pressable
      disabled={isDisabled}
      style={(state) => [
        styles.base,
        styles[size],
        styles[type],

        icon ? styles.baseWithIcon : undefined,

        fullWidth && { width: "100%", alignSelf: "stretch" },

        isDisabled ? styles.disabled : undefined,

        state.pressed && !isDisabled
          ? [getPressedStyle(), { opacity: 0.85 }]
          : undefined,

        typeof style === "function"
          ? style(state)
          : (style as StyleProp<ViewStyle>),
      ]}
      {...rest}
    >
      {({ pressed }) =>
        loading ? (
          <ActivityIndicator
            size={size === "small" ? "small" : "large"}
            color={
              type === "border" || type === "remove_border"
                ? indicatorColor
                : "#FFF"
            }
          />
        ) : (
          <>
            {icon && <View style={styles.icon}>{icon}</View>}

            <Text
              style={[
                styles.buttonText,
                getTextSizeStyle(),
                getTextColorStyle(),
                pressed && !isDisabled ? { opacity: 0.7 } : undefined,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {title}
            </Text>
          </>
        )
      }
    </Pressable>
  );
}
