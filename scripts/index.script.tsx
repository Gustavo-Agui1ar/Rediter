import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { useLoading } from "@/context/loadingContext";
import { configs } from "@/utils/configs.utils";
import { LoginValidator } from "@/utils/login.utils";
import { useApi } from "@/utils/request.utils";
import * as StorageUtils from "@/utils/storage.utils";

GoogleSignin.configure({
  webClientId: configs.GoogleClientID,
  offlineAccess: true,
});

export function useIndex() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const rootNavigationState = useRootNavigationState();
  const { request } = useApi();
  const [form, setForm] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
    setForm((prev) => ({ ...prev, [field]: value }));
    if (submitted) setSubmitted(false);
    if (serverError) setServerError("");
  };

  const handleLogin = async () => {
    setSubmitted(true);
    setServerError("");

    if (
      !LoginValidator.isEmailValid(form.email) ||
      !LoginValidator.isPasswordValid(form.password)
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await request({
        urlComplement: "/api/auth/login",
        method: "POST",
        body: {
          name: "User Redider",
          email: form.email,
          password: form.password,
        },
        requireAuth: false,
      });

      const { refresh, access } = await LoginValidator.ParseTokens(response);

      if (!access || !refresh) {
        setServerError("Resposta inválida do servidor.");
        return;
      }

      await StorageUtils.saveTokens(access, refresh);
      router.replace("/home");
    } catch (error: any) {
      setServerError(error?.message || "Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setServerError("");

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        setServerError("Falha ao obter o token de autenticação do Google.");
        return;
      }

      const response = await request({
        urlComplement: "/api/auth/login/google",
        method: "POST",
        body: { idToken: idToken },
        requireAuth: false,
      });

      const { refresh, access } = await LoginValidator.ParseTokens(response);

      if (!access || !refresh) {
        setServerError("Resposta inválida do servidor.");
        return;
      }

      await StorageUtils.saveTokens(access, refresh);
      router.replace("/home");
    } catch (error: any) {
      console.error("Erro durante o Google Sign-In:", error);

      if (error.code) {
        switch (error.code) {
          case "SIGN_IN_CANCELLED":
            setServerError("O login com Google foi cancelado.");
            return;
          case "IN_PROGRESS":
            setServerError("O login já está em andamento.");
            return;
          case "PLAY_SERVICES_NOT_AVAILABLE":
            setServerError(
              "Serviços do Google Play indisponíveis neste dispositivo.",
            );
            return;
          default:
            setServerError("Falha ao comunicar com os servidores do Google.");
            return;
        }
      }
      setServerError(
        error?.message || "Erro desconhecido durante login com Google.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    state: { form, serverError, submitted },
    actions: { handleInputChange, handleLogin, handleGoogleLogin },
  };
}
