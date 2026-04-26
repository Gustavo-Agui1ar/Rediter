import { Image } from "expo-image";
import React from "react";
import { ImageSourcePropType, Text, View, ViewProps } from "react-native";
import { useStylesHeader } from "./header.style";

interface HeaderProps extends ViewProps {
  title?: string;
  resource?: ImageSourcePropType;
  children?: React.ReactNode;
  divider?: boolean;
}

export default function Header({
  title,
  resource,
  children,
  divider = true,
  style,
  ...rest
}: HeaderProps) {
  const stylesHeader = useStylesHeader();
  const defaultLogo = require("@/assets/logo/white_r.svg");

  return (
    <View
      style={[stylesHeader.container, divider && stylesHeader.divider, style]}
      {...rest}
    >
      <View style={stylesHeader.left}>
        <Image
          source={resource ?? defaultLogo}
          style={stylesHeader.logo}
          contentFit="contain"
        />
      </View>

      {/* Ocupa todo o meio do header */}
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
