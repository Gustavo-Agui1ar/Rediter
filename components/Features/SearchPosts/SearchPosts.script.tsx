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
  score?: number;
}

const PAGE_SIZE = 12;
export const getId = (p: PostItem) => p.postId || p.id;

const mergePosts = (oldPosts: PostItem[], newPosts: PostItem[]) => {
  const ids = new Set(oldPosts.map(getId));
  const filtered = newPosts.filter((p) => !ids.has(getId(p)));
  return [...oldPosts, ...filtered];
};

export function useSearchPosts(
  searchTerm: string,
  onlyWithMedia = false,
  feedMode?: "following" | "foryou",
) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { request } = useApi();
  const fetchingRef = useRef(false);
  const lastItemRef = useRef<{
    id: string;
    createdAt: string;
    score?: number;
  } | null>(null);

  const fetchPosts = useCallback(
    async (isRefresh = false, currentTerm: string) => {
      if (!feedMode && (!currentTerm || currentTerm.trim() === "")) {
        setPosts([]);
        setHasMore(false);
        setInitialLoading(false);
        setError(null);
        return;
      }

      if (fetchingRef.current) return;
      fetchingRef.current = true;
      setError(null);

      if (isRefresh) {
        lastItemRef.current = null;
        setHasMore(true);
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        let basePath = "/api/posts/search";
        if (feedMode === "following") {
          basePath = "/api/posts/feed/following";
        } else if (feedMode === "foryou") {
          basePath = "/api/posts/feed/discover";
        }

        const params = new URLSearchParams();

        params.append("pageSize", String(PAGE_SIZE));

        if (!feedMode) {
          params.append("query", currentTerm);
        }

        if (onlyWithMedia) {
          params.append("onlyWithMedia", "true");
        }

        if (!isRefresh && lastItemRef.current) {
          const { id, createdAt, score } = lastItemRef.current;

          params.append("lastCreatedAt", createdAt);
          params.append("lastId", id);

          if (feedMode === "foryou" && score !== undefined) {
            params.append("lastScore", String(score));
          }
        }

        const url = `${basePath}?${params.toString()}`;
        const res = await request({ urlComplement: url, method: "GET" });

        if (!res || !res.ok) throw new Error("Erro na requisição");

        const data: PostItem[] = (await res.json()) || [];
        if (data.length > 0) {
          const last = data[data.length - 1];
          lastItemRef.current = {
            id: String(getId(last)),
            createdAt: last.createdAt,
            score: last.score,
          };
        }

        setPosts((prev) => (isRefresh ? data : mergePosts(prev, data)));
        setHasMore(data.length >= PAGE_SIZE);
      } catch (e: any) {
        const errorMessage = e?.message || "Ocorreu um erro inesperado.";

        setError(errorMessage);

        if (__DEV__) {
          console.log("⚠️ [useSearchPosts] Aviso:", errorMessage);
        }
      } finally {
        fetchingRef.current = false;
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [request, onlyWithMedia, feedMode],
  );

  useEffect(() => {
    if (!feedMode && (!searchTerm || searchTerm.trim() === "")) {
      setPosts([]);
      setInitialLoading(false);
      setHasMore(false);
      lastItemRef.current = null;
      setError(null);
      return;
    }

    const delay = feedMode ? 0 : 500;

    const delayDebounceFn = setTimeout(() => {
      fetchPosts(true, searchTerm);
    }, delay);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, feedMode, fetchPosts]);

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
    error,
  };
}
