import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

import { LoginValidator } from "@/utils/login.utils";
import { request } from "@/utils/request.utils";
import * as StorageUtils from "@/utils/storage.utils";
import { router } from "expo-router";
import { Alert } from "react-native";

GoogleSignin.configure({
  webClientId:
    "573963521901-0tovmn0v1au6ob5dm2uq7q19gm21o144.apps.googleusercontent.com",
  offlineAccess: true,
});
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export class ScriptIndex {
  static async signInWithGoogle(setLoading?: (loading: boolean) => void) {
    try {
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        var tks = await request({
          urlComplement: "/Auth/Google",
          method: "POST",
          body: { idToken: response.data.idToken },
          setLoading: setLoading,
        });

        const tokens = await LoginValidator.ParseTokens(tks);
        await StorageUtils.saveTokens(tokens.access, tokens.refresh);
        router.replace("/main");
      } else {
        Alert.alert(
          "Erro",
          "Falha ao autenticar com o Google. Tente novamente.",
        );
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  }

  static async checkTokens() {
    const accessToken = await StorageUtils.getStoreageItem("user_token");
    const refreshToken = await StorageUtils.getStoreageItem("refresh_token");
    if (accessToken && refreshToken) {
      console.log("Tokens encontrados, redirecionando para main...");
      setTimeout(() => {
        router.replace("/main");
      }, 0);
    }
  }
  static async authenticate(
    email: string,
    password: string,
    setLoading?: (loading: boolean) => void,
  ) {
    if (!LoginValidator.isEmailValid(email)) {
      return { success: false, error: "invalid_email" };
    }

    const user = {
      name: "User Redider",
      email,
      password,
    };

    try {
      const response = await request({
        urlComplement: "/Auth/Rediter",
        method: "POST",
        body: user,
        setLoading: setLoading,
      });

      if (!response.ok) {
        return { success: false, error: "api_error" };
      }

      var { refresh, access } = await LoginValidator.ParseTokens(response);

      return { success: true, refresh, access };
    } catch (error) {
      console.error("Error during authentication:", error);
      return { success: false, error: "network_error" };
    }
  }
}
