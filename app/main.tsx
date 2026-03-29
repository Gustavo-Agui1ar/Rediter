import { Divider, Header } from "@/components/components";
import { Colors, styles } from "@/styles/theme";
import { KeyboardAvoidingView, View } from "react-native";

export default function Main() {
  return (
    <KeyboardAvoidingView style={[styles.key_board_avoid]} behavior="height">
      <Header title="" style={styles.header}>
        <Divider />
      </Header>
      <View
        style={[
          styles.content,
          // { flex: 0.6, backgroundColor: Colors.secondary },
        ]}
      >
        {/* Conteúdo principal do app */}
      </View>
      <View style={[styles.footer, { backgroundColor: Colors.terciary }]}>
        {/* Rodapé do app */}
      </View>
    </KeyboardAvoidingView>
  );
}
