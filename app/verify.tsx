import { Button, Code, LinkText } from "@/components/components";
import { useLoading } from "@/context/loadingContext";
import { ScriptVerify } from "@/scripts/verify.script";
import { styles } from "@/styles/theme";
import { saveTokens } from "@/utils/storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Text, View } from "react-native";

export default function Verify() {
  const { userEmail } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const { setLoading } = useLoading();
  return (
    <KeyboardAvoidingView style={[styles.content]} behavior="padding">
      <View style={[styles.content, { width: "80%" }]}>
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
            console.log("Starting code verification...", { userEmail, code });
            var response = await ScriptVerify.verifyCode(
              userEmail as string,
              code,
              setLoading,
            );

            if (!response?.success) {
              alert(response?.error || "Código incorreto. Tente novamente.");
              return;
            }

            await saveTokens(response.access, response.refresh);
            router.push("/main");
          }}
          type="fill"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
