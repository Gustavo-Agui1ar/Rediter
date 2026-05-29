import {
  AlertBanner,
  Button,
  Header,
  HelperText,
  TextBox,
} from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import { useStylesForgotPassword } from "@/styles/forgotPassword.style";
import { useGlobalStyles } from "@/styles/global.styles";
import { useApi } from "@/utils/request.utils";
import { deleteTokens } from "@/utils/storage.utils";
import { router } from "expo-router";
import { startTransition, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

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
  const { t } = useLanguage();

  const handleResetPassword = async () => {
    startTransition(() => {
      setSubmitted(true);
      setError(null);
    });

    if (!form.password) {
      return;
    }

    if (form.password !== form.confirmPassword) {
      startTransition(() => setError(t("validation_passwords_dont_match")));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("password", form.password);

      await request({
        urlComplement: "/api/users/me",
        method: "PATCH",
        data: formData,
      });

      await deleteTokens();

      startTransition(() => {
        router.replace("/");
      });
    } catch (err) {
      startTransition(() => setError(t("error_reset_password_failed")));
    }
  };

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
            message={error || ""}
            visible={!!error}
            alert_type="error"
          />

          <View style={forgotStyles.fieldContainer}>
            <TextBox
              placeholder={t("forgot_password_placeholder_new")}
              value={form.password}
              onChangeText={(text: string) =>
                setForm({ ...form, password: text })
              }
              secureTextEntry
            />
            <HelperText
              message={t("validation_password_empty")}
              visible={submitted && !form.password}
              alert_type="error"
              style={forgotStyles.helperText}
            />
          </View>

          <View style={forgotStyles.fieldContainer}>
            <TextBox
              placeholder={t("forgot_password_placeholder_confirm")}
              value={form.confirmPassword}
              onChangeText={(text: string) =>
                setForm({ ...form, confirmPassword: text })
              }
              secureTextEntry
            />
            <HelperText
              message={t("validation_passwords_dont_match")}
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
            title={t("forgot_password_btn_submit")}
            onPress={handleResetPassword}
            type="fill"
          />
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
