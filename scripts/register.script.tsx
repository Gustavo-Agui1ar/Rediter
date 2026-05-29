import { LoginValidator } from "@/utils/login.utils";
import { useApi } from "@/utils/request.utils";
import { router } from "expo-router";
import { startTransition, useState } from "react";

export function useRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorText, setErrorText] = useState("");
  const { request } = useApi();

  const handleInputChange = (field: keyof typeof form, value: string) => {
    startTransition(() => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errorText) setErrorText("");
    });
  };

  const handleRegister = async () => {
    const trimmedEmail = form.email.trim().toLowerCase();

    startTransition(() => setErrorText(""));

    if (!form.name.trim()) {
      startTransition(() => setErrorText("Por favor, insira o seu nome."));
      return;
    }

    if (!LoginValidator.isEmailValid(trimmedEmail)) {
      startTransition(() =>
        setErrorText("Por favor, insira um e-mail válido."),
      );
      return;
    }

    if (!LoginValidator.doPasswordsMatch(form.password, form.confirmPassword)) {
      startTransition(() =>
        setErrorText("Por favor, insira senhas coincidentes."),
      );
      return;
    }

    try {
      const user = {
        name: form.name,
        email: trimmedEmail,
        password: form.password,
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
    state: { form, errorText },
    actions: { handleInputChange, handleRegister },
  };
}
