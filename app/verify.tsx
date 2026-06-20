import { Button, Code, LinkText } from "@/components/components";
import { useLanguage } from "@/context/LanguageContext";
import { useVerifyCode } from "@/scripts/verify.script";
import { useGlobalStyles } from "@/styles/global.styles";
import { Image, KeyboardAvoidingView, Text, View } from "react-native";

export default function Verify() {
  const styles = useGlobalStyles();
  const { setCode, handleVerify, handleResendCode, loading } = useVerifyCode();
  const { t } = useLanguage();

  return (
    <KeyboardAvoidingView style={[styles.content]} behavior="padding">
      <View style={[styles.content, { width: "80%" }]}>
        <Image
          source={require("@/assets/images/verify.svg")}
          style={styles.icon_lg}
        />
        <Text style={styles.title}>
          {t("verify_title") || "Verifique seu email"}
        </Text>
        <Text style={[styles.paragraph, styles.subtitle]}>
          {t("verify_description") ||
            "Insira o código de verificação que enviamos para o seu email."}
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
            {t("verify_no_code") || "Não recebeu o código?"}
          </Text>

          <LinkText
            text={t("verify_resend") || "Reenviar código"}
            onPress={handleResendCode}
          />
        </View>

        <Button
          title={
            loading
              ? t("verify_loading") || "Verificando..."
              : t("verify_button") || "Verificar"
          }
          onPress={handleVerify}
          type="fill"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
