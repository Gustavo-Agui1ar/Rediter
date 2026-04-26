import { useGlobalStyles } from "@/styles/global.styles";
import { View } from "react-native";

export default function Feed() {
  const styles = useGlobalStyles();

  return <View style={styles.content}></View>;
}
