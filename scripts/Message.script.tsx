import { useSignalR } from "@/context/NotificationsContext";
import { useApi } from "@/utils/request.utils";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export interface MessageDTO {
  messageId: string;
  isMine: boolean;
  content: string;
  createdAt: string;
}

interface UseChatOptions {
  chatId?: string | null;
  receiverId?: string | null;
  isDirect?: boolean;
}

const PAGE_SIZE = 50;

const sanitizeId = (id?: string | null) => {
  if (!id || id === "null" || id === "undefined") return null;
  return id;
};

export function useChat({
  chatId = null,
  receiverId = null,
  isDirect = false,
}: UseChatOptions) {
  const [activeChatId, setActiveChatId] = useState<string | null>(
    sanitizeId(chatId),
  );
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const oldestMessageRef = useRef<{ id: string; createdAt: string } | null>(
    null,
  );

  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { request } = useApi();
  const { connection } = useSignalR();

  useEffect(() => {
    setActiveChatId(sanitizeId(chatId));
  }, [chatId]);

  useEffect(() => {
    if (!connection || !activeChatId) return;

    connection.invoke("JoinChatGroup", activeChatId).catch(console.error);

    const onReceiveTyping = (incomingChatId: string, isTyping: boolean) => {
      if (incomingChatId.toLowerCase() !== activeChatId.toLowerCase()) return;
      startTransition(() => setIsOtherTyping(isTyping));
    };

    const onReceiveMessage = (
      incomingChatId: string,
      novaMensagem: MessageDTO,
    ) => {
      if (incomingChatId.toLowerCase() !== activeChatId.toLowerCase()) return;
      startTransition(() => {
        setMessages((prev) => {
          if (prev.some((m) => m.messageId === novaMensagem.messageId))
            return prev;
          return [novaMensagem, ...prev];
        });
        setIsOtherTyping(false);
      });
    };

    connection.on("ReceiveTyping", onReceiveTyping);
    connection.on("ReceiveMessage", onReceiveMessage);

    return () => {
      connection.off("ReceiveTyping", onReceiveTyping);
      connection.off("ReceiveMessage", onReceiveMessage);
    };
  }, [connection, activeChatId]);

  const loadMessages = useCallback(
    async (isLoadMore = false) => {
      if (!activeChatId) {
        startTransition(() => setIsLoading(false));
        return;
      }

      if (isFetchingRef.current) return;

      if (isLoadMore) {
        if (!hasMoreRef.current) return;
        startTransition(() => setIsLoadingMore(true));
      } else {
        hasMoreRef.current = true;
        oldestMessageRef.current = null;
        startTransition(() => setIsLoading(true));
      }

      isFetchingRef.current = true;

      try {
        const params = new URLSearchParams({
          pageSize: String(PAGE_SIZE),
        });

        if (isLoadMore && oldestMessageRef.current) {
          params.append("lastCreatedAt", oldestMessageRef.current.createdAt);
          params.append("lastId", oldestMessageRef.current.id);
        }

        const data: MessageDTO[] = await request({
          urlComplement: `/api/chats/${activeChatId}/messages?${params.toString()}`,
          method: "GET",
          hasLoading: false,
        });

        const newMessages = Array.isArray(data) ? data : [];

        if (newMessages.length > 0) {
          const oldest = newMessages[newMessages.length - 1];
          oldestMessageRef.current = {
            id: oldest.messageId,
            createdAt: oldest.createdAt,
          };
        }

        hasMoreRef.current = newMessages.length === PAGE_SIZE;

        startTransition(() => {
          setMessages((prev) =>
            isLoadMore ? [...prev, ...newMessages] : newMessages,
          );
        });
      } catch (error) {
        console.error("Falha ao carregar o chat:", error);
        hasMoreRef.current = false;
      } finally {
        isFetchingRef.current = false;
        startTransition(() => {
          setIsLoading(false);
          setIsLoadingMore(false);
        });
      }
    },
    [activeChatId, request],
  );

  useEffect(() => {
    if (!activeChatId) {
      startTransition(() => {
        setIsLoading(false);
      });
      return;
    }
    loadMessages();
  }, [activeChatId, loadMessages]);

  const notifyTyping = useCallback(() => {
    if (!connection || !activeChatId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      connection.invoke("SendTyping", activeChatId, true).catch(console.error);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      connection.invoke("SendTyping", activeChatId, false).catch(console.error);
    }, 2000);
  }, [activeChatId, connection]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      if (!activeChatId && !(isDirect && receiverId)) {
        console.error(
          "É necessário um chatId ou um receiverId para enviar a mensagem.",
        );
        return;
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (isTypingRef.current && connection && activeChatId) {
        isTypingRef.current = false;
        connection
          .invoke("SendTyping", activeChatId, false)
          .catch(console.error);
      }

      const tempId = `temp-${Date.now()}`;
      const novaMensagem: MessageDTO = {
        messageId: tempId,
        isMine: true,
        content: text,
        createdAt: new Date().toISOString(),
      };

      startTransition(() => {
        setMessages((prev) => [novaMensagem, ...prev]);
      });

      try {
        let responseData: any = null;

        if (activeChatId) {
          responseData = await request({
            urlComplement: `/api/chats/${activeChatId}/messages`,
            method: "POST",
            data: { content: text },
            hasLoading: false,
          });
        } else if (isDirect && receiverId) {
          responseData = await request({
            urlComplement: `/api/chats/direct/${receiverId}`,
            method: "POST",
            data: { content: text },
            hasLoading: false,
          });

          if (responseData && responseData.chatId) {
            startTransition(() => setActiveChatId(responseData.chatId));
          }
        }

        if (responseData) {
          const realId = responseData.messageId || responseData.id;
          const realCreatedAt = responseData.createdAt;

          startTransition(() => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.messageId === tempId
                  ? {
                      ...msg,
                      messageId: realId || msg.messageId,
                      createdAt: realCreatedAt || msg.createdAt,
                    }
                  : msg,
              ),
            );
          });
        }
      } catch (error) {
        console.error("Erro no envio:", error);
        startTransition(() => {
          setMessages((prev) => prev.filter((m) => m.messageId !== tempId));
        });
        alert("Falha ao enviar mensagem. Tente novamente.");
      }
    },
    [activeChatId, isDirect, receiverId, request, connection],
  );

  return {
    activeChatId,
    messages,
    isLoading,
    isLoadingMore,
    hasMore: hasMoreRef.current,
    isOtherTyping,
    loadMessages,
    sendMessage,
    notifyTyping,
  };
}
