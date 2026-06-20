import { useApi } from "@/utils/request.utils";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export interface BlockedUserItem {
  userID: string;
  userName: string;
  createdAt: string;
  ownProfile: boolean;
  isFollowing: boolean;
  profileImageName?: string;
  description?: string;
  [key: string]: any;
}

const PAGE_SIZE = 12;

export function useBlockedUsers() {
  const [users, setUsers] = useState<BlockedUserItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { request } = useApi();
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);
  const lastItemRef = useRef<{ id: string; createdAt: string } | null>(null);
  const [error, setError] = useState<string | null>(null); // Guardando o estado de erro

  const fetchBlockedUsers = useCallback(
    async (isMore = false, isRefresh = false) => {
      if (isFetchingRef.current) return;

      startTransition(() => setError(null));

      if (isMore) {
        if (!hasMoreRef.current) return;
        startTransition(() => setLoadingMore(true));
      } else {
        lastItemRef.current = null;
        hasMoreRef.current = true;

        if (!isRefresh) {
          startTransition(() => setInitialLoading(true));
        }
      }

      isFetchingRef.current = true;

      try {
        const params = new URLSearchParams();
        params.append("pageSize", String(PAGE_SIZE));

        if (isMore && lastItemRef.current) {
          params.append("lastCreatedAt", lastItemRef.current.createdAt);
          params.append("lastId", lastItemRef.current.id);
        }

        const url = `/api/users/me/blocked?${params.toString()}`;

        const data: BlockedUserItem[] = await request({
          urlComplement: url,
          method: "GET",
          hasLoading: false,
        });

        const newUsers = Array.isArray(data) ? data : [];

        if (newUsers.length > 0) {
          const last = newUsers[newUsers.length - 1];
          lastItemRef.current = {
            id: last.userID || last.userId,
            createdAt: last.createdAt,
          };
        }

        hasMoreRef.current = newUsers.length >= PAGE_SIZE;

        startTransition(() => {
          setUsers((prev) => {
            if (!isMore) return newUsers;

            const existingIds = new Set(prev.map((u) => u.userID || u.userId));
            const filtered = newUsers.filter(
              (u) => !existingIds.has(u.userID || u.userId),
            );

            return [...prev, ...filtered];
          });
        });
      } catch (error: any) {
        console.error("Erro na busca de usuários bloqueados:", error);

        startTransition(() => {
          setError(
            isMore
              ? "Erro ao carregar mais usuários: " +
                  (error.message || "Erro desconhecido")
              : "Erro ao buscar usuários bloqueados: " +
                  (error.message || "Erro desconhecido"),
          );
        });
      } finally {
        isFetchingRef.current = false;
        startTransition(() => {
          setInitialLoading(false);
          setLoadingMore(false);
        });
      }
    },
    [request],
  );

  const refresh = useCallback(async () => {
    startTransition(() => setError(null));
    await fetchBlockedUsers(false, true);
  }, [fetchBlockedUsers]);

  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  const unblockUserLocally = useCallback(
    async (userIdToUnblock: string) => {
      console.log("ID Recebido para desbloqueio:", userIdToUnblock);
      console.log("URL Montada:", `/api/users/${userIdToUnblock}/unblock`);

      startTransition(() => setError(null));

      startTransition(() => {
        setUsers((prev) =>
          prev.filter(
            (user) => (user.userID || user.userId) !== userIdToUnblock,
          ),
        );
      });

      try {
        await request({
          urlComplement: `/api/users/${userIdToUnblock}/unblock`,
          method: "DELETE",
          hasLoading: false,
        });
      } catch (error: any) {
        console.error("Erro ao desbloquear o usuário:", error);
        startTransition(() => {
          setError(
            "Erro ao desbloquear o usuário: " +
              (error.message || "Erro desconhecido"),
          );
        });
        refresh();
      }
    },
    [request, refresh],
  );

  return {
    error,
    users,
    initialLoading,
    loadingMore,
    hasMore: hasMoreRef.current,
    loadMore: () => fetchBlockedUsers(true),
    refresh,
    unblockUserLocally,
  };
}
