import Post from "@/components/Features/Post/post";
import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
import { request } from "@/utils/request.utils";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

import { useStylesPosts } from "./Posts.style";

interface PostsProps {
  ListHeaderComponent: React.ReactNode;
  onRefreshProfile: () => Promise<void>;
}

const PAGE_SIZE = 5;

export default function Posts({
  ListHeaderComponent,
  onRefreshProfile,
}: PostsProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { setLoading } = useLoading();
  const { colors } = useTheme();
  const styles = useStylesPosts();

  const getId = (p: any) => p.postId || p.id;

  const fetchingRef = useRef(false);
  const lastItemRef = useRef<{ id: string; createdAt: string } | null>(null);

  // 1. NOVA REF: Trava o onEndReached até o usuário realmente rolar a tela
  const onEndReachedCalledDuringMomentum = useRef(true);

  const mergePosts = (oldPosts: any[], newPosts: any[]) => {
    const ids = new Set(oldPosts.map(getId));
    const filtered = newPosts.filter((p) => !ids.has(getId(p)));
    return [...oldPosts, ...filtered];
  };

  const fetchPosts = useCallback(
    async (isRefresh = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      try {
        if (isRefresh) {
          if (!refreshing) setLoading(true);
          lastItemRef.current = null;
          setHasMore(true); // Reseta o hasMore ao recarregar
        } else {
          setLoadingMore(true);
        }

        let url = `/Post/GetPostUser?pageSize=${PAGE_SIZE}`;

        if (!isRefresh && lastItemRef.current) {
          const { id, createdAt } = lastItemRef.current;
          url += `&lastCreatedAt=${encodeURIComponent(createdAt)}&lastId=${id}`;
        }

        const res = await request({
          urlComplement: url,
          method: "GET",
        });

        if (!res) throw new Error("Sem resposta do servidor");

        const data = (await res.json()) || [];

        if (data.length > 0) {
          const last = data[data.length - 1];
          lastItemRef.current = {
            id: getId(last),
            createdAt: last.createdAt,
          };
        }

        setPosts((prev) => (isRefresh ? data : mergePosts(prev, data)));

        setHasMore(data.length >= PAGE_SIZE);
      } catch (e: any) {
        console.error("[fetchPosts ERROR]", e?.message);
      } finally {
        fetchingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [refreshing, setLoading],
  );

  useEffect(() => {
    fetchPosts(true);

    const sub = DeviceEventEmitter.addListener("refresh_posts", () => {
      fetchPosts(true);
    });

    return () => sub.remove();
  }, [fetchPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchPosts(true), onRefreshProfile()]);
  };

  const loadMore = () => {
    if (!hasMore || loadingMore || refreshing || fetchingRef.current) return;
    fetchPosts(false);
  };

  return (
    <FlatList
      data={posts}
      ListHeaderComponent={ListHeaderComponent as React.ReactElement}
      keyExtractor={(item, index) => {
        const id = getId(item);
        return id ? id.toString() : `idx-${index}`;
      }}
      renderItem={({ item }) => (
        <Post
          userName={item.userName}
          text={item.text}
          imageProfileUrl={item.imageProfileUrl}
          postImageUrl={item.imageUrls}
          postId={getId(item)}
          Location={item.Location || item.location}
          edited={item.edited}
        />
      )}
      contentContainerStyle={styles.listContent}
      onMomentumScrollBegin={() => {
        onEndReachedCalledDuringMomentum.current = false;
      }}
      onEndReached={() => {
        if (!onEndReachedCalledDuringMomentum.current) {
          loadMore();
          onEndReachedCalledDuringMomentum.current = true;
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footerLoading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      ListEmptyComponent={
        !refreshing && !fetchingRef.current ? (
          <Text style={styles.emptyText}>Nenhum post encontrado</Text>
        ) : null
      }
    />
  );
}
