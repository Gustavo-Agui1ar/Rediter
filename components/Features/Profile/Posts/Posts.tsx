import Post from "@/components/Features/Post/Post";
import { useTheme } from "@/context/ThemeContext";
import React, { memo, useCallback } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Text,
  View,
} from "react-native";
import { getId, usePosts } from "./Posts.script";
import { useStylesPosts } from "./Posts.style";

export const PostSkeleton = () => {
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

interface PostsProps {
  userId?: string;
  refresh_id: string;
  ownProfile: boolean;
  onScroll?: any;
  headerHeight?: number;
}

function Posts({
  userId,
  refresh_id,
  ownProfile = false,
  onScroll,
  headerHeight = 0,
}: PostsProps) {
  const { colors } = useTheme();
  const styles = useStylesPosts();
  const { posts, initialLoading, loadingMore, loadMore } = usePosts(
    refresh_id,
    userId,
  );

  const displayData = initialLoading
    ? ([
        { _isSkeleton: true, id: "skel-1" },
        { _isSkeleton: true, id: "skel-2" },
      ] as any)
    : posts || [];

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
            imageProfileUrl={item.imageProfileUrl}
            postImageUrl={item.imageUrls}
            postId={getId(item) as string}
            Location={item.Location || item.location}
            edited={item.edited}
            createdAt={item.createdAt}
            ownProfile={ownProfile}
            countLikes={item.likesCount}
            liked={item.likedByCurrentUser}
            canGoToProfile={false}
            userId={userId || ""}
          />
        </View>
      );
    },
    [userId, ownProfile, styles.PostContainer],
  );

  return (
    <Animated.SectionList
      sections={[{ data: displayData }]}
      renderItem={renderItem}
      keyExtractor={(item, index) => {
        if (item._isSkeleton) return item.id;

        const id = getId(item);
        return id ? id.toString() : `idx-${index}`;
      }}
      onScroll={onScroll}
      scrollEventThrottle={16}
      initialNumToRender={6}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews
      onEndReachedThreshold={0.3}
      onEndReached={() => {
        if (!initialLoading) {
          loadMore();
        }
      }}
      contentContainerStyle={[
        styles.listContent,
        { minHeight: "100%" },
        Platform.OS === "android" ? { paddingTop: headerHeight } : {},
      ]}
      contentInset={Platform.OS === "ios" ? { top: headerHeight } : undefined}
      contentOffset={
        Platform.OS === "ios" ? { x: 0, y: -headerHeight } : undefined
      }
      ListEmptyComponent={() => {
        if (initialLoading) return null;
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum post encontrado</Text>
          </View>
        );
      }}
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

export default memo(Posts);
