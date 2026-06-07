import UserItem from "@/components/Features/UserItem/UserItem";
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
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSearchUsers } from "./SearchUser.script";
import { useStylesSearchUsers } from "./SearchUser.style";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const REFRESH_THRESHOLD = 80;
const MAX_PULL_DISTANCE = 150;

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const UserSkeleton = memo(() => {
  const styles = useStylesSearchUsers();
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonName} />
    </View>
  );
});

interface SearchUsersProps {
  searchTerm: string;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  profileHeader?: React.ReactElement;
  tabBar?: React.ReactElement;
  isAdminMode?: boolean;
  onDeleteUser?: (userId: string) => void;
}

const SearchUsers = ({
  searchTerm,
  onRefresh,
  refreshing = false,
  profileHeader,
  tabBar,
  isAdminMode = false,
  onDeleteUser,
}: SearchUsersProps) => {
  const { colors } = useTheme();
  const styles = useStylesSearchUsers();
  const { t } = useLanguage();
  const listRef = useRef<any>(null);
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const { users, initialLoading, loadingMore, loadMore, refresh } =
    useSearchUsers(searchTerm);

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

  const displayData = initialLoading
    ? ([
        { _isSkeleton: true, id: "sk-1" },
        { _isSkeleton: true, id: "sk-2" },
        { _isSkeleton: true, id: "sk-3" },
      ] as any)
    : users || [];

  const sections = useMemo(() => [{ data: displayData }], [displayData]);

  const handleRefreshTrigger = useCallback(async () => {
    isRefreshingSV.value = true;
    setInternalRefreshing(true);

    try {
      if (onRefresh) {
        await onRefresh();
      } else if (refresh) {
        await refresh();
      }
    } finally {
      setInternalRefreshing(false);
      isRefreshingSV.value = false;
      pullOffset.value = withTiming(0, { duration: 300 });
    }
  }, [onRefresh, refresh, isRefreshingSV, pullOffset]);

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .activeOffsetY(5)
      .failOffsetY(-5)
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

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      isAtTop.value = event.contentOffset.y <= 5;
    },
  });

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
    (user: any) => {
      Alert.alert(
        `${t("admin_confirm_delete_title")}`,
        `${t("admin_confirm_delete_message")} ${user.name}? ${t("admin_confirm_delete_confirmation")}.`,
        [
          { text: `${t("btn_cancel")}`, style: "cancel" },
          {
            text: "Deletar",
            style: "destructive",
            onPress: () => {
              if (onDeleteUser) onDeleteUser(user.userID);
            },
          },
        ],
      );
    },
    [onDeleteUser, t],
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item._isSkeleton) {
        return <UserSkeleton />;
      }
      return (
        <UserItem
          user={item}
          searchTerm={searchTerm}
          isAdminMode={isAdminMode}
          onDelete={() => handleConfirmDelete(item)}
        />
      );
    },
    [searchTerm, isAdminMode, handleConfirmDelete],
  );

  const handleKeyExtractor = useCallback((item: any, index: number) => {
    return item.id?.toString() || `idx-${index}`;
  }, []);

  const handleEndReached = useCallback(() => {
    if (!initialLoading && !loadingMore) {
      loadMore();
    }
  }, [initialLoading, loadingMore, loadMore]);

  const renderSectionHeader = useCallback(() => tabBar || <></>, [tabBar]);

  const renderSectionFooter = useCallback(
    ({ section }: any) => {
      if (section.data.length === 0 && !initialLoading) {
        const emptyMessage = searchTerm
          ? `${t("error_no_users_for")} "${searchTerm}"`
          : t("search_users_start_typing");

        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        );
      }
      return null;
    },
    [initialLoading, searchTerm, styles.emptyContainer, styles.emptyText, t],
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
          <AnimatedSectionList
            ref={listRef}
            sections={sections}
            renderItem={renderItem}
            keyExtractor={handleKeyExtractor}
            ListHeaderComponent={profileHeader}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            onEndReachedThreshold={0.3}
            onEndReached={handleEndReached}
            bounces={false}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
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

export default memo(SearchUsers);
