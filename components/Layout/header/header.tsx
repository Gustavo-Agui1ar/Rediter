import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import { useStylesHeader } from "./header.style";

interface HeaderProps extends ViewProps {
  title?: string;
  resource?: ImageSourcePropType;
  children?: React.ReactNode;
  divider?: boolean;
  arrowBack?: boolean;
}

export default function Header({
  title,
  resource,
  children,
  divider = true,
  arrowBack = false,
  style,
  ...rest
}: HeaderProps) {
  const stylesHeader = useStylesHeader();
  const { colors } = useTheme();
  const defaultLogo = require("@/assets/logo/white_r.svg");
  const router = useRouter();

  return (
    <View
      style={[stylesHeader.container, divider && stylesHeader.divider, style]}
      {...rest}
    >
      <View style={stylesHeader.left}>
        {arrowBack ? (
          <TouchableOpacity
            onPress={router.back}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.textPrimary || "#FFFFFF"}
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={resource ?? defaultLogo}
            style={stylesHeader.logo}
            contentFit="contain"
          />
        )}
      </View>

      <View style={stylesHeader.center}>
        {title ? (
          <Text numberOfLines={1} style={stylesHeader.title}>
            {title}
          </Text>
        ) : (
          children
        )}
      </View>

      {children && title && <View style={stylesHeader.right}>{children}</View>}
    </View>
  );
}
