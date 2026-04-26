import React from "react";
// Importe o ViewProps direto do react-native, a pasta Libraries/Components... é obsoleta
import {
  Image,
  ImageSourcePropType,
  Text,
  View,
  ViewProps,
} from "react-native";
import { useStylesHeader } from "./header.style"; // <-- Importando nosso Hook

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
  const styles = useStylesHeader();
  const defaultLogo = require("@/assets/logo/white_r.png");

  return (
    <View
      style={[styles.container, divider && styles.divider, style]}
      {...rest}
    >
      <View style={styles.left}>
        <Image
          source={resource ?? defaultLogo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.center}>
        {title ? (
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>{children}</View>
    </View>
  );
}
