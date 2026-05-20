import { useApi } from "@/utils/request.utils";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DeviceEventEmitter, FlatList } from "react-native";

interface UseMediaGridProps {
  userProfileId?: string;
  refresh_id: string;
}

export function useMediaGrid({ userProfileId, refresh_id }: UseMediaGridProps) {
  const { request } = useApi();

  const [data, setData] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchingRef = useRef(false);

  const listRef = useRef<FlatList>(null);

  const modalListRef = useRef<FlatList>(null);

  const endpoint = useMemo(() => {
    return userProfileId == null
      ? "/api/posts/me/media"
      : `/api/posts/user/${userProfileId}/media`;
  }, [userProfileId]);

  const requireAuth = userProfileId == null;

  const fetchMedia = useCallback(
    async (showLoader = true) => {
      if (fetchingRef.current) {
        return;
      }

      fetchingRef.current = true;

      if (showLoader) {
        setLoading(true);
      }

      try {
        const response = await request({
          urlComplement: endpoint,
          method: "GET",
          requireAuth,
        });

        if (!response.ok) {
          setData([]);
          return;
        }

        const json = await response.json();

        setData(Array.isArray(json) ? json : []);
      } catch {
        setData([]);
      } finally {
        fetchingRef.current = false;
        setLoading(false);
      }
    },
    [endpoint, requireAuth, request],
  );

  const openModal = useCallback((index: number) => {
    setSelectedIndex(index);

    requestAnimationFrame(() => {
      setModalVisible(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const scrollToTop = useCallback(() => {
    try {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    } catch {}
  }, []);

  useEffect(() => {
    fetchMedia();

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
