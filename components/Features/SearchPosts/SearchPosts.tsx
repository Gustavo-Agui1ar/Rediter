import Post from "@/components/Features/Post/Post";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import React, { memo, useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useStylesPosts } from "./SearchPost.style";
import { getId, useSearchPosts } from "./SearchPosts.script";

const PostSkeleton = memo(() => {
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

const SKELETON_DATA = [
  { _isSkeleton: true, id: "skel-1" },
  { _isSkeleton: true, id: "skel-2" },
];
interface SearchPostsProps {
  searchTerm: string;
  onlyWithMedia?: boolean;
  myProfile?: boolean;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  profileHeader?: React.ReactElement;
  tabBar?: React.ReactElement;
  feedMode?: "following" | "foryou";
}

const SearchPosts = ({
  searchTerm,
  onlyWithMedia = false,
  myProfile = false,
  onRefresh,
  refreshing = false,
  profileHeader,
  tabBar,
  feedMode,
}: SearchPostsProps) => {
  const { colors } = useTheme();
  const styles = useStylesPosts();
  const { t } = useLanguage();

  const { posts, initialLoading, loadingMore, loadMore } = useSearchPosts(
    searchTerm,
    onlyWithMedia,
    feedMode,
  );

  const displayData = initialLoading ? SKELETON_DATA : posts || [];
  const sections = useMemo(() => [{ data: displayData }], [displayData]);

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
            searchTerm={searchTerm}
            countLikes={item.likesCount}
            countComments={item.commentsCount}
            liked={item.likedByCurrentUser}
            userId={item.postUserID}
            canGoToProfile={true}
          />
        </View>
      );
    },
    [myProfile, searchTerm, styles.PostContainer],
  );

  const handleKeyExtractor = useCallback((item: any, index: number) => {
    if (item._isSkeleton) return item.id;
    const id = getId(item);
    return id ? id.toString() : `idx-${index}`;
  }, []);

  const handleEndReached = useCallback(() => {
    if (!initialLoading) {
      loadMore();
    }
  }, [initialLoading, loadMore]);

  const renderSectionHeader = useCallback(() => tabBar || <></>, [tabBar]);

  const renderSectionFooter = useCallback(
    ({ section }: any) => {
      if (section.data.length === 0 && !initialLoading) {
        let emptyMessage = t("error_no_posts_found");

        if (feedMode === "following") {
          emptyMessage = t("empty_feed_following");
        } else if (feedMode === "foryou") {
          emptyMessage = t("empty_feed_foryou");
        } else {
          emptyMessage = searchTerm
            ? `${t("error_no_posts_for")} "${searchTerm}"`
            : t("search_posts_start_typing");
        }

        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        );
      }
      return null;
    },
    [
      initialLoading,
      searchTerm,
      feedMode,
      styles.emptyContainer,
      styles.emptyText,
      t,
    ],
  );

  const ListFooterComponent = useMemo(() => {
    return loadingMore ? (
      <View style={styles.footerLoading}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    ) : (
      <View style={{ height: 40 }} />
    );
  }, [loadingMore, colors.primary, styles.footerLoading]);

  const contentContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.listContent, { minHeight: "100%" }],
    [styles.listContent],
  );

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      keyExtractor={handleKeyExtractor}
      ListHeaderComponent={profileHeader}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={true}
      initialNumToRender={6}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      onEndReachedThreshold={0.3}
      onEndReached={handleEndReached}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      contentContainerStyle={contentContainerStyle}
      renderSectionFooter={renderSectionFooter}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

export default memo(SearchPosts);
