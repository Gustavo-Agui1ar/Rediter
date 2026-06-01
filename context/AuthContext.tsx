import {
    deleteTokens,
    getStoreageItem,
    saveTokens,
} from "@/utils/storage.utils"; // Os métodos que você já tem!
import { jwtDecode } from "jwt-decode";
import {
    createContext,
    startTransition,
    useContext,
    useEffect,
    useState,
} from "react";

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  console.log("AuthProvider renderizado. isAuthenticated:", isAuthenticated);
  console.log("AuthProvider renderizado. isAdmin:", isAdmin);
  console.log("AuthProvider renderizado. isInitializing:", isInitializing);

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

      startTransition(() => {
        console.log("Token processado. Roles:", rolesArray);
        setIsAdmin(rolesArray.includes("SuperAdmin"));
        setIsAuthenticated(true);
      });
    } catch (error) {
      console.error("Token inválido", error);
      logout();
    }
  };

  const login = async (accessToken: string, refreshToken: string) => {
    await saveTokens(accessToken, refreshToken);
    processToken(accessToken);
  };

  const logout = async () => {
    await deleteTokens();
    setIsAdmin(false);
    setIsAuthenticated(false);
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
