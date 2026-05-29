import { useApi } from "@/utils/request.utils";
import { saveTokens } from "@/utils/storage.utils";
import { router, useLocalSearchParams } from "expo-router";
import { startTransition, useState } from "react";
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
      const data = await request({
        urlComplement: `/api/auth/verification-code/confirm`,
        method: "POST",
        requireAuth: false,
        data: { code: codeToVerify, email },
      });

      return {
        success: true,
        access: data.accessToken,
        refresh: data.refreshToken,
      };
    } catch (error: any) {
      console.error("Erro durante a verificação do código:", error);

      let errorMessage = "Erro de rede. Tente novamente.";

      if (error?.response?.status === 400 || error?.response?.status === 401) {
        errorMessage = "Código inválido ou expirado.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const handleResendCode = async () => {
    if (!userEmail) return;

    try {
      await request({
        method: "POST",
        urlComplement: "/api/auth/verification-code",
        data: { email: userEmail },
        requireAuth: false,
        hasLoading: false,
      });

      alert("Código reenviado com sucesso!");
    } catch (error) {
      alert("Não foi possível reenviar o código. Tente novamente mais tarde.");
    }
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

    startTransition(() => {
      if (mode === "register") {
        router.replace("/home");
      } else if (mode === "reset") {
        router.push({
          pathname: "/forgotPassword",
          params: { userEmail },
        });
      }
    });
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
