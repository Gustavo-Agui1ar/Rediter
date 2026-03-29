import { Button, Header, HelperText, TextBox } from "@/components/components";
import { indexStyle } from "@/styles/index.style";
import { styles } from "@/styles/theme";
import { LoginValidator } from "@/utils/loginVerify";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordSubmitted, setConfirmPasswordSubmitted] =
    useState(false);
  const [errorText, setErrorText] = useState("");
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);

  async function sendRegisterRequest() {
    setErrorText("");

    router.push("/verify?userId=123");
    // if (
    //   !LoginValidator.isEmailValid(email) ||
    //   !LoginValidator.isPasswordValid(password) ||
    //   !LoginValidator.doPasswordsMatch(password, confirmPassword)
    // ) {
    //   setErrorText("Por favor, corrija os erros no formulário.");
    //   return;
    // }

    // var user = {
    //   name: name,
    //   email: email,
    //   password: password,
    // };
    // var response = await fetch("http://192.168.18.75:6969/User/Register", {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(user),
    //   signal: controller.signal,
    // });
    // if (response.ok) {
    //   const userId = (await response.json()).userId;
    //   router.push(`/verify?userId=${userId}`);
    // } else {
    //   setErrorText("Failed to register user.");
    // }
  }

  return (
    <KeyboardAvoidingView style={[styles.key_board_avoid]} behavior="padding">
      <ScrollView
        style={[styles.scroll_view]}
        contentContainerStyle={styles.scroll_content}
      >
        <Header title="Crie sua conta" style={[indexStyle.headerIndex]} />

        <HelperText message={errorText} visible={!!errorText} />
        <View style={[styles.content]}>
          <TextBox
            placeholder="Nome"
            value={name}
            onChangeText={(text: string) => setName(text)}
          />
          <TextBox
            placeholder="Email"
            value={email}
            onChangeText={(text: string) => setEmail(text)}
          />
          <HelperText
            message="E-mail incorreto ou não preenchido"
            visible={!!email && !LoginValidator.isEmailValid(email)}
          />
          <TextBox
            placeholder="Senha"
            value={password}
            onChangeText={(text: string) => setPassword(text)}
            secureTextEntry
          />
          <HelperText
            message="Senha deve conter pelo menos 6 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais."
            visible={!!password && !LoginValidator.isPasswordValid(password)}
          />
          <TextBox
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChangeText={(text: string) => setConfirmPassword(text)}
            secureTextEntry
          />
          <HelperText
            message="As senhas não coincidem."
            visible={
              !!confirmPassword &&
              !LoginValidator.doPasswordsMatch(password, confirmPassword)
            }
          />

          <Button
            title="Criar conta"
            onPress={sendRegisterRequest}
            style={[{ marginTop: 20 }]}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
