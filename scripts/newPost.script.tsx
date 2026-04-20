import { request } from "@/utils/request";
import { getStoreageItem } from "@/utils/storage";
import { router } from "expo-router";
import { Alert, DeviceEventEmitter } from "react-native";
interface NewPostData {
  text: string;
  files: any[];
  locationName: string | null;
  setLoading: (loading: boolean) => void;
  postId?: string;
}

interface RemoveImageData {
  indexToRemove: number;
  setFiles: React.Dispatch<React.SetStateAction<any[]>>;
}

export class NewPostScript {
  async handleRemoveImage({ indexToRemove, setFiles }: RemoveImageData) {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  }

  async handlePublish({
    text,
    files,
    locationName,
    setLoading,
    postId,
  }: NewPostData) {
    if (!text.trim() && files.length === 0) {
      Alert.alert("Aviso", "Escreva algo ou adicione uma foto para publicar.");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    try {
      if (!postId) {
        const refresh_token = await getStoreageItem("refresh_token");
        formData.append("RefreshToken", refresh_token || "");
      }
      formData.append("Text", text);
      if (locationName) formData.append("LocationName", locationName);

      files.forEach((fileAsset) => {
        if (typeof fileAsset === "string") {
          formData.append("RetainedPictures", fileAsset);
        } else if (fileAsset && fileAsset.uri) {
          const uriParts = fileAsset.uri.split("/");
          const fileName = fileAsset.fileName || uriParts[uriParts.length - 1];
          const type = fileAsset.mimeType || "image/jpeg";

          formData.append("Pictures", {
            uri: fileAsset.uri,
            name: fileName,
            type: type,
          } as any);
        }
      });

      await request({
        urlComplement: postId ? `/Post/UpdatePost/${postId}` : "/Post/NewPost",
        method: postId ? "PUT" : "POST",
        body: formData,
        setLoading: setLoading,
      });

      DeviceEventEmitter.emit("refresh_posts");

      router.back();
    } catch (err: any) {
      console.error("Erro ao publicar post:", err.response?.data || err);
      Alert.alert("Erro", "Houve um problema ao publicar seu post.");
    } finally {
      setLoading(false);
    }
  }
}
