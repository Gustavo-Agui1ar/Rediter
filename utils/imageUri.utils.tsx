import { useRediterBaseConfigs } from "@/context/RediterConfigContext";
import { useCallback } from "react";

export const useImageUtils = () => {
  const { baseUrl } = useRediterBaseConfigs();

  const getProfileImageUri = useCallback(
    (imageName: unknown, thumbnail: boolean = true): string | null => {
      try {
        if (!imageName || typeof imageName !== "string") {
          return null;
        }

        if (
          imageName.startsWith("http") ||
          imageName.startsWith("file://") ||
          imageName.startsWith("data:image")
        ) {
          return imageName;
        }

        return `${baseUrl}/api/pictures/${encodeURIComponent(imageName)}?isThumb=${thumbnail}`;
      } catch (error) {
        console.error("[useImageUtils] Erro ao gerar URI de perfil:", error);
        return null;
      }
    },
    [baseUrl],
  );

  const getSafeUri = useCallback(
    (imagePath: unknown, thumbnail: boolean = true): string | undefined => {
      try {
        if (!imagePath || typeof imagePath !== "string") {
          return undefined;
        }

        if (
          imagePath.startsWith("http") ||
          imagePath.startsWith("file://") ||
          imagePath.startsWith("data:")
        ) {
          return imagePath;
        }

        const cleanPath = imagePath.startsWith("/")
          ? imagePath.slice(1)
          : imagePath;

        const finalUrl = `${baseUrl}/api/pictures/${encodeURIComponent(cleanPath)}?isThumb=${thumbnail}`;
        return finalUrl;
      } catch (error) {
        console.error("[useImageUtils] Erro ao gerar URI segura:", error);

        return undefined;
      }
    },
    [baseUrl],
  );

  return {
    getProfileImageUri,
    getSafeUri,
  };
};
