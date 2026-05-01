import { Text } from "react-native";
import { createHelperTextStyles } from "./helpertext.style";
interface HelperTextProps extends React.ComponentProps<typeof Text> {
  message?: string;
  visible?: boolean;
  alert_type: "error" | "success" | "info" | "warning";
}

export default function HelperText({
  message,
  visible,
  alert_type,
  style,
  ...rest
}: HelperTextProps) {
  if (!visible || !message) return null;

  const styles = createHelperTextStyles();

  return (
    <Text style={[styles.text, styles[alert_type], style]} {...rest}>
      {message}
    </Text>
  );
}
