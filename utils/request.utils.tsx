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
// CACHE EM MEMÓRIA
// ============================================================================
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
let cachedAccessToken: string | null = null;

export const clearTokenCache = () => {
  cachedAccessToken = null;
};

async function getAccessTokenOptimized(): Promise<string | null> {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  const t0 = performance.now();
  cachedAccessToken = await getStoreageItem(STORAGE_KEYS.ACCESS_TOKEN);
  return cachedAccessToken;
}

async function buildRequestOptions(
  options: RequestOptions,
): Promise<RequestInit> {
  const { method, body, headers = {}, signal, requireAuth = true } = options;
  const isFormData = body instanceof FormData;
  const requestHeaders = new Headers(headers);

  if (requireAuth) {
    const accessToken = await getAccessTokenOptimized();
    if (accessToken) {
      requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const requestInit: RequestInit = {
    method,
    signal,
    headers: requestHeaders,
  };

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

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleApiError(response: Response, url: string): Promise<never> {
  let errorMessage = `HTTP ${response.status} - ${response.statusText}`;
  const textResponse = await response.text();

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

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = await getStoreageItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) return null;

      const refreshUrl = `${getBaseURL()}/api/auth/refresh-token`;
      const response = await fetch(refreshUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(refreshToken),
      });

      if (response.ok) {
        const result = await response.json();
        const newAccess = result.accessToken || result.access;
        const newRefresh = result.refreshToken || result.refresh;

        await saveTokens(newAccess, newRefresh);
        cachedAccessToken = newAccess;
        return newAccess;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ============================================================================
// O USE API OTIMIZADO (COM LOGS DE TEMPO)
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

      const startInteraction = performance.now();
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

        if (response.status === 401 && !_isRetry) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            return await request({ ...options, _isRetry: true });
          } else {
            clearTokenCache();
            await deleteTokens();
            router.replace("/");
            throw new ApiError("Sessão expirada. Faça login novamente.", 401);
          }
        }

        if (!response.ok) {
          await handleApiError(response, url);
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
          `🏁 [API FIM] Tempo TOTAL da operação: ${(performance.now() - startTotal).toFixed(2)}ms\n`,
        );
      }
    },
    [setLoading],
  );

  return { request, loading, error };
}
