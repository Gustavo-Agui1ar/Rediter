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
import { useIndex } from "@/scripts/Index.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { useIndexStyle } from "@/styles/index.style";
import { LoginValidator } from "@/utils/login.utils";
import { useRouter } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const styles = useGlobalStyles();
  const indexStyles = useIndexStyle();
  const router = useRouter();
  const { loading } = useLoading();
  const { state, actions } = useIndex();

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="padding">
      {loading && <LoadingOverlay />}

      <Header title="Bem-vindo ao Rediter" />

      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={indexStyles.content_login}>
          <AlertBanner
            message={state.serverError}
            visible={!!state.serverError}
            alert_type="error"
          />
          <View style={indexStyles.content_fields}>
            <View style={indexStyles.fieldContainer}>
              <TextBox
                placeholder="Email"
                value={state.form.email}
                onChangeText={(text: string) =>
                  actions.handleInputChange("email", text)
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <HelperText
                message="E-mail incorreto ou não preenchido"
                visible={
                  state.submitted &&
                  !LoginValidator.isEmailValid(state.form.email)
                }
                alert_type="error"
                style={indexStyles.helperText}
              />
            </View>

            <View style={indexStyles.fieldContainer}>
              <TextBox
                placeholder="Password"
                value={state.form.password}
                onChangeText={(text: string) =>
                  actions.handleInputChange("password", text)
                }
                secureTextEntry
              />
              <HelperText
                message="Senha incorreta ou não preenchida"
                visible={
                  state.submitted &&
                  !LoginValidator.isPasswordValid(state.form.password)
                }
                alert_type="error"
                style={indexStyles.helperText}
              />
            </View>
          </View>

          <LinkText
            text="Esqueceu sua senha?"
            style={indexStyles.forgotPasswordLink}
            onPress={() => router.push("/sendEmail")}
          />

          <Button
            title="Conectar-se agora"
            onPress={actions.handleLogin}
            type="fill"
          />

          <Divider text="ou" />

          <Button
            title="Entrar com Google"
            onPress={actions.handleGoogleLogin}
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
              onPress={() => router.push("/Register")}
            />
          </View>
        </View>
        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
