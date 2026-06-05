import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useLoading } from "@/context/LoadingContext";
import { useSignalR } from "@/context/NotificationsContext";
import { pickImage } from "@/utils/filePicker.utils";
import { LoginValidator } from "@/utils/login.utils";
import { useApi } from "@/utils/request.utils";
import * as Storage from "@/utils/storage.utils";
import { router } from "expo-router";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";

interface ImageState {
  local?: any;
  remote?: string;
  changed?: boolean;
}

export interface ProfileFormData {
  name: string;
  email: string;
  password?: string;
  description: string;
}

const MAX_DESCRIPTION_LENGTH = 150;

export function useConfigs() {
  const { language, setLanguage } = useLanguage();
  const { loading } = useLoading();
  const { request } = useApi();
  const { disconnectSignalR } = useSignalR();
  const { logout: contextLogout } = useAuth();

  const [initialData, setInitialData] = useState<ProfileFormData>({
    name: "",
    email: "",
    password: "",
    description: "",
  });

  const [profileImage, setProfileImage] = useState<ImageState>({});
  const [coverImage, setCoverImage] = useState<ImageState>({});
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lan, setLan] = useState<string>(language);

  const clearAlerts = useCallback(() => {
    startTransition(() => {
      setError(null);
      setSuccessMsg(null);
    });
  }, []);

  const goToBlockedUsers = useCallback(() => {
    router.push("/BlockedUsers");
  }, []);

  const applyProfileData = useCallback((data: any) => {
    startTransition(() => {
      setInitialData({
        name: data.userName || "",
        email: data.email || "",
        password: "",
        description: data.description || "",
      });
      setProfileImage({ remote: data.imageUrl });
      setCoverImage({ remote: data.coverUrl });
    });
  }, []);

  const loadProfileData = useCallback(async () => {
    try {
      const cached = await Storage.getProfileBasic();
      if (cached) {
        applyProfileData(cached);
        return;
      }

      const data = await request({
        urlComplement: "/api/users/me",
        method: "GET",
      });

      const profileData = {
        userName: data.name,
        email: data.email,
        imageUrl: data.imageName,
        coverUrl: data.imageCover,
        description: data.description,
      };

      applyProfileData(profileData);
      await Storage.saveProfileBasic(profileData);
    } catch (error) {
      startTransition(() =>
        setError("Erro ao carregar informações do perfil."),
      );
    }
  }, [applyProfileData, request]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const pickAndSetImage = useCallback(
    async (
      setImage: React.Dispatch<React.SetStateAction<ImageState>>,
      crop: boolean,
    ) => {
      try {
        const img = await pickImage(crop);
        if (!img) return;

        startTransition(() => {
          setImage({ local: img, changed: true });
        });
        clearAlerts();
      } catch (error) {
        startTransition(() => setError("Erro ao selecionar imagem."));
      }
    },
    [clearAlerts],
  );

  const handlePickCover = useCallback(
    () => pickAndSetImage(setCoverImage, false),
    [pickAndSetImage],
  );

  const handlePickProfileImage = useCallback(
    () => pickAndSetImage(setProfileImage, true),
    [pickAndSetImage],
  );

  const createFileData = useCallback((imageAsset: any) => {
    if (!imageAsset?.uri) return null;
    const uriParts = imageAsset.uri.split("/");
    return {
      uri: imageAsset.uri,
      name:
        imageAsset.fileName ||
        uriParts[uriParts.length - 1] ||
        `image-${Date.now()}.jpg`,
      type: imageAsset.mimeType || "image/jpeg",
    } as any;
  }, []);

  const clearSessionAndRedirect = useCallback(async () => {
    await Storage.deleteInfoUser();
    await contextLogout();
    router.replace("/");
  }, [contextLogout]);

  const logOut = useCallback(async () => {
    disconnectSignalR();
    await clearSessionAndRedirect();
  }, [disconnectSignalR, clearSessionAndRedirect]);

  const confirmAndDeleteAccount = useCallback(() => {
    Alert.alert(
      "Deletar Conta",
      "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await request({
                urlComplement: "/api/users/me",
                method: "DELETE",
              });
              await clearSessionAndRedirect();
            } catch (err: any) {
              startTransition(() => {
                setError(
                  err?.response?.data?.message || "Erro ao deletar conta.",
                );
              });
            }
          },
        },
      ],
    );
  }, [request, clearSessionAndRedirect]);

  const validateForm = useCallback((form: ProfileFormData) => {
    const name = form.name?.trim() || "";
    const email = form.email?.trim().toLowerCase() || "";
    const password = form.password || "";
    const description = (form.description || "").replace(/\s+/g, " ").trim();

    if (!name) return "O campo Nome não pode estar vazio.";
    if (!email) return "O campo E-mail não pode estar vazio.";
    if (!LoginValidator.isEmailValid(email))
      return "O formato do e-mail é inválido.";
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return `A descrição deve ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres.`;
    }
    if (password && !LoginValidator.isPasswordValid(password))
      return "A nova senha é inválida.";

    return null;
  }, []);

  const buildFormData = useCallback(
    (form: ProfileFormData) => {
      const formData = new FormData();
      const name = form.name.trim();
      const email = form.email.trim().toLowerCase();
      const description = (form.description || "")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, MAX_DESCRIPTION_LENGTH);

      if (profileImage.changed && profileImage.local) {
        const fileData = createFileData(profileImage.local);
        if (fileData) formData.append("File", fileData);
      }
      if (coverImage.changed && coverImage.local) {
        const coverData = createFileData(coverImage.local);
        if (coverData) formData.append("Cover", coverData);
      }

      formData.append("Name", name);
      formData.append("Email", email);

      if (description.length > 0) {
        formData.append("Description", description);
      }

      if (form.password) formData.append("Password", form.password);

      return formData;
    },
    [profileImage, coverImage, createFileData],
  );

  const handleSave = useCallback(
    async (formDataFromScreen: ProfileFormData) => {
      clearAlerts();
      const validationError = validateForm(formDataFromScreen);
      if (validationError) {
        startTransition(() => setError(validationError));
        return false;
      }

      try {
        const formData = buildFormData(formDataFromScreen);

        await request({
          urlComplement: "/api/users/me",
          method: "PATCH",
          data: formData,
        });

        await Storage.saveProfileBasic({
          imageUrl: profileImage.local?.uri || profileImage.remote,
          coverUrl: coverImage.local?.uri || coverImage.remote,
          userName: formDataFromScreen.name.trim(),
          email: formDataFromScreen.email.trim().toLowerCase(),
          description: (formDataFromScreen.description || "")
            .replace(/\s+/g, " ")
            .trim(),
        });

        startTransition(() => {
          setLanguage(lan as any);
          setSuccessMsg("Informações atualizadas com sucesso!");
        });
        return true;
      } catch (err: any) {
        startTransition(() =>
          setError(err?.message || "Erro ao atualizar perfil."),
        );
        return false;
      }
    },
    [
      clearAlerts,
      validateForm,
      buildFormData,
      request,
      profileImage,
      coverImage,
      lan,
      setLanguage,
    ],
  );

  const state = useMemo(
    () => ({
      initialData,
      profileImage,
      coverImage,
      error,
      successMsg,
      loading,
      lan,
      maxDescriptionLength: MAX_DESCRIPTION_LENGTH,
    }),
    [initialData, profileImage, coverImage, error, successMsg, loading, lan],
  );

  const actions = useMemo(
    () => ({
      handlePickCover,
      handlePickProfileImage,
      handleSave,
      deleteAccount: confirmAndDeleteAccount,
      logOut,
      goToBlockedUsers,
      setLan,
    }),
    [
      handlePickCover,
      handlePickProfileImage,
      handleSave,
      confirmAndDeleteAccount,
      logOut,
      goToBlockedUsers,
    ],
  );

  return { state, actions };
}
