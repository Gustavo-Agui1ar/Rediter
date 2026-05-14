import { useApi } from "@/utils/request.utils";
import { useCallback, useEffect, useRef, useState } from "react";

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

export function useSearchPosts(searchTerm: string, onlyWithMedia = false) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const { request } = useApi();
  const fetchingRef = useRef(false);
  const lastItemRef = useRef<{ id: string; createdAt: string } | null>(null);

  const fetchPosts = useCallback(
    async (isRefresh = false, currentTerm: string) => {
      if (!currentTerm || currentTerm.trim() === "") {
        setPosts([]);
        setHasMore(false);
        setInitialLoading(false);
        return;
      }

      if (fetchingRef.current) return;
      fetchingRef.current = true;

      if (isRefresh) {
        lastItemRef.current = null;
        setHasMore(true);
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        let url = `/api/posts/search?query=${encodeURIComponent(currentTerm)}&pageSize=${PAGE_SIZE}`;

        if (onlyWithMedia) {
          url += `&onlyWithMedia=true`;
        }

        if (!isRefresh && lastItemRef.current) {
          const { id, createdAt } = lastItemRef.current;
          url += `&lastCreatedAt=${encodeURIComponent(createdAt)}&lastId=${id}`;
        }

        const res = await request({ urlComplement: url, method: "GET" });
        if (!res || !res.ok) throw new Error("Erro na requisição de busca");

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
        if (__DEV__) {
          console.error("[useSearchPosts ERROR]", e?.message);
        }
      } finally {
        fetchingRef.current = false;
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [request, onlyWithMedia],
  );

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      setPosts([]);
      setInitialLoading(false);
      setHasMore(false);
      lastItemRef.current = null;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchPosts(true, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchPosts]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || fetchingRef.current || initialLoading)
      return;
    fetchPosts(false, searchTerm);
  }, [hasMore, loadingMore, initialLoading, fetchPosts, searchTerm]);

  return {
    posts,
    initialLoading,
    loadingMore,
    loadMore,
  };
}
