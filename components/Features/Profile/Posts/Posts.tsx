import Post from "@/components/Features/Post/Post";
import { useTheme } from "@/context/ThemeContext";
import React, { memo, useCallback } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { PostItem, getId, usePosts } from "./Post.script";
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

interface PostsProps {
  myProfile: boolean;
}

export default function Posts({ myProfile }: PostsProps) {
  const { colors } = useTheme();
  const styles = useStylesPosts();
  const { posts, initialLoading, loadingMore, loadMore } = usePosts();

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
        createdAt={item.createdAt}
        myProfile={myProfile}
      />
    ),
    [myProfile],
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item, index) => {
        const id = getId(item);
        return id ? id.toString() : `idx-${index}`;
      }}
      initialNumToRender={6}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews
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
