import { Button, Header, HelperText, TextBox } from "@/components/components";
import { useRegister } from "@/scripts/Register.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { LoginValidator } from "@/utils/login.utils";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";

export default function Register() {
  const styles = useGlobalStyles();
  const { state, actions } = useRegister();

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Crie sua conta" />

        <View style={[styles.content, { width: "80%" }]}>
          <HelperText
            message={state.errorText}
            visible={!!state.errorText}
            alert_type="error"
          />

          <TextBox
            placeholder="Nome"
            value={state.form.name}
            onChangeText={(value: string) =>
              actions.handleInputChange("name", value)
            }
          />

          <TextBox
            placeholder="Email"
            value={state.form.email}
            onChangeText={(value: string) =>
              actions.handleInputChange("email", value)
            }
          />
          <HelperText
            message="E-mail incorreto ou não preenchido"
            alert_type="error"
            visible={
              !!state.form.email &&
              !LoginValidator.isEmailValid(state.form.email)
            }
          />

          <TextBox
            placeholder="Senha"
            value={state.form.password}
            onChangeText={(value: string) =>
              actions.handleInputChange("password", value)
            }
            secureTextEntry
          />

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
            visible={
              !!state.form.confirmPassword &&
              !LoginValidator.doPasswordsMatch(
                state.form.password,
                state.form.confirmPassword,
              )
            }
          />

          <Button
            title="Criar conta"
            onPress={actions.handleRegister}
            style={{ marginTop: 20 }}
          />
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
