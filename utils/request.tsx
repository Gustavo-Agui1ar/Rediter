import { deleteTokens, getStoreageItem, saveTokens } from "@/utils/storage";
import { router } from "expo-router";
import { configs } from "./configs";

interface RequestOptions {
  urlComplement: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  setLoading?: (loading: boolean) => void;
  signal?: AbortSignal;
  multipart?: boolean;
  _isRetry?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = await getStoreageItem("refresh_token");
      if (!refreshToken) return null;

      for (const baseUrl of configs.apiUrls) {
        try {
          const response = await fetch(`${baseUrl}/Auth/RefreshToken`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(refreshToken),
          });

          if (response.ok) {
            const result = await response.json();

            const newAccess = result.accessToken || result.access;
            const newRefresh = result.refreshToken || result.refresh;

            await saveTokens(newAccess, newRefresh);
            return newAccess;
          }
        } catch (err) {
          console.log(`Falhou o refresh em ${baseUrl}, tentando próximo...`);
        }
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      isRefreshing = false;
    }
  })();

  return refreshPromise;
}

export async function request({
  urlComplement,
  method,
  body,
  headers = {},
  signal,
  setLoading,
  _isRetry = false,
}: RequestOptions) {
  const isFormData = body instanceof FormData;
  let access_token = await getStoreageItem("user_token");

  const optionsBase: RequestInit = {
    method,
    signal,
    headers: { ...headers, Authorization: `Bearer ${access_token}` },
  };

  if (body && method !== "GET") {
    if (isFormData) {
      optionsBase.body = body;
    } else {
      optionsBase.body = JSON.stringify(body);
      optionsBase.headers = {
        ...optionsBase.headers,
        "Content-Type": "application/json",
      };
    }
  }

  let lastError: any;

  try {
    if (!_isRetry) setLoading?.(true);

    for (const baseUrl of configs.apiUrls) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), configs.timeout);

      try {
        const url = `${baseUrl}${urlComplement}`;
        let response = await fetch(url, {
          ...optionsBase,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log(
          `Requisição para ${url} retornou status ${response.status}`,
        );

        if (response.status === 401 && !_isRetry) {
          console.log("Token expirado! Tentando atualizar...");

          const newToken = await refreshAccessToken();

          if (newToken) {
            console.log(
              "Token atualizado com sucesso. Refazendo requisição original...",
            );

            return await request({
              urlComplement,
              method,
              body,
              headers,
              signal,
              _isRetry: true,
            });
          } else {
            router.replace("/");

            await deleteTokens();
            throw new Error("Sessão expirada. Faça login novamente.");
          }
        }
        // ----------------------------------------

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response;
      } catch (err: any) {
        clearTimeout(timeoutId);
        lastError = err;
        if (err.message.includes("Sessão expirada")) throw err;

        console.log(`Falhou em ${baseUrl}, tentando próximo...`);
      }
    }

    throw lastError;
  } finally {
    if (!_isRetry) setLoading?.(false);
  }
}
