import {
  AlertBanner,
  Button,
  Header,
  HelperText,
  TextBox,
} from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import { useForgotPassword } from "@/scripts/ForgotPassword.script";
import { useStylesForgotPassword } from "@/styles/forgotPassword.style";
import { useGlobalStyles } from "@/styles/global.styles";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function ForgotPassword() {
  const styles = useGlobalStyles();
  const forgotStyles = useStylesForgotPassword();
  const { t } = useLanguage();
  const { state, actions } = useForgotPassword();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      actions.clearError();
    },
    [actions],
  );

  const handleConfirmPasswordChange = useCallback(
    (text: string) => {
      setConfirmPassword(text);
      actions.clearError();
    },
    [actions],
  );

  const submitReset = useCallback(() => {
    actions.handleResetPassword(password, confirmPassword);
  }, [actions, password, confirmPassword]);

  return (
    <KeyboardAvoidingView
      style={[styles.container]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title={t("forgot_password_title")} />

      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={forgotStyles.content_card}>
          <Text style={forgotStyles.instructionText}>
            {t("forgot_password_instruction")}
          </Text>

          <AlertBanner
            message={state.error || ""}
            visible={!!state.error}
            alert_type="error"
          />

          <View style={forgotStyles.fieldContainer}>
            <TextBox
              placeholder={t("forgot_password_placeholder_new")}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
            />
            <HelperText
              message={t("validation_password_empty")}
              visible={state.submitted && !password}
              alert_type="error"
              style={forgotStyles.helperText}
            />
          </View>

          <View style={forgotStyles.fieldContainer}>
            <TextBox
              placeholder={t("forgot_password_placeholder_confirm")}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry
            />
            <HelperText
              message={t("validation_passwords_dont_match")}
              visible={
                state.submitted &&
                password !== confirmPassword &&
                !!confirmPassword
              }
              alert_type="error"
              style={forgotStyles.helperText}
            />
          </View>

          <Button
            title={t("forgot_password_btn_submit")}
            onPress={submitReset}
            type="fill"
          />
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
