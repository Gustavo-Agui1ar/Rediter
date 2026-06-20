import Post from "@/components/Features/Post/Post";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SectionList,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useStylesPosts } from "./SearchPost.style";
import { getId, useSearchPosts } from "./SearchPosts.script";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const REFRESH_THRESHOLD = 80;
const MAX_PULL_DISTANCE = 150;

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
  onDeletePost?: (postId: string) => void;
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
  onDeletePost,
}: SearchPostsProps) => {
  const { colors } = useTheme();
  const styles = useStylesPosts();
  const { t } = useLanguage();
  const listRef = useRef<SectionList>(null);
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const { posts, initialLoading, loadingMore, loadMore, refresh } =
    useSearchPosts(searchTerm, onlyWithMedia, feedMode);

  const pullOffset = useSharedValue(0);
  const isRefreshingSV = useSharedValue(false);
  const isLoadingSV = useSharedValue(initialLoading);
  const isAtTop = useSharedValue(true);

  useEffect(() => {
    isLoadingSV.value = initialLoading;
  }, [initialLoading, isLoadingSV]);

  useEffect(() => {
    if (refreshing !== undefined) {
      isRefreshingSV.value = refreshing;
    }
  }, [refreshing, isRefreshingSV]);

  const displayData = initialLoading ? SKELETON_DATA : posts || [];
  const sections = useMemo(() => [{ data: displayData }], [displayData]);

  const handleRefreshTrigger = useCallback(async () => {
    isRefreshingSV.value = true;
    setInternalRefreshing(true);

    if (onRefresh) {
      await onRefresh();
    } else {
      await refresh();
    }

    setInternalRefreshing(false);
    isRefreshingSV.value = false;
    pullOffset.value = withTiming(0, { duration: 300 });
  }, [onRefresh, refresh, isRefreshingSV, pullOffset]);

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .activeOffsetY(10)
      .failOffsetY(-10)
      .onUpdate((event) => {
        if (isRefreshingSV.value || isLoadingSV.value || !isAtTop.value) return;

        if (event.translationY > 0) {
          pullOffset.value = interpolate(
            event.translationY,
            [0, WINDOW_HEIGHT / 2],
            [0, MAX_PULL_DISTANCE],
            Extrapolate.CLAMP,
          );
        }
      })
      .onEnd(() => {
        if (isRefreshingSV.value || isLoadingSV.value || !isAtTop.value) return;

        if (pullOffset.value >= REFRESH_THRESHOLD) {
          pullOffset.value = withTiming(REFRESH_THRESHOLD);
          runOnJS(handleRefreshTrigger)();
        } else {
          pullOffset.value = withTiming(0);
        }
      });
  }, [pullOffset, isRefreshingSV, isLoadingSV, isAtTop, handleRefreshTrigger]);

  const nativeGesture = Gesture.Native();
  const composedGesture = Gesture.Simultaneous(panGesture, nativeGesture);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: pullOffset.value }] };
  });

  const animatedSpinnerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      pullOffset.value,
      [0, REFRESH_THRESHOLD / 2, REFRESH_THRESHOLD],
      [0, 0.5, 1],
      Extrapolate.CLAMP,
    );
    return {
      opacity: opacity,
      transform: [{ scale: opacity }],
    };
  });

  const handleConfirmDelete = useCallback(
    (item: any) => {
      Alert.alert(
        "Deletar Post",
        "Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Deletar",
            style: "destructive",
            onPress: () => {
              const id = getId(item) as string;
              if (onDeletePost && id) {
                onDeletePost(id);
              }
            },
          },
        ],
      );
    },
    [onDeletePost],
  );

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
            onDelete={() => handleConfirmDelete(item)}
          />
        </View>
      );
    },
    [searchTerm, styles.PostContainer, handleConfirmDelete],
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
    <GestureHandlerRootView
      style={[{ flex: 1, backgroundColor: colors.background || "#121212" }]}
    >
      <View style={localStyles.spinnerContainer}>
        {!internalRefreshing && !refreshing && !initialLoading ? (
          <Animated.View style={animatedSpinnerStyle}>
            <ActivityIndicator size="small" color={colors.primary} />
          </Animated.View>
        ) : (
          <ActivityIndicator size="small" color={colors.primary} />
        )}
      </View>

      <Animated.View
        style={[
          {
            flex: 1,
            zIndex: 2,
            backgroundColor: colors.background || "#121212",
          },
          animatedContainerStyle,
        ]}
      >
        <GestureDetector gesture={composedGesture}>
          <SectionList
            ref={listRef}
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
            bounces={false}
            scrollEventThrottle={16}
            onScroll={(event) => {
              isAtTop.value = event.nativeEvent.contentOffset.y <= 5;
            }}
            contentContainerStyle={contentContainerStyle}
            renderSectionFooter={renderSectionFooter}
            ListFooterComponent={ListFooterComponent}
          />
        </GestureDetector>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const localStyles = StyleSheet.create({
  spinnerContainer: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});

export default memo(SearchPosts);
