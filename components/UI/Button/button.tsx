import { useLoading } from "@/context/loadingContext";
import { ReactNode } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { buttonStyles } from "./button.style";

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

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        buttonStyles.base,
        buttonStyles[type],
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

      <Text
        style={[
          buttonStyles.buttonText,
          type === "border" && buttonStyles.textBorder,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
