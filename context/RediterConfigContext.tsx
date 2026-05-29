import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const RAW_GIST_URL =
  "https://gist.githubusercontent.com/Gustavo-Agui1ar/f5b861e40a39f0a0c64284d737730de6/raw/rediter_config.json";
const GOOGLE_CLIENT_ID =
  "573963521901-0tovmn0v1au6ob5dm2uq7q19gm21o144.apps.googleusercontent.com";

interface RediterConfigContextData {
  baseUrl: string;
  signalRUrl: string;
  isLoading: boolean;
  isServerOnline: boolean;
  error: string | null;
  googleClientId: string;
  timeout: number;
  retryConnection: () => Promise<void>;
}

const RediterConfigContext = createContext<RediterConfigContextData>(
  {} as RediterConfigContextData,
);

export const RediterConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isServerOnline, setIsServerOnline] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [googleClientId] = useState<string>(GOOGLE_CLIENT_ID);

  const baseUrlRef = useRef<string>("");
  const timeout = 25000;
  const OFFLINE_POLLING_INTERVAL = 15000;

  // ==========================================================
  // FUNÇÃO DE HEALTH CHECK PURA (Atualizada)
  // ==========================================================
  const checkServerHealth = async (url: string) => {
    if (!url) return false;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${url}/api/health/ping`, {
        signal: controller.signal,
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log(
          `[Health Check] O servidor retornou um erro (Status: ${response.status}). Marcando como offline.`,
        );
        return false;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        console.log(
          `[Health Check] Recebemos HTML em vez da resposta da API. O Ngrok pode estar retornando um erro. Marcando como offline.`,
        );
        return false;
      }

      return true;
    } catch (err) {
      clearTimeout(timeoutId);
      return false;
    }
  };

  const fetchConfigs = useCallback(async () => {
    setIsLoading(true);
    let targetUrl = "http://localhost:6969";

    try {
      const response = await fetch(RAW_GIST_URL, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) throw new Error("Falha ao buscar Gist");

      const config = await response.json();
      targetUrl = config.apiUrl;
      setBaseUrl(targetUrl);
      baseUrlRef.current = targetUrl;

      const isOnline = await checkServerHealth(targetUrl);

      setIsServerOnline(isOnline);

      if (!isOnline) {
        setError("O servidor não respondeu a tempo ou está offline.");
      } else {
        setError(null);
      }
    } catch (err) {
      console.error("Erro no RediterConfigProvider:", err);
      setError("Falha crítica ao inicializar as configurações.");
      setBaseUrl(targetUrl);
      baseUrlRef.current = targetUrl;
      setIsServerOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (!isLoading && !isServerOnline) {
      console.log(
        `📡 [Health Check] Iniciando Auto-Recuperação a cada ${OFFLINE_POLLING_INTERVAL / 1000}s...`,
      );

      intervalId = setInterval(async () => {
        const isOnlineNow = await checkServerHealth(baseUrlRef.current);

        if (isOnlineNow) {
          console.log("✅ [Health Check] O Servidor voltou a responder!");
          setIsServerOnline(true);
          setError(null);
        } else {
          console.log("❌ [Health Check] Servidor ainda offline...");
        }
      }, OFFLINE_POLLING_INTERVAL);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoading, isServerOnline]);

  const retryConnection = async () => {
    await fetchConfigs();
  };

  const signalRUrl = baseUrl ? `${baseUrl}/Hubs/NotificationHub` : "";

  return (
    <RediterConfigContext.Provider
      value={{
        baseUrl,
        signalRUrl,
        isLoading,
        isServerOnline,
        error,
        googleClientId,
        timeout,
        retryConnection,
      }}
    >
      {children}
    </RediterConfigContext.Provider>
  );
};

export const useRediterBaseConfigs = () => {
  const context = useContext(RediterConfigContext);
  if (!context) {
    throw new Error(
      "useRediterBaseConfigs deve ser usado dentro de um RediterConfigProvider",
    );
  }
  return context;
};
