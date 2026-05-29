import { useApi } from "@/utils/request.utils";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, DeviceEventEmitter } from "react-native";
interface UseProfileActionsProps {
  userId?: string;
  initialIsFollowing: boolean;
  initialIsBlocked?: boolean;
  OwnProfile?: boolean;
  onUpdateProfile?: (
    updatedFields: Partial<{ isFollowing: boolean; isBlocked: boolean }>,
  ) => void;
}

export function useProfileActions({
  userId,
  initialIsFollowing = false,
  initialIsBlocked = false,
  OwnProfile = false,
  onUpdateProfile,
}: UseProfileActionsProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerType, setBannerType] = useState<
    "error" | "success" | "info" | "warning"
  >("info");

  const { request } = useApi();
  const bannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showAlert = useCallback(
    (message: string, type: "error" | "success") => {
      setBannerMessage(message);
      setBannerType(type);
      setBannerVisible(true);

      if (bannerTimeoutRef.current) {
        clearTimeout(bannerTimeoutRef.current);
      }

      bannerTimeoutRef.current = setTimeout(
        () => setBannerVisible(false),
        3000,
      );
    },
    [],
  );

  const handleFollowToggle = useCallback(async () => {
    if (!userId) return;

    const wasFollowing = isFollowing;

    setIsFollowing(!wasFollowing);
    if (onUpdateProfile) onUpdateProfile({ isFollowing: !wasFollowing });

    try {
      await request({
        urlComplement: `/api/users/${userId}/${wasFollowing ? "unfollow" : "follow"}`,
        method: wasFollowing ? "DELETE" : "POST",
        hasLoading: false,
      });
    } catch (ex) {
      setIsFollowing(wasFollowing);
      if (onUpdateProfile) onUpdateProfile({ isFollowing: wasFollowing });
      console.error("Erro ao atualizar seguidor:", ex);
      showAlert("Erro ao atualizar seguidor", "error");
    }
  }, [userId, isFollowing, onUpdateProfile, request, showAlert]);

  const handleBlock = useCallback(() => {
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
              await request({
                urlComplement: `/api/users/${userId}/${isBlocked ? "unblock" : "block"}`,
                method: isBlocked ? "DELETE" : "POST",
                hasLoading: true,
              });

              showAlert(
                `Usuário ${isBlocked ? "desbloqueado" : "bloqueado"} com sucesso`,
                "success",
              );

              if (isBlocked) {
                DeviceEventEmitter.emit("updateBlockedUsers", {
                  targetId: userId,
                  action: "unblock",
                });
              }

              const newBlockedState = !isBlocked;
              setIsBlocked(newBlockedState);

              if (onUpdateProfile) {
                onUpdateProfile({ isBlocked: newBlockedState });
              }

              setTimeout(() => router.back(), 1500);
            } catch (error) {
              showAlert(
                `Não foi possível ${isBlocked ? "desbloquear" : "bloquear"} o usuário.`,
                "error",
              );
            }
          },
        },
      ],
    );
  }, [userId, isBlocked, request, onUpdateProfile, showAlert]);

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
