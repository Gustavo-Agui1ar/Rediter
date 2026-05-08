import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useState } from "react";

export function useSearchUsers(searchTerm: string) {
  const [users, setUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { request } = useApi();

  const fetchUsers = useCallback(
    async (isMore = false) => {
      if (!searchTerm?.trim()) {
        setUsers([]);
        return;
      }

      if (isMore) {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
      } else {
        setInitialLoading(true);
      }

      try {
        let url = `/api/users/search?query=${encodeURIComponent(searchTerm)}&pageSize=12`;

        if (isMore && users.length > 0) {
          const lastUser = users[users.length - 1];
          url += `&lastCreatedAt=${encodeURIComponent(lastUser.createdAt)}&lastId=${lastUser.id}`;
        }

        const response = await request({ urlComplement: url, method: "GET" });

        if (response.ok) {
          const data = await response.json();

          setUsers((prev) => (isMore ? [...prev, ...data] : data));
          setHasMore(data.length === 12);
        }
      } catch (error) {
        console.error("Erro na busca de usuários:", error);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [searchTerm, users, hasMore, loadingMore, request],
  );

  useEffect(() => {
    setUsers([]);
    setHasMore(true);
    fetchUsers(false);
  }, [searchTerm]);

  return {
    users,
    initialLoading,
    loadingMore,
    loadMore: () => fetchUsers(true),
  };
}
