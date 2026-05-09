import {
  AlertBanner,
  Button,
  Header,
  HelperText,
  LinkText,
  TextBox,
} from "@/components/components";
import { useRegister } from "@/scripts/Register.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useRegisterStyle } from "@/styles/Register.style";
import { LoginValidator } from "@/utils/login.utils";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";

export default function Register() {
  const styles = useGlobalStyles();
  const registerStyles = useRegisterStyle();
  const router = useRouter();
  const { state, actions } = useRegister();

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="padding">
      <Header title="Crie sua conta" />

      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={registerStyles.content_card}>
          <Text style={registerStyles.instructionText}>
            Preencha os dados abaixo para começar sua jornada no Rediter.
          </Text>

          <AlertBanner
            message={state.errorText || ""}
            visible={!!state.errorText}
            alert_type="error"
          />

          <View style={registerStyles.fieldContainer}>
            <TextBox
              placeholder="Nome completo"
              value={state.form.name}
              onChangeText={(value: string) =>
                actions.handleInputChange("name", value)
              }
            />
          </View>

          <View style={registerStyles.fieldContainer}>
            <TextBox
              placeholder="E-mail"
              value={state.form.email}
              onChangeText={(value: string) =>
                actions.handleInputChange("email", value)
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <HelperText
              message="E-mail incorreto ou não preenchido"
              alert_type="error"
              style={registerStyles.helperText}
              visible={
                !!state.form.email &&
                !LoginValidator.isEmailValid(state.form.email)
              }
            />
          </View>

          <View style={registerStyles.fieldContainer}>
            <TextBox
              placeholder="Senha"
              value={state.form.password}
              onChangeText={(value: string) =>
                actions.handleInputChange("password", value)
              }
              secureTextEntry
            />
          </View>

          <View style={registerStyles.fieldContainer}>
            <TextBox
              placeholder="Confirmar senha"
              value={state.form.confirmPassword}
              onChangeText={(value: string) =>
                actions.handleInputChange("confirmPassword", value)
              }
              secureTextEntry
            />
            <HelperText
              message="As senhas não coincidem."
              alert_type="error"
              style={registerStyles.helperText}
              visible={
                !!state.form.confirmPassword &&
                !LoginValidator.doPasswordsMatch(
                  state.form.password,
                  state.form.confirmPassword,
                )
              }
            />
          </View>

          <Button
            title="Criar conta"
            onPress={actions.handleRegister}
            type="fill"
            style={{ marginTop: 20 }}
          />

          <View style={registerStyles.loginRow}>
            <Text style={styles.textCenter}>Já possui uma conta?</Text>
            <LinkText text="Entrar" onPress={() => router.push("/")} />
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
