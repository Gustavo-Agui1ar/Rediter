import { useApi } from "@/utils/request.utils";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DeviceEventEmitter } from "react-native";

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

const SKELETONS = [
  { _isSkeleton: true, id: "skel-1" },
  { _isSkeleton: true, id: "skel-2" },
  { _isSkeleton: true, id: "skel-3" },
];

export const getId = (p: PostItem) => p.postId || p.id;

const mergePosts = (oldPosts: PostItem[], newPosts: PostItem[]) => {
  const ids = new Set(oldPosts.map(getId));
  return [...oldPosts, ...newPosts.filter((p) => !ids.has(getId(p)))];
};

export function usePosts(
  refresh_id: string,
  userId?: string,
  onlyLiked = false,
  shouldFetch = true,
) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const { request } = useApi();
  const fetchingRef = useRef(false);
  const lastItemRef = useRef<{ id: string; createdAt: string } | null>(null);
  const initialFetchDone = useRef(false);

  const fetchPosts = useCallback(
    async (isRefresh = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      if (isRefresh) {
        lastItemRef.current = null;
        setPosts(SKELETONS as any);
      }

      startTransition(() => {
        if (isRefresh) setHasMore(true);
        else setLoadingMore(true);
      });

      try {
        const searchParams = new URLSearchParams({
          pageSize: String(PAGE_SIZE),
        });

        if (!isRefresh && lastItemRef.current) {
          searchParams.append("lastCreatedAt", lastItemRef.current.createdAt);
          searchParams.append("lastId", lastItemRef.current.id);
        }

        const baseUrl = onlyLiked
          ? "/api/posts/liked"
          : userId
            ? `/api/posts/user/${userId}`
            : "/api/posts/me";

        const data: PostItem[] = await request({
          urlComplement: `${baseUrl}?${searchParams.toString()}`,
          method: "GET",
          hasLoading: false,
        });

        const newPosts = Array.isArray(data) ? data : [];

        if (newPosts.length > 0) {
          const last = newPosts[newPosts.length - 1];
          lastItemRef.current = {
            id: String(getId(last)),
            createdAt: last.createdAt,
          };
        }

        startTransition(() => {
          setPosts((prev) =>
            isRefresh ? newPosts : mergePosts(prev, newPosts),
          );
          setHasMore(newPosts.length >= PAGE_SIZE);
        });
      } catch (e: any) {
        console.error("[fetchPosts ERROR]", e?.message);
      } finally {
        fetchingRef.current = false;
        startTransition(() => {
          setInitialLoading(false);
          setLoadingMore(false);
        });
      }
    },
    [request, userId, onlyLiked],
  );

  useEffect(() => {
    if (shouldFetch && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchPosts(true);
    }
  }, [shouldFetch, fetchPosts]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(refresh_id, () => {
      fetchPosts(true);
    });
    return () => sub.remove();
  }, [refresh_id, fetchPosts]);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && !fetchingRef.current && !initialLoading) {
      fetchPosts(false);
    }
  }, [hasMore, loadingMore, initialLoading, fetchPosts]);

  return { posts, initialLoading, loadingMore, loadMore };
}

export interface UsePostsUIProps {
  userId?: string;
  refresh_id: string;
  onlyLiked: boolean;
  headerHeight: number;
  shouldFetch?: boolean;
  styles: any;
}

export function usePostsUI({
  userId,
  refresh_id,
  onlyLiked,
  headerHeight,
  shouldFetch = true,
  styles,
}: UsePostsUIProps) {
  const { posts, initialLoading, loadingMore, loadMore } = usePosts(
    refresh_id,
    userId,
    onlyLiked,
    shouldFetch,
  );

  const listRef = useRef<any>(null);

  const displayData = initialLoading ? SKELETONS : posts || [];

  const handleEndReached = useCallback(() => {
    if (!initialLoading && !loadingMore) {
      loadMore();
    }
  }, [initialLoading, loadingMore, loadMore]);

  const keyExtractor = useCallback((item: any, index: number) => {
    if (item._isSkeleton) return item.id;
    const id = getId(item);
    return id ? String(id) : `post-idx-${index}`;
  }, []);

  const contentContainerStyle = useMemo(
    () => [
      styles.listContent,
      { minHeight: "100%", paddingTop: headerHeight + 60 },
    ],
    [styles.listContent, headerHeight],
  );

  const scrollToTop = useCallback(() => {
    const listNode = listRef.current?.getNode?.() || listRef.current;
    listNode?.scrollToOffset?.({ offset: 0, animated: true });
  }, []);

  return {
    listRef,
    scrollToTop,
    displayData,
    initialLoading,
    loadingMore,
    handleEndReached,
    keyExtractor,
    contentContainerStyle,
  };
}
