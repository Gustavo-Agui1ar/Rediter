import { ButtonType } from "@/components/UI/Button/button";
import { useApi } from "@/utils/request.utils";
import { useEffect, useRef, useState } from "react";

export function useFollow(userId: number, initialIsFollowing = false) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const initialValueRef = useRef(initialIsFollowing);
  const latestValueRef = useRef(initialIsFollowing);
  const { request } = useApi();

  useEffect(() => {
    latestValueRef.current = isFollowing;
  }, [isFollowing]);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  useEffect(() => {
    if (isFollowing === initialValueRef.current) return;

    const handler = setTimeout(() => {
      syncFollowState(isFollowing);
    }, 2000);

    return () => {
      clearTimeout(handler);

      if (latestValueRef.current !== initialValueRef.current) {
        syncFollowState(latestValueRef.current);
      }
    };
  }, [isFollowing]);

  const syncFollowState = async (following: boolean) => {
    try {
      console.log(
        `[API] Sincronizando: Usuário ${userId} -> Seguindo: ${following}`,
      );

      const url = following
        ? `/api/users/${userId}/follow`
        : `/api/users/${userId}/unfollow`;
      const method = following ? "POST" : "DELETE";

      request({ urlComplement: url, method, hasLoading: false });

      initialValueRef.current = following;
    } catch (error) {
      console.error("Erro ao sincronizar follow:", error);
    }
  };

  return {
    isFollowing,
    handleFollowToggle,
    buttonTitle: isFollowing ? "Seguindo" : "Seguir",
    buttonType: (isFollowing ? "border" : "fill") as ButtonType,
  };
}
