import { pickImage } from "@/utils/filePicker.utils";
import { handleGetLocation } from "@/utils/location.utils";
import { useApi } from "@/utils/request.utils";
import { router, useLocalSearchParams } from "expo-router";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DeviceEventEmitter, Keyboard } from "react-native";

const MAX_CHARACTERS = 250;
const WARNING_LIMIT = 200;

type HelperTextType = {
  message: string;
  type: "error" | "warning" | "success";
} | null;

type AlertBannerType = {
  message: string;
  type: "error" | "success";
} | null;

export function useNewPost() {
  const [files, setFiles] = useState<any[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [text, setText] = useState("");
  const [locationName, setLocationName] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [helperText, setHelperText] = useState<HelperTextType>(null);
  const [alertBanner, setAlertBanner] = useState<AlertBannerType>(null);
  const validationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { request } = useApi();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.isEditing !== "true") return;

    startTransition(() => {
      if (typeof params.postId === "string") setPostId(params.postId);
      if (typeof params.text === "string") setText(params.text);
      if (typeof params.location === "string") setLocationName(params.location);
    });

    if (typeof params.imageUrls === "string") {
      try {
        const parsedFiles = JSON.parse(params.imageUrls);
        startTransition(() => setFiles(parsedFiles));
      } catch (e) {
        console.error("Erro ao fazer parse das imagens", e);
        startTransition(() => {
          setAlertBanner({
            message: "Aviso: Falha ao carregar imagens antigas.",
            type: "error",
          });
        });
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (validationTimer.current) {
        clearTimeout(validationTimer.current);
      }
    };
  }, []);

  const clearMessages = useCallback(() => {
    startTransition(() => {
      setHelperText(null);
      setAlertBanner(null);
    });
  }, []);

  const onAddImage = useCallback(async () => {
    try {
      const result = await pickImage();

      if (!result) return;

      startTransition(() => {
        setFiles((prev) => [...prev, result]);
      });
      clearMessages();
    } catch {
      startTransition(() => {
        setAlertBanner({
          message: "Erro ao acessar a galeria de imagens.",
          type: "error",
        });
      });
    }
  }, [clearMessages]);

  const onRemoveImage = useCallback((indexToRemove: number) => {
    startTransition(() => {
      setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    });
  }, []);

  const onToggleEmoji = useCallback(() => {
    Keyboard.dismiss();
    startTransition(() => setShowEmoji((prev) => !prev));
  }, []);

  const onAddLocation = useCallback(async () => {
    try {
      startTransition(() => setHelperText(null));
      await handleGetLocation({ setLocationName });
    } catch {
      startTransition(() => {
        setHelperText({
          message:
            "Não foi possível obter sua localização. Verifique as permissões.",
          type: "error",
        });
      });
    }
  }, []);

  const onEmojiSelected = useCallback(
    (emojiObject: { emoji: string }) => {
      startTransition(() => setText((prev) => prev + emojiObject.emoji));
      clearMessages();
    },
    [clearMessages],
  );

  const validateText = useCallback((value: string) => {
    startTransition(() => {
      if (value.length > MAX_CHARACTERS) {
        setHelperText({
          message: `Você ultrapassou o limite de ${MAX_CHARACTERS} caracteres.`,
          type: "error",
        });
        return;
      }

      if (value.length > WARNING_LIMIT) {
        setHelperText({
          message: `Você está quase atingindo o limite de ${MAX_CHARACTERS} caracteres.`,
          type: "warning",
        });
        return;
      }

      setHelperText(null);
    });
  }, []);

  const onChangeText = useCallback(
    (newText: string) => {
      setText(newText);

      if (validationTimer.current) {
        clearTimeout(validationTimer.current);
      }

      validationTimer.current = setTimeout(() => {
        validateText(newText);
      }, 250);
    },
    [validateText],
  );

  const validatePost = useCallback(() => {
    clearMessages();

    if (text.trim() === "" && files.length === 0) {
      startTransition(() => {
        setAlertBanner({
          message: "O post não pode estar vazio. Adicione texto ou uma imagem.",
          type: "error",
        });
      });
      return false;
    }

    if (text.length > MAX_CHARACTERS) {
      startTransition(() => {
        setAlertBanner({
          message: `O texto excedeu o limite máximo de ${MAX_CHARACTERS} caracteres.`,
          type: "error",
        });
      });
      return false;
    }

    return true;
  }, [text, files.length, clearMessages]);

  const createFormData = useCallback(() => {
    const formData = new FormData();

    formData.append("Text", text);

    if (locationName) {
      formData.append("LocationName", locationName);
    }

    files.forEach((fileAsset) => {
      if (typeof fileAsset === "string") {
        formData.append("RetainedPictures", fileAsset);
      } else if (fileAsset?.uri) {
        const uriParts = fileAsset.uri.split("/");
        const fileName =
          fileAsset.fileName ||
          uriParts[uriParts.length - 1] ||
          `image-${Date.now()}.jpg`;

        formData.append("Pictures", {
          uri: fileAsset.uri,
          name: fileName,
          type: fileAsset.mimeType || "image/jpeg",
        } as any);
      }
    });

    return formData;
  }, [text, locationName, files]);

  const handlePublish = useCallback(async () => {
    if (!validatePost()) return;

    try {
      clearMessages();

      const formData = createFormData();

      await request({
        urlComplement: postId ? `/api/posts/${postId}` : "/api/posts",
        method: postId ? "PUT" : "POST",
        data: formData,
      });

      DeviceEventEmitter.emit("refresh_posts");

      startTransition(() => {
        setAlertBanner({
          message: postId
            ? "Post editado com sucesso!"
            : "Post publicado com sucesso!",
          type: "success",
        });
        setText("");
        setFiles([]);
        setLocationName(null);
      });

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error: any) {
      console.error("Erro ao publicar post:", error);

      startTransition(() => {
        setAlertBanner({
          message:
            "Erro no servidor ao tentar publicar. Tente novamente mais tarde.",
          type: "error",
        });
      });
    }
  }, [validatePost, clearMessages, createFormData, request, postId]);

  const state = useMemo(
    () => ({
      files,
      showEmoji,
      text,
      locationName,
      postId,
      helperText,
      alertBanner,
    }),
    [files, showEmoji, text, locationName, postId, helperText, alertBanner],
  );

  const actions = useMemo(
    () => ({
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
    }),
    [
      onChangeText,
      onAddImage,
      onRemoveImage,
      onToggleEmoji,
      onAddLocation,
      onEmojiSelected,
      handlePublish,
    ],
  );

  return { state, actions };
}
