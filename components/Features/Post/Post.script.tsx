import { useRediterBaseConfigs } from "@/context/RediterConfigContext";
import { useApi } from "@/utils/request.utils";
import { File, Paths } from "expo-file-system";
import {
  Asset,
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-media-library";
import { router } from "expo-router";
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
  const toggleOptions = useCallback(() => setShowOptions((prev) => !prev), []);
  const closeOptions = useCallback(() => setShowOptions(false), []);
  const { baseUrl } = useRediterBaseConfigs();

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

    let permission = await getPermissionsAsync();
    if (!permission.granted) {
      permission = await requestPermissionsAsync();
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
          validUrl = `${baseUrl}/api/pictures/${cleanImage}`;
        }

        const cleanUrl = validUrl.split("?")[0];
        const filename =
          cleanUrl.split("/").pop() || `post_media_${Date.now()}.jpg`;

        if (!Paths || !Paths.document) {
          throw new Error(
            "Sistema de arquivos nativo não disponível nesta plataforma.",
          );
        }

        const file = new File(Paths.document, filename);
        await File.downloadFileAsync(validUrl, file);

        await Asset.create(file.uri);

        Alert.alert("Sucesso", "Mídia(s) salva(s) na sua galeria!");
      }
    } catch (error: any) {
      Alert.alert(
        "Erro",
        `Não foi possível concluir o download da mídia.\n\nDetalhes: ${error.message}`,
      );
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
    router.push({
      pathname: "/profile/[id]",
      params: {
        id: userId,
        isOwnProfile: String(isOwnProfile),
      },
    });
  }, [userId, isOwnProfile]);

  const handleClickPost = useCallback(() => {
    router.push({
      pathname: "/posts/[id]",
      params: {
        id: postId,
      },
    });
  }, [postId]);

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
