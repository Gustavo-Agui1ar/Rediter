import { getStoreageItem, saveTokens } from "@/utils/storage.utils";
import axios, { AxiosError } from "axios";
import { DeviceEventEmitter } from "react-native";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "user_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export const api = axios.create({
  baseURL: "http://localhost:6969",
  timeout: 10000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });
  failedQueue = [];
};

api.interceptors.request.use(async (config) => {
  if (config.headers.requireAuth !== false) {
    const token = await getStoreageItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || !originalRequest) {
      const apiMessage = (error.response?.data as any)?.message;
      if (apiMessage) {
        error.message = apiMessage;
      }
      return Promise.reject(error);
    }

    if ((originalRequest as any)._isRetry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      try {
        const token = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    (originalRequest as any)._isRetry = true;
    isRefreshing = true;

    try {
      const refreshToken = await getStoreageItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) throw new Error("No refresh token");

      const { data } = await axios.post(
        `${api.defaults.baseURL}/api/auth/refresh-token`,
        {
          refreshToken,
        },
        {
          headers: { "ngrok-skip-browser-warning": "true" },
        },
      );

      const newAccess = data.accessToken || data.access;
      const newRefresh = data.refreshToken || data.refresh;

      if (!newAccess) throw new Error("Token payload invalid");

      await saveTokens(newAccess, newRefresh ?? refreshToken);

      DeviceEventEmitter.emit("onTokenRefresh");

      processQueue(null, newAccess);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      DeviceEventEmitter.emit("onSessionExpired");
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
