import { useLoading } from "@/context/loadingContext";
import { pickImage } from "@/utils/filePicker.utils";
import { handleGetLocation } from "@/utils/location.utils";
import { request } from "@/utils/request.utils";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, Keyboard } from "react-native";

export function useNewPost() {
  const [files, setFiles] = useState<any[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [text, setText] = useState("");
  const [locationName, setLocationName] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);

  const [helperText, setHelperText] = useState<{
    message: string;
    type: "error" | "warning" | "success";
  } | null>(null);

  const [alertBanner, setAlertBanner] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const { setLoading } = useLoading();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.isEditing === "true") {
      if (typeof params.postId === "string") setPostId(params.postId);
      if (typeof params.text === "string") setText(params.text);
      if (typeof params.location === "string") setLocationName(params.location);

      if (typeof params.imageUrls === "string") {
        try {
          setFiles(JSON.parse(params.imageUrls));
        } catch (e) {
          console.error("Erro ao fazer parse das imagens", e);
          setAlertBanner({
            message: "Aviso: Falha ao carregar imagens antigas.",
            type: "error",
          });
        }
      }
    }
  }, [params]);

  const onAddImage = async () => {
    const result = await pickImage();
    if (result) {
      setFiles((prev) => [...prev, result]);
      setHelperText(null);
    }
  };

  const onRemoveImage = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const onToggleEmoji = () => {
    Keyboard.dismiss();
    setShowEmoji((prev) => !prev);
  };

  const onAddLocation = async () => {
    await handleGetLocation({ setLocationName });
  };

  const onEmojiSelected = (emojiObject: { emoji: string }) => {
    setText((prev) => prev + emojiObject.emoji);
    setHelperText(null);
  };

  const onChangeText = (newText: string) => {
    setText(newText);
    setHelperText(null);
  };

  const validatePost = () => {
    if (text.trim() === "" && files.length === 0) {
      setHelperText({
        message: "O post não pode estar vazio. Adicione texto ou uma imagem.",
        type: "error",
      });
      return false;
    }
    if (text.length > 500) {
      setHelperText({
        message: "Você está quase atingindo o limite de caracteres.",
        type: "warning",
      });
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!validatePost()) return;

    setLoading(true);
    const formData = new FormData();

    try {
      setAlertBanner(null);

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

      setAlertBanner({
        message: postId
          ? "Post editado com sucesso!"
          : "Post publicado com sucesso!",
        type: "success",
      });

      setText("");
      setFiles([]);
      setLocationName(null);

      router.back();
    } catch (error: any) {
      console.error("Erro ao publicar post:", error.response?.data || error);
      setAlertBanner({
        message:
          "Erro no servidor ao tentar publicar. Tente novamente mais tarde.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      files,
      showEmoji,
      text,
      locationName,
      postId,
      helperText,
      alertBanner,
    },
    actions: {
      onChangeText,
      onAddImage,
      onRemoveImage,
      onToggleEmoji,
      onAddLocation,
      onEmojiSelected,
      handlePublish,
      setShowEmoji,
      setLocationName,
      setAlertBanner,
    },
  };
}
