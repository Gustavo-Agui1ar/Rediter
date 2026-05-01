import { useLoading } from "@/context/loadingContext";
import { pickImage } from "@/utils/filePicker.utils";
import { LoginValidator } from "@/utils/login.utils";
import { useApi } from "@/utils/request.utils";
import * as Storage from "@/utils/storage.utils";
import { useCallback, useEffect, useState } from "react";

interface ImageState {
  local?: any;
  remote?: string;
  changed?: boolean;
}

export function useConfigs() {
  const { loading, setLoading } = useLoading();
  const { request } = useApi();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [profileImage, setProfileImage] = useState<ImageState>({});
  const [coverImage, setCoverImage] = useState<ImageState>({});

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const clearAlerts = () => {
    if (error) setError(null);
    if (successMsg) setSuccessMsg(null);
  };

  const onChangeForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearAlerts();
  };

  const loadProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const cached = await Storage.getProfileBasic();
      if (cached) {
        setForm((prev) => ({
          ...prev,
          name: cached.userName || "",
          email: cached.email || "",
        }));
        setProfileImage({ remote: cached.imageUrl });
        setCoverImage({ remote: cached.coverUrl });
      }

      const response = await request({
        urlComplement: `/User/GetUser`,
        method: "GET",
      });
      if (response.ok) {
        const json = await response.json();
        const data = {
          userName: json.name,
          email: json.email,
          imageUrl: json.imageName,
          coverUrl: json.imageCover,
        };

        await Storage.saveProfileBasic(data);
        setForm((prev) => ({
          ...prev,
          name: data.userName || "",
          email: data.email || "",
        }));
        setProfileImage({ remote: data.imageUrl });
        setCoverImage({ remote: data.coverUrl });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do perfil:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handlePickCover = async () => {
    const img = await pickImage(false);
    if (img) {
      setCoverImage({ local: img, changed: true });
      clearAlerts();
    }
  };

  const handlePickProfileImage = async () => {
    const img = await pickImage(true);
    if (img) {
      setProfileImage({ local: img, changed: true });
      clearAlerts();
    }
  };

  const createFileData = (imageAsset: any) => {
    if (!imageAsset?.uri) return null;
    const uriParts = imageAsset.uri.split("/");
    const fileName = imageAsset.fileName || uriParts[uriParts.length - 1];
    return {
      uri: imageAsset.uri,
      name: fileName,
      type: imageAsset.mimeType || "image/jpeg",
    } as any;
  };

  const handleSave = async () => {
    clearAlerts();

    const name = form.name?.trim() || "";
    const email = form.email?.trim().toLowerCase() || "";
    const password = form.password || "";

    if (!name) return setError("O campo Nome não pode estar vazio.");
    if (!email) return setError("O campo E-mail não pode estar vazio.");
    if (!LoginValidator.isEmailValid(email))
      return setError("O formato do e-mail é inválido.");
    if (password && !LoginValidator.isPasswordValid(password))
      return setError("A nova senha informada é inválida ou muito curta.");

    setLoading(true);
    const formData = new FormData();

    if (profileImage?.changed && profileImage?.local) {
      const fileData = createFileData(profileImage.local);
      if (fileData) formData.append("File", fileData);
    }

    if (coverImage?.changed && coverImage?.local) {
      const coverData = createFileData(coverImage.local);
      if (coverData) formData.append("Cover", coverData);
    }

    formData.append("Name", name);
    formData.append("Email", email);
    if (password) formData.append("Password", password);

    try {
      await request({
        urlComplement: "/User/UpdateProfile",
        method: "POST",
        body: formData,
      });

      await Storage.saveProfileBasic({
        imageUrl: profileImage.local?.uri || profileImage.remote,
        coverUrl: coverImage.local?.uri || coverImage.remote,
        userName: name,
        email: email,
      });

      setSuccessMsg("Informações atualizadas com sucesso!");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  return {
    state: { form, profileImage, coverImage, error, successMsg, loading },
    actions: {
      onChangeForm,
      handlePickCover,
      handlePickProfileImage,
      handleSave,
    },
  };
}
