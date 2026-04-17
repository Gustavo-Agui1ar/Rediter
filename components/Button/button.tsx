import { styles } from "@/styles/theme";
import { ReactNode } from "react"; // Importe o ReactNode
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { buttonStyles } from "./button.style";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  type?: "fill" | "border";
  fullWidth?: boolean;
  icon?: ReactNode; // Adicionamos a prop de ícone aqui
}

export default function Button({
  title,
  type = "fill",
  style,
  disabled,
  icon,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        buttonStyles.base,
        buttonStyles[type],
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        disabled && styles.disabledOverlay,
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
