import { useLoading } from "@/context/LoadingContext";
import { useRediterBaseConfigs } from "@/context/RediterConfigContext";
import { api } from "@/utils/api";
import { AxiosError, AxiosRequestConfig } from "axios";
import { startTransition, useCallback, useState } from "react";

export interface RequestOptions extends AxiosRequestConfig {
  urlComplement: string;
  hasLoading?: boolean;
  requireAuth?: boolean;
}

export function useApi() {
  const { loading, setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const { isServerOnline, baseUrl } = useRediterBaseConfigs();

  const request = useCallback(
    async (options: RequestOptions) => {
      const {
        urlComplement,
        hasLoading = true,
        requireAuth = true,
        ...axiosConfig
      } = options;

      if (!isServerOnline) {
        const offlineMsg = "Servidor indisponível no momento.";
        startTransition(() => setError(offlineMsg));
        throw new Error(offlineMsg);
      }

      const startTime = Date.now();

      if (baseUrl && api.defaults.baseURL !== baseUrl) {
        api.defaults.baseURL = baseUrl;
      }

      try {
        startTransition(() => setError(null));
        if (hasLoading) startTransition(() => setLoading(true));

        const isFormData = axiosConfig.data instanceof FormData;

        const customHeaders: Record<string, any> = {
          requireAuth,
          ...axiosConfig.headers,
        };

        if (isFormData) {
          customHeaders["Content-Type"] = "multipart/form-data";
        } else if (axiosConfig.data && !customHeaders["Content-Type"]) {
          customHeaders["Content-Type"] = "application/json";
        }

        const response = await api({
          url: urlComplement,
          ...axiosConfig,
          headers: customHeaders,
          transformRequest: isFormData
            ? (data) => data
            : axiosConfig.transformRequest,
        });

        return response.data;
      } catch (err) {
        let errorMsg = "Ocorreu um erro inesperado.";

        if (err instanceof AxiosError) {
          if (err.code === "ECONNABORTED" || err.message === "Network Error") {
            errorMsg = "A conexão com o servidor expirou ou falhou.";
          } else {
            errorMsg =
              err.response?.data?.message ||
              err.response?.data?.error ||
              err.message;
          }
        } else if (err instanceof Error) {
          errorMsg = err.message;
        }

        startTransition(() => setError(errorMsg));
        throw err;
      } finally {
        if (hasLoading) startTransition(() => setLoading(false));
        const endTime = Date.now();
        console.log(
          `[API Request] ${axiosConfig.method || "GET"} ${urlComplement} - Duration: ${endTime - startTime} ms`,
        );
      }
    },
    [isServerOnline, baseUrl, setLoading],
  );

  return { request, loading, error };
}
