import { Header, TextBox } from "@/components/components";
import SearchPosts from "@/components/Features/SearchPosts/SearchPosts"; // Caminho do componente
import { useLanguage } from "@/context/LanguageContext";
import { useGlobalStyles } from "@/styles/global.styles";
import { useApi } from "@/utils/request.utils";
import { useCallback, useState } from "react";
import { Alert, View } from "react-native";

export default function AdminPostsScreen() {
  const styles = useGlobalStyles();
  const { request } = useApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useLanguage();

  const handleDeletePost = useCallback(
    async (postId: string) => {
      try {
        await request({
          urlComplement: `/api/posts/${postId}`,
          method: "DELETE",
        });

        Alert.alert("Sucesso", t("post_deleted"));
        setRefreshKey((prev) => prev + 1);
      } catch (error: any) {
        Alert.alert(
          "Erro",
          error?.response?.data?.message || t("failed_to_delete_post"),
        );
      }
    },
    [request],
  );

  return (
    <View style={styles.container}>
      <Header title={t("manage_posts")} arrowBack={true} />

      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <TextBox
          placeholder={t("search_posts")}
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
