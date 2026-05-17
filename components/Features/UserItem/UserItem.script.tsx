import { ButtonType } from "@/components/UI/Button/button";
import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useRef, useState } from "react";

export function useFollow(
  userId: number,
  initialIsFollowing = false,
  onSuccessRemove?: (userId: string) => void,
) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const syncedStateRef = useRef(initialIsFollowing);
  const latestValueRef = useRef(initialIsFollowing);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { request } = useApi();

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
  };

  const handleUnlockUser = () => {
    request({
      urlComplement: `/api/users/${userId}/unlock`,
      method: "DELETE",
    })
      .then(() => {
        onSuccessRemove?.(userId.toString());
      })
      .catch((error) => {
        console.error("Erro ao desbloquear usuário:", error);
      });
  };

  const executeSync = useCallback(
    (targetState: boolean) => {
      if (!userId) return;

      request({
        urlComplement: `/api/users/${userId}/${targetState ? "follow" : "unfollow"}`,
        method: targetState ? "POST" : "DELETE",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Falha silenciosa");

          syncedStateRef.current = targetState;
        })
        .catch(() => {
          setIsFollowing(syncedStateRef.current);
        });
    },
    [userId, request],
  );

  useEffect(() => {
    latestValueRef.current = isFollowing;
  }, [isFollowing]);

  useEffect(() => {
    if (isFollowing === syncedStateRef.current) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      executeSync(isFollowing);
    }, 2000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isFollowing, executeSync]);

  useEffect(() => {
    return () => {
      if (latestValueRef.current !== syncedStateRef.current) {
        executeSync(latestValueRef.current);
      }
    };
  }, [executeSync]);

  return {
    isFollowing,
    handleFollowToggle,
    handleUnlockUser,
    buttonTitle: isFollowing ? "Seguindo" : "Seguir",
    buttonType: (isFollowing ? "border" : "fill") as ButtonType,
  };
}
