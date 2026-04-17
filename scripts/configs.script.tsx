import { configs } from "@/utils/configs";
import { request } from "@/utils/request";
import { getStoreageItem } from "@/utils/storage";
import * as ImagePicker from "expo-image-picker";

// 🔹 carregar imagem do backend
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

  return `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(
    imageName,
  )}`;
}

export async function pickImage(isSquare: boolean = true) {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) throw new Error("Sem permissão");

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    allowsEditing: true,
    aspect: isSquare ? [1, 1] : [16, 9],
  });

  if (result.canceled) return null;
  return result.assets[0];
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

  const refresh_token = await getStoreageItem("refresh_token");

  formData.append("Name", form.name || "");
  formData.append("Email", form.email || "");
  formData.append("Password", form.password || "");
  formData.append("RefreshToken", refresh_token ?? "");

  try {
    const response = await request({
      urlComplement: "/User/UpdateProfile",
      method: "POST",
      body: formData,
      setLoading: setLoading,
    });
  } catch (err) {
    console.log("Erro ao salvar:", err);
  }
}
