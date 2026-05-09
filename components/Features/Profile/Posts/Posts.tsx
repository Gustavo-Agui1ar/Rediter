import Post from "@/components/Features/Post/Post";
import { useTheme } from "@/context/ThemeContext";
import React, { memo, useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";
import { getId, usePosts } from "./Posts.script";
import { useStylesPosts } from "./Posts.style";

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

interface PostsProps {
  userId?: string;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  profileHeader?: React.ReactElement;
  tabBar?: React.ReactElement;
  refresh_id: string;
  ownProfile: boolean;
}

function Posts({
  userId,
  onRefresh,
  refreshing = false,
  profileHeader,
  tabBar,
  refresh_id,
  ownProfile = false,
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
            userId={userId}
            ownProfile={ownProfile}
          />
        </View>
      );
    },
    [userId, ownProfile],
  );

  return (
    <SectionList
      sections={[{ data: displayData }]}
      renderItem={renderItem}
      keyExtractor={(item, index) => {
        if (item._isSkeleton) return item.id;

        const id = getId(item);
        return id ? id.toString() : `idx-${index}`;
      }}
      ListHeaderComponent={profileHeader}
      renderSectionHeader={() => tabBar || <></>}
      stickySectionHeadersEnabled={true}
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
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      contentContainerStyle={[styles.listContent, { minHeight: "100%" }]}
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
