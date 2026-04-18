import { Colors } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { textboxStyles } from "./textbox.style";

export default function TextBox({ children, ...props }: any) {
  const isPassword = props.secureTextEntry;
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={textboxStyles.container}>
      <View style={{ justifyContent: "center" }}>
        {/* TEXTO */}
        <TextInput
          style={[
            textboxStyles.base,
            {
              color: Colors.white,
              minHeight: 40,
              textAlignVertical: isPassword ? "center" : "top",
              paddingRight: isPassword ? 40 : undefined,
            },
          ]}
          {...props}
          multiline={!isPassword}
          secureTextEntry={isPassword ? secure : false}
          placeholderTextColor={Colors.textMuted}
        />

        {/* ÍCONE PASSWORD */}
        {isPassword && (
          <Pressable
            style={{
              position: "absolute",
              right: 10,
              // Sem o `top: 10`, o flexbox do View pai centraliza automaticamente
            }}
            onPress={() => setSecure(!secure)}
          >
            <Ionicons
              name={secure ? "eye-off" : "eye"}
              size={20}
              color={Colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      {/* CONTEÚDO EXTRA (IMAGENS, Links e etc.) */}
      {children}
    </View>
  );
}
