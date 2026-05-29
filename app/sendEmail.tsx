import {
  AlertBanner,
  Button,
  Header,
  HelperText,
  TextBox,
} from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
// 1. Removido o import do useLoading (O useApi já faz isso!)
import { useGlobalStyles } from "@/styles/global.styles";
import { useSendEmailStyle } from "@/styles/sendEmail.style";
import { LoginValidator } from "@/utils/login.utils";
import { useApi } from "@/utils/request.utils";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function SendEmail() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { request } = useApi();
  const styles = useGlobalStyles();
  const sendStyles = useSendEmailStyle();
  const { t } = useLanguage();

  const handleSendCode = async () => {
    setSubmitted(true);
    setServerError(null);

    if (!LoginValidator.isEmailValid(email)) {
      return;
    }

    try {
      await request({
        method: "POST",
        urlComplement: "/api/auth/generate-code",
        data: { email },
        requireAuth: false,
      });

      router.push({
        pathname: "/Verify",
        params: { userEmail: email, mode: "reset" },
      });
    } catch (err) {
      setServerError(t("error_send_code_failed"));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title={t("send_email_title")} />

      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={sendStyles.content_card}>
          <Text style={sendStyles.instructionText}>
            {t("send_email_instruction")}
          </Text>

          <AlertBanner
            message={serverError || ""}
            visible={!!serverError}
            alert_type="error"
          />

          <View style={sendStyles.fieldContainer}>
            <TextBox
              placeholder={t("send_email_placeholder")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <HelperText
              message={t("validation_email_invalid_recovery")}
              visible={submitted && !LoginValidator.isEmailValid(email)}
              alert_type="error"
              style={sendStyles.helperText}
            />
          </View>

          <Button
            title={t("send_email_btn_submit")}
            onPress={handleSendCode}
            type="fill"
          />

          <Button
            title={t("btn_back_to_login")}
            onPress={() => router.back()}
            type="border"
          />
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
