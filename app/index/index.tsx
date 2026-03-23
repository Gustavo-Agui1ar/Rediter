import {
  Button,
  Divider,
  HelperText,
  LinkText,
  TextBox,
} from "@/components/components";
import { styles } from "@/styles/theme";
import {
  GoogleSignin,
  User,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";
import { Image, Text, View } from "react-native";

GoogleSignin.configure({
  webClientId:
    "573963521901-0tovmn0v1au6ob5dm2uq7q19gm21o144.apps.googleusercontent.com",
  offlineAccess: true,
});

export default function Index() {
  const [authenticated, setAuthenticated] = useState<User | null>(null);
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

  function authenticate() {
    console.log("Authenticating with email:", email);
    setEmailSubmitted(true);
    setPasswordSubmitted(true);
    if (!isValidEmail(email)) return;
    if (!isPasswordValid(password)) return;
  }

  return (
    <View style={[styles.container]}>
      <Image
        source={require("@/assets/logo/white_r.png")}
        style={styles.logo}
      />

      <Text style={[styles.title]}>Bem vindo ao Rediter!</Text>

      <View style={{ flex: 0.65, width: "80%", gap: 20, paddingTop: 50 }}>
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
        <Button title="Conectar-se agora" onPress={authenticate} type="fill" />
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
      </View>
    </View>
  );
}
