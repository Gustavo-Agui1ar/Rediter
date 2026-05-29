import Post from "@/components/Features/Post/Post";
import { useTheme } from "@/context/ThemeContext";
import { useApi } from "@/utils/request.utils";
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, DeviceEventEmitter, Text, View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view"; // IMPORTAÇÃO DA BIBLIOTECA

import { useStylesPosts } from "./Posts.style";
import { PostSkeleton } from "./PostSkeleton";

// ==========================================
// 1. TIPAGENS E FUNÇÕES AUXILIARES
// ==========================================
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

// ==========================================
// 2. HOOK: DE FETCH (usePosts) - Intacto
// ==========================================
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
  const lastItemRef = useRef<{ id: string; createdAt: string } | null>(null);

  const fetchPosts = useCallback(
    async (isRefresh = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      if (isRefresh) {
        lastItemRef.current = null;
        startTransition(() => setHasMore(true));
      } else {
        startTransition(() => setLoadingMore(true));
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

        const data: PostItem[] = await request({
          urlComplement: url,
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
    fetchPosts(true);
    const sub = DeviceEventEmitter.addListener(`${refresh_id}`, () =>
      fetchPosts(true),
    );
    return () => sub.remove();
  }, [fetchPosts, refresh_id]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || fetchingRef.current || initialLoading)
      return;
    fetchPosts(false);
  }, [hasMore, loadingMore, initialLoading, fetchPosts]);

  return { posts, initialLoading, loadingMore, loadMore };
}

// ==========================================
// 3. HOOK: DE UI (usePostsUI) - Limpo
// ==========================================
interface UsePostsUIProps {
  userId?: string;
  refresh_id: string;
  onlyLiked: boolean;
  styles: any;
}

export function usePostsUI({
  userId,
  refresh_id,
  onlyLiked,
  styles,
}: UsePostsUIProps) {
  const { posts, initialLoading, loadingMore, loadMore } = usePosts(
    refresh_id,
    userId,
    onlyLiked,
  );

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

  // Mantemos apenas o estilo base da lista, sem gambiarras de padding/height
  const contentContainerStyle = useMemo(() => {
    return [styles.listContent];
  }, [styles.listContent]);

  return {
    displayData,
    initialLoading,
    loadingMore,
    handleEndReached,
    keyExtractor,
    contentContainerStyle,
  };
}

// ==========================================
// 4. COMPONENTE PRINCIPAL (Posts)
// ==========================================
interface PostsProps {
  userId?: string;
  refresh_id: string;
  ownProfile: boolean;
  onlyLiked?: boolean;
}

const Posts = function Posts({
  userId,
  refresh_id,
  ownProfile,
  onlyLiked = false,
}: PostsProps) {
  const { colors } = useTheme();
  const styles = useStylesPosts();

  const {
    displayData,
    initialLoading,
    loadingMore,
    handleEndReached,
    keyExtractor,
    contentContainerStyle,
  } = usePostsUI({
    userId,
    refresh_id,
    onlyLiked,
    styles,
  });

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item._isSkeleton) return <PostSkeleton />;

      return (
        <View style={styles.PostContainer}>
          <Post
            userName={item.userName}
            text={item.text}
            imageProfileUrl={item.profileImageName}
            postImageUrl={item.imageUrls}
            postId={getId(item) as string}
            Location={item.Location || item.location}
            edited={item.edited}
            createdAt={item.createdAt}
            ownProfile={item.ownPost}
            countLikes={item.likesCount}
            countComments={item.commentsCount}
            liked={item.likedByCurrentUser}
            canGoToProfile={false}
            userId={userId || ""}
          />
        </View>
      );
    },
    [userId, styles.PostContainer],
  );

  const renderEmptyComponent = useCallback(() => {
    if (initialLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum post encontrado</Text>
      </View>
    );
  }, [initialLoading, styles]);

  const renderFooterComponent = useCallback(() => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }
    return <View style={{ height: 40 }} />;
  }, [loadingMore, colors.primary, styles.footerLoading]);

  return (
    <Tabs.FlatList
      data={displayData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
      onEndReached={handleEndReached}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderFooterComponent}
      contentContainerStyle={contentContainerStyle} // Apenas passando os estilos base
    />
  );
};

export default memo(Posts);
