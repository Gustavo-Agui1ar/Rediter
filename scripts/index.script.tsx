import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Router } from "expo-router";

import { configs } from "@/utils/configs.utils";
import { LoginValidator } from "@/utils/login.utils";
import { request } from "@/utils/request.utils";
import { getStoreageItem, saveTokens } from "@/utils/storage.utils";

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================
GoogleSignin.configure({
  webClientId: configs.GoogleClientID,
  offlineAccess: true,
});

// ============================================================================
// CONTROLADOR DE AUTENTICAÇÃO
// ============================================================================
export class AuthController {
  /**
   * Inicia o fluxo de login com Google
   */
  static async signInWithGoogle(
    router: Router,
    setLoading?: (loading: boolean) => void,
  ): Promise<{ success: boolean; error?: string } | undefined> {
    if (setLoading) setLoading(true);

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        return {
          success: false,
          error: "Falha ao obter o token de autenticação do Google.",
        };
      }

      const response = await request({
        urlComplement: "/Auth/google",
        method: "POST",
        body: { idToken: idToken },
        requireAuth: false,
        setLoading,
      });

      const { refresh, access } = await LoginValidator.ParseTokens(response);

      if (!access || !refresh) {
        return { success: false, error: "Resposta inválida do servidor." };
      }

      await saveTokens(access, refresh);
      router.replace("/home");
    } catch (error: any) {
      console.error("Erro durante o Google Sign-In:", error);

      if (error.code) {
        switch (error.code) {
          case "SIGN_IN_CANCELLED":
            return {
              success: false,
              error: "O login com Google foi cancelado.",
            };
          case "IN_PROGRESS":
            return { success: false, error: "O login já está em andamento." };
          case "PLAY_SERVICES_NOT_AVAILABLE":
            return {
              success: false,
              error: "Serviços do Google Play indisponíveis neste dispositivo.",
            };
          default:
            return {
              success: false,
              error: "Falha ao comunicar com os servidores do Google.",
            };
        }
      }

      return {
        success: false,
        error: error?.message || "Erro desconhecido durante login com Google.",
      };
    } finally {
      if (setLoading) setLoading(false);
    }
  }

  /**
   * Verifica se os tokens já existem no Storage e redireciona automaticamente
   */
  static async checkTokens(router: Router) {
    try {
      const accessToken = await getStoreageItem("user_token");
      const refreshToken = await getStoreageItem("refresh_token");

      if (accessToken && refreshToken) {
        console.log("Tokens encontrados, redirecionando para /home...");
        router.replace("/home");
      }
    } catch (error) {
      console.error("Erro ao verificar tokens:", error);
      throw error;
    }
  }

  /**
   * Autenticação clássica via credenciais (Email e Senha)
   */
  static async authenticate(
    email: string,
    password: string,
    router: Router,
    setLoading?: (loading: boolean) => void,
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Validação de dados de entrada
    if (!LoginValidator.isEmailValid(email)) {
      return { success: false, error: "E-mail com formato inválido." };
    }

    if (!LoginValidator.isPasswordValid(password)) {
      return { success: false, error: "Senha inválida ou muito curta." };
    }

    const userPayload = {
      name: "User Redider",
      email,
      password,
    };

    try {
      const response = await request({
        urlComplement: "/Auth/rediter",
        method: "POST",
        body: userPayload,
        requireAuth: false,
        setLoading,
      });

      const { refresh, access } = await LoginValidator.ParseTokens(response);

      if (!access || !refresh) {
        return { success: false, error: "Resposta inválida do servidor." };
      }

      await saveTokens(access, refresh);

      router.replace("/home");

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Falha na conexão com o servidor.",
      };
    }
  }
}
