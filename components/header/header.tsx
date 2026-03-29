import { styles } from "@/styles/theme";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";

interface HeaderProps extends ViewProps {
  title: string;
  resource?: ImageSourcePropType;
  children?: React.ReactNode;
}

export function Header({ title, resource, children, ...rest }: HeaderProps) {
  const defaultLogo = require("@/assets/logo/white_r.png");

  return (
    <View style={styles.header} {...rest}>
      <Image source={resource ?? defaultLogo} style={styles.logo} />

      {/* Se title existir e não for uma string vazia, renderiza o Text */}
      {title ? <Text style={styles.title}>{title}</Text> : null}

      {/* Conteúdo adicional que pode ser passado como children */}
      {children}
    </View>
  );
}
