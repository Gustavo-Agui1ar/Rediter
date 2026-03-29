import { Button, Code, LinkText } from "@/components/components";
import { styles } from "@/styles/theme";
import { saveTokens } from "@/utils/storage";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Text, View } from "react-native";

export default function Verify() {
  const { userId } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);

  async function verifyCode(code: string) {
    if (code.length !== 6) {
      alert("Código deve conter 6 dígitos.");
      return;
    }

    var response = await fetch(
      `http://192.168.18.75:6969/Auth/Code?code=${code}&userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      },
    );

    if (response.ok) {
      var tokens = await response.json();
      var refresh = tokens.refreshToken;
      var access = tokens.accessToken;
      await saveTokens(access, refresh);
    }
  }

  return (
    <KeyboardAvoidingView style={[styles.keyboard_avoid]} behavior="padding">
      <View style={[styles.container, { gap: 10, width: "100%" }]}>
        <Image
          source={require("@/assets/images/verify.png")}
          style={styles.large_icon}
        />
        <Text style={styles.title}>Verifique seu email</Text>
        <Text style={[styles.paragraph, styles.subtitle]}>
          Enviamos um código de verificação para seu email.
        </Text>
        <Code length={6} OnChangeCode={setCode} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text style={[styles.paragraph, styles.subtitle]}>
            Não recebeu o código?{" "}
          </Text>
          <LinkText text="Reenviar código" onPress={() => {}} />
        </View>
        <Button
          title="Verificar"
          onPress={() => {
            verifyCode(code);
          }}
          type="fill"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
