import { request } from "@/utils/request.utils";

interface VerifyResponse {
  success: boolean;
  error?: string;
  access?: string;
  refresh?: string;
}

export class ScriptVerify {
  static async authenticateCode(
    userEmail: string,
    code: string,
    setLoading?: (loading: boolean) => void,
  ): Promise<VerifyResponse> {
    if (code.length !== 6) {
      return {
        success: false,
        error: "Código deve conter 6 dígitos.",
      };
    }

    try {
      const serverResponse = await request({
        urlComplement: `/Auth/verify-code`,
        method: "POST",
        requireAuth: false,
        setLoading,
        body: { code: code, email: userEmail },
      });

      if (!serverResponse.ok) {
        return {
          success: false,
          error: "Código inválido ou expirado.",
        };
      }

      const data = await serverResponse.json();

      return {
        success: true,
        access: data.accessToken,
        refresh: data.refreshToken,
      };
    } catch (error) {
      console.error("Error during code verification:", error);
      return {
        success: false,
        error: "Erro de rede. Tente novamente.",
      };
    }
  }
}
