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
  isSignalRConnected: boolean;
  unreadCount: number;
  latestIncomingNotification: any | null;
  clearUnreadCount: () => void;
  connectSignalR: () => Promise<void>;
  disconnectSignalR: () => Promise<void>;
  registerAndSendPushToken: () => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  isSignalRConnected: false,
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
  const [isSignalRConnected, setIsSignalRConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestIncomingNotification, setLatestIncomingNotification] = useState<
    any | null
  >(null);
  const { baseUrl, isServerOnline } = useRediterBaseConfigs();
  const appState = useRef(AppState.currentState);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const { request } = useApi();
  const requestRef = useRef(request);

  useEffect(() => {
    requestRef.current = request;
  }, [request]);

  const registerAndSendPushToken = useCallback(async () => {
    try {
      if (!Device.isDevice) return;

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

      if (finalStatus !== "granted") return;

      const tokenData = await Notifications.getDevicePushTokenAsync();
      const pushToken = tokenData.data;

      await requestRef.current({
        urlComplement: "/api/users/devices",
        method: "POST",
        data: { deviceToken: pushToken },
        hasLoading: false,
      });
    } catch (error) {
      console.error("❌ Erro ao registrar Push Token:", error);
    }
  }, []);

  const fetchInitialUnreadCount = useCallback(async () => {
    try {
      const data = await requestRef.current({
        urlComplement: "/api/notifications/unread-count",
        method: "GET",
        hasLoading: false,
      });

      const count = typeof data === "number" ? data : data.count || 0;
      startTransition(() => setUnreadCount(count));
    } catch (error) {
      console.error("❌ Erro ao buscar contador inicial:", error);
    }
  }, []);

  const disconnectSignalR = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.stop();
      setConnection(null);
      connectionRef.current = null;
      startTransition(() => {
        setIsSignalRConnected(false);
        setUnreadCount(0);
        setLatestIncomingNotification(null);
      });
      console.log("🛑 SignalR: Desconectado com segurança.");
    }
  }, []);

  const connectSignalR = useCallback(async () => {
    try {
      const jwtToken = await Storage.getStoreageItem("user_token");

      if (!jwtToken) return;

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
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .build();

      newConnection.onreconnecting((error) => {
        console.warn("⚠️ SignalR reconectando...", error);
        startTransition(() => setIsSignalRConnected(false));
      });

      newConnection.onreconnected((connectionId) => {
        console.log(`✅ Reconectado! ID: ${connectionId}`);
        startTransition(() => setIsSignalRConnected(true));
        fetchInitialUnreadCount();
      });

      newConnection.onclose(async (error) => {
        console.error("🛑 SignalR desconectado.", error);
        startTransition(() => setIsSignalRConnected(false));
      });

      connectionRef.current = newConnection;

      await newConnection.start();
      console.log("✅ Conectado ao SignalR no App!");

      setConnection(newConnection);
      startTransition(() => setIsSignalRConnected(true));

      fetchInitialUnreadCount();
      registerAndSendPushToken();
    } catch (error) {
      console.error("🔴 SignalR: Erro ao inicializar conexão:", error);
    }
  }, [baseUrl, fetchInitialUnreadCount, registerAndSendPushToken]);

  useEffect(() => {
    if (!baseUrl) return;

    if (isServerOnline) {
      connectSignalR();
    } else {
      disconnectSignalR();
    }

    return () => {
      disconnectSignalR();
    };
  }, [baseUrl, isServerOnline, connectSignalR, disconnectSignalR]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "onTokenRefresh",
      async () => {
        console.log("🔄 Axios atualizou o token! Reconectando SignalR...");
        if (
          connectionRef.current?.state ===
          signalR.HubConnectionState.Disconnected
        ) {
          try {
            await connectionRef.current.start();
            startTransition(() => setIsSignalRConnected(true));
            fetchInitialUnreadCount();
          } catch (e) {
            console.error("❌ Falha ao reconectar SignalR:", e);
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
    if (!connection) return;

    const handleGlobalNotification = (notification: any) => {
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
        if (
          connection.state === signalR.HubConnectionState.Disconnected &&
          isServerOnline
        ) {
          try {
            await connection.start();
            startTransition(() => setIsSignalRConnected(true));
            fetchInitialUnreadCount();
          } catch (e) {
            console.error("Erro ao reconectar após voltar pro app: ", e);
          }
        }
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        if (connection.state === signalR.HubConnectionState.Connected) {
          await connection.stop();
          startTransition(() => setIsSignalRConnected(false));
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [connection, isServerOnline, fetchInitialUnreadCount]);

  return (
    <SignalRContext.Provider
      value={{
        connection,
        isSignalRConnected,
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
