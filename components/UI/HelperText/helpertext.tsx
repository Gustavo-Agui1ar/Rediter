import { Text } from "react-native";
import { helperTextStyles } from "./helpertext.style";

interface HelperTextProps {
  message?: string;
  visible?: boolean;
}

export function HelperText({ message, visible }: HelperTextProps) {
  if (!visible || !message) return null;

  return <Text style={[helperTextStyles.text]}>{message}</Text>;
}
