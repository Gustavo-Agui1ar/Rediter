import { Colors } from "@/styles/theme";
import { Text, View } from "react-native";

interface DividerProps {
  text?: string;
}

export const Divider = ({ text }: DividerProps) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
    }}
  >
    <View style={{ flex: 1, height: 1, backgroundColor: Colors.terciary }} />

    {text && (
      <Text
        style={{
          marginHorizontal: 10,
          color: Colors.quaternary,
        }}
      >
        {text}
      </Text>
    )}

    <View style={{ flex: 1, height: 1, backgroundColor: Colors.terciary }} />
  </View>
);
