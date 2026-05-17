import { useApi } from "@/utils/request.utils";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, DeviceEventEmitter } from "react-native";
interface UseProfileActionsProps {
  userId?: string;
  initialIsFollowing: boolean;
  initialIsBlocked?: boolean;
  OwnProfile?: boolean;
}

export function useProfileActions({
  userId,
  initialIsFollowing = false,
  initialIsBlocked = false,
  OwnProfile = false,
}: UseProfileActionsProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerType, setBannerType] = useState<
    "error" | "success" | "info" | "warning"
  >("info");

  const { request } = useApi();

  const showAlert = (message: string, type: "error" | "success") => {
    setBannerMessage(message);
    setBannerType(type);
    setBannerVisible(true);
    setTimeout(() => setBannerVisible(false), 3000);
  };

  const handleFollowToggle = useCallback(() => {
    if (!userId) return;
    setIsFollowing((prev) => !prev);

    request({
      urlComplement: `/api/users/${userId}/${isFollowing ? "unfollow" : "follow"}`,
      method: isFollowing ? "DELETE" : "POST",
      hasLoading: false,
    }).catch((ex) => {
      setIsFollowing((prev) => !prev);
      console.error(ex);
      showAlert("Erro ao atualizar seguidor", "error");
    });
  }, [userId, isFollowing]);

  const handleBlock = useCallback(async () => {
    if (!userId) return;

    Alert.alert(
      isBlocked ? "Desbloquear Usuário" : "Bloquear Usuário",
      `Tem certeza que deseja ${isBlocked ? "desbloquear" : "bloquear"} este usuário?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: isBlocked ? "Desbloquear" : "Bloquear",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await request({
                urlComplement: `/api/users/${userId}/${isBlocked ? "unblock" : "block"}`,
                method: isBlocked ? "DELETE" : "POST",
              });

              if (!response?.ok) throw new Error();

              showAlert(
                "Usuário " +
                  (isBlocked ? "desbloqueado" : "bloqueado") +
                  " com sucesso",
                "success",
              );
              if (isBlocked) {
                DeviceEventEmitter.emit("updateBlockedUsers", {
                  targetId: userId,
                  action: "unblock",
                });
              }

              setIsBlocked((prev) => !prev);
              setTimeout(() => router.back(), 1500);
            } catch (error) {
              showAlert(
                "Não foi possível " +
                  (isBlocked ? "desbloquear" : "bloquear") +
                  " o usuário.",
                "error",
              );
            }
          },
        },
      ],
    );
  }, [userId, isBlocked, request]);

  return {
    isFollowing,
    isBlocked,
    handleFollowToggle,
    handleBlock,
    handleGoToConfig: () => OwnProfile && router.push("/Configs"),
    bannerProps: {
      visible: bannerVisible,
      message: bannerMessage,
      alert_type: bannerType,
    },
  };
}
