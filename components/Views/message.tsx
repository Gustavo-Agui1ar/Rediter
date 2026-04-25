import { useTheme } from "@/context/ThemeContext";
import { createdStyles } from "@/styles/theme";
import { Text, View } from "react-native";

export default function Message() {
  const { colors } = useTheme();
  const styles = createdStyles(colors);

  return (
    <View style={styles.content}>
      <Text>Suas Mensagens aqui.</Text>
    </View>
  );
}
