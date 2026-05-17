import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DeviceEventEmitter, Platform } from "react-native";

export interface PostItem {
  id?: string;
  postId?: string;
  createdAt: string;
  userName: string;
  text: string;
  imageProfileUrl: string;
  imageUrls: string[];
  Location?: string;
  location?: string;
  edited: boolean;
}

const PAGE_SIZE = 12;

export const getId = (p: PostItem) => p.postId || p.id;

const mergePosts = (oldPosts: PostItem[], newPosts: PostItem[]) => {
  const ids = new Set(oldPosts.map(getId));

  const filtered = newPosts.filter((p) => !ids.has(getId(p)));

  return [...oldPosts, ...filtered];
};

export function usePosts(
  refresh_id: string,
  userId?: string,
  onlyLiked = false,
) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const { request } = useApi();

  const fetchingRef = useRef(false);

  const lastItemRef = useRef<{
    id: string;
    createdAt: string;
  } | null>(null);

  const fetchPosts = useCallback(
    async (isRefresh = false) => {
      if (fetchingRef.current) {
        return;
      }

      fetchingRef.current = true;

      if (isRefresh) {
        lastItemRef.current = null;
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const searchParams = new URLSearchParams({
          pageSize: String(PAGE_SIZE),
        });

        if (!isRefresh && lastItemRef.current) {
          const { id, createdAt } = lastItemRef.current;

          searchParams.append("lastCreatedAt", createdAt);
          searchParams.append("lastId", id);
        }

        let baseUrl = "";

        if (onlyLiked) {
          baseUrl = "/api/posts/liked";
        } else {
          baseUrl = userId ? `/api/posts/user/${userId}` : "/api/posts/me";
        }

        const url = `${baseUrl}?${searchParams.toString()}`;

        const res = await request({
          urlComplement: url,
          method: "GET",
        });

        if (!res || !res.ok) throw new Error("Erro na requisição");

        const data: PostItem[] = (await res.json()) || [];

        if (data.length > 0) {
          const last = data[data.length - 1];

          lastItemRef.current = {
            id: String(getId(last)),
            createdAt: last.createdAt,
          };
        }

        setPosts((prev) => (isRefresh ? data : mergePosts(prev, data)));

        setHasMore(data.length >= PAGE_SIZE);
      } catch (e: any) {
        console.error("[fetchPosts ERROR]", e?.message);
      } finally {
        fetchingRef.current = false;
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [request, userId, onlyLiked],
  );

  useEffect(() => {
    fetchPosts(true);

    const sub = DeviceEventEmitter.addListener(`${refresh_id}`, () =>
      fetchPosts(true),
    );

    return () => sub.remove();
  }, [fetchPosts, refresh_id]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || fetchingRef.current || initialLoading) {
      return;
    }

    fetchPosts(false);
  }, [hasMore, loadingMore, initialLoading, fetchPosts]);

  return {
    posts,
    initialLoading,
    loadingMore,
    loadMore,
  };
}

interface UsePostsUIProps {
  userId?: string;
  refresh_id: string;
  onlyLiked: boolean;
  headerHeight: number;
  styles: any;
}

export function usePostsUI({
  userId,
  refresh_id,
  onlyLiked,
  headerHeight,
  styles,
}: UsePostsUIProps) {
  const { posts, initialLoading, loadingMore, loadMore } = usePosts(
    refresh_id,
    userId,
    onlyLiked,
  );

  const listRef = useRef<any>(null);

  const skeletons = useMemo(
    () => [
      { _isSkeleton: true, id: "skel-1" },
      { _isSkeleton: true, id: "skel-2" },
      { _isSkeleton: true, id: "skel-3" },
    ],
    [],
  );

  const displayData = initialLoading ? skeletons : posts || [];

  const handleEndReached = useCallback(() => {
    if (!initialLoading && !loadingMore) {
      loadMore();
    }
  }, [initialLoading, loadingMore, loadMore]);

  const keyExtractor = useCallback((item: any, index: number) => {
    if (item._isSkeleton) return item.id;
    const id = getId(item);

    return id ? id.toString() : `post-idx-${index}`;
  }, []);

  const contentContainerStyle = useMemo(() => {
    return [
      styles.listContent,
      { minHeight: "100%" },
      Platform.OS === "android" ? { paddingTop: headerHeight } : undefined,
    ];
  }, [styles.listContent, headerHeight]);

  const contentOffset = useMemo(() => {
    return Platform.OS === "ios" ? { x: 0, y: -headerHeight } : undefined;
  }, [headerHeight]);

  const contentInset = useMemo(() => {
    return Platform.OS === "ios" ? { top: headerHeight } : undefined;
  }, [headerHeight]);

  const scrollToTop = useCallback(() => {
    const listNode = listRef.current?.getNode
      ? listRef.current.getNode()
      : listRef.current;

    if (!listNode) {
      return;
    }

    listNode.scrollToOffset({
      offset: Platform.OS === "ios" ? -headerHeight : 0,
      animated: true,
    });
  }, [headerHeight]);

  return {
    listRef,
    scrollToTop,
    displayData,
    initialLoading,
    loadingMore,
    handleEndReached,
    keyExtractor,
    contentContainerStyle,
    contentOffset,
    contentInset,
  };
}
