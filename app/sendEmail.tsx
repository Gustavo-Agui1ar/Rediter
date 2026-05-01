import { Button, Header, TextBox } from "@/components/components";
import { useLoading } from "@/context/loadingContext";
import { useGlobalStyles } from "@/styles/global.styles";
import { useApi } from "@/utils/request.utils";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";

export default function SendEmail() {
  const [email, setEmail] = useState("");
  const { setLoading } = useLoading();
  const { request } = useApi();
  const styles = useGlobalStyles();

  return (
    <KeyboardAvoidingView style={styles.content} behavior={"height"}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll_content}
        keyboardShouldPersistTaps="handled"
      >
        <Header title="Recuperar senha" />
        <View style={[styles.content, { width: "80%" }]}>
          <TextBox
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
          />
          <Button
            title="Enviar email de recuperação"
            onPress={async () => {
              await request({
                method: "POST",
                urlComplement: "/api/auth/generate-code",
                body: email,
                requireAuth: false,
              });

              router.push({
                pathname: "/Verify",
                params: { userEmail: email, mode: "reset" },
              });
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
