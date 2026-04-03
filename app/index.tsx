import {
  Button,
  Divider,
  Header,
  HelperText,
  LinkText,
  TextBox,
} from "@/components/components";
import { styles } from "@/styles/theme";
import { LoginValidator, updateField } from "@/utils/loginVerify";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";

import { ScriptIndex } from "@/scripts/index.script";
import { indexStyle } from "@/styles/index.style";
import * as StorageUtils from "@/utils/storage";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    async function checkTokens() {
      const accessToken = await StorageUtils.getStoreageItem("user_token");
      const refreshToken = await StorageUtils.getStoreageItem("refresh_token");
      if (accessToken && refreshToken) {
        console.log("Tokens encontrados, redirecionando para main...");
        router.push("/main"); // TODO terminar segurança e validação dos tokens: se o tempo do acesstokem tiver expirado, usar o refresh token para obter um novo access token. Se o refresh token também tiver expirado, redirecionar para a tela de login.
      }
    }

    checkTokens();
  }, []);

  const [Submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="padding">
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.scroll_content}
      >
        <Header title="Bem-vindo ao Rediter" />
        <View style={indexStyle.content_login}>
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
          <HelperText
            message="A senha deve conter pelo menos 6 caracteres"
            visible={
              Submitted && !LoginValidator.isPasswordValid(form.password)
            }
          />
          <LinkText
            text="Esqueceu sua senha?"
            style={{ alignSelf: "flex-end" }}
            onPress={() => {
              console.log("Esqueceu sua senha? pressed");
            }}
          />
          <Button
            title="Conectar-se agora"
            onPress={async () => {
              setSubmitted(true);

              const result = await ScriptIndex.authenticate(
                form.email,
                form.password,
              );

              if (!result.success) return;

              await StorageUtils.saveTokens(result.access, result.refresh);

              router.push("/main");
            }}
            type="fill"
          />
          <Divider text="ou" />
          <Button
            title="Entrar com Google"
            onPress={() => ScriptIndex.signInWithGoogle()}
            type="border"
            icon={
              <Image
                source={require("@/assets/images/google_icon.png")}
                style={{ width: 20, height: 20 }}
              />
            }
          />

          <View style={styles.centerRow}>
            <Text style={[styles.TextAlignCenter]}>Não possui uma conta? </Text>
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
