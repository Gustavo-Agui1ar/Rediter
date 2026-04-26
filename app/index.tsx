import {
  Button,
  Divider,
  Header,
  HelperText,
  LinkText,
  LoadingOverlay,
  TextBox,
} from "@/components/components";
import { useLoading } from "@/context/loadingContext";
import { ScriptIndex } from "@/scripts/index.script";
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
          router.replace("/search");
        }
      } catch (error) {
        console.error("Erro ao recuperar tokens:", error);
      }
    };

    checkTokens();
  }, [rootNavigationState?.key, router]);

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="padding">
      {loading && <LoadingOverlay />}
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.scroll_content}
      >
        <Header title="Bem-vindo ao Rediter" />
        <View style={indexStyles.content_login}>
          <TextBox
            placeholder="Email"
            value={form.email}
            onChangeText={(text: string) => {
              updateField(setForm, "email", text);
              if (Submitted) setSubmitted(false);
            }}
          />
          <HelperText
            message="E-mail incorreto ou não preenchido"
            visible={Submitted && !LoginValidator.isEmailValid(form.email)}
          />
          <TextBox
            placeholder="Password"
            value={form.password}
            onChangeText={(text: string) => {
              updateField(setForm, "password", text);
              if (Submitted) setSubmitted(false);
            }}
            secureTextEntry
          />
          <HelperText />
          <LinkText
            text="Esqueceu sua senha?"
            style={{ alignSelf: "flex-end" }}
            onPress={() => {
              router.push("/sendEmail");
            }}
          />
          <Button
            title="Conectar-se agora"
            onPress={async () => {
              setSubmitted(true);

              const result = await ScriptIndex.authenticate(
                form.email,
                form.password,
                setLoading,
              );

              if (!result.success) return;

              await StorageUtils.saveTokens(result.access, result.refresh);

              router.replace("/home");
            }}
            type="fill"
          />
          <Divider text="ou" />
          <Button
            title="Entrar com Google"
            onPress={() => ScriptIndex.signInWithGoogle(router, setLoading)}
            type="border"
            icon={
              <Image
                source={require("@/assets/images/google_icon.png")}
                style={{ width: 20, height: 20 }}
              />
            }
          />

          <View style={styles.centerRow}>
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
