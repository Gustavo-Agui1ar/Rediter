import { ButtonType } from "@/components/UI/Button/button";
import { useApi } from "@/utils/request.utils";
import { useState } from "react";

export function useFollow(
  userId: number,
  initialIsFollowing = false,
  onSuccessRemove?: (userId: string) => void,
) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const { request } = useApi();

  const handleFollowToggle = async () => {
    if (!userId) return;

    const wasFollowing = isFollowing;
    const targetState = !wasFollowing;

    setIsFollowing(targetState);

    try {
      await request({
        urlComplement: `/api/users/${userId}/${targetState ? "follow" : "unfollow"}`,
        method: targetState ? "POST" : "DELETE",
        hasLoading: false,
      });
    } catch (error) {
      setIsFollowing(wasFollowing);
      console.error("Erro ao sincronizar follow:", error);
    }
  };

  const handleUnlockUser = async () => {
    if (!userId) return;

    try {
      await request({
        urlComplement: `/api/users/${userId}/unlock`,
        method: "DELETE",
        hasLoading: true,
      });
      onSuccessRemove?.(userId.toString());
    } catch (error) {
      console.error("Erro ao desbloquear usuário:", error);
    }
  };

  return {
    isFollowing,
    handleFollowToggle,
    handleUnlockUser,
    buttonTitle: isFollowing ? "Seguindo" : "Seguir",
    buttonType: (isFollowing ? "border" : "fill") as ButtonType,
  };
}
