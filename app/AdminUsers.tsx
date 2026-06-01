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

        Alert.alert("Sucesso", "Usuário deletado e removido do sistema.");

        setRefreshKey((prev) => prev + 1);
      } catch (error: any) {
        Alert.alert(
          "Erro",
          error?.response?.data?.message ||
            error?.message ||
            "Não foi possível deletar o usuário.",
        );
      }
    },
    [request],
  );

  return (
    <View style={styles.container}>
      <Header title="Gerenciar Usuários" arrowBack={true} />

      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <TextBox
          placeholder="Buscar usuário pelo nome..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
        />
      </View>

      <View style={{ flex: 1 }} key={refreshKey}>
        <SearchUsers
          searchTerm={searchTerm}
          isAdminMode={true}
          onDeleteUser={handleDeleteUser}
        />
      </View>
    </View>
  );
}
