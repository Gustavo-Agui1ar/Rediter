import * as Storage from "@/utils/storage.utils";
import { getStoreageItem, saveTokens } from "@/utils/storage.utils";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = async () => {
    try {
      await Storage.deleteInfoUser();
    } catch (error) {
      console.error("Erro ao limpar dados do usuário", error);
    } finally {
      setIsAdmin(false);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "onSessionExpired",
      async () => {
        await logout();

        router.replace("/");
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await getStoreageItem("user_token");
        if (token) {
          processToken(token);
        }
      } catch (e) {
        console.error("Erro ao ler token no boot", e);
      } finally {
        setIsInitializing(false);
      }
    };

    loadSession();
  }, []);

  const processToken = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      console.log("🚀 Payload do JWT:", decoded);

      const roleClaim =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || decoded.role;

      const rolesArray = Array.isArray(roleClaim) ? roleClaim : [roleClaim];

      console.log("Token processado. Roles:", rolesArray);

      setIsAdmin(rolesArray.includes("SuperAdmin"));
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token inválido", error);
      logout();
    }
  };

  const login = async (accessToken: string, refreshToken: string) => {
    await saveTokens(accessToken, refreshToken);
    processToken(accessToken);
  };

  return (
    <AuthContext.Provider
      value={{ isAdmin, isAuthenticated, isInitializing, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
