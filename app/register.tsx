import {
  AlertBanner,
  Button,
  Header,
  HelperText,
  LinkText,
  TextBox,
} from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import { useRegister } from "@/scripts/Register.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useRegisterStyle } from "@/styles/Register.style";
import { LoginValidator } from "@/utils/login.utils";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";

export default function Register() {
  const styles = useGlobalStyles();
  const registerStyles = useRegisterStyle();
  const router = useRouter();
  const { state, actions } = useRegister();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onChangeName = useCallback(
    (text: string) => {
      setName(text);
      actions.clearError();
    },
    [actions],
  );

  const onChangeEmail = useCallback(
    (text: string) => {
      setEmail(text);
      actions.clearError();
    },
    [actions],
  );

  const onChangePassword = useCallback(
    (text: string) => {
      setPassword(text);
      actions.clearError();
    },
    [actions],
  );

  const onChangeConfirmPassword = useCallback(
    (text: string) => {
      setConfirmPassword(text);
      actions.clearError();
    },
    [actions],
  );

  const submitRegister = useCallback(() => {
    actions.handleRegister(name, email, password, confirmPassword);
  }, [actions, name, email, password, confirmPassword]);

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="padding">
      <Header title={t("register_header_title")} />

      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={registerStyles.content_card}>
          <Text style={registerStyles.instructionText}>
            {t("register_instruction_text")}
          </Text>

          <AlertBanner
            message={state.errorText || ""}
            visible={!!state.errorText}
            alert_type="error"
          />

          <View style={registerStyles.fieldContainer}>
            <TextBox
              placeholder={t("register_placeholder_name")}
              value={name}
              onChangeText={onChangeName}
            />
          </View>

          <View style={registerStyles.fieldContainer}>
            <TextBox
              placeholder={t("register_placeholder_email")}
              value={email}
              onChangeText={onChangeEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <HelperText
              message={t("validation_email_invalid")}
              alert_type="error"
              style={registerStyles.helperText}
              visible={!!email && !LoginValidator.isEmailValid(email)}
            />
          </View>

          <View style={registerStyles.fieldContainer}>
            <TextBox
              placeholder={t("register_placeholder_password")}
              value={password}
              onChangeText={onChangePassword}
              secureTextEntry
            />
          </View>

          <View style={registerStyles.fieldContainer}>
            <TextBox
              placeholder={t("register_placeholder_confirm_password")}
              value={confirmPassword}
              onChangeText={onChangeConfirmPassword}
              secureTextEntry
            />
            <HelperText
              message={t("validation_passwords_dont_match")}
              alert_type="error"
              style={registerStyles.helperText}
              visible={
                !!confirmPassword &&
                !LoginValidator.doPasswordsMatch(password, confirmPassword)
              }
            />
          </View>

          <Button
            title={t("register_btn_submit")}
            onPress={submitRegister}
            type="fill"
            style={{ marginTop: 20 }}
          />

          <View style={registerStyles.loginRow}>
            <Text style={styles.textCenter}>
              {t("register_already_have_account")}
            </Text>
            <LinkText
              text={t("register_link_login")}
              onPress={() => router.push("/")}
            />
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
