import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useState } from "react";
import { InteractionManager } from "react-native";

const profileCache: Record<string, any> = {};

export function useUserProfile(userId: string, initialData?: any) {
  const { request } = useApi();

  const [profile, setProfile] = useState<any>(
    () => profileCache[userId] || initialData || null,
  );
  const [loading, setLoading] = useState(
    () => !profileCache[userId] && !initialData,
  );

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    InteractionManager.runAfterInteractions(async () => {
      try {
        if (!profileCache[userId] && !initialData) {
          setLoading(true);
        }

        const response = await request({
          urlComplement: `/api/users/${userId}`,
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          profileCache[userId] = data;
          setProfile(data);
        }
      } catch (error) {
        console.error("Erro ao carregar o perfil do usuário:", error);
      } finally {
        setLoading(false);
      }
    });
  }, [userId, request, initialData]);

  const updateLocalProfile = useCallback(
    (newData: Partial<any>) => {
      setProfile((prevProfile: any) => {
        const updatedProfile = { ...prevProfile, ...newData };
        profileCache[userId] = updatedProfile;
        return updatedProfile;
      });
    },
    [userId],
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    state: { profile, loading },
    actions: { fetchProfile, updateLocalProfile },
  };
}
