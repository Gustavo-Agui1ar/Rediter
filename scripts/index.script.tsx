import {
    GoogleSignin,
    isSuccessResponse,
} from "@react-native-google-signin/google-signin";

import { configs } from "@/utils/configs";
import { LoginValidator } from "@/utils/loginVerify";

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

  static async authenticate(email: string, password: string) {
    if (!LoginValidator.isEmailValid(email)) {
      return { success: false, error: "invalid_email" };
    }

    if (!LoginValidator.isPasswordValid(password)) {
      return { success: false, error: "invalid_password" };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), configs.timeout);

    const user = {
      name: "User Redider",
      email,
      password,
    };

    try {
      const response = await fetch(`${configs.apiUrl}/Auth/Rediter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        signal: controller.signal,
      });

      if (!response.ok) {
        return { success: false, error: "api_error" };
      }

      var { refresh, access } = await LoginValidator.ParseTokens(response);

      return { success: true, refresh, access };
    } catch (error) {
      console.error("Error during authentication:", error);
      return { success: false, error: "network_error" };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
