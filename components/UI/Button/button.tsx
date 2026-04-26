import { useLoading } from "@/context/loadingContext";
import { ReactNode } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { useStylesButton } from "./button.style";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  type?: "fill" | "border" | "remove_fill" | "remove_border";
  fullWidth?: boolean;
  icon?: ReactNode;
}

export default function Button({
  title,
  type = "fill",
  style,
  disabled,
  icon,
  ...rest
}: ButtonProps) {
  const { loading } = useLoading();
  const styles = useStylesButton();

  const isDisabled = disabled || loading;

  const getTextStyle = () => {
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

  return (
    <TouchableOpacity
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        styles[type],
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {icon && <View style={{ marginRight: 10 }}>{icon}</View>}

      <Text style={[styles.buttonText, getTextStyle()]}>{title}</Text>
    </TouchableOpacity>
  );
}
