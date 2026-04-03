import { stylesPerfil } from "@/styles/perfil.style";
import { Colors, styles } from "@/styles/theme";
import { Image, Text, View } from "react-native";

export default function Perfil() {
  return (
    <View style={styles.content}>
      <Image
        source={require("@/assets/logo/white_r.png")}
        style={stylesPerfil.imageProfile}
      />
      <Text style={{ color: Colors.quaternary, fontFamily: "bold" }}>
        Usuario teste
      </Text>
    </View>
  );
}
