import { useLoading } from "@/context/loadingContext";
import { LoginValidator } from "@/utils/login.utils";
import { request } from "@/utils/request.utils";
import { router } from "expo-router";
import { useState } from "react";

export function useRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorText, setErrorText] = useState("");
  const { setLoading } = useLoading();

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errorText) setErrorText("");
  };

  const handleRegister = async () => {
    const trimmedEmail = form.email.trim().toLowerCase();
    setErrorText("");

    if (!form.name.trim()) {
      return setErrorText("Por favor, insira o seu nome.");
    }

    if (!LoginValidator.isEmailValid(trimmedEmail)) {
      return setErrorText("Por favor, insira um e-mail válido.");
    }

    if (!LoginValidator.doPasswordsMatch(form.password, form.confirmPassword)) {
      return setErrorText("Por favor, insira senhas coincidentes.");
    }

    setLoading(true);
    try {
      const user = {
        name: form.name,
        email: trimmedEmail,
        password: form.password,
      };

      const serverResponse = await request({
        urlComplement: "/User/Register",
        method: "PUT",
        body: user,
        requireAuth: false,
        setLoading,
      });

      if (serverResponse.ok) {
        router.push({
          pathname: "/verify",
          params: { userEmail: trimmedEmail, mode: "register" },
        });
      } else {
        setErrorText(
          "Falha ao registrar usuário. Verifique se o e-mail já existe.",
        );
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        setErrorText("O servidor demorou muito para responder (Timeout).");
      } else {
        setErrorText("Erro de conexão com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    state: { form, errorText },
    actions: { handleInputChange, handleRegister },
  };
}
