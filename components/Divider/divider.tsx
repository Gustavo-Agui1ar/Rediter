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
        marginVertical: 20, // Sugestão: um respiro padrão para o divisor
      },
      style,
    ]}
    {...rest}
  >
    {/* Linha da Esquerda */}
    <View style={{ flex: 1, height: 1, backgroundColor: Colors.terciary }} />

    {/* Texto Central (opcional) */}
    {text ? (
      <Text
        style={{
          marginHorizontal: 10,
          color: Colors.quaternary,
          fontSize: 14,
          fontWeight: "500",
        }}
      >
        {text}
      </Text>
    ) : null}

    {/* Linha da Direita */}
    <View style={{ flex: 1, height: 1, backgroundColor: Colors.terciary }} />
  </View>
);
