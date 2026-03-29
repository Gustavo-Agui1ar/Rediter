import { Button, Header, HelperText, TextBox } from "@/components/components";
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

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function sendRegisterRequest() {
    setIsSubmitted(true);
    setErrorText("");

    const isEmailValid = LoginValidator.isEmailValid(email);
    const isPasswordValid = LoginValidator.isPasswordValid(password);
    const doPasswordsMatch = LoginValidator.doPasswordsMatch(
      password,
      confirmPassword,
    );

    if (!isEmailValid || !isPasswordValid || !doPasswordsMatch) {
      setErrorText("Por favor, corrija os erros no formulário.");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const user = {
        name: name,
        email: email,
        password: password,
      };

      const response = await fetch("http://192.168.18.75:6969/User/Register", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log("Usuário registrado com sucesso!");
        const data = await response.json();
        console.log("Resposta do servidor:", data);
        router.push(`/verify?userId=${data.userId}`);
      } else {
        setErrorText(
          "Falha ao registrar usuário. Verifique se o e-mail já existe.",
        );
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        setErrorText("O servidor demorou muito para responder (Timeout).");
      } else {
        setErrorText("Erro de conexão com o servidor.");
      }
    }
  }

  return (
    <KeyboardAvoidingView style={styles.key_board_avoid} behavior={"height"}>
      <ScrollView
        style={styles.scroll_view}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Crie sua conta" style={styles.header} />

        <View style={[styles.content]}>
          <HelperText message={errorText} visible={!!errorText} />
          <TextBox placeholder="Nome" value={name} onChangeText={setName} />

          <TextBox placeholder="Email" value={email} onChangeText={setEmail} />
          <HelperText
            message="E-mail incorreto ou não preenchido"
            visible={!!email && !LoginValidator.isEmailValid(email)}
          />

          <TextBox
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <HelperText
            message="A senha deve ter 6+ caracteres, maiúsculas, números e símbolos."
            visible={
              (isSubmitted || !!password) &&
              !LoginValidator.isPasswordValid(password)
            }
          />

          <TextBox
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
            style={{ marginTop: 20 }}
          />
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
