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
import { useLoading } from "@/context/loadingContext";
import { AuthController } from "@/scripts/index.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useIndexStyle } from "@/styles/index.style";
import { LoginValidator, updateField } from "@/utils/login.utils";
import * as StorageUtils from "@/utils/storage.utils";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const { loading, setLoading } = useLoading();
  const styles = useGlobalStyles();
  const indexStyles = useIndexStyle();
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const rootNavigationState = useRootNavigationState();
  const [Submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    const checkTokens = async () => {
      try {
        const accessToken = await StorageUtils.getStoreageItem("user_token");
        const refreshToken =
          await StorageUtils.getStoreageItem("refresh_token");

        if (accessToken && refreshToken) {
          console.log("Tokens encontrados, redirecionando para main...");
          router.replace("/home");
        }
      } catch (error) {
        console.error("Erro ao recuperar tokens:", error);
      }
    };

    checkTokens();
  }, [rootNavigationState?.key, router]);

  const handleInputChange = (field: "email" | "password", value: string) => {
    updateField(setForm, field, value);
    if (Submitted) setSubmitted(false);
    if (serverError) setServerError("");
  };

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="padding">
      {loading && <LoadingOverlay />}
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Bem-vindo ao Rediter" />
        <View style={indexStyles.content_login}>
          <AlertBanner
            message={serverError}
            visible={!!serverError}
            alert_type="error"
          />
          <View style={indexStyles.content_fields}>
            <View style={indexStyles.fieldContainer}>
              <TextBox
                placeholder="Email"
                value={form.email}
                onChangeText={(text: string) =>
                  handleInputChange("email", text)
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <HelperText
                message="E-mail incorreto ou não preenchido"
                visible={Submitted && !LoginValidator.isEmailValid(form.email)}
                alert_type="error"
                style={indexStyles.helperText}
              />
            </View>

            <View style={indexStyles.fieldContainer}>
              <TextBox
                placeholder="Password"
                value={form.password}
                onChangeText={(text: string) =>
                  handleInputChange("password", text)
                }
                secureTextEntry
              />
              <HelperText
                message="Senha incorreta ou não preenchida"
                visible={
                  Submitted && !LoginValidator.isPasswordValid(form.password)
                }
                alert_type="error"
                style={indexStyles.helperText}
              />
            </View>
          </View>
          <LinkText
            text="Esqueceu sua senha?"
            style={indexStyles.forgotPasswordLink}
            onPress={() => {
              router.push("/sendEmail");
            }}
          />

          <Button
            title="Conectar-se agora"
            onPress={async () => {
              setSubmitted(true);
              setServerError("");

              if (
                !LoginValidator.isEmailValid(form.email) ||
                !LoginValidator.isPasswordValid(form.password)
              ) {
                return;
              }

              const result = await AuthController.authenticate(
                form.email,
                form.password,
                router,
                setLoading,
              );

              if (!result.success) {
                setServerError(result.error as string);
              }
            }}
            type="fill"
          />

          <Divider text="ou" />

          <Button
            title="Entrar com Google"
            onPress={async () => {
              const result = await AuthController.signInWithGoogle(
                router,
                setLoading,
              );

              if (result !== undefined && !result.success) {
                setServerError(result.error as string);
              }
            }}
            type="border"
            icon={
              <Image
                source={require("@/assets/images/google_icon.png")}
                style={indexStyles.googleIcon}
              />
            }
          />

          <View style={[styles.centerRow, indexStyles.signUpRow]}>
            <Text style={[styles.textCenter]}>Não possui uma conta? </Text>
            <LinkText
              text="Inscreva-se"
              onPress={() => {
                router.push("/register");
              }}
            />
          </View>
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
