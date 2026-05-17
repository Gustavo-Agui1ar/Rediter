import { useLoading } from "@/context/loadingContext";
import { pickImage } from "@/utils/filePicker.utils";
import { LoginValidator } from "@/utils/login.utils";
import { useApi } from "@/utils/request.utils";
import * as Storage from "@/utils/storage.utils";
import { deleteInfoUser } from "@/utils/storage.utils";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
interface ImageState {
  local?: any;
  remote?: string;
  changed?: boolean;
}
interface FormState {
  name: string;
  email: string;
  password: string;
  description?: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  description: "",
};
const MAX_DESCRIPTION_LENGTH = 150;

export function useConfigs() {
  const { loading, setLoading } = useLoading();
  const { request } = useApi();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [profileImage, setProfileImage] = useState<ImageState>({});
  const [coverImage, setCoverImage] = useState<ImageState>({});
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const clearAlerts = useCallback(() => {
    setError(null);
    setSuccessMsg(null);
  }, []);

  const goToBlockedUsers = useCallback(() => {
    router.push("/BlockedUsers");
  }, []);

  const onChangeForm = useCallback(
    (field: keyof FormState, value: string) => {
      setForm((prev) => {
        if (field === "description" && value.length > MAX_DESCRIPTION_LENGTH) {
          return prev;
        }

        if (prev[field] === value) return prev;

        return {
          ...prev,
          [field]: value,
        };
      });

      clearAlerts();
    },
    [clearAlerts],
  );

  const applyProfileData = useCallback((data: any) => {
    setForm({
      name: data.userName || "",
      email: data.email || "",
      password: "",
      description: data.description || "",
    });

    setProfileImage({
      remote: data.imageUrl,
    });

    setCoverImage({
      remote: data.coverUrl,
    });
  }, []);

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);

      const cached = await Storage.getProfileBasic();
      if (cached) {
        applyProfileData(cached);
        return;
      }

      const response = await request({
        urlComplement: "/api/users/me",
        method: "GET",
      });

      const json = await response.json();

      const data = {
        userName: json.name,
        email: json.email,
        imageUrl: json.imageName,
        coverUrl: json.imageCover,
        description: json.description,
      };

      applyProfileData(data);

      await Storage.saveProfileBasic(data);
    } catch (error) {
      setError("Erro ao carregar informações do perfil.");
    } finally {
      setLoading(false);
    }
  }, [applyProfileData, request, setLoading]);

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

        setImage({
          local: img,
          changed: true,
        });

        clearAlerts();
      } catch (error) {
        setError("Erro ao selecionar imagem.");
      }
    },
    [clearAlerts],
  );

  const handlePickCover = useCallback(() => {
    return pickAndSetImage(setCoverImage, false);
  }, [pickAndSetImage]);

  const handlePickProfileImage = useCallback(() => {
    return pickAndSetImage(setProfileImage, true);
  }, [pickAndSetImage]);

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
    await deleteInfoUser();

    router.replace("/");
  }, []);

  const logOut = useCallback(async () => {
    await clearSessionAndRedirect();
  }, [clearSessionAndRedirect]);

  const deleteAccount = useCallback(async () => {
    try {
      setLoading(true);

      await request({
        urlComplement: "/api/users/me",
        method: "DELETE",
      });

      await clearSessionAndRedirect();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao deletar conta.");
    } finally {
      setLoading(false);
    }
  }, [request, clearSessionAndRedirect, setLoading]);

  const validateForm = useCallback(() => {
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
  }, [form]);

  const buildFormData = useCallback(() => {
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

    if ((form.description || "").replace(/\s+/g, " ").trim().length > 0)
      formData.append("Description", description);
    if (form.password) formData.append("Password", form.password);

    return formData;
  }, [form, profileImage, coverImage, createFileData]);

  const handleSave = useCallback(async () => {
    clearAlerts();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const formData = buildFormData();

      await request({
        urlComplement: "/api/users/me",
        method: "PATCH",
        body: formData,
      });

      await Storage.saveProfileBasic({
        imageUrl: profileImage.local?.uri || profileImage.remote,
        coverUrl: coverImage.local?.uri || coverImage.remote,
        userName: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        description: (form.description || "").replace(/\s+/g, " ").trim(),
      });

      setSuccessMsg("Informações atualizadas com sucesso!");

      setForm((prev) => ({
        ...prev,
        password: "",
      }));
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  }, [
    clearAlerts,
    validateForm,
    buildFormData,
    request,
    setLoading,
    profileImage,
    coverImage,
    form,
  ]);

  const state = useMemo(
    () => ({
      form,
      profileImage,
      coverImage,
      error,
      successMsg,
      loading,
      maxDescriptionLength: MAX_DESCRIPTION_LENGTH,
    }),
    [form, profileImage, coverImage, error, successMsg, loading],
  );

  const actions = useMemo(
    () => ({
      onChangeForm,
      handlePickCover,
      handlePickProfileImage,
      handleSave,
      deleteAccount,
      logOut,
      goToBlockedUsers,
    }),
    [
      onChangeForm,
      handlePickCover,
      handlePickProfileImage,
      handleSave,
      deleteAccount,
      logOut,
      goToBlockedUsers,
    ],
  );

  return {
    state,
    actions,
  };
}
