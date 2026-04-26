import { useGlobalStyles } from "@/styles/global.styles";
import { Text, View } from "react-native";

export default function Message() {
  const styles = useGlobalStyles();

  return (
    <View style={styles.content}>
      <Text>Suas Mensagens aqui.</Text>
    </View>
  );
}
