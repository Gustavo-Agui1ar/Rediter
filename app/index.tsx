import {
  Button,
  Divider,
  Header,
  HelperText,
  LinkText,
  TextBox,
} from "@/components/components";
import { Colors, styles } from "@/styles/theme";
import { LoginValidator } from "@/utils/loginVerify";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";

import * as StorageUtils from "@/utils/storage";
import { useEffect } from "react";

GoogleSignin.configure({
  webClientId:
    "573963521901-0tovmn0v1au6ob5dm2uq7q19gm21o144.apps.googleusercontent.com",
  offlineAccess: true,
});

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Emailsubmitted, setEmailSubmitted] = useState(false);
  const [Passwordsubmitted, setPasswordSubmitted] = useState(false);

  async function signInWithGoogle() {
    try {
      const userInfo = await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        console.log("Google Sign-In successful:", response.data);
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  }

  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isPasswordValid(password: string) {
    return password.length >= 6;
  }

  async function authenticate() {
    setEmailSubmitted(true);
    setPasswordSubmitted(true);
    if (!isValidEmail(email)) return;
    if (!isPasswordValid(password)) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    var user = {
      name: "User Redider",
      email: email,
      password: password,
    };

    console.log("Usuário a ser registrado:", user);

    try {
      var response = await fetch("http://192.168.18.75:6969/Auth/Rediter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        signal: controller.signal,
      });

      console.log("Resposta da autenticação:", response);

      if (response.ok) {
        await LoginValidator.EnterInRediter(response);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return (
    <KeyboardAvoidingView style={[styles.key_board_avoid]} behavior="padding">
      <ScrollView
        style={[styles.scroll_view]}
        contentContainerStyle={styles.scroll_content}
      >
        <Header title="Bem-vindo ao Rediter" style={[styles.header]} />
        <View style={styles.content}>
          <TextBox
            placeholder="Email"
            value={email}
            onChangeText={(text: string) => {
              setEmail(text);
              if (Emailsubmitted) setEmailSubmitted(false);
            }}
          />
          <HelperText
            message="E-mail incorreto ou não preenchido"
            visible={Emailsubmitted && !isValidEmail(email)}
          />
          <TextBox
            placeholder="Password"
            value={password}
            onChangeText={(text: string) => {
              setPassword(text);
              if (Passwordsubmitted) setPasswordSubmitted(false);
            }}
            secureTextEntry
          />
          <HelperText
            message="A senha deve conter pelo menos 6 caracteres"
            visible={Passwordsubmitted && !isPasswordValid(password)}
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
            onPress={authenticate}
            type="fill"
          />
          <Divider text="ou" />
          <Button
            title="Entrar com Google"
            onPress={signInWithGoogle}
            type="border"
            icon={
              <Image
                source={require("@/assets/images/google_icon.png")}
                style={{ width: 20, height: 20 }}
              />
            }
          />

          <View
            style={{ flexDirection: "row", justifyContent: "center", gap: 5 }}
          >
            <Text style={{ textAlign: "center", color: Colors.terciary }}>
              Não possui uma conta?{" "}
            </Text>
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
