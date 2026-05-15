import { configs } from "@/utils/configs.utils";
import { useApi } from "@/utils/request.utils";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { router, useNavigation } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, DeviceEventEmitter } from "react-native";

interface UsePostProps {
  postId: string;
  text: string;
  Location?: string;
  postImageUrl?: string[];
  countLikes?: number;
  liked?: boolean;
  userId: string;
  isOwnProfile: boolean;
}

export function usePost({
  postId,
  text,
  Location,
  postImageUrl,
  countLikes = 0,
  liked = false,
  userId,
  isOwnProfile,
}: UsePostProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const [likesCount, setLikesCount] = useState(countLikes);
  const { request } = useApi();
  const navigation = useNavigation();
  const toggleOptions = useCallback(() => setShowOptions((prev) => !prev), []);
  const closeOptions = useCallback(() => setShowOptions(false), []);

  const handleEditPost = useCallback(() => {
    closeOptions();
    router.push({
      pathname: "/NewPost",
      params: {
        isEditing: "true",
        postId,
        text,
        location: Location || "",
        imageUrls: JSON.stringify(postImageUrl || []),
      },
    });
  }, [postId, text, Location, postImageUrl, closeOptions]);

  const handleDeletePost = useCallback(() => {
    closeOptions();
    Alert.alert(
      "Excluir Publicação",
      "Deseja realmente apagar este post? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const response = await request({
              urlComplement: `/api/posts/${postId}`,
              method: "DELETE",
            });
            if (response?.ok) {
              DeviceEventEmitter.emit("refresh_posts");
            }
          },
        },
      ],
    );
  }, [postId, request, closeOptions]);

  const handleDownloadMedia = useCallback(async () => {
    if (!postImageUrl || postImageUrl.length === 0) {
      Alert.alert("Aviso", "Não há mídias para baixar neste post.");
      closeOptions();
      return;
    }

    let permission = await MediaLibrary.getPermissionsAsync();
    if (!permission.granted) {
      permission = await MediaLibrary.requestPermissionsAsync();
    }

    if (!permission.granted) {
      Alert.alert(
        "Permissão negada",
        "Precisamos de acesso à galeria para salvar a imagem.",
      );
      closeOptions();
      return;
    }

    setIsDownloading(true);

    try {
      for (const imageUrl of postImageUrl) {
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
    } catch (error) {
      Alert.alert("Erro", "Não foi possível concluir o download da mídia.");
    } finally {
      setIsDownloading(false);
      closeOptions();
    }
  }, [postImageUrl, closeOptions]);

  const handleLikePost = useCallback(() => {
    const wasLiked = isLiked;

    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    request({
      urlComplement: `/api/posts/${postId}/like`,
      method: wasLiked ? "DELETE" : "POST",
      hasLoading: false,
    })
      .then((response) => {
        if (response && !response.ok) {
          throw new Error("Erro na API");
        }
      })
      .catch((error) => {
        console.error("Erro ao curtir:", error);
        setIsLiked(wasLiked);
        setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      });
  }, [isLiked, postId, request]);

  const handleGoToProfile = useCallback(() => {
    (navigation as any).push("profile/[id]", {
      id: userId,
      isOwnProfile: isOwnProfile,
    });
  }, [userId, isOwnProfile, navigation]);

  const handleClickPost = useCallback(() => {
    (navigation as any).push("posts/[id]", {
      id: postId,
    });
  }, [postId, navigation]);

  return useMemo(
    () => ({
      showOptions,
      isDownloading,
      isLiked,
      likesCount,
      toggleOptions,
      closeOptions,
      handleEditPost,
      handleDeletePost,
      handleDownloadMedia,
      handleLikePost,
      handleGoToProfile,
      handleClickPost,
      setShowOptions,
    }),
    [
      showOptions,
      isDownloading,
      isLiked,
      likesCount,
      toggleOptions,
      closeOptions,
      handleEditPost,
      handleDeletePost,
      handleDownloadMedia,
      handleLikePost,
      handleGoToProfile,
      handleClickPost,
      setShowOptions,
    ],
  );
}
