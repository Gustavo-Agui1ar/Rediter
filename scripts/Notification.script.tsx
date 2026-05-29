import { useSignalR } from "@/context/NotificationsContext";
import { useApi } from "@/utils/request.utils";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
  const hasMoreRef = useRef<boolean>(true);
  const isFetchingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastItemRef = useRef<{ createdAt: string; id: string } | null>(null);
  const { latestIncomingNotification, clearUnreadCount } = useSignalR();
  const { request } = useApi();

  const loadNotifications = useCallback(
    async (fromRefresh = false, fromScroll = false) => {
      if (isFetchingRef.current) return;

      if (fromRefresh) {
        startTransition(() => setIsRefreshing(true));
        hasMoreRef.current = true;
        lastItemRef.current = null;
      } else if (fromScroll) {
        if (!hasMoreRef.current) return;
        startTransition(() => setIsLoadingMore(true));
      } else {
        startTransition(() => setIsLoading(true));
      }

      isFetchingRef.current = true;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const params = new URLSearchParams();
        params.append("pageSize", String(PAGE_SIZE));

        if (!fromRefresh && lastItemRef.current) {
          params.append("lastCreatedAt", lastItemRef.current.createdAt);
          params.append("lastId", lastItemRef.current.id);
        }

        const url = `/api/notifications?${params.toString()}`;

        const data: NotificacaoProps[] = await request({
          urlComplement: url,
          method: "GET",
          signal: abortControllerRef.current.signal,
          hasLoading: false,
        });

        const newNotifications = Array.isArray(data) ? data : [];

        startTransition(() => {
          if (fromRefresh || (!fromRefresh && !fromScroll)) {
            setNotificationsList(newNotifications);
            clearUnreadCount();
          } else if (fromScroll) {
            setNotificationsList((prev) => {
              const idsExistentes = new Set(prev.map((item) => item.id));
              const novosItens = newNotifications.filter(
                (item) => !idsExistentes.has(item.id),
              );
              return [...prev, ...novosItens];
            });
          }

          if (newNotifications.length > 0) {
            const lastItem = newNotifications[newNotifications.length - 1];
            lastItemRef.current = {
              createdAt: lastItem.createdAt,
              id: lastItem.id,
            };
          }

          if (newNotifications.length < PAGE_SIZE) {
            hasMoreRef.current = false;
          }
        });
      } catch (error: any) {
        if (error.name !== "AbortError" && error.code !== "ERR_CANCELED") {
          console.error("Erro ao carregar notificações da API:", error);
        }
      } finally {
        isFetchingRef.current = false;
        startTransition(() => {
          setIsLoading(false);
          setIsRefreshing(false);
          setIsLoadingMore(false);
        });
      }
    },
    [request, clearUnreadCount],
  );

  const handleMarkAsRead = useCallback(
    (id: string, postId: string) => {
      startTransition(() => {
        setNotificationsList((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif,
          ),
        );
      });

      request({
        urlComplement: `/api/notifications/${id}/read`,
        method: "PUT",
        hasLoading: false,
      }).catch((error) => {
        console.error("Erro ao marcar como lida no servidor:", error);

        startTransition(() => {
          setNotificationsList((prev) =>
            prev.map((notif) =>
              notif.id === id ? { ...notif, isRead: false } : notif,
            ),
          );
        });
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
  }, [loadNotifications]);

  useEffect(() => {
    if (latestIncomingNotification) {
      startTransition(() => {
        setNotificationsList((prev) => {
          const jaExiste = prev.some(
            (notif) => notif.id === latestIncomingNotification.id,
          );

          if (jaExiste) {
            return prev;
          }

          return [latestIncomingNotification, ...prev];
        });
      });
    }
  }, [latestIncomingNotification]);

  return {
    notificationsList,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore: hasMoreRef.current,
    onRefresh,
    handleLoadMore,
    handleMarkAsRead,
  };
}
