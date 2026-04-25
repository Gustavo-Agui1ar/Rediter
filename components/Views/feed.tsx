import { useTheme } from "@/context/ThemeContext";
import { createdStyles } from "@/styles/theme";
import { View } from "react-native";

export default function Feed() {
  const { colors } = useTheme();
  const styles = createdStyles(colors);

  return <View style={styles.content}></View>;
}
