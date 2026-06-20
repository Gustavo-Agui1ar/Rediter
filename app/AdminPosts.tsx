import { Header, TextBox } from "@/components/components";
import SearchPosts from "@/components/Features/SearchPosts/SearchPosts"; // Caminho do componente
import { useGlobalStyles } from "@/styles/global.styles";
import { useApi } from "@/utils/request.utils";
import { useCallback, useState } from "react";
import { Alert, View } from "react-native";

export default function AdminPostsScreen() {
  const styles = useGlobalStyles();
  const { request } = useApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDeletePost = useCallback(
    async (postId: string) => {
      try {
        await request({
          urlComplement: `/api/posts/${postId}`,
          method: "DELETE",
        });

        Alert.alert("Sucesso", "Post deletado com sucesso.");
        setRefreshKey((prev) => prev + 1);
      } catch (error: any) {
        Alert.alert(
          "Erro",
          error?.response?.data?.message || "Não foi possível deletar o post.",
        );
      }
    },
    [request],
  );

  return (
    <View style={styles.container}>
      <Header title="Gerenciar Posts" arrowBack={true} />

      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <TextBox
          placeholder="Buscar posts por conteúdo..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
        />
      </View>

      <View style={{ flex: 1 }} key={refreshKey}>
        <SearchPosts searchTerm={searchTerm} onDeletePost={handleDeletePost} />
      </View>
    </View>
  );
}
