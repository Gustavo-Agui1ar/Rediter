import { configs } from "@/utils/configs.utils";
import * as Storage from "@/utils/storage.utils";
import * as signalR from "@microsoft/signalr";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";

interface SignalRContextType {
  connection: signalR.HubConnection | null;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  connectSignalR: () => Promise<void>;
  disconnectSignalR: () => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  unreadCount: 0,
  setUnreadCount: () => {},
  notifications: [],
  setNotifications: () => {},
  connectSignalR: async () => {},
  disconnectSignalR: async () => {},
});

export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const appState = useRef(AppState.currentState);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    connectionRef.current = connection;
  }, [connection]);

  const connectSignalR = useCallback(async () => {
    try {
      const jwtToken = await Storage.getStoreageItem("user_token");

      if (!jwtToken) {
        console.warn("⚠️ SignalR: Conexão abortada (Token não encontrado).");
        return;
      }

      if (connectionRef.current) {
        await connectionRef.current.stop();
      }

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(configs.SIGNALR_URL[0], {
          accessTokenFactory: async () => {
            const token = await Storage.getStoreageItem("user_token");
            return token || "";
          },
        })
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    } catch (error) {
      console.error("🔴 SignalR: Erro ao inicializar conexão:", error);
    }
  }, []);

  const disconnectSignalR = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.stop();
      setConnection(null);
      setUnreadCount(0);
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    connectSignalR();
  }, [connectSignalR]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => console.log("✅ Conectado ao SignalR no App!"))
        .catch((e) => console.log("❌ Erro na conexão SignalR: ", e));

      return () => {
        connection.stop();
      };
    }
  }, [connection]);

  useEffect(() => {
    if (!connection) return;

    const handleGlobalNotification = (notification: any) => {
      console.log(
        "🔔 Notificação capturada globalmente no Contexto:",
        notification.id,
      );

      setUnreadCount((prev) => prev + 1);

      setNotifications((prev) => [notification, ...prev]);
    };

    connection.off("ReceiveNotification", handleGlobalNotification);
    connection.on("ReceiveNotification", handleGlobalNotification);

    return () => {
      connection.off("ReceiveNotification", handleGlobalNotification);
    };
  }, [connection]);

  useEffect(() => {
    if (!connection) return;

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App em primeiro plano. Verificando conexão do SignalR...");
        if (connection.state === signalR.HubConnectionState.Disconnected) {
          try {
            await connection.start();
            console.log("Reconectado ao SignalR com sucesso!");
          } catch (e) {
            console.error("Erro ao reconectar após voltar pro app: ", e);
          }
        }
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log(
          "App em segundo plano. Desconectando SignalR para poupar bateria...",
        );
        if (connection.state === signalR.HubConnectionState.Connected) {
          await connection.stop();
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [connection]);

  return (
    <SignalRContext.Provider
      value={{
        connection,
        unreadCount,
        setUnreadCount,
        notifications,
        setNotifications,
        connectSignalR,
        disconnectSignalR,
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};
