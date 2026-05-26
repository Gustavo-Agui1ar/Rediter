import { useSignalR } from "@/context/NotificationsContext";
import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useRef, useState } from "react";

export interface NotificacaoProps {
  id: string;
  recipientUserId: string;
  senderUsername: string;
  postId: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const PAGE_SIZE = 15;

export function useNotifications() {
  const [notificationsList, setNotificationsList] = useState<
    NotificacaoProps[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [lastCreatedAt, setLastCreatedAt] = useState<string | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { latestIncomingNotification, clearUnreadCount } = useSignalR();
  const { request } = useApi();

  const loadNotifications = useCallback(
    async (fromRefresh = false, fromScroll = false) => {
      if (fromRefresh) {
        setIsRefreshing(true);
        setHasMore(true);
      } else if (fromScroll) {
        if (!hasMore || isLoadingMore) return;
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        let url = `/api/notifications?pageSize=${PAGE_SIZE}`;
        if (!fromRefresh && lastCreatedAt && lastId) {
          url += `&lastCreatedAt=${lastCreatedAt}&lastId=${lastId}`;
        }

        const response = await request({
          urlComplement: url,
          method: "GET",
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error("Erro ao buscar dados");

        const data: NotificacaoProps[] = await response.json();

        if (fromRefresh || (!fromRefresh && !fromScroll)) {
          setNotificationsList(data);
          clearUnreadCount();

          if (data.length > 0) {
            setLastCreatedAt(data[data.length - 1].createdAt);
            setLastId(data[data.length - 1].id);
          }
        } else if (fromScroll) {
          setNotificationsList((prev) => {
            const idsExistentes = new Set(prev.map((item) => item.id));
            const novosItens = data.filter(
              (item) => !idsExistentes.has(item.id),
            );

            return [...prev, ...novosItens];
          });
          if (data.length > 0) {
            setLastCreatedAt(data[data.length - 1].createdAt);
            setLastId(data[data.length - 1].id);
          }
        }

        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Erro ao carregar notificações da API:", error);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [lastCreatedAt, lastId, hasMore, isLoadingMore, request, clearUnreadCount],
  );

  const handleMarkAsRead = useCallback(
    (id: string, postId: string) => {
      setNotificationsList((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif,
        ),
      );

      request({
        urlComplement: `/api/notifications/${id}/read`,
        method: "PUT",
        hasLoading: false,
      }).catch((error) => {
        console.error("Erro ao marcar como lida no servidor:", error);

        setNotificationsList((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, isRead: false } : notif,
          ),
        );
      });
    },
    [request],
  );

  const onRefresh = useCallback(() => {
    loadNotifications(true, false);
  }, [loadNotifications]);

  const handleLoadMore = useCallback(() => {
    loadNotifications(false, true);
  }, [loadNotifications]);

  useEffect(() => {
    loadNotifications();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (latestIncomingNotification) {
      setNotificationsList((prev) => {
        const jaExiste = prev.some(
          (notif) => notif.id === latestIncomingNotification.id,
        );

        if (jaExiste) {
          return prev;
        }

        return [latestIncomingNotification, ...prev];
      });
    }
  }, [latestIncomingNotification]);

  return {
    notificationsList,
    isLoading,
    isRefreshing,
    isLoadingMore,
    onRefresh,
    handleLoadMore,
    handleMarkAsRead,
  };
}
