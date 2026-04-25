import { Button, Header, TextBox } from "@/components/components";
import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
import { createdStyles } from "@/styles/theme";
import { request } from "@/utils/request.utils";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";

export default function SendEmail() {
  const [email, setEmail] = useState("");
  const { setLoading } = useLoading();

  const { colors } = useTheme();
  const styles = createdStyles(colors);

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
                urlComplement: "/Auth/GenerateCode",
                body: email,
                setLoading: setLoading,
              });

              router.push({
                pathname: "/verify",
                params: { userEmail: email, mode: "reset" },
              });
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
