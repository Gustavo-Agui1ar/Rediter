import { Button, Code, LinkText } from "@/components/components";
import { ScriptVerify } from "@/scripts/verify.script";
import { styles } from "@/styles/theme";
import { saveTokens } from "@/utils/storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Text, View } from "react-native";

export default function Verify() {
  const { userId } = useLocalSearchParams();
  const [code, setCode] = useState("");

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="padding">
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
          onPress={async () => {
            var response = await ScriptVerify.verifyCode(
              userId as string,
              code,
            );

            if (response?.success) {
              await saveTokens(response.access, response.refresh);
              router.push("/main");
            } else {
              alert(response?.error || "Código incorreto. Tente novamente.");
            }
          }}
          type="fill"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
