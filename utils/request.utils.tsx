import { useLoading } from "@/context/loadingContext";
import {
  deleteTokens,
  getStoreageItem,
  saveTokens,
} from "@/utils/storage.utils";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { configs, getBaseURL } from "./configs.utils";
import { writeLog } from "./logger.utils";

// ============================================================================
// CONSTANTES & TIPAGENS
// ============================================================================
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
// ESTADO GLOBAL DE AUTENTICAÇÃO
// ============================================================================
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// ============================================================================
// AUXILIARES
// ============================================================================
async function buildRequestOptions(
  options: RequestOptions,
): Promise<RequestInit> {
  const { method, body, headers = {}, signal, requireAuth = true } = options;
  const isFormData = body instanceof FormData;
  const requestHeaders = new Headers(headers);

  if (requireAuth) {
    const accessToken = await getStoreageItem(STORAGE_KEYS.ACCESS_TOKEN);
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

  await writeLog(`[HTTP ERROR] ${response.status} ${url} -> ${errorMessage}`);
  console.error(`[HTTP ERROR] ${response.status} ${url} -> ${errorMessage}`);
  throw new ApiError(errorMessage, response.status);
}

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    await writeLog("[AUTH] Refresh já em andamento");
    console.log("[AUTH] Refresh já em andamento, aguardando resultado...");
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      await writeLog("[AUTH] Iniciando refresh token");
      console.log("[AUTH] Iniciando refresh token...");
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
        return newAccess;
      }
      return null;
    } catch (error) {
      console.error("[AUTH] Erro ao atualizar token:", error);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ============================================================================
// O USE API
// ============================================================================
export function useApi() {
  const { loading, setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (options: RequestOptions): Promise<Response> => {
      const {
        urlComplement,
        method,
        body,
        _isRetry = false,
        hasLoading = true,
      } = options;
      const url = `${getBaseURL()}${urlComplement}`;

      try {
        if (!_isRetry) {
          if (hasLoading) setLoading(true);
          setError(null);
        }

        const requestInit = await buildRequestOptions(options);

        await writeLog(`[REQUEST] ${method} ${url}`);
        console.log(`[REQUEST] ${method} ${url}`);
        const response = await fetchWithTimeout(
          url,
          requestInit,
          configs.timeout,
        );
        await writeLog(`[RESPONSE] ${response.status} ${url}`);

        if (response.status === 401 && !_isRetry) {
          await writeLog("[AUTH] Token expirado, tentando atualizar...");
          console.log("[AUTH] Token expirado, tentando atualizar...");
          const newToken = await refreshAccessToken();

          if (newToken) {
            return await request({ ...options, _isRetry: true });
          } else {
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
        await writeLog(
          `[REQUEST ERROR] ${method} ${urlComplement} -> ${errorMsg}`,
        );
        console.error(
          `[REQUEST ERROR] ${method} ${urlComplement} -> ${errorMsg}`,
        );

        setError(errorMsg);

        if (errorMsg.includes("Sessão expirada")) {
          throw err;
        }
        throw err;
      } finally {
        if (!_isRetry) {
          setLoading(false);
        }
      }
    },
    [],
  );

  return { request, loading, error };
}
