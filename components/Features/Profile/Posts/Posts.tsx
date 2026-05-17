import Post from "@/components/Features/Post/Post";
import { useTheme } from "@/context/ThemeContext";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  DeviceEventEmitter,
  Platform,
  Text,
  View,
} from "react-native";
import { getId, usePosts } from "./Posts.script";
import { useStylesPosts } from "./Posts.style";

export const PostSkeleton = memo(() => {
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
});

interface PostsProps {
  userId?: string;
  refresh_id: string;
  ownProfile: boolean;
  onlyLiked?: boolean;
  onScroll?: any;
  headerHeight?: number;
}

function Posts({
  userId,
  refresh_id,
  ownProfile = false,
  onlyLiked = false,
  onScroll,
  headerHeight = 0,
}: PostsProps) {
  const { colors } = useTheme();
  const styles = useStylesPosts();
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

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item._isSkeleton) {
        return <PostSkeleton />;
      }
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

  const keyExtractor = useCallback((item: any, index: number) => {
    if (item._isSkeleton) return item.id;
    const id = getId(item);
    return id ? id.toString() : `post-idx-${index}`;
  }, []);

  const handleEndReached = useCallback(() => {
    if (!initialLoading && !loadingMore) {
      loadMore();
    }
  }, [initialLoading, loadingMore, loadMore]);

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

  const contentContainerStyle = useMemo(() => {
    return [
      styles.listContent,
      { minHeight: "100%" },
      Platform.OS === "android" ? { paddingTop: headerHeight } : undefined,
    ] as any;
  }, [styles.listContent, headerHeight]);

  const contentOffset = useMemo(() => {
    return Platform.OS === "ios" ? { x: 0, y: -headerHeight } : undefined;
  }, [headerHeight]) as any;

  const contentInset = useMemo(() => {
    return Platform.OS === "ios" ? { top: headerHeight } : undefined;
  }, [headerHeight]) as any;

  const listRef = useRef<any>(null);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      `scrollToTop_${refresh_id}`,
      () => {
        listRef.current?.scrollToOffset({
          offset: Platform.OS === "ios" ? -headerHeight : 0,
          animated: false,
        });
      },
    );

    return () => subscription.remove();
  }, [refresh_id, headerHeight]);

  return (
    <Animated.FlatList
      ref={listRef}
      data={displayData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onScroll={onScroll}
      scrollEventThrottle={16}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={Platform.OS === "android"}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
      onEndReached={handleEndReached}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderFooterComponent}
      contentContainerStyle={contentContainerStyle}
      contentInset={contentInset}
      contentOffset={contentOffset}
    />
  );
}

export default memo(Posts);
