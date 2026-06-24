import { Header, TextBox } from "@/components/components";
import SearchUsers from "@/components/Features/SearchUser/SearchUser";
import { useLanguage } from "@/context/LanguageContext";
import { useGlobalStyles } from "@/styles/global.styles";
import { useApi } from "@/utils/request.utils";
import { useCallback, useState } from "react";
import { Alert, View } from "react-native";

export default function AdminUsersScreen() {
  const styles = useGlobalStyles();
  const { request } = useApi();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDeleteUser = useCallback(
    async (userId: string) => {
      try {
        await request({
          urlComplement: `/api/users/${userId}`,
          method: "DELETE",
        });

        Alert.alert("Sucesso", t("user_deleted"));

        setRefreshKey((prev) => prev + 1);
      } catch (error: any) {
        Alert.alert(
          "Erro",
          error?.response?.data?.message ||
            error?.message ||
            t("failed_to_delete_user"),
        );
      }
    },
    [request],
  );

  return (
    <View style={styles.container}>
      <Header title={t("manage_users")} arrowBack={true} />

      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <TextBox
          placeholder={t("search_users")}
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
        />
      </View>

      <View style={{ flex: 1 }} key={refreshKey}>
        <SearchUsers searchTerm={searchTerm} onDeleteUser={handleDeleteUser} />
      </View>
    </View>
  );
}
