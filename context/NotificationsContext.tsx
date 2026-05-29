import { useRediterBaseConfigs } from "@/context/RediterConfigContext";
import { useApi } from "@/utils/request.utils";
import * as Storage from "@/utils/storage.utils";
import * as signalR from "@microsoft/signalr";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AppState,
  AppStateStatus,
  DeviceEventEmitter,
  Platform,
} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface SignalRContextType {
  connection: signalR.HubConnection | null;
  unreadCount: number;
  latestIncomingNotification: any | null;
  clearUnreadCount: () => void;
  connectSignalR: () => Promise<void>;
  disconnectSignalR: () => Promise<void>;
  registerAndSendPushToken: () => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  unreadCount: 0,
  latestIncomingNotification: null,
  clearUnreadCount: () => {},
  connectSignalR: async () => {},
  disconnectSignalR: async () => {},
  registerAndSendPushToken: async () => {},
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
  const [latestIncomingNotification, setLatestIncomingNotification] = useState<
    any | null
  >(null);
  const { baseUrl, isServerOnline } = useRediterBaseConfigs();
  const appState = useRef(AppState.currentState);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const { request } = useApi();

  useEffect(() => {
    connectionRef.current = connection;
  }, [connection]);

  const registerAndSendPushToken = useCallback(async () => {
    try {
      if (!Device.isDevice) {
        console.log("⚠️ Push Notifications não funcionam no emulador.");
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("❌ Permissão para Push Notifications negada.");
        return;
      }

      const tokenData = await Notifications.getDevicePushTokenAsync();
      const pushToken = tokenData.data;

      console.log("✅ Device Token Nativo gerado:", pushToken);

      await request({
        urlComplement: "/api/users/devices",
        method: "POST",
        data: { deviceToken: pushToken },
        hasLoading: false,
      });
    } catch (error) {
      console.error("❌ Erro ao registrar Push Token:", error);
    }
  }, [request]);

  const fetchInitialUnreadCount = useCallback(async () => {
    try {
      const data = await request({
        urlComplement: "/api/notifications/unread-count",
        method: "GET",
        hasLoading: false,
      });

      const count = typeof data === "number" ? data : data.count || 0;

      startTransition(() => setUnreadCount(count));
    } catch (error) {
      console.error(
        "❌ Erro ao buscar contador inicial de notificações:",
        error,
      );
    }
  }, [request]);

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
        .withUrl(`${baseUrl}/Hubs/NotificationHub`, {
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
  }, [baseUrl]);

  const disconnectSignalR = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.stop();
      setConnection(null);
      startTransition(() => {
        setUnreadCount(0);
        setLatestIncomingNotification(null);
      });
      console.log("🛑 SignalR: Desconectado com segurança.");
    }
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "onTokenRefresh",
      async () => {
        console.log("🔄 Axios atualizou o token! Reconectando SignalR...");

        if (connectionRef.current) {
          if (
            connectionRef.current.state ===
            signalR.HubConnectionState.Disconnected
          ) {
            try {
              await connectionRef.current.start();
              console.log("✅ SignalR reconectado com o novo token!");
              fetchInitialUnreadCount();
            } catch (e) {
              console.error(
                "❌ Falha ao reconectar SignalR após refresh do token:",
                e,
              );
            }
          }
        }
      },
    );

    return () => subscription.remove();
  }, [fetchInitialUnreadCount]);

  const clearUnreadCount = useCallback(() => {
    startTransition(() => {
      setUnreadCount(0);
      setLatestIncomingNotification(null);
    });
  }, []);

  useEffect(() => {
    if (!baseUrl) return;

    if (isServerOnline) {
      connectSignalR();
    } else {
      disconnectSignalR();
    }
  }, [baseUrl, isServerOnline, connectSignalR, disconnectSignalR]);

  useEffect(() => {
    if (connection && isServerOnline) {
      connection
        .start()
        .then(() => {
          console.log("✅ Conectado ao SignalR no App!");
          fetchInitialUnreadCount();
          registerAndSendPushToken();
        })
        .catch((e) => console.log("❌ Erro ao iniciar SignalR: ", e));

      return () => {
        connection.stop();
      };
    }
  }, [
    connection,
    isServerOnline,
    fetchInitialUnreadCount,
    registerAndSendPushToken,
  ]);

  useEffect(() => {
    if (!connection) return;

    const handleGlobalNotification = (notification: any) => {
      console.log(
        "🔔 Notificação capturada globalmente no Contexto:",
        notification.id,
      );

      startTransition(() => {
        setUnreadCount((prev) => prev + 1);
        setLatestIncomingNotification(notification);
      });
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

        if (
          connection.state === signalR.HubConnectionState.Disconnected &&
          isServerOnline
        ) {
          try {
            await connection.start();
            console.log("Reconectado ao SignalR com sucesso!");
            fetchInitialUnreadCount();
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
  }, [connection, isServerOnline, fetchInitialUnreadCount]);

  return (
    <SignalRContext.Provider
      value={{
        connection,
        unreadCount,
        latestIncomingNotification,
        clearUnreadCount,
        connectSignalR,
        disconnectSignalR,
        registerAndSendPushToken,
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};
