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

export function useChat({
  chatId = null,
  receiverId = null,
  isDirect = false,
}: UseChatOptions) {
  const [activeChatId, setActiveChatId] = useState<string | null>(chatId);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { request } = useApi();
  const fetchingRef = useRef(false);
  const oldestMessageRef = useRef<{ id: string; createdAt: string } | null>(
    null,
  );

  useEffect(() => {
    if (chatId) setActiveChatId(chatId);
  }, [chatId]);

  const loadMessages = useCallback(
    async (isLoadMore = false) => {
      if (!activeChatId) {
        startTransition(() => setIsLoading(false));
        return;
      }

      if (fetchingRef.current) return;
      if (isLoadMore && (!hasMore || isLoadingMore)) return;

      fetchingRef.current = true;

      startTransition(() => {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          oldestMessageRef.current = null;
        }
      });

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

        startTransition(() => {
          setMessages((prev) =>
            isLoadMore ? [...prev, ...newMessages] : newMessages,
          );
          setHasMore(newMessages.length === PAGE_SIZE);
        });
      } catch (error) {
        console.error("Falha ao carregar o chat:", error);
      } finally {
        fetchingRef.current = false;
        startTransition(() => {
          setIsLoading(false);
          setIsLoadingMore(false);
        });
      }
    },
    [activeChatId, hasMore, isLoadingMore, request],
  );

  useEffect(() => {
    startTransition(() => {
      setMessages([]);
      setHasMore(true);
    });
    oldestMessageRef.current = null;

    if (activeChatId) {
      loadMessages();
    }
  }, [activeChatId, loadMessages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (!activeChatId && !(isDirect && receiverId)) {
      console.error(
        "É necessário um chatId ou um receiverId para enviar a mensagem.",
      );
      return;
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

      /* * PRO-TIP (Opcional): Se a sua API C# estiver retornando o DTO da mensagem real
       * no POST, é aqui que você substitui o tempId pelo ID definitivo no estado:
       * * if (responseData && responseData.messageId) {
       * setMessages(prev => prev.map(m => m.messageId === tempId ? responseData : m));
       * }
       */
    } catch (error) {
      console.error("Erro no envio:", error);
      startTransition(() => {
        setMessages((prev) => prev.filter((m) => m.messageId !== tempId));
      });
      alert("Falha ao enviar mensagem. Tente novamente.");
    }
  };

  return {
    activeChatId,
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMessages,
    sendMessage,
  };
}
