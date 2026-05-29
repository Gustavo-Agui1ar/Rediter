import { LoginValidator } from "@/utils/login.utils";
import { useApi } from "@/utils/request.utils";
import { router } from "expo-router";
import { startTransition, useCallback, useState } from "react";

export function useRegister() {
  const [errorText, setErrorText] = useState("");
  const { request } = useApi();

  const clearError = useCallback(() => {
    if (errorText) {
      startTransition(() => setErrorText(""));
    }
  }, [errorText]);

  const handleRegister = async (
    name: string,
    email: string,
    pass: string,
    confirmPass: string,
  ) => {
    const trimmedEmail = email.trim().toLowerCase();

    startTransition(() => setErrorText(""));

    if (!name.trim()) {
      startTransition(() => setErrorText("Por favor, insira o seu nome."));
      return;
    }

    if (!LoginValidator.isEmailValid(trimmedEmail)) {
      startTransition(() =>
        setErrorText("Por favor, insira um e-mail válido."),
      );
      return;
    }

    if (!LoginValidator.doPasswordsMatch(pass, confirmPass)) {
      startTransition(() =>
        setErrorText("Por favor, insira senhas coincidentes."),
      );
      return;
    }

    try {
      const user = {
        name: name.trim(),
        email: trimmedEmail,
        password: pass,
      };

      await request({
        urlComplement: "/api/users",
        method: "POST",
        data: user,
        requireAuth: false,
      });

      router.push({
        pathname: "/Verify",
        params: { userEmail: trimmedEmail, mode: "register" },
      });
    } catch (error: any) {
      let errorMessage =
        "Falha ao registrar usuário. Verifique se o e-mail já existe.";

      if (
        error?.code === "ECONNABORTED" ||
        error?.message?.toLowerCase().includes("timeout")
      ) {
        errorMessage = "O servidor demorou muito para responder (Timeout).";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      startTransition(() => setErrorText(errorMessage));
    }
  };

  return {
    state: { errorText },
    actions: { handleRegister, clearError },
  };
}
