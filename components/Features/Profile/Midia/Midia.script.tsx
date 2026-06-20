import { useApi } from "@/utils/request.utils";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DeviceEventEmitter, FlatList } from "react-native";

export interface UseMediaGridProps {
  userProfileId?: string;
  refresh_id: string;
  shouldFetch?: boolean;
}

export function useMediaGrid({
  userProfileId,
  refresh_id,
  shouldFetch = true,
}: UseMediaGridProps) {
  const { request } = useApi();
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchingRef = useRef(false);
  const initialFetchDone = useRef(false);
  const listRef = useRef<any>(null);
  const modalListRef = useRef<FlatList>(null);

  const endpoint = useMemo(() => {
    return userProfileId == null
      ? "/api/posts/me/media"
      : `/api/posts/user/${userProfileId}/media`;
  }, [userProfileId]);

  const requireAuth = userProfileId == null;

  const fetchMedia = useCallback(
    async (showLoader = true) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      if (showLoader) {
        startTransition(() => setLoading(true));
      }

      try {
        const responseData = await request({
          urlComplement: endpoint,
          method: "GET",
          requireAuth,
          hasLoading: false,
        });

        startTransition(() => {
          setData(Array.isArray(responseData) ? responseData : []);
        });
      } catch (error) {
        console.error("Erro ao buscar mídia da grid:", error);
        startTransition(() => setData([]));
      } finally {
        fetchingRef.current = false;
        startTransition(() => setLoading(false));
      }
    },
    [endpoint, requireAuth, request],
  );

  const openModal = useCallback((index: number) => {
    setSelectedIndex(index);
    startTransition(() => {
      setModalVisible(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const scrollToTop = useCallback(() => {
    try {
      const listNode = listRef.current?.getNode?.() || listRef.current;
      listNode?.scrollToOffset?.({ offset: 0, animated: true });
    } catch {}
  }, []);

  useEffect(() => {
    if (shouldFetch && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchMedia();
    }
  }, [shouldFetch, fetchMedia]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(refresh_id, () => {
      fetchMedia(false);
    });

    return () => sub.remove();
  }, [fetchMedia, refresh_id]);

  return {
    data,
    loading,
    modalVisible,
    selectedIndex,
    listRef,
    modalListRef,
    fetchMedia,
    openModal,
    closeModal,
    scrollToTop,
  };
}

export interface UseMediaGridUIProps extends UseMediaGridProps {
  styles: any;
}

// 2. Hook responsável por formatar os dados para a interface visual
export function useMediaGridUI({
  userProfileId,
  refresh_id,
  shouldFetch = true,
  styles,
}: UseMediaGridUIProps) {
  const {
    data,
    loading,
    modalVisible,
    selectedIndex,
    listRef,
    modalListRef,
    openModal,
    closeModal,
  } = useMediaGrid({ userProfileId, refresh_id, shouldFetch });

  // Lógica de Skeleton transferida do componente para cá
  const displayData = useMemo(() => {
    if (!loading) return data;
    return Array.from({ length: 12 }, (_, i) => `skeleton-${i}`);
  }, [data, loading]);

  const keyExtractor = useCallback((item: any, index: number) => {
    if (typeof item === "string" && item.startsWith("skeleton")) return item;
    return `media-${index}`;
  }, []);

  const contentContainerStyle = useMemo(
    () => [
      styles.listContainer,
      {
        flexGrow: 1,
        paddingBottom: 80,
      },
    ],
    [styles.listContainer],
  );

  return {
    data,
    listRef,
    modalListRef,
    displayData,
    loading,
    modalVisible,
    selectedIndex,
    keyExtractor,
    contentContainerStyle,
    openModal,
    closeModal,
  };
}
