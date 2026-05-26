import React, { createContext, useContext, useEffect, useState } from "react";

const RAW_GIST_URL =
  "https://gist.githubusercontent.com/Gustavo-Agui1ar/f5b861e40a39f0a0c64284d737730de6/raw/af353f2f67a48ff24a16898c0dac79630109288d/rediter_config.json";
const PROD_BASE_URL = "http://159.112.185.202:6969";
const GOOGLE_CLIENT_ID =
  "573963521901-0tovmn0v1au6ob5dm2uq7q19gm21o144.apps.googleusercontent.com";
const IS_PRODUCTION = false;

interface RediterConfigContextData {
  baseUrl: string;
  signalRUrl: string;
  isLoading: boolean;
  error: string | null;
  googleClientId: string;
  timeout: number;
}

const RediterConfigContext = createContext<RediterConfigContextData>(
  {} as RediterConfigContextData,
);

export const RediterConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [googleClientId] = useState<string>(GOOGLE_CLIENT_ID);
  const timeout = 20000;

  useEffect(() => {
    const fetchConfigs = async () => {
      if (IS_PRODUCTION) {
        setBaseUrl(PROD_BASE_URL);
        setIsLoading(false);
        return;
      }

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
        setBaseUrl(config.apiUrl);
      } catch (err) {
        console.error("Erro no RediterConfigProvider:", err);
        setError("Não foi possível conectar ao servidor de desenvolvimento.");
        setBaseUrl("http://localhost:6969");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  const signalRUrl = baseUrl ? `${baseUrl}/Hubs/NotificationHub` : "";

  if (isLoading) {
    return null;
  }

  return (
    <RediterConfigContext.Provider
      value={{ baseUrl, signalRUrl, isLoading, error, googleClientId, timeout }}
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
