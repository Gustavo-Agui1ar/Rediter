import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, memo, useCallback, useMemo, useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import { useTextboxStyles } from "./textbox.style";

interface TextBoxProps extends TextInputProps {
  children?: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
}

const TextBox = forwardRef<TextInput, TextBoxProps>(
  (
    {
      children,
      icon,
      onIconPress,
      secureTextEntry,
      onFocus,
      onBlur,
      style,
      numberOfLines,
      placeholderTextColor,
      multiline,
      value,
      onChangeText,
      ...props
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const styles = useTextboxStyles();

    const isPassword = secureTextEntry;
    const [secure, setSecure] = useState(!!isPassword);
    const [focused, setFocused] = useState(false);

    const handleFocus = useCallback(
      (e: any) => {
        setFocused(true);
        if (onFocus) onFocus(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: any) => {
        setFocused(false);
        if (onBlur) onBlur(e);
      },
      [onBlur],
    );

    const toggleSecure = useCallback(() => {
      setSecure((prev) => !prev);
    }, []);

    const hasRightIcon = isPassword || !!icon;
    const isMultiline = Boolean(
      !isPassword && (multiline || (numberOfLines && numberOfLines > 1)),
    );
    const dynamicStyle = useMemo(
      () =>
        ({
          paddingRight: hasRightIcon ? 36 : 0,
          textAlignVertical: isMultiline ? "top" : "center",
          minHeight: isMultiline
            ? (numberOfLines ? numberOfLines : 1) * 24
            : undefined,
        }) as const,
      [hasRightIcon, isMultiline, numberOfLines],
    );

    return (
      <View style={[styles.container, focused && styles.focused]}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            multiline={isMultiline}
            numberOfLines={numberOfLines}
            secureTextEntry={isPassword ? secure : false}
            placeholderTextColor={placeholderTextColor || colors.textMuted}
            style={[styles.base, dynamicStyle, style]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {isPassword && (
            <Pressable style={styles.icon} onPress={toggleSecure} hitSlop={10}>
              <Ionicons
                name={secure ? "eye-off" : "eye"}
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          )}

          {!isPassword && icon && (
            <Pressable
              style={styles.icon}
              onPress={onIconPress}
              hitSlop={10}
              disabled={!onIconPress}
            >
              <Ionicons name={icon} size={20} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {children}
      </View>
    );
  },
);

export default memo(TextBox);
