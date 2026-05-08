import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { DeviceEventEmitter } from "react-native";

interface UseMediaGridProps {
  userProfileId?: string;
  isMyProfile: boolean;
}

export function useMediaGrid({
  userProfileId,
  isMyProfile,
}: UseMediaGridProps) {
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
        if (!isMyProfile && !userProfileId) return;

        const endpoint = isMyProfile
          ? `/api/posts/me/media`
          : `/api/posts/${userProfileId}/media`;

        const response = await request({
          urlComplement: endpoint,
          method: "GET",
          requireAuth: isMyProfile,
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
    [isMyProfile, userProfileId, request],
  );

  useEffect(() => {
    fetchMedia(false);

    const sub = DeviceEventEmitter.addListener("refresh_media", () => {
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
