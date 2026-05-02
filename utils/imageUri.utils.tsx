import { getBaseURL } from "@/utils/configs.utils";

export class ImageUtils {
  /**
   * Gera uma URI segura especificamente para fotos de perfil.
   * Protege contra undefined, null e objetos inválidos.
   *
   * @param imageName O nome do arquivo, URL completa ou variável indefinida
   * @returns Uma string válida da URL ou null caso falhe
   */
  static getProfileImageUri(imageName: unknown): string | null {
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

      const baseUrl = getBaseURL();
      return `${baseUrl}/api/pictures/${encodeURIComponent(imageName)}`;
    } catch (error) {
      console.error("[ImageUtils] Erro ao gerar URI de perfil:", error);
      return null;
    }
  }

  /**
   * Gera uma URI segura genérica para outras imagens do app (ex: Posts).
   *
   * @param imagePath O caminho da imagem (ex: "/Midia/get/123.jpg")
   * @param defaultEndpoint Um endpoint base opcional caso o backend precise
   */
  static getSafeUri(
    imagePath: unknown,
    defaultEndpoint: string = "",
  ): string | null {
    try {
      if (!imagePath || typeof imagePath !== "string") {
        return null;
      }

      if (
        imagePath.startsWith("http") ||
        imagePath.startsWith("file://") ||
        imagePath.startsWith("data:")
      ) {
        return imagePath;
      }

      const baseUrl = getBaseURL();
      const cleanEndpoint = defaultEndpoint.startsWith("/")
        ? defaultEndpoint
        : `/${defaultEndpoint}`;
      const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

      return `${baseUrl}${defaultEndpoint ? cleanEndpoint : ""}${cleanPath}`;
    } catch (error) {
      console.error("[ImageUtils] Erro ao gerar URI segura genérica:", error);
      return null;
    }
  }
}
