import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter } from "react-native";

interface User {
  userID: string;
  userName?: string;
  profileImageName?: string;
  createdAt: string;
  description?: string;
  [key: string]: any;
}

interface Cursor {
  lastCreatedAt: string;
  lastId: string;
}

export const useBlockedUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);
  const PAGE_SIZE = 12;
  const { request } = useApi();

  const fetchBlockedUsers = useCallback(
    async (cursor?: Cursor, isRefresh = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const queryParams = new URLSearchParams({
          pageSize: PAGE_SIZE.toString(),
        });

        if (cursor) {
          queryParams.append("lastCreatedAt", cursor.lastCreatedAt);
          queryParams.append("lastId", cursor.lastId);
        }

        const startTime = new Date();

        console.log("tempo inicial de busca:", startTime.toISOString());

        const response = await request({
          method: "GET",
          urlComplement: `/api/users/me/blocked?${queryParams.toString()}`,
        });

        const endTime = new Date();

        console.log("duração:", endTime.getTime() - startTime.getTime(), "ms");
        if (!response.ok)
          throw new Error("Falha ao buscar usuários bloqueados.");

        const rawData = await response.json();
        const newData: User[] = Array.isArray(rawData)
          ? rawData
          : rawData.data || rawData.items || [];

        setUsers((prevUsers) => {
          if (!cursor || isRefresh) return newData;

          const existingIds = new Set(prevUsers.map((u) => u.userID));
          const filteredNewData = newData.filter(
            (u) => !existingIds.has(u.userID),
          );

          return [...prevUsers, ...filteredNewData];
        });

        setHasMore(newData.length === PAGE_SIZE);
      } catch (error) {
        console.error("Erro ao buscar usuários bloqueados:", error);
      } finally {
        isFetchingRef.current = false;
      }
    },
    [request],
  );

  const unblockUserLocally = useCallback((targetId: string | number) => {
    const normalizedTargetId = String(targetId).toLowerCase();

    setUsers((currentUsers) =>
      currentUsers.filter((user) => {
        const possibleIds = [user.userID, user.userId].map((id) =>
          id ? String(id).toLowerCase() : "",
        );
        return !possibleIds.includes(normalizedTargetId);
      }),
    );
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "updateBlockedUsers",
      (payload: any) => {
        const idToRemove =
          typeof payload === "string" ? payload : payload?.targetId;
        const actionType =
          typeof payload === "string" ? "unblock" : payload?.action;

        if (idToRemove && actionType === "unblock") {
          unblockUserLocally(idToRemove);
        }
      },
    );

    return () => subscription.remove();
  }, [fetchBlockedUsers, unblockUserLocally]);

  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      await fetchBlockedUsers();
      setInitialLoading(false);
    };
    loadInitialData();
  }, [fetchBlockedUsers]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || users.length === 0 || isFetchingRef.current)
      return;

    setLoadingMore(true);
    const lastUser = users[users.length - 1];

    await fetchBlockedUsers({
      lastCreatedAt: lastUser.createdAt,
      lastId: lastUser.userID,
    });

    setLoadingMore(false);
  }, [loadingMore, hasMore, users, fetchBlockedUsers]);

  return {
    users,
    initialLoading,
    loadingMore,
    loadMore,
    unblockUserLocally,
  };
};
