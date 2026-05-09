import {
  AlertBanner,
  Button,
  Header,
  HelperText,
  TextBox,
} from "@/components/components";
import { useStylesForgotPassword } from "@/styles/forgotPassword.style";
import { useGlobalStyles } from "@/styles/global.styles";
import { useApi } from "@/utils/request.utils";
import { deleteTokens } from "@/utils/storage.utils";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";

export default function ForgotPassword() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { request } = useApi();
  const styles = useGlobalStyles();
  const forgotStyles = useStylesForgotPassword();

  const handleResetPassword = async () => {
    setSubmitted(true);
    setError(null);

    if (!form.password) {
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      var formData = new FormData();
      formData.append("password", form.password);

      await request({
        urlComplement: "/api/users/me",
        method: "PATCH",
        body: formData,
      });

      deleteTokens();
      router.replace("/");
    } catch (err) {
      setError("Ocorreu um erro ao redefinir a senha.");
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="padding">
      <Header title="Redefinir senha" />

      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={forgotStyles.content_card}>
          <Text style={forgotStyles.instructionText}>
            Crie uma nova senha forte para a sua conta. Certifique-se de não
            usar senhas antigas.
          </Text>

          <AlertBanner
            message={error || ""}
            visible={!!error}
            alert_type="error"
          />

          <View style={forgotStyles.fieldContainer}>
            <TextBox
              placeholder="Nova senha"
              value={form.password}
              onChangeText={(text: string) =>
                setForm({ ...form, password: text })
              }
              secureTextEntry
            />
            <HelperText
              message="A senha não pode estar vazia"
              visible={submitted && !form.password}
              alert_type="error"
              style={forgotStyles.helperText}
            />
          </View>

          <View style={forgotStyles.fieldContainer}>
            <TextBox
              placeholder="Confirmar nova senha"
              value={form.confirmPassword}
              onChangeText={(text: string) =>
                setForm({ ...form, confirmPassword: text })
              }
              secureTextEntry
            />
            <HelperText
              message="As senhas não coincidem"
              visible={
                submitted &&
                form.password !== form.confirmPassword &&
                !!form.confirmPassword
              }
              alert_type="error"
              style={forgotStyles.helperText}
            />
          </View>

          <Button
            title="Redefinir senha"
            onPress={handleResetPassword}
            type="fill"
          />
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
