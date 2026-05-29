import { useApi } from "@/utils/request.utils";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export interface SearchUserItem {
  id: string;
  createdAt: string;
  [key: string]: any;
}

const PAGE_SIZE = 12;

export function useSearchUsers(searchTerm: string) {
  const [users, setUsers] = useState<SearchUserItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { request } = useApi();
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);
  const lastItemRef = useRef<{ id: string; createdAt: string } | null>(null);

  const fetchUsers = useCallback(
    async (isMore = false, currentTerm: string) => {
      if (!currentTerm?.trim()) {
        startTransition(() => {
          setUsers([]);
          setInitialLoading(false);
        });
        hasMoreRef.current = false;
        return;
      }

      if (isFetchingRef.current) return;

      if (isMore) {
        if (!hasMoreRef.current) return;
        startTransition(() => setLoadingMore(true));
      } else {
        lastItemRef.current = null;
        hasMoreRef.current = true;
        startTransition(() => setInitialLoading(true));
      }

      isFetchingRef.current = true;

      try {
        const params = new URLSearchParams();
        params.append("query", currentTerm);
        params.append("pageSize", String(PAGE_SIZE));

        if (isMore && lastItemRef.current) {
          params.append("lastCreatedAt", lastItemRef.current.createdAt);
          params.append("lastId", lastItemRef.current.id);
        }

        const url = `/api/users/search?${params.toString()}`;

        const data: SearchUserItem[] = await request({
          urlComplement: url,
          method: "GET",
          hasLoading: false,
        });

        const newUsers = Array.isArray(data) ? data : [];

        if (newUsers.length > 0) {
          const last = newUsers[newUsers.length - 1];
          lastItemRef.current = {
            id: last.id,
            createdAt: last.createdAt,
          };
        }

        hasMoreRef.current = newUsers.length >= PAGE_SIZE;

        startTransition(() => {
          setUsers((prev) => {
            if (!isMore) return newUsers;

            const existingIds = new Set(prev.map((u) => u.id));
            const filtered = newUsers.filter((u) => !existingIds.has(u.id));

            return [...prev, ...filtered];
          });
        });
      } catch (error) {
        console.error("Erro na busca de usuários:", error);
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

  useEffect(() => {
    if (!searchTerm || !searchTerm.trim()) {
      startTransition(() => {
        setUsers([]);
      });
      hasMoreRef.current = false;
      lastItemRef.current = null;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchUsers(false, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchUsers]);

  return {
    users,
    initialLoading,
    loadingMore,
    hasMore: hasMoreRef.current,
    loadMore: () => fetchUsers(true, searchTerm),
  };
}
