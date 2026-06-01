import { useApi } from "@/utils/request.utils";
import { useFocusEffect } from "expo-router";
import { startTransition, useCallback, useRef, useState } from "react";

export interface UserChatDTO {
  chatId: string;
  targetUserId: string;
  titleChat: string;
  targetUserImage?: string | null;
  lastMessageContent: string;
  lastUpdatedAt: string;
  unreadCount?: number;
}

const PAGE_SIZE = 20;

export function useChatsList() {
  const [chats, setChats] = useState<UserChatDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const oldestChatRef = useRef<{ id: string; updatedAt: string } | null>(null);

  const { request } = useApi();

  const loadChats = useCallback(
    async (isLoadMore = false, isRefresh = false) => {
      if (isFetchingRef.current) return;

      if (isRefresh) {
        startTransition(() => setIsRefreshing(true));
        hasMoreRef.current = true;
        oldestChatRef.current = null;
      } else if (isLoadMore) {
        if (!hasMoreRef.current) return;
        startTransition(() => setIsLoadingMore(true));
      } else {
        startTransition(() => setIsLoading(true));
      }

      isFetchingRef.current = true;

      try {
        const params = new URLSearchParams({
          pageSize: String(PAGE_SIZE),
        });

        if (isLoadMore && oldestChatRef.current) {
          params.append("lastUpdatedAt", oldestChatRef.current.updatedAt);
          params.append("lastId", oldestChatRef.current.id);
        }

        const data: UserChatDTO[] = await request({
          urlComplement: `/api/chats?${params.toString()}`,
          method: "GET",
          hasLoading: false,
        });

        const newChats = Array.isArray(data) ? data : [];

        if (newChats.length > 0) {
          const oldest = newChats[newChats.length - 1];
          oldestChatRef.current = {
            id: oldest.chatId,
            updatedAt: oldest.lastUpdatedAt,
          };
        }

        hasMoreRef.current = newChats.length === PAGE_SIZE;

        startTransition(() => {
          setChats((prev) => {
            if (isRefresh || (!isLoadMore && prev.length === 0))
              return newChats;
            return isLoadMore ? [...prev, ...newChats] : newChats;
          });
        });
      } catch (error) {
        console.error("Falha ao carregar lista de chats:", error);
        hasMoreRef.current = false;
      } finally {
        isFetchingRef.current = false;
        startTransition(() => {
          setIsLoading(false);
          setIsRefreshing(false);
          setIsLoadingMore(false);
        });
      }
    },
    [request],
  );

  useFocusEffect(
    useCallback(() => {
      loadChats();

      return () => {};
    }, [loadChats]),
  );

  const refreshChats = () => loadChats(false, true);

  return {
    chats,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore: hasMoreRef.current,
    loadChats,
    refreshChats,
  };
}
