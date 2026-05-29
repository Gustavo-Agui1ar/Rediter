import { useLanguage } from "@/context/LanguageContext";
import { useApi } from "@/utils/request.utils";
import { deleteTokens } from "@/utils/storage.utils";
import { router } from "expo-router";
import { startTransition, useCallback, useState } from "react";

export function useForgotPassword() {
  const { request } = useApi();
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    if (error) {
      startTransition(() => setError(null));
    }
    if (submitted) {
      startTransition(() => setSubmitted(false));
    }
  }, [error, submitted]);

  const handleResetPassword = async (
    password: string,
    confirmPassword: string,
  ) => {
    startTransition(() => {
      setSubmitted(true);
      setError(null);
    });

    if (!password) {
      return;
    }

    if (password !== confirmPassword) {
      startTransition(() => setError(t("validation_passwords_dont_match")));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("password", password);

      await request({
        urlComplement: "/api/users/me",
        method: "PATCH",
        data: formData,
      });

      await deleteTokens();

      startTransition(() => {
        router.replace("/");
      });
    } catch (err) {
      startTransition(() => setError(t("error_reset_password_failed")));
    }
  };

  return {
    state: { submitted, error },
    actions: { handleResetPassword, clearError },
  };
}
