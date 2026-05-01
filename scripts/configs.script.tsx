import { getBaseURL } from "@/utils/configs.utils";
import { request } from "@/utils/request.utils";
import { router } from "expo-router";
interface Config {
  form: {
    name: string;
    email: string;
    password: string;
  };
  profileImage: {
    local?: any;
    remote?: string;
    changed?: boolean;
  };
  profileCover: {
    local?: any;
    remote?: string;
    changed?: boolean;
  };

  setLoading?: (loading: boolean) => void;
}

export function loadProfileImage(imageName?: string) {
  if (!imageName) return undefined;

  return `${getBaseURL()}/Picture/GetPicture?name=${encodeURIComponent(
    imageName,
  )}`;
}

const createFileData = (imageAsset: any) => {
  if (!imageAsset.uri) return null;

  const uriParts = imageAsset.uri.split("/");
  const fileName = imageAsset.fileName || uriParts[uriParts.length - 1];

  const type = imageAsset.mimeType || "image/jpeg";

  return {
    uri: imageAsset.uri,
    name: fileName,
    type: type,
  } as any;
};

export async function handleSave({
  form,
  profileImage,
  profileCover,
  setLoading,
}: Config) {
  const formData = new FormData();

  if (profileImage?.changed && profileImage?.local) {
    const fileData = createFileData(profileImage.local);
    if (fileData) formData.append("File", fileData);
  }

  if (profileCover?.changed && profileCover?.local) {
    const coverData = createFileData(profileCover.local);
    if (coverData) formData.append("Cover", coverData);
  }

  formData.append("Name", form.name || "");
  formData.append("Email", form.email.trim().toLowerCase() || "");
  formData.append("Password", form.password || "");

  try {
    await request({
      urlComplement: "/User/UpdateProfile",
      method: "POST",
      body: formData,
      setLoading: setLoading,
    });

    router.back();
  } catch (err: any) {
    return err.response?.data || "Ocorreu um erro ao atualizar o perfil.";
  }
}
