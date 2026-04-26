import { Pressable, PressableProps, Text } from "react-native";
import { useLinkTextStyles } from "./linktext.style";

interface LinkTextProps extends PressableProps {
  text: string;
}

export default function LinkText({ text, ...rest }: LinkTextProps) {
  const styles = useLinkTextStyles();

  return (
    <Pressable {...rest}>
      <Text style={styles.link}>{text}</Text>
    </Pressable>
  );
}
