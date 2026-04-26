import { useGlobalStyles } from "@/styles/global.styles";
import { View } from "react-native";
import { IconButton, TextBox } from "../components";

export default function Feed() {
  const styles = useGlobalStyles();

  return (
    <View style={styles.content}>
      <TextBox placeholder="O que está acontecendo?">
        <IconButton type="fill" icon="search"></IconButton>
      </TextBox>
    </View>
  );
}
