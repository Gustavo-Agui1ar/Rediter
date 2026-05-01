import { Button, Header, TextBox } from "@/components/components";
import { useStylesForgotPassword } from "@/styles/forgotPassword.style";
import { useGlobalStyles } from "@/styles/global.styles";
import { useApi } from "@/utils/request.utils";
import { deleteTokens } from "@/utils/storage.utils";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";

export default function ForgotPassword() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const { request } = useApi();
  const styles = useGlobalStyles();
  const forgotStyles = useStylesForgotPassword();

  return (
    <KeyboardAvoidingView style={[styles.content]} behavior="padding">
      <Header title="Redefinir senha" />
      <View style={[styles.content, forgotStyles.content]}>
        <TextBox
          placeholder="Nova senha"
          value={form.password}
          onChangeText={(text: string) => setForm({ ...form, password: text })}
          secureTextEntry
        />
        <TextBox
          placeholder="Confirmar nova senha"
          value={form.confirmPassword}
          onChangeText={(text: string) =>
            setForm({ ...form, confirmPassword: text })
          }
          secureTextEntry
        />
        <Button
          title="Redefinir senha"
          onPress={() => {
            if (form.password !== form.confirmPassword) {
              alert("As senhas não coincidem.");
              return;
            }

            var formData = new FormData();
            formData.append("password", "novaSenha");

            request({
              urlComplement: "/User/UpdateProfile",
              method: "POST",
              body: formData,
            });

            deleteTokens();
            router.replace("/");
          }}
          style={{ marginTop: 20 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
