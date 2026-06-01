import { pickImage } from "@/utils/filePicker.utils";
import { handleGetLocation } from "@/utils/location.utils";
import { useApi } from "@/utils/request.utils";
import { router, useLocalSearchParams } from "expo-router";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DeviceEventEmitter, Platform } from "react-native";

export type AlertBannerType = {
  message: string;
  type: "error" | "success";
} | null;

export function useNewPost() {
  const { request } = useApi();
  const params = useLocalSearchParams();
  const [alertBanner, setAlertBanner] = useState<AlertBannerType>(null);
  const [initialData, setInitialData] = useState({
    postId: null as string | null,
    text: "",
    locationName: null as string | null,
    files: [] as any[],
  });

  useEffect(() => {
    if (params.isEditing !== "true") return;

    let parsedFiles: any[] = [];
    if (typeof params.imageUrls === "string") {
      try {
        parsedFiles = JSON.parse(params.imageUrls);
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

    setInitialData({
      postId: typeof params.postId === "string" ? params.postId : null,
      text: typeof params.text === "string" ? params.text : "",
      locationName:
        typeof params.location === "string" ? params.location : null,
      files: parsedFiles,
    });
  }, [params]);

  const clearAlerts = useCallback(() => {
    if (alertBanner) {
      startTransition(() => setAlertBanner(null));
    }
  }, [alertBanner]);

  const pickNewImage = useCallback(async () => {
    try {
      const result = await pickImage();
      clearAlerts();
      return result;
    } catch {
      startTransition(() => {
        setAlertBanner({
          message: "Erro ao acessar a galeria de imagens.",
          type: "error",
        });
      });
      return null;
    }
  }, [clearAlerts]);

  const fetchLocation = useCallback(
    async (setLocationName: (loc: string | null) => void) => {
      try {
        await handleGetLocation({ setLocationName });
        clearAlerts();
      } catch {
        startTransition(() => {
          setAlertBanner({
            message:
              "Não foi possível obter sua localização. Verifique as permissões.",
            type: "error",
          });
        });
      }
    },
    [clearAlerts],
  );

  const createFormData = useCallback(
    (text: string, locationName: string | null, files: any[]) => {
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

          const mimeType = fileAsset.mimeType || fileAsset.type || "image/jpeg";

          let localUri = fileAsset.uri;
          if (
            Platform.OS === "android" &&
            !localUri.startsWith("file://") &&
            !localUri.startsWith("content://")
          ) {
            localUri = `file://${localUri}`;
          }

          formData.append("Pictures", {
            uri: localUri,
            name: fileName,
            type: mimeType,
          } as any);
        }
      });

      return formData;
    },
    [],
  );

  const handlePublish = useCallback(
    async (
      text: string,
      locationName: string | null,
      files: any[],
      postId: string | null,
    ) => {
      try {
        clearAlerts();
        const formData = createFormData(text, locationName, files);

        for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

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
        });

        setTimeout(() => {
          router.back();
        }, 1000);
        return true;
      } catch (error: any) {
        console.error("Erro ao publicar post:", error);
        startTransition(() => {
          setAlertBanner({
            message:
              "Erro no servidor ao tentar publicar. Tente novamente mais tarde.",
            type: "error",
          });
        });
        return false;
      }
    },
    [clearAlerts, createFormData, request],
  );

  const state = useMemo(
    () => ({ alertBanner, initialData }),
    [alertBanner, initialData],
  );

  const actions = useMemo(
    () => ({
      pickNewImage,
      fetchLocation,
      handlePublish,
      clearAlerts,
      setAlertBanner,
    }),
    [pickNewImage, fetchLocation, handlePublish, clearAlerts],
  );

  return { state, actions };
}
