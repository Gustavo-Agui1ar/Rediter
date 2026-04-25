import { useTheme } from "@/context/ThemeContext";
import { Pressable, PressableProps, Text } from "react-native";
import { createdLinkTextStyles } from "./linktext.style";

interface LinkTextProps extends PressableProps {
  text: string;
}

export default function LinkText({ text, ...rest }: LinkTextProps) {
  const { colors } = useTheme();
  const styles = createdLinkTextStyles(colors);

  return (
    <Pressable {...rest}>
      <Text style={styles.link}>{text}</Text>
    </Pressable>
  );
}
