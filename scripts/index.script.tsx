import { useSignalR } from "@/context/NotificationsContext";
import { useRediterBaseConfigs } from "@/context/RediterConfigContext";
import { LoginValidator } from "@/utils/login.utils";
import { useApi } from "@/utils/request.utils";
import * as StorageUtils from "@/utils/storage.utils";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRootNavigationState, useRouter } from "expo-router";
import { startTransition, useEffect, useState } from "react";

export function useIndex() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { request } = useApi();
  const { googleClientId } = useRediterBaseConfigs();
  const { connectSignalR } = useSignalR();
  const [form, setForm] = useState({ email: "", password: "" });
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

    const checkTokens = async () => {
      try {
        const accessToken = await StorageUtils.getStoreageItem("user_token");
        const refreshToken =
          await StorageUtils.getStoreageItem("refresh_token");

        if (accessToken && refreshToken) {
          console.log("Tokens encontrados, redirecionando para main...");
          router.replace("/home");
        }
      } catch (error) {
        console.error("Erro ao recuperar tokens:", error);
      }
    };

    checkTokens();
  }, [rootNavigationState?.key, router]);

  const handleInputChange = (field: "email" | "password", value: string) => {
    startTransition(() => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (submitted) setSubmitted(false);
      if (serverError) setServerError("");
    });
  };

  const handleLogin = async () => {
    startTransition(() => {
      setSubmitted(true);
      setServerError("");
    });

    if (
      !LoginValidator.isEmailValid(form.email) ||
      !LoginValidator.isPasswordValid(form.password)
    ) {
      return;
    }

    try {
      const responseData = await request({
        urlComplement: "/api/auth/login",
        method: "POST",
        data: {
          name: "User Redider",
          email: form.email,
          password: form.password,
        },
        requireAuth: false,
      });

      const access = responseData.accessToken || responseData.access;
      const refresh = responseData.refreshToken || responseData.refresh;

      if (!access || !refresh) {
        startTransition(() => setServerError("Resposta inválida do servidor."));
        return;
      }

      await StorageUtils.saveTokens(access, refresh);
      await connectSignalR();
      router.replace("/home");
    } catch (error: any) {
      startTransition(() => {
        setServerError(error?.message || "Falha na conexão com o servidor.");
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

      await StorageUtils.saveTokens(access, refresh);
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
    state: { form, serverError, submitted },
    actions: { handleInputChange, handleLogin, handleGoogleLogin },
  };
}
