import { Colors } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { textboxStyles } from "./textbox.style";

export default function TextBox(props: any) {
  const isPassword = props.secureTextEntry;

  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={textboxStyles.container}>
      <TextInput
        style={[textboxStyles.base, { flex: 1 }]}
        {...props}
        secureTextEntry={isPassword ? secure : false}
        placeholderTextColor={Colors.textMuted}
      />

      {isPassword && (
        <Pressable onPress={() => setSecure(!secure)}>
          <Ionicons
            name={secure ? "eye-off" : "eye"}
            size={20}
            color={Colors.textMuted}
          />
        </Pressable>
      )}
    </View>
  );
}
