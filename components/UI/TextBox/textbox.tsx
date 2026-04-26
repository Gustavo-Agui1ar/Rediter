import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { useTextboxStyles } from "./textbox.style";

export default function TextBox({ children, ...props }: any) {
  // Hooks no topo, sem amarras!
  const { colors } = useTheme();
  const styles = useTextboxStyles();

  const isPassword = props.secureTextEntry;
  const [secure, setSecure] = useState(isPassword);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.base,
            {
              paddingRight: isPassword ? 36 : 0,
            },
          ]}
          {...props}
          multiline={!isPassword}
          secureTextEntry={isPassword ? secure : false}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {isPassword && (
          <Pressable
            style={styles.icon}
            onPress={() => setSecure(!secure)}
            hitSlop={10}
          >
            <Ionicons
              name={secure ? "eye-off" : "eye"}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      {children}
    </View>
  );
}
