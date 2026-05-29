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
import { useLanguage } from "@/context/LanguageContext";
import { useLoading } from "@/context/LoadingContext";
import { useIndex } from "@/scripts/Index.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useIndexStyle } from "@/styles/index.style";
import { LoginValidator } from "@/utils/login.utils";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const submitLogin = useCallback(() => {
    actions.handleLogin(email, password);
  }, [actions, email, password]);

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
                value={email}
                onChangeText={onChangeEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <HelperText
                message={t("validation_email_invalid")}
                visible={state.submitted && !LoginValidator.isEmailValid(email)}
                alert_type="error"
                style={indexStyles.helperText}
              />
            </View>

            <View style={indexStyles.fieldContainer}>
              <TextBox
                placeholder={t("login_placeholder_password")}
                value={password}
                onChangeText={onChangePassword}
                secureTextEntry
              />
              <HelperText
                message={t("validation_password_invalid")}
                visible={
                  state.submitted && !LoginValidator.isPasswordValid(password)
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
            onPress={submitLogin}
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
