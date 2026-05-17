import { useApi } from "@/utils/request.utils";
import {
  getProfileBasic,
  isCacheValid,
  saveProfileBasic,
} from "@/utils/storage.utils";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { InteractionManager } from "react-native";

// 1. Tipagem Forte para garantir a estrutura dos dados
export interface UserProfile {
  imageUrl: string;
  coverUrl: string;
  userName: string;
  email: string;
  description: string;
  isFollowing: boolean;
  isBlocked: boolean;
  userId: string;
  following: number;
  followers: number;
}

const INITIAL_PROFILE: UserProfile = {
  imageUrl: "",
  coverUrl: "",
  userName: "UserName",
  email: "",
  description: "",
  isFollowing: false,
  isBlocked: false,
  userId: "",
  following: 0,
  followers: 0,
};

const isShallowEqual = (
  obj1: Record<string, any>,
  obj2: Record<string, any>,
) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
};

export function usePerfil() {
  const { request } = useApi();
  const [form, setForm] = useState<UserProfile>(INITIAL_PROFILE);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  const applyProfile = useCallback((data: Partial<UserProfile>) => {
    setForm((prevForm) => {
      const newForm = { ...INITIAL_PROFILE, ...prevForm, ...data };

      if (isShallowEqual(prevForm, newForm)) {
        return prevForm;
      }
      return newForm;
    });
  }, []);

  const fetchProfile = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      const response = await request({
        urlComplement: `/api/users/me`,
        method: "GET",
      });

      if (response.ok) {
        const json = await response.json();

        const data: UserProfile = {
          imageUrl: json.imageName || "",
          coverUrl: json.imageCover || "",
          userName: json.name || "",
          email: json.email || "",
          description: json.description || "",
          isFollowing: json.isFollowing || false,
          isBlocked: json.isBlocked || false,
          userId: json.userId || json.id || "",
          following: json.following || 0,
          followers: json.followers || 0,
        };

        applyProfile(data);

        saveProfileBasic(data).catch((err) =>
          console.error("Erro ao salvar cache do perfil:", err),
        );
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    } finally {
      fetchingRef.current = false;
    }
  }, [applyProfile, request]);

  const hydrateProfile = useCallback(async () => {
    try {
      const cached = await getProfileBasic();

      if (cached) {
        applyProfile(cached);
        setLoading(false);

        if (!isCacheValid(cached)) {
          InteractionManager.runAfterInteractions(() => {
            fetchProfile();
          });
        }
        return;
      }

      InteractionManager.runAfterInteractions(async () => {
        await fetchProfile();
        setLoading(false);
      });
    } catch (error) {
      console.error("Erro ao hidratar perfil do cache:", error);
      fetchProfile().finally(() => setLoading(false));
    }
  }, [applyProfile, fetchProfile]);

  useFocusEffect(
    useCallback(() => {
      hydrateProfile();
    }, [hydrateProfile]),
  );

  return {
    state: { form, loading },
    actions: { fetchProfile },
  };
}
