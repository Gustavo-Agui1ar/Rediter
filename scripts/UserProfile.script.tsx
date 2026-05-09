import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useState } from "react";

export function useUserProfile(userId: string) {
  const { request } = useApi();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await request({
        urlComplement: `/api/users/${userId}`,
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Erro ao carregar o perfil do usuário:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, request]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { state: { profile, loading }, actions: { fetchProfile } };
}
