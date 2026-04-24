import { Button, Header, TextBox } from "@/components/components";
import { useLoading } from "@/context/loadingContext";
import { forgotPasswordStyle } from "@/styles/forgotPassword.style";
import { styles } from "@/styles/theme";
import { request } from "@/utils/request.utils";
import { deleteTokens } from "@/utils/storage.utils";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";

export default function ForgotPassword() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const { setLoading } = useLoading();

  return (
    <KeyboardAvoidingView style={[styles.content]} behavior="padding">
      <Header title="Redefinir senha" />
      <View style={[styles.content, forgotPasswordStyle.content]}>
        <TextBox placeholder="Nova senha" secureTextEntry />
        <TextBox placeholder="Confirmar nova senha" secureTextEntry />
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
              setLoading: setLoading,
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
