import Post from "@/components/Features/Post/post";
import { useTheme } from "@/context/ThemeContext";
import { request } from "@/utils/request.utils";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Text,
  View,
} from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { useStylesPosts } from "./Posts.style";

const MemoizedPost = memo(Post);

const PostSkeleton = () => {
  const styles = useStylesPosts();
  return (
    <View style={styles.postContainer}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonAvatar} />
        <View style={styles.skeletonNameInfo}>
          <View style={[styles.skeletonTextBar, { width: 120 }]} />
          <View style={[styles.skeletonTextBar, { width: 80, height: 10 }]} />
        </View>
      </View>
      <View
        style={[styles.skeletonTextBar, { width: "100%", marginBottom: 8 }]}
      />
      <View style={[styles.skeletonTextBar, { width: "80%" }]} />
      <View style={styles.skeletonImage} />
    </View>
  );
};

interface PostItem {
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
const getId = (p: PostItem) => p.postId || p.id;

const mergePosts = (oldPosts: PostItem[], newPosts: PostItem[]) => {
  const ids = new Set(oldPosts.map(getId));
  const filtered = newPosts.filter((p) => !ids.has(getId(p)));
  return [...oldPosts, ...filtered];
};

export default function Posts() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const { colors } = useTheme();
  const styles = useStylesPosts();

  const fetchingRef = useRef(false);
  const lastItemRef = useRef<{ id: string; createdAt: string } | null>(null);

  const fetchPosts = useCallback(async (isRefresh = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    if (isRefresh) {
      lastItemRef.current = null;
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let url = `/Post/GetPostUser?pageSize=${PAGE_SIZE}`;
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
  }, []);

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

  const renderItem = useCallback(
    ({ item }: { item: PostItem }) => (
      <MemoizedPost
        userName={item.userName}
        text={item.text}
        imageProfileUrl={item.imageProfileUrl}
        postImageUrl={item.imageUrls}
        postId={getId(item) as string}
        Location={item.Location || item.location}
        edited={item.edited}
      />
    ),
    [],
  );

  return (
    <Tabs.FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item, index) => {
        const id = getId(item);
        return id ? id.toString() : `idx-${index}`;
      }}
      initialNumToRender={6}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      onEndReachedThreshold={0.3}
      onEndReached={loadMore}
      contentContainerStyle={[styles.listContent, { minHeight: "100%" }]}
      ListEmptyComponent={
        initialLoading ? (
          <View style={{ flex: 1 }}>
            <PostSkeleton />
            <PostSkeleton />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum post encontrado</Text>
          </View>
        )
      }
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footerLoading}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <View style={{ height: 40 }} />
        )
      }
    />
  );
}
