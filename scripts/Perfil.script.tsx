import { useApi } from "@/utils/request.utils";
import {
  getProfileBasic,
  isCacheValid,
  saveProfileBasic,
} from "@/utils/storage.utils";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function usePerfil() {
  const { request } = useApi();
  const [form, setForm] = useState({
    imageUrl: "",
    coverUrl: "",
    userName: "UserName",
    email: "",
    description: "",
  });

  const applyProfile = useCallback((data: any) => {
    setForm((prevForm) => {
      const newForm = {
        imageUrl: data.imageUrl || "",
        coverUrl: data.coverUrl || "",
        userName: data.userName || "",
        email: data.email || "",
        description: data.description || "",
      };

      if (JSON.stringify(prevForm) === JSON.stringify(newForm)) {
        return prevForm;
      }

      return newForm;
    });
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await request({
        urlComplement: `/api/users/me`,
        method: "GET",
      });

      if (response.ok) {
        const json = await response.json();

        const data = {
          imageUrl: json.imageName,
          coverUrl: json.imageCover,
          userName: json.name,
          email: json.email,
          description: json.description,
        };

        applyProfile(data);
        await saveProfileBasic(data);
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  }, [applyProfile]);

  const hydrateProfile = useCallback(async () => {
    try {
      const cached = await getProfileBasic();
      if (cached) {
        applyProfile(cached);

        if (!isCacheValid(cached)) {
          fetchProfile();
        }
        return;
      }

      fetchProfile();
    } catch (error) {
      console.error("Erro ao hidratar perfil do cache:", error);
      fetchProfile();
    }
  }, [applyProfile, fetchProfile]);

  useFocusEffect(
    useCallback(() => {
      hydrateProfile();
    }, [hydrateProfile]),
  );

  return {
    state: { form },
    actions: { fetchProfile },
  };
}
