import { useTheme } from "@/context/ThemeContext";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import { createdStylesHeader } from "./header.style";
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
  const defaultLogo = require("@/assets/logo/white_r.png");

  const { colors } = useTheme();
  const stylesHeader = createdStylesHeader(colors);

  return (
    <View
      style={[stylesHeader.container, divider && stylesHeader.divider, style]}
      {...rest}
    >
      <View style={stylesHeader.left}>
        <Image
          source={resource ?? defaultLogo}
          style={stylesHeader.logo}
          resizeMode="contain"
        />
      </View>

      <View style={stylesHeader.center}>
        {title ? (
          <Text numberOfLines={1} style={stylesHeader.title}>
            {title}
          </Text>
        ) : null}
      </View>

      <View style={stylesHeader.right}>{children}</View>
    </View>
  );
}
