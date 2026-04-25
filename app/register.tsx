import { Button, Header, HelperText, TextBox } from "@/components/components";
import { useTheme } from "@/context/ThemeContext";
import { ScriptRegister } from "@/scripts/register.script";
import { createdStyles } from "@/styles/theme";
import { LoginValidator, updateField } from "@/utils/login.utils";
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

  const { colors } = useTheme();
  const styles = createdStyles(colors);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Crie sua conta" />

        <View style={[styles.content, { width: "80%" }]}>
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
                router.push({
                  pathname: "/verify",
                  params: { userEmail: form.email, mode: "register" },
                });
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
