import { MaterialIcons } from "@expo/vector-icons";
import { StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { createAlertBannerStyles } from "./AlertBanner.styles";

interface AlertBannerProps {
  message?: string;
  visible?: boolean;
  alert_type: "error" | "success" | "info" | "warning";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
}

const iconMap = {
  error: "error-outline",
  success: "check-circle-outline",
  info: "info-outline",
  warning: "warning-amber",
} as const;

export default function AlertBanner({
  message,
  visible,
  alert_type,
  style,
  textStyle,
  iconStyle,
}: AlertBannerProps) {
  if (!visible || !message) return null;

  const styles = createAlertBannerStyles();

  return (
    <View style={[styles.container, styles[`${alert_type}Container`], style]}>
      <MaterialIcons
        name={iconMap[alert_type]}
        size={20}
        style={[styles.icon, styles[`${alert_type}Text`], iconStyle]}
      />
      <Text style={[styles.text, styles[`${alert_type}Text`], textStyle]}>
        {message}
      </Text>
    </View>
  );
}
