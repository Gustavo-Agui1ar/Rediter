import { useAuth } from "@/context/AuthContext";
import { useSignalR } from "@/context/NotificationsContext";
import { useRediterBaseConfigs } from "@/context/RediterConfigContext";
import { LoginValidator } from "@/utils/login.utils";
import { useApi } from "@/utils/request.utils";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRootNavigationState, useRouter } from "expo-router";
import { startTransition, useCallback, useEffect, useState } from "react";

export function useIndex() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { request } = useApi();
  const { googleClientId } = useRediterBaseConfigs();
  const { connectSignalR } = useSignalR();
  const { login: contextLogin, isAuthenticated } = useAuth();

  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (googleClientId) {
      GoogleSignin.configure({
        webClientId: googleClientId,
        offlineAccess: true,
      });
    }
  }, [googleClientId]);

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    if (isAuthenticated) {
      console.log(
        "Tokens encontrados no Contexto, redirecionando para main...",
      );
      router.replace("/home");
    }
  }, [rootNavigationState?.key, isAuthenticated, router]);

  const clearError = useCallback(() => {
    if (serverError) {
      startTransition(() => setServerError(""));
    }
    if (submitted) {
      startTransition(() => setSubmitted(false));
    }
  }, [serverError, submitted]);

  const handleLogin = async (email: string, password: string) => {
    startTransition(() => {
      setSubmitted(true);
      setServerError("");
    });

    if (
      !LoginValidator.isEmailValid(email) ||
      !LoginValidator.isPasswordValid(password)
    ) {
      return;
    }

    try {
      const responseData = await request({
        urlComplement: "/api/auth/login",
        method: "POST",
        data: {
          name: "User Redider",
          email: email,
          password: password,
        },
        requireAuth: false,
      });

      const access = responseData.accessToken || responseData.access;
      const refresh = responseData.refreshToken || responseData.refresh;

      if (!access || !refresh) {
        startTransition(() => setServerError("Resposta inválida do servidor."));
        return;
      }

      await contextLogin(access, refresh);
      await connectSignalR();
      router.replace("/home");
    } catch (error: any) {
      startTransition(() => {
        // 1. Tenta pegar a mensagem customizada vinda do corpo da resposta da API
        // Ajuste 'error.response?.data?.message' conforme a estrutura de erro do seu backend
        const apiErrorMessage =
          error.response?.data?.message || error.response?.data?.error;

        // 2. Se não houver resposta do backend, usa a mensagem do erro ou o fallback genérico
        const finalMessage =
          apiErrorMessage ||
          error?.message ||
          "Falha na conexão com o servidor.";

        setServerError(finalMessage);
      });
    }
  };

  const handleGoogleLogin = async () => {
    startTransition(() => setServerError(""));

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        startTransition(() =>
          setServerError("Falha ao obter o token de autenticação do Google."),
        );
        return;
      }

      const responseData = await request({
        urlComplement: "/api/auth/login/google",
        method: "POST",
        data: { idToken: idToken },
        requireAuth: false,
      });

      const access = responseData.accessToken || responseData.access;
      const refresh = responseData.refreshToken || responseData.refresh;

      if (!access || !refresh) {
        startTransition(() => setServerError("Resposta inválida do servidor."));
        return;
      }

      await contextLogin(access, refresh);
      await connectSignalR();
      router.replace("/home");
    } catch (error: any) {
      console.error("Erro durante o Google Sign-In:", error);

      let errorMessage = "Erro desconhecido durante login com Google.";

      if (error.code) {
        switch (error.code) {
          case "SIGN_IN_CANCELLED":
            errorMessage = "O login com Google foi cancelado.";
            break;
          case "IN_PROGRESS":
            errorMessage = "O login já está em andamento.";
            break;
          case "PLAY_SERVICES_NOT_AVAILABLE":
            errorMessage =
              "Serviços do Google Play indisponíveis neste dispositivo.";
            break;
          default:
            errorMessage = "Falha ao comunicar com os servidores do Google.";
            break;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      startTransition(() => setServerError(errorMessage));
    }
  };

  return {
    state: { serverError, submitted },
    actions: { handleLogin, handleGoogleLogin, clearError },
  };
}
