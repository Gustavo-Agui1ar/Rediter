import { Button, Code, LinkText } from "@/components/components";
import { useVerifyCode } from "@/scripts/verify.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { Image, KeyboardAvoidingView, Text, View } from "react-native";

export default function Verify() {
  const styles = useGlobalStyles();
  const { setCode, handleVerify, handleResendCode, loading } = useVerifyCode();

  return (
    <KeyboardAvoidingView style={[styles.content]} behavior="padding">
      <View style={[styles.content, { width: "80%" }]}>
        <Image
          source={require("@/assets/images/verify.svg")}
          style={styles.icon_lg}
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

          <LinkText text="Reenviar código" onPress={handleResendCode} />
        </View>

        <Button
          title={loading ? "Verificando..." : "Verificar"}
          onPress={handleVerify}
          type="fill"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
