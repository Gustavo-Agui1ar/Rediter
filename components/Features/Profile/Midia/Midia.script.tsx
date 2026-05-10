import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter } from "react-native";

interface UseMediaGridProps {
  userProfileId?: string;
  refresh_id: string;
}

export function useMediaGrid({
  userProfileId,
  refresh_id,
}: UseMediaGridProps & { refresh_id: string }) {
  const [data, setData] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const fetchingRef = useRef(false);
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

  useEffect(() => {
    fetchMedia(false);

    const sub = DeviceEventEmitter.addListener(`${refresh_id}`, () => {
      fetchMedia(true);
    });

    return () => sub.remove();
  }, [fetchMedia]);

  const openCarousel = useCallback((index: number) => {
    setInitialIndex(index);
    requestAnimationFrame(() => setModalVisible(true));
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return {
    data,
    isLocalLoading,
    modalVisible,
    initialIndex,
    openCarousel,
    closeModal,
  };
}
