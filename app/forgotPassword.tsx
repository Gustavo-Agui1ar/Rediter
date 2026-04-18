import { Button, Header, TextBox } from "@/components/components";
import { forgotPasswordStyle } from "@/styles/forgotPassword.style";
import { styles } from "@/styles/theme";
import { KeyboardAvoidingView, View } from "react-native";

export default function ForgotPassword() {
  return (
    <KeyboardAvoidingView style={[styles.content]} behavior="padding">
      <Header title="Redefinir senha" />
      <View style={[styles.content, forgotPasswordStyle.content]}>
        <TextBox placeholder="Nova senha" secureTextEntry />
        <TextBox placeholder="Confirmar nova senha" secureTextEntry />
        <Button
          title="Redefinir senha"
          onPress={() => {}}
          style={{ marginTop: 20 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
