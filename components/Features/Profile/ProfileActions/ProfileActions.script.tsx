import { useApi } from "@/utils/request.utils";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

interface UseProfileActionsProps {
  userId?: string;
  initialIsFollowing: boolean;
  OwnProfile?: boolean;
}

export function useProfileActions({
  userId,
  initialIsFollowing = false,
  OwnProfile = false,
}: UseProfileActionsProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoadingBlock, setIsLoadingBlock] = useState(false);
  const { request } = useApi();

  const handleFollowToggle = useCallback(() => {
    if (!userId) return;

    setIsFollowing((prev) => !prev);
    console.log(
      `${isFollowing ? "Desseguir" : "Seguir"} usuário com ID:`,
      userId,
    );
    request({
      urlComplement: `/api/users/${userId}/${isFollowing ? "unfollow" : "follow"}`,
      method: isFollowing ? "DELETE" : "POST",
      hasLoading: false,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Falha silenciosa");
        }
      })
      .catch((error) => {
        setIsFollowing((prev) => !prev);
      });
  }, [userId, isFollowing]);

  const handleMessage = useCallback(() => {
    if (!userId) return;
    console.log("Ir para chat com usuário:", userId);
    // router.push(`/chat/${userId}`);
  }, [userId]);

  // Ação de Bloquear Usuário
  const handleBlock = useCallback(async () => {
    if (!userId || isLoadingBlock) return;

    Alert.alert(
      "Bloquear Usuário",
      "Tem certeza que deseja bloquear este usuário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Bloquear",
          style: "destructive",
          onPress: async () => {
            setIsLoadingBlock(true);
            try {
              const response = await request({
                urlComplement: `/api/users/${userId}/block`,
                method: "POST",
              });

              if (!response?.ok) throw new Error("Erro na API");

              Alert.alert("Sucesso", "Usuário bloqueado.");
              router.back();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível bloquear o usuário.");
            } finally {
              setIsLoadingBlock(false);
            }
          },
        },
      ],
    );
  }, [userId, isLoadingBlock]);

  const handleGoToConfig = useCallback(() => {
    if (OwnProfile) {
      router.push("/Configs");
    }
  }, [OwnProfile]);

  return {
    isFollowing,
    isLoadingBlock,
    handleFollowToggle,
    handleMessage,
    handleBlock,
    handleGoToConfig,
  };
}
