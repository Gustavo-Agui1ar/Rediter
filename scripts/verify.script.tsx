import { useApi } from "@/utils/request.utils";
import { saveTokens } from "@/utils/storage.utils";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
export interface VerifyResponse {
  success: boolean;
  error?: string;
  access?: string;
  refresh?: string;
}

export function useVerifyCode() {
  const { userEmail, mode } = useLocalSearchParams();
  const [code, setCode] = useState("");

  const { request, loading, error: apiError } = useApi();

  const verifyCodeApi = async (
    email: string,
    codeToVerify: string,
  ): Promise<VerifyResponse> => {
    if (codeToVerify.length !== 6) {
      return { success: false, error: "Código deve conter 6 dígitos." };
    }

    try {
      const serverResponse = await request({
        urlComplement: `/api/auth/verification-code/confirm`,
        method: "POST",
        requireAuth: false,
        body: { code: codeToVerify, email },
      });

      if (!serverResponse.ok) {
        return { success: false, error: "Código inválido ou expirado." };
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
        error:
          error instanceof Error
            ? error.message
            : "Erro de rede. Tente novamente.",
      };
    }
  };

  const handleResendCode = async () => {
    if (!userEmail) return;

    await request({
      method: "POST",
      urlComplement: "/api/auth/verification-code",
      body: userEmail,
      requireAuth: false,
    });
  };

  const handleVerify = async () => {
    if (!userEmail) return;

    const response = await verifyCodeApi(userEmail as string, code);

    if (!response.success) {
      alert(response.error || "Código incorreto. Tente novamente.");
      return;
    }

    if (response.access && response.refresh) {
      await saveTokens(response.access, response.refresh);
    }

    if (mode === "register") {
      router.replace("/home");
    } else if (mode === "reset") {
      router.push({
        pathname: "/forgotPassword",
        params: { userEmail },
      });
    }
  };

  return {
    code,
    setCode,
    handleVerify,
    handleResendCode,
    loading,
    apiError,
  };
}
