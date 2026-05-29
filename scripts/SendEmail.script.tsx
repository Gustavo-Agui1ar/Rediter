import { useLanguage } from "@/context/LanguageContext";
import { LoginValidator } from "@/utils/login.utils";
import { useApi } from "@/utils/request.utils";
import { router } from "expo-router";
import { startTransition, useCallback, useState } from "react";

export function useSendEmail() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { request } = useApi();
  const { t } = useLanguage();

  const clearError = useCallback(() => {
    if (serverError) {
      startTransition(() => setServerError(null));
    }
    if (submitted) {
      startTransition(() => setSubmitted(false));
    }
  }, [serverError, submitted]);

  const handleSendCode = async (email: string) => {
    startTransition(() => {
      setSubmitted(true);
      setServerError(null);
    });

    if (!LoginValidator.isEmailValid(email)) {
      return;
    }

    try {
      await request({
        method: "POST",
        urlComplement: "/api/auth/generate-code",
        data: { email },
        requireAuth: false,
      });

      router.push({
        pathname: "/Verify",
        params: { userEmail: email, mode: "reset" },
      });
    } catch (err) {
      startTransition(() => setServerError(t("error_send_code_failed")));
    }
  };

  return {
    state: { submitted, serverError },
    actions: { handleSendCode, clearError },
  };
}
