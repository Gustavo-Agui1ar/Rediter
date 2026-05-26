import { useCallback, useEffect, useState } from "react";

export interface MensagemProps {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export function useChat(targetUserId: string, currentUserId: string) {
  const [messages, setMessages] = useState<MensagemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ==========================================
  // CARREGAR MENSAGENS (MOCK)
  // ==========================================
  const loadMessages = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) {
        if (!hasMore || isLoadingMore) return;
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      // Simula o tempo de rede (delay de 800ms)
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!isLoadMore) {
        // Primeira carga: gera 10 mensagens iniciais falsas
        const initialMessages: MensagemProps[] = Array.from({ length: 10 }).map(
          (_, i) => ({
            id: `mock-init-${i}`,
            senderId: i % 2 === 0 ? currentUserId : targetUserId, // Alterna entre você e a outra pessoa
            recipientId: i % 2 === 0 ? targetUserId : currentUserId,
            content: `Mensagem de teste ${i + 1} para ver o layout do chat funcionando.`,
            createdAt: new Date(Date.now() - i * 60000).toISOString(), // Subtrai minutos para criar histórico
            isRead: true,
          }),
        );

        setMessages(initialMessages);
      } else {
        // Paginação: gera mais 5 mensagens antigas quando rolar pra cima
        const olderMessages: MensagemProps[] = Array.from({ length: 5 }).map(
          (_, i) => ({
            id: `mock-old-${Date.now()}-${i}`,
            senderId: targetUserId,
            recipientId: currentUserId,
            content: `Mensagem antiga carregada na paginação ${i + 1}...`,
            createdAt: new Date(
              Date.now() - (messages.length + i) * 600000,
            ).toISOString(),
            isRead: true,
          }),
        );

        setMessages((prev) => [...prev, ...olderMessages]);

        // Simula que o histórico acabou após a primeira paginação
        setHasMore(false);
      }

      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [hasMore, isLoadingMore, currentUserId, targetUserId, messages.length],
  );

  // Carrega ao abrir a tela
  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId]);

  // ==========================================
  // ENVIAR MENSAGEM (MOCK)
  // ==========================================
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Cria a mensagem temporária na hora (Optimistic UI)
    const tempId = `temp-${Date.now()}`;
    const novaMensagem: MensagemProps = {
      id: tempId,
      senderId: currentUserId,
      recipientId: targetUserId,
      content: text,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => [novaMensagem, ...prev]);

    // 2. Simula o tempo de ir até o C# e voltar (600ms de delay)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 3. Substitui o ID temporário por um ID "oficial do banco"
    const savedMessage = { ...novaMensagem, id: `guid-falso-${Date.now()}` };
    setMessages((prev) =>
      prev.map((m) => (m.id === tempId ? savedMessage : m)),
    );

    // 4. BÔNUS: Simula o SignalR (A outra pessoa respondendo 2 segundos depois)
    setTimeout(() => {
      const respostaAutomatica: MensagemProps = {
        id: `mock-reply-${Date.now()}`,
        senderId: targetUserId,
        recipientId: currentUserId,
        content:
          "Ei! Esta é uma resposta automática do Mock pra você testar o balão recebido. 🤖",
        createdAt: new Date().toISOString(),
        isRead: true,
      };

      setMessages((prev) => [respostaAutomatica, ...prev]);
    }, 2000);
  };

  return {
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMessages,
    sendMessage,
  };
}
