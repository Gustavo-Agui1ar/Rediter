import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter, FlatList } from "react-native";

interface UseMediaGridProps {
  userProfileId?: string;
  refresh_id: string;
  headerHeight?: number;
}

export function useMediaGrid({
  userProfileId,
  refresh_id,
  headerHeight = 0,
}: UseMediaGridProps) {
  const [data, setData] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const fetchingRef = useRef(false);
  const modalListRef = useRef<FlatList>(null);
  const listRef = useRef<any>(null);
  const { request } = useApi();

  const fetchMedia = useCallback(
    async (isRefresh = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      if (!isRefresh) setIsLocalLoading(true);

      try {
        const endpoint =
          userProfileId === null || userProfileId === undefined
            ? `/api/posts/me/media`
            : `/api/posts/user/${userProfileId}/media`;

        const response = await request({
          urlComplement: endpoint,
          method: "GET",
          requireAuth: userProfileId === null || userProfileId === undefined,
        });

        if (response.ok) {
          const json = await response.json();
          setData(json || []);
        } else {
          setData([]);
        }
      } catch {
        setData([]);
      } finally {
        fetchingRef.current = false;
        setIsLocalLoading(false);
      }
    },
    [userProfileId, request],
  );

  const openCarousel = useCallback((index: number) => {
    setInitialIndex(index);
    requestAnimationFrame(() => setModalVisible(true));
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  useEffect(() => {
    fetchMedia(false);

    const sub = DeviceEventEmitter.addListener(`${refresh_id}`, () => {
      fetchMedia(true);
    });

    return () => sub.remove();
  }, [fetchMedia, refresh_id]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      `scrollToTop_${refresh_id}`,
      () => {
        setTimeout(() => {
          if (!listRef.current) return;

          listRef.current.scrollToOffset({
            offset: 0,
            animated: false,
          });
        }, 30);
      },
    );

    return () => subscription.remove();
  }, [refresh_id, headerHeight]);

  return {
    state: {
      data,
      isLocalLoading,
      modalVisible,
      initialIndex,
    },
    refs: {
      listRef,
      modalListRef,
    },
    actions: {
      openCarousel,
      closeModal,
    },
  };
}
