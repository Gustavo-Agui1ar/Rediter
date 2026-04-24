import { Pressable, PressableProps, Text } from "react-native";
import { linkTextStyles } from "./linktext.style";

interface LinkTextProps extends PressableProps {
  text: string;
}

export default function LinkText({ text, ...rest }: LinkTextProps) {
  return (
    <Pressable {...rest}>
      <Text style={linkTextStyles.link}>{text}</Text>
    </Pressable>
  );
}
