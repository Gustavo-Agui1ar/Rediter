import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

import { LoginValidator } from "@/utils/loginVerify";
import { request } from "@/utils/request";
import * as StorageUtils from "@/utils/storage";
import { router } from "expo-router";

GoogleSignin.configure({
  webClientId:
    "573963521901-0tovmn0v1au6ob5dm2uq7q19gm21o144.apps.googleusercontent.com",
  offlineAccess: true,
});
export class ScriptIndex {
  static async signInWithGoogle() {
    try {
      const userInfo = await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        console.log("Google Sign-In successful:", response.data);
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
      router.push("/main"); // TODO terminar segurança e validação dos tokens: se o tempo do acesstokem tiver expirado, usar o refresh token para obter um novo access token. Se o refresh token também tiver expirado, redirecionar para a tela de login.
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
