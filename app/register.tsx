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
import React from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";

export default function Register() {
  const styles = useGlobalStyles();
  const registerStyles = useRegisterStyle();
  const router = useRouter();
  const { state, actions } = useRegister();
  const { t } = useLanguage();

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
              value={state.form.name}
              onChangeText={(value: string) =>
                actions.handleInputChange("name", value)
              }
            />
          </View>

          <View style={registerStyles.fieldContainer}>
            <TextBox
              placeholder={t("register_placeholder_email")}
              value={state.form.email}
              onChangeText={(value: string) =>
                actions.handleInputChange("email", value)
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <HelperText
              message={t("validation_email_invalid")}
              alert_type="error"
              style={registerStyles.helperText}
              visible={
                !!state.form.email &&
                !LoginValidator.isEmailValid(state.form.email)
              }
            />
          </View>

          <View style={registerStyles.fieldContainer}>
            <TextBox
              placeholder={t("register_placeholder_password")}
              value={state.form.password}
              onChangeText={(value: string) =>
                actions.handleInputChange("password", value)
              }
              secureTextEntry
            />
          </View>

          <View style={registerStyles.fieldContainer}>
            <TextBox
              placeholder={t("register_placeholder_confirm_password")}
              value={state.form.confirmPassword}
              onChangeText={(value: string) =>
                actions.handleInputChange("confirmPassword", value)
              }
              secureTextEntry
            />
            <HelperText
              message={t("validation_passwords_dont_match")}
              alert_type="error"
              style={registerStyles.helperText}
              visible={
                !!state.form.confirmPassword &&
                !LoginValidator.doPasswordsMatch(
                  state.form.password,
                  state.form.confirmPassword,
                )
              }
            />
          </View>

          <Button
            title={t("register_btn_submit")}
            onPress={actions.handleRegister}
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
