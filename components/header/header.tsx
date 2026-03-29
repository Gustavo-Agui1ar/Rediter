import { styles } from "@/styles/theme";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";

interface HeaderProps extends ViewProps {
  title: string;
  resource?: ImageSourcePropType;
}

export function Header({ title, resource, ...rest }: HeaderProps) {
  const defaultLogo = require("@/assets/logo/white_r.png");

  return (
    <View style={styles.header} {...rest}>
      <Image source={resource ?? defaultLogo} style={styles.logo} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
