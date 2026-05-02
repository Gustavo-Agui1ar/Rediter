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
    console.log("[DownloadMedia] Iniciando função handleDownloadMedia.");
    console.log("[DownloadMedia] postImageUrl recebido:", postImageUrl);

    if (!postImageUrl || postImageUrl.length === 0) {
      console.log("[DownloadMedia] Lista de URLs vazia ou nula. Cancelando.");
      Alert.alert("Aviso", "Não há mídias para baixar neste post.");
      closeOptions();
      return;
    }

    setIsDownloading(true);

    try {
      console.log(
        "[DownloadMedia] Solicitando permissão para acessar a galeria...",
      );
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log("[DownloadMedia] Status da permissão:", status);

      if (status !== "granted") {
        console.log("[DownloadMedia] Permissão negada pelo usuário.");
        Alert.alert(
          "Permissão negada",
          "Precisamos de acesso à galeria para salvar a imagem.",
        );
        setIsDownloading(false);
        closeOptions();
        return;
      }

      for (let i = 0; i < postImageUrl.length; i++) {
        const imageUrl = postImageUrl[i];
        console.log(
          `\n[DownloadMedia] --- Processando imagem ${i + 1} de ${postImageUrl.length} ---`,
        );
        console.log("[DownloadMedia] URL original:", imageUrl);

        let validUrl = imageUrl;
        if (
          !validUrl.startsWith("http://") &&
          !validUrl.startsWith("https://")
        ) {
          validUrl = validUrl.startsWith("/")
            ? `${configs.ProductionURL}${validUrl}`
            : `${configs.ProductionURL}/${validUrl}`;
        }

        console.log("[DownloadMedia] URL validada (absoluta):", validUrl);

        const cleanUrl = validUrl.split("?")[0];
        const filename =
          cleanUrl.split("/").pop() || `post_media_${Date.now()}.jpg`;
        const fileUri = `${FileSystem.documentDirectory}${filename}`;

        console.log("[DownloadMedia] Nome do arquivo extraído:", filename);
        console.log("[DownloadMedia] Caminho de destino (fileUri):", fileUri);

        console.log("[DownloadMedia] Iniciando FileSystem.downloadAsync...");
        const downloadedFile = await FileSystem.downloadAsync(
          validUrl,
          fileUri,
        );

        console.log(
          "[DownloadMedia] Download concluído! Arquivo salvo em:",
          downloadedFile.uri,
        );
        console.log(
          "[DownloadMedia] Status do download (HTTP):",
          downloadedFile.status,
        );

        console.log(
          "[DownloadMedia] Salvando na galeria (MediaLibrary.saveToLibraryAsync)...",
        );
        await MediaLibrary.saveToLibraryAsync(downloadedFile.uri);
        console.log("[DownloadMedia] Imagem salva na galeria com sucesso!");
      }

      console.log(
        "[DownloadMedia] Processo de download finalizado com sucesso para todas as imagens.",
      );
      Alert.alert("Sucesso", "Mídia(s) salva(s) na sua galeria!");
      closeOptions();
    } catch (error) {
      console.error("[DownloadMedia] ERRO CAPTURADO NO CATCH:", error);
      Alert.alert("Erro", "Não foi possível concluir o download da mídia.");
      closeOptions();
    } finally {
      console.log(
        "[DownloadMedia] Bloco finally executado. Resetando estados.",
      );
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
