import Post from "@/components/Features/Post/Post";
import { useTheme } from "@/context/ThemeContext";
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
} from "react";
import { ActivityIndicator, Animated, Text, View } from "react-native";

import { getId, usePostsUI } from "./Posts.script";
import { useStylesPosts } from "./Posts.style";
import { PostSkeleton } from "./PostSkeleton";

export interface PostsRef {
  scrollToTop: () => void;
}

interface PostsProps {
  userId?: string;
  refresh_id: string;
  ownProfile: boolean;
  onlyLiked?: boolean;
  onScroll?: any;
  headerHeight?: number;
}

const Posts = forwardRef<PostsRef, PostsProps>(function Posts(
  { userId, refresh_id, onlyLiked = false, onScroll, headerHeight = 0 },
  ref,
) {
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
    contentOffset,
    contentInset,
  } = usePostsUI({
    userId,
    refresh_id,
    onlyLiked,
    headerHeight,
    styles,
  });

  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    },
  }));

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

  const renderEmptyComponent = useCallback(() => {
    if (initialLoading) {
      return null;
    }

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
      removeClippedSubviews={true}
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
});

export default memo(Posts);
