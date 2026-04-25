import { useTheme } from "@/context/ThemeContext";
import { Text } from "react-native";
import { createHelperTextStyles } from "./helpertext.style";
interface HelperTextProps {
  message?: string;
  visible?: boolean;
}

export default function HelperText({ message, visible }: HelperTextProps) {
  if (!visible || !message) return null;

  const { colors } = useTheme();
  const styles = createHelperTextStyles(colors);

  return <Text style={[styles.text]}>{message}</Text>;
}
