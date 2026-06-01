import { useApi } from "@/utils/request.utils";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export interface SearchedUserDTO {
  userID: string;
  userName: string;
  description?: string | null;
  profileImageName?: string | null;
  createdAt: string;
}

export function useSearchUsers() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchedUserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { request } = useApi();
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchUsers = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        startTransition(() => setUsers([]));
        return;
      }

      startTransition(() => setIsLoading(true));

      try {
        const params = new URLSearchParams({
          query: searchQuery,
          pageSize: "20",
        });

        const data: SearchedUserDTO[] = await request({
          urlComplement: `/api/users/search?${params.toString()}`, // Ajuste para a rota exata do seu Controller
          method: "GET",
          hasLoading: false,
        });

        startTransition(() => setUsers(data || []));
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        startTransition(() => setIsLoading(false));
      }
    },
    [request],
  );

  // Efeito de Debounce
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      searchUsers(query);
    }, 500); // Aguarda 500ms após a última digitação

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query, searchUsers]);

  return { query, setQuery, users, isLoading };
}
