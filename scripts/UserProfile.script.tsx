import { useApi } from "@/utils/request.utils";
import { startTransition, useCallback, useEffect, useState } from "react";

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

    if (!profileCache[userId] && !initialData) {
      startTransition(() => setLoading(true));
    }

    try {
      const data = await request({
        urlComplement: `/api/users/${userId}`,
        method: "GET",
        hasLoading: false,
      });

      profileCache[userId] = data;

      startTransition(() => {
        setProfile(data);
      });
    } catch (error) {
      console.error("Erro ao carregar o perfil do usuário:", error);
    } finally {
      startTransition(() => {
        setLoading(false);
      });
    }
  }, [userId, request, initialData]);

  const updateLocalProfile = useCallback(
    (newData: Partial<any>) => {
      startTransition(() => {
        setProfile((prevProfile: any) => {
          const updatedProfile = { ...prevProfile, ...newData };
          profileCache[userId] = updatedProfile;
          return updatedProfile;
        });
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
