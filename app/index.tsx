import {
  AlertBanner,
  Button,
  Divider,
  Header,
  HelperText,
  LinkText,
  LoadingOverlay,
  TextBox,
} from "@/components/components";
import { useLanguage } from "@/context/LanguageContext"; // 1. IMPORTADO O CONTEXTO DE IDIOMA
import { useLoading } from "@/context/loadingContext";
import { useIndex } from "@/scripts/Index.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useIndexStyle } from "@/styles/index.style";
import { LoginValidator } from "@/utils/login.utils";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const styles = useGlobalStyles();
  const indexStyles = useIndexStyle();
  const router = useRouter();
  const { loading } = useLoading();
  const { state, actions } = useIndex();
  const { t } = useLanguage();

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="padding">
      {loading && <LoadingOverlay />}

      <Header title={t("login_header_title")} />

      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={indexStyles.content_login}>
          <AlertBanner
            message={state.serverError}
            visible={!!state.serverError}
            alert_type="error"
          />
          <View style={indexStyles.content_fields}>
            <View style={indexStyles.fieldContainer}>
              <TextBox
                placeholder={t("login_placeholder_email")}
                value={state.form.email}
                onChangeText={(text: string) =>
                  actions.handleInputChange("email", text)
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <HelperText
                message={t("validation_email_invalid")}
                visible={
                  state.submitted &&
                  !LoginValidator.isEmailValid(state.form.email)
                }
                alert_type="error"
                style={indexStyles.helperText}
              />
            </View>

            <View style={indexStyles.fieldContainer}>
              <TextBox
                placeholder={t("login_placeholder_password")}
                value={state.form.password}
                onChangeText={(text: string) =>
                  actions.handleInputChange("password", text)
                }
                secureTextEntry
              />
              <HelperText
                message={t("validation_password_invalid")}
                visible={
                  state.submitted &&
                  !LoginValidator.isPasswordValid(state.form.password)
                }
                alert_type="error"
                style={indexStyles.helperText}
              />
            </View>
          </View>

          <LinkText
            text={t("login_forgot_password")}
            style={indexStyles.forgotPasswordLink}
            onPress={() => router.push("/sendEmail")}
          />

          <Button
            title={t("login_btn_submit")}
            onPress={actions.handleLogin}
            type="fill"
          />

          <Divider text={t("login_divider_or")} />

          <Button
            title={t("login_btn_google")}
            onPress={actions.handleGoogleLogin}
            type="border"
            icon={
              <Image
                source={require("@/assets/images/google_icon.png")}
                style={indexStyles.googleIcon}
              />
            }
          />

          <View style={[styles.centerRow, indexStyles.signUpRow]}>
            <Text style={[styles.textCenter]}>{t("login_no_account")}</Text>
            <LinkText
              text={t("login_link_signup")}
              onPress={() => router.push("/Register")}
            />
          </View>
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
