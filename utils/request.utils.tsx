import {
  deleteTokens,
  getStoreageItem,
  saveTokens,
} from "@/utils/storage.utils";
import { router } from "expo-router";
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
  setLoading?: (loading: boolean) => void;
  signal?: AbortSignal;
  multipart?: boolean;
  requireAuth?: boolean;
  _isRetry?: boolean;
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
// FUNÇÕES AUXILIARES DO REQUEST
// ============================================================================

/**
 * Constrói as opções da requisição (Headers e Body)
 */
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

/**
 * Executa o fetch com suporte a timeout via AbortController
 */
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
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Lida com respostas de erro padronizando as mensagens em uma classe customizada
 */
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

  throw new ApiError(errorMessage, response.status);
}

// ============================================================================
// LÓGICA DE REFRESH TOKEN
// ============================================================================

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    await writeLog("[AUTH] Refresh já em andamento");
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      await writeLog("[AUTH] Iniciando refresh token");
      const refreshToken = await getStoreageItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        await writeLog("[AUTH] Refresh token inexistente");
        return null;
      }

      const refreshUrl = `${getBaseURL()}/Auth/refresh-token`;
      await writeLog(`[AUTH] POST ${refreshUrl}`);

      const response = await fetch(refreshUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(refreshToken),
      });

      await writeLog(`[AUTH] Refresh retornou status ${response.status}`);

      if (response.ok) {
        const result = await response.json();
        const newAccess = result.accessToken || result.access;
        const newRefresh = result.refreshToken || result.refresh;

        await saveTokens(newAccess, newRefresh);
        await writeLog("[AUTH] Tokens atualizados com sucesso");
        return newAccess;
      }

      const errorText = await response.text();
      await writeLog(`[AUTH] Refresh falhou: ${errorText}`);
      return null;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Desconhecido";
      await writeLog(`[AUTH] Erro inesperado refresh: ${msg}`);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Função principal para realizar requisições à API do Rediter, com suporte a autenticação, refresh token automático, timeout e logging detalhado.
 * @param options Configurações da requisição, incluindo URL complementar, método HTTP, corpo, headers, função de loading e sinal de abort.
 * @returns A resposta da requisição, ou lança um erro customizado em caso de falha.
 * @throws ApiError com mensagens padronizadas para erros HTTP, ou erros de rede.
 */
export async function request(options: RequestOptions): Promise<Response> {
  const { urlComplement, method, body, setLoading, _isRetry = false } = options;
  const url = `${getBaseURL()}${urlComplement}`;

  try {
    if (!_isRetry) setLoading?.(true);

    const requestInit = await buildRequestOptions(options);

    await writeLog(`[REQUEST] ${method} ${url}`);
    if (body) {
      const isFormData = body instanceof FormData;
      await writeLog(
        `[REQUEST BODY] ${isFormData ? "[FormData]" : JSON.stringify(body)}`,
      );
    }

    const response = await fetchWithTimeout(url, requestInit, configs.timeout);
    await writeLog(`[RESPONSE] ${response.status} ${url}`);

    if (response.status === 401 && !_isRetry) {
      await writeLog("[AUTH] Token expirado, tentando atualizar...");
      console.log("Token expirado! Tentando atualizar...");

      const newToken = await refreshAccessToken();

      if (newToken) {
        await writeLog(
          "[AUTH] Token atualizado, reexecutando requisição original",
        );
        return await request({ ...options, _isRetry: true });
      } else {
        await writeLog("[AUTH] Sessão expirada");
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

    await writeLog(`[REQUEST ERROR] ${method} ${urlComplement} -> ${errorMsg}`);

    if (errorMsg.includes("Sessão expirada")) {
      throw err;
    }

    console.log(`Falhou em ${getBaseURL()} com erro: ${errorMsg}`);
    throw err;
  } finally {
    if (!_isRetry) {
      setLoading?.(false);
    }
  }
}
