import { styles } from "@/styles/theme";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import { stylesHeader } from "./header.style";

interface HeaderProps extends ViewProps {
  title?: string;
  resource?: ImageSourcePropType;
  children?: React.ReactNode;
  divider?: boolean;
}

export function Header({
  title,
  resource,
  children,
  divider,
  style,
  ...rest
}: HeaderProps) {
  const defaultLogo = require("@/assets/logo/white_r.png");

  return (
    <View
      style={[stylesHeader.header, divider && stylesHeader.divider, style]}
      {...rest}
    >
      <Image source={resource ?? defaultLogo} style={styles.logo} />

      {title ? <Text style={styles.title}>{title}</Text> : null}

      {children}
    </View>
  );
}
