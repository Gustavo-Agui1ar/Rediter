import { Text, View, ViewProps } from "react-native";
import { useDividerStyles } from "./Divider.styles";

interface DividerProps extends ViewProps {
  text?: string;
}

export default function Divider({ text, style, ...rest }: DividerProps) {
  const styles = useDividerStyles();

  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.line} />

      {text ? <Text style={styles.text}>{text}</Text> : null}

      <View style={styles.line} />
    </View>
  );
}
