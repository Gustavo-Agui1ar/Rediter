import { Colors } from "@/styles/theme";
import { Text, View, ViewProps } from "react-native";

interface DividerProps extends ViewProps {
  text?: string;
}

export const Divider = ({ text, style, ...rest }: DividerProps) => (
  <View
    style={[
      {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
      },
      style,
    ]}
    {...rest}
  >
    <View style={{ flex: 1, height: 1, backgroundColor: Colors.divider }} />

    {text ? (
      <Text
        style={{
          marginHorizontal: 10,
          color: Colors.textMuted,
          fontSize: 14,
        }}
      >
        {text}
      </Text>
    ) : null}

    <View style={{ flex: 1, height: 1, backgroundColor: Colors.divider }} />
  </View>
);
