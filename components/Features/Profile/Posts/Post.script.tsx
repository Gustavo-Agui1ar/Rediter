import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useRef, useState } from "react";
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
export const getId = (p: PostItem) => p.postId || p.id;

const mergePosts = (oldPosts: PostItem[], newPosts: PostItem[]) => {
  const ids = new Set(oldPosts.map(getId));
  const filtered = newPosts.filter((p) => !ids.has(getId(p)));
  return [...oldPosts, ...filtered];
};

export function usePosts() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const { request } = useApi();
  const fetchingRef = useRef(false);
  const lastItemRef = useRef<{ id: string; createdAt: string } | null>(null);

  const fetchPosts = useCallback(
    async (isRefresh = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      if (isRefresh) {
        lastItemRef.current = null;
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      try {
        let url = `/api/posts/me?pageSize=${PAGE_SIZE}`;
        if (!isRefresh && lastItemRef.current) {
          const { id, createdAt } = lastItemRef.current;
          url += `&lastCreatedAt=${encodeURIComponent(createdAt)}&lastId=${id}`;
        }

        const res = await request({ urlComplement: url, method: "GET" });
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
    [request],
  );

  useEffect(() => {
    fetchPosts(true);

    const sub = DeviceEventEmitter.addListener("refresh_posts", () =>
      fetchPosts(true),
    );

    return () => sub.remove();
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || fetchingRef.current || initialLoading)
      return;
    fetchPosts(false);
  }, [hasMore, loadingMore, initialLoading, fetchPosts]);

  return {
    posts,
    initialLoading,
    loadingMore,
    loadMore,
  };
}
