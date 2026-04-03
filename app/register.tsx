import { Button, Header, HelperText, TextBox } from "@/components/components";
import { ScriptRegister } from "@/scripts/register.script";
import { styles } from "@/styles/theme";
import { LoginValidator, updateField } from "@/utils/loginVerify";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorText, setErrorText] = useState("");

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Crie sua conta" />

        <View style={[styles.content]}>
          <HelperText message={errorText} visible={!!errorText} />
          <TextBox
            placeholder="Nome"
            value={form.name}
            onChangeText={(value: string) =>
              updateField(setForm, "name", value)
            }
          />

          <TextBox
            placeholder="Email"
            value={form.email}
            onChangeText={(value: string) =>
              updateField(setForm, "email", value)
            }
          />
          <HelperText
            message="E-mail incorreto ou não preenchido"
            visible={!!form.email && !LoginValidator.isEmailValid(form.email)}
          />

          <TextBox
            placeholder="Senha"
            value={form.password}
            onChangeText={(value: string) =>
              updateField(setForm, "password", value)
            }
            secureTextEntry
          />
          <HelperText
            message="A senha deve ter 6+ caracteres, maiúsculas, números e símbolos."
            visible={
              (isSubmitted || !!form.password) &&
              !LoginValidator.isPasswordValid(form.password)
            }
          />

          <TextBox
            placeholder="Confirmar senha"
            value={form.confirmPassword}
            onChangeText={(value: string) =>
              updateField(setForm, "confirmPassword", value)
            }
            secureTextEntry
          />
          <HelperText
            message="As senhas não coincidem."
            visible={
              !!form.confirmPassword &&
              !LoginValidator.doPasswordsMatch(
                form.password,
                form.confirmPassword,
              )
            }
          />

          <Button
            title="Criar conta"
            onPress={async () => {
              setIsSubmitted(true);

              var response = await ScriptRegister.sendRegisterRequest(form);

              setErrorText(response.error);

              if (response.success) {
                router.push(`/verify?userId=${response.userId}`);
              }
            }}
            style={{ marginTop: 20 }}
          />
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
