import { useLoading } from "@/context/loadingContext";
import {
  deleteTokens,
  getStoreageItem,
  saveTokens,
} from "@/utils/storage.utils";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { InteractionManager } from "react-native";
import { configs, getBaseURL } from "./configs.utils";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "user_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export interface RequestOptions {
  urlComplement: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
  multipart?: boolean;
  requireAuth?: boolean;
  _isRetry?: boolean;
  hasLoading?: boolean;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ============================================================================
// CACHE GLOBAL E FILA DE CONCORRÊNCIA
// ============================================================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];
let cachedAccessToken: string | null = null;

export const clearTokenCache = () => {
  cachedAccessToken = null;
};

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ============================================================================
// TOKEN
// ============================================================================

async function getAccessTokenOptimized(): Promise<string | null> {
  if (isRefreshing) {
    try {
      const refreshedToken = await new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
      return refreshedToken;
    } catch (error) {
      return null;
    }
  }

  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  cachedAccessToken = await getStoreageItem(STORAGE_KEYS.ACCESS_TOKEN);
  return cachedAccessToken;
}

// ============================================================================
// REFRESH TOKEN (Apenas responsável por chamar a API)
// ============================================================================
async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await getStoreageItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      return null;
    }

    const refreshUrl = `${getBaseURL()}/api/auth/refresh-token`;
    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return null;
    }

    let result: any;
    try {
      result = JSON.parse(responseText);
    } catch (err) {
      return null;
    }

    const newAccess = result.accessToken || result.access;
    const newRefresh = result.refreshToken || result.refresh;

    if (!newAccess) {
      return null;
    }

    await saveTokens(newAccess, newRefresh ?? refreshToken);
    cachedAccessToken = newAccess;

    return newAccess;
  } catch (err) {
    return null;
  }
}

// ============================================================================
// REQUEST OPTIONS & TIMEOUT (Sem alterações)
// ============================================================================
async function buildRequestOptions(
  options: RequestOptions,
): Promise<RequestInit> {
  const { method, body, headers = {}, signal, requireAuth = true } = options;
  const isFormData = body instanceof FormData;
  const requestHeaders = new Headers(headers);

  // AUTH
  if (requireAuth) {
    const accessToken = await getAccessTokenOptimized();
    if (accessToken) {
      requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    } else {
    }
  }

  const requestInit: RequestInit = {
    method,
    signal,
    headers: requestHeaders,
  };

  // BODY
  if (body && method !== "GET") {
    if (isFormData) {
      requestInit.body = body;
    } else {
      requestInit.body = JSON.stringify(body);
      if (!requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
      }
    }
  }

  return requestInit;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> {
  const controller = new AbortController();
  const userSignal = options.signal;

  if (userSignal) {
    userSignal.addEventListener("abort", () => controller.abort(), {
      once: true,
    });
  }

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleApiError(response: Response): Promise<never> {
  let errorMessage = `HTTP ${response.status} - ${response.statusText}`;
  const textResponse = await response.text();

  console.log("❌ API ERROR RESPONSE:", textResponse);

  if (textResponse) {
    try {
      const data = JSON.parse(textResponse);
      errorMessage = data.message || data.error || JSON.stringify(data);
    } catch {
      errorMessage = textResponse;
    }
  }

  throw new ApiError(errorMessage, response.status);
}

// ============================================================================
// USE API
// ============================================================================
export function useApi() {
  const { loading, setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (options: RequestOptions): Promise<Response> => {
      const startTotal = performance.now();
      const {
        urlComplement,
        method,
        _isRetry = false,
        hasLoading = true,
      } = options;

      const url = `${getBaseURL()}${urlComplement}`;

      console.log(`🚀 [API INÍCIO] ${method} ${urlComplement}`);

      await new Promise<void>((resolve) =>
        InteractionManager.runAfterInteractions(() => resolve()),
      );

      try {
        if (!_isRetry) {
          setError(null);
          if (hasLoading) {
            requestAnimationFrame(() => setLoading(true));
          }
        }

        const requestInit = await buildRequestOptions(options);
        const response = await fetchWithTimeout(
          url,
          requestInit,
          configs.timeout,
        );

        // ==========================================================
        // TOKEN EXPIROU (401)
        // ==========================================================
        if (response.status === 401 && !_isRetry) {
          console.log("🔄 Token expirado (401 detectado)");

          if (isRefreshing) {
            try {
              const token = await new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              });

              return await request({
                ...options,
                _isRetry: true,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${token}`,
                },
              });
            } catch (err) {
              throw new ApiError(
                "Sessão expirada enquanto aguardava fila.",
                401,
              );
            }
          }

          isRefreshing = true;

          const newToken = await refreshAccessToken();

          if (newToken) {
            processQueue(null, newToken); // Avisa todo mundo da fila que deu bom!
            isRefreshing = false; // Destrava a cancela global

            return await request({
              ...options,
              _isRetry: true,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
              },
            });
          }

          console.log("❌ Refresh falhou na raiz. Derrubando sessão...");
          processQueue(new Error("Refresh failed")); // Avisa todo mundo da fila que deu ruim
          isRefreshing = false;

          clearTokenCache();
          await deleteTokens();
          router.replace("/");

          throw new ApiError("Sessão expirada. Faça login novamente.", 401);
        }

        if (!response.ok) {
          console.log("❌ Response não OK");
          await handleApiError(response);
        }

        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        throw err;
      } finally {
        if (!_isRetry) {
          requestAnimationFrame(() => setLoading(false));
        }

        console.log(
          `🏁 [API FIM] Tempo TOTAL: ${(performance.now() - startTotal).toFixed(2)}ms\n`,
        );
      }
    },
    [setLoading],
  );

  return {
    request,
    loading,
    error,
  };
}
