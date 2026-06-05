import Post from "@/components/Features/Post/Post";
import { useTheme } from "@/context/ThemeContext";
import { memo, useCallback } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { getId, usePostsUI } from "./Posts.script";
import { useStylesPosts } from "./Posts.style";
import { PostSkeleton } from "./PostSkeleton";

interface PostsProps {
  userId?: string;
  refresh_id: string;
  onlyLiked?: boolean;
  headerHeight?: number;
  shouldFetch?: boolean;
}

const Posts = function Posts({
  userId,
  refresh_id,
  onlyLiked = false,
  headerHeight = 0,
  shouldFetch = true,
}: PostsProps) {
  const { colors } = useTheme();
  const styles = useStylesPosts();

  const {
    listRef,
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
    headerHeight,
    shouldFetch,
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
      ref={listRef}
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
      contentContainerStyle={contentContainerStyle}
    />
  );
};

export default memo(Posts);
