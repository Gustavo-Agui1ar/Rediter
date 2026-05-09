import {
  AlertBanner,
  Button,
  Header,
  HelperText,
  TextBox,
} from "@/components/components";
import { useLoading } from "@/context/loadingContext";
import { useGlobalStyles } from "@/styles/global.styles";
import { useSendEmailStyle } from "@/styles/sendEmail.style";
import { LoginValidator } from "@/utils/login.utils";
import { useApi } from "@/utils/request.utils";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";

export default function SendEmail() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { setLoading } = useLoading();
  const { request } = useApi();
  const styles = useGlobalStyles();
  const sendStyles = useSendEmailStyle();

  const handleSendCode = async () => {
    setSubmitted(true);
    setServerError(null);

    if (!LoginValidator.isEmailValid(email)) {
      return;
    }

    setLoading(true);
    try {
      await request({
        method: "POST",
        urlComplement: "/api/auth/generate-code",
        body: email,
        requireAuth: false,
      });

      router.push({
        pathname: "/Verify",
        params: { userEmail: email, mode: "reset" },
      });
    } catch (err) {
      setServerError(
        "Não foi possível enviar o código. Verifique o e-mail digitado.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="padding">
      <Header title="Recuperar senha" />

      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={sendStyles.content_card}>
          <Text style={sendStyles.instructionText}>
            Insira seu e-mail abaixo. Enviaremos um código de verificação para
            você redefinir sua senha.
          </Text>

          <AlertBanner
            message={serverError || ""}
            visible={!!serverError}
            alert_type="error"
          />

          <View style={sendStyles.fieldContainer}>
            <TextBox
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <HelperText
              message="E-mail inválido ou não preenchido"
              visible={submitted && !LoginValidator.isEmailValid(email)}
              alert_type="error"
              style={sendStyles.helperText}
            />
          </View>

          <Button
            title="Enviar código de recuperação"
            onPress={handleSendCode}
            type="fill"
          />

          <Button
            title="Voltar para o login"
            onPress={() => router.back()}
            type="border"
          />
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
