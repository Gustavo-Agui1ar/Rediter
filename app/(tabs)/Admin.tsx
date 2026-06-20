import { Button, Divider, Header } from "@/components/components";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useGlobalStyles } from "@/styles/global.styles";
import { Redirect, useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function AdminScreen() {
  const { isAdmin } = useAuth();
  const styles = useGlobalStyles();
  const router = useRouter();
  const { t } = useLanguage();

  if (!isAdmin) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={styles.container}>
      <Header title={t("admin_warning_title")} />

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16, color: "#666", marginTop: 4 }}>
            {t("admin_warning")}
          </Text>
        </View>

        <Button
          title={t("admin_manage_posts")}
          type="fill"
          onPress={() => {
            router.push("/AdminPosts");
            console.log("Abrir tela de gerenciamento de posts");
          }}
        />

        <Button
          title={t("admin_manage_users")}
          type="border"
          onPress={() => {
            router.push("/AdminUsers");
            console.log("Abrir tela de listagem e banimento de usuários");
          }}
        />

        <Divider text={t("admin_advanced_settings")} />
      </ScrollView>
    </View>
  );
}
