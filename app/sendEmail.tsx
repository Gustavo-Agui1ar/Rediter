import {
  AlertBanner,
  Button,
  Header,
  HelperText,
  TextBox,
} from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import { useSendEmail } from "@/scripts/SendEmail.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useSendEmailStyle } from "@/styles/sendEmail.style";
import { LoginValidator } from "@/utils/login.utils";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function SendEmail() {
  const styles = useGlobalStyles();
  const sendStyles = useSendEmailStyle();
  const { t } = useLanguage();
  const { state, actions } = useSendEmail();
  const [email, setEmail] = useState("");

  const onChangeEmail = useCallback(
    (text: string) => {
      setEmail(text);
      actions.clearError();
    },
    [actions],
  );

  const submitSendEmail = useCallback(() => {
    actions.handleSendCode(email);
  }, [actions, email]);

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
            message={state.serverError || ""}
            visible={!!state.serverError}
            alert_type="error"
          />

          <View style={sendStyles.fieldContainer}>
            <TextBox
              placeholder={t("send_email_placeholder")}
              value={email}
              onChangeText={onChangeEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <HelperText
              message={t("validation_email_invalid_recovery")}
              visible={state.submitted && !LoginValidator.isEmailValid(email)}
              alert_type="error"
              style={sendStyles.helperText}
            />
          </View>

          <Button
            title={t("send_email_btn_submit")}
            onPress={submitSendEmail}
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
