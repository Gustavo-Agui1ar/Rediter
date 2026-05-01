import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { createAlertBannerStyles } from "./AlertBanner.styles";

interface AlertBannerProps {
  message?: string;
  visible?: boolean;
  alert_type: "error" | "success" | "info" | "warning";
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
}: AlertBannerProps) {
  if (!visible || !message) return null;

  const styles = createAlertBannerStyles();

  return (
    <View style={[styles.container, styles[`${alert_type}Container`]]}>
      <MaterialIcons
        name={iconMap[alert_type]}
        size={20}
        style={[styles.icon, styles[`${alert_type}Text`]]}
      />
      <Text style={[styles.text, styles[`${alert_type}Text`]]}>{message}</Text>
    </View>
  );
}
