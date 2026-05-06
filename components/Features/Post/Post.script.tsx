import { configs } from "@/utils/configs.utils";
import { useApi } from "@/utils/request.utils";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, DeviceEventEmitter } from "react-native";

interface UsePostProps {
  postId: string;
  text: string;
  Location?: string;
  postImageUrl?: string[];
}

export function usePost({
  postId,
  text,
  Location,
  postImageUrl,
}: UsePostProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { request } = useApi();

  const toggleOptions = () => setShowOptions((prev) => !prev);
  const closeOptions = () => setShowOptions(false);

  const handleEditPost = () => {
    closeOptions();
    router.push({
      pathname: "/NewPost",
      params: {
        isEditing: "true",
        postId: postId,
        text: text,
        location: Location || "",
        imageUrls: JSON.stringify(postImageUrl || []),
      },
    });
  };

  const handleDeletePost = () => {
    closeOptions();
    Alert.alert(
      "Excluir Publicação",
      "Deseja realmente apagar este post? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const response = await request({
              urlComplement: `/api/posts/${postId}`,
              method: "DELETE",
            });
            if (response.ok) {
              DeviceEventEmitter.emit("refresh_posts");
            }
          },
        },
      ],
    );
  };

  const handleDownloadMedia = async () => {
    if (!postImageUrl || postImageUrl.length === 0) {
      Alert.alert("Aviso", "Não há mídias para baixar neste post.");
      closeOptions();
      return;
    }

    setIsDownloading(true);

    try {
      let permission = await MediaLibrary.getPermissionsAsync();

      if (!permission.granted)
        permission = await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permissão negada",
          "Precisamos de acesso à galeria para salvar a imagem.",
        );

        closeOptions();
        return;
      }

      for (let i = 0; i < postImageUrl.length; i++) {
        const imageUrl = postImageUrl[i];

        let validUrl = imageUrl;

        if (
          !validUrl.startsWith("http://") &&
          !validUrl.startsWith("https://")
        ) {
          const cleanImage = validUrl.startsWith("/")
            ? validUrl.slice(1)
            : validUrl;

          validUrl = `${configs.ProductionURL}/api/pictures/${cleanImage}`;
        }

        const cleanUrl = validUrl.split("?")[0];

        const filename =
          cleanUrl.split("/").pop() || `post_media_${Date.now()}.jpg`;

        const fileUri = `${FileSystem.documentDirectory}${filename}`;

        const downloadedFile = await FileSystem.downloadAsync(
          validUrl,
          fileUri,
        );

        if (downloadedFile.status !== 200) {
          throw new Error(`Erro HTTP ${downloadedFile.status}`);
        }

        await MediaLibrary.saveToLibraryAsync(downloadedFile.uri);
      }

      Alert.alert("Sucesso", "Mídia(s) salva(s) na sua galeria!");

      closeOptions();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível concluir o download da mídia.");
      closeOptions();
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    showOptions,
    isDownloading,
    toggleOptions,
    closeOptions,
    handleEditPost,
    handleDeletePost,
    handleDownloadMedia,
  };
}
