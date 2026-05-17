import IconButton from "@/components/UI/IconButton/IconButton";
import { getBaseURL } from "@/utils/configs.utils";
import { Image } from "expo-image";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMediaGrid } from "./Midia.script";
import { useMidiaStyles } from "./Midia.styles";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface MediaGridProps {
  userProfileId?: string;
  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;
  refresh_id: string;
  onScroll?: any;
  headerHeight?: number;
}

const getImageUri = (item: string | { uri: string }) => {
  if (typeof item === "object" && item?.uri) return item.uri;
  if (typeof item === "string") {
    return `${getBaseURL()}/api/pictures/${encodeURIComponent(item)}`;
  }
  return "";
};

const SkeletonItem = memo(({ styles }: { styles: any }) => {
  const pulseAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[styles.imageWrapper, styles.skeletonItem, { opacity: pulseAnim }]}
    />
  );
});

function MediaGrid({
  userProfileId,
  onRefresh,
  refreshing = false,
  refresh_id,
  onScroll,
  headerHeight = 0,
}: MediaGridProps) {
  const styles = useMidiaStyles();

  const { state, refs, actions } = useMediaGrid({
    userProfileId,
    refresh_id,
    headerHeight,
  });

  const displayData = useMemo(() => {
    return state.isLocalLoading
      ? Array.from({ length: 12 }).map((_, i) => `skeleton-${i}`)
      : state.data || [];
  }, [state.isLocalLoading, state.data]);

  const renderGridItem = useCallback(
    ({ item, index }: { item: string | { uri: string }; index: number }) => {
      if (typeof item === "string" && item.startsWith("skeleton-")) {
        return <SkeletonItem styles={styles} />;
      }

      return (
        <TouchableOpacity
          style={styles.imageWrapper}
          activeOpacity={0.85}
          onPress={() => actions.openCarousel(index)}
        >
          <Image
            source={{ uri: getImageUri(item) }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>
      );
    },
    [actions, styles],
  );

  const renderEmptyComponent = useCallback(() => {
    if (state.isLocalLoading) return null;
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>Nenhuma mídia encontrada.</Text>
      </View>
    );
  }, [state.isLocalLoading, styles]);

  const renderModalItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={[styles.modalCarouselItem, { width: SCREEN_WIDTH }]}>
        <Image
          source={{ uri: getImageUri(item) }}
          style={styles.modalCarouselImage}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
      </View>
    ),
    [styles],
  );

  const listContentStyle = useMemo(() => {
    return [
      styles.listContainer,
      {
        flexGrow: 1,
        paddingBottom: headerHeight + 80,
      },
      Platform.OS === "android" ? { paddingTop: headerHeight } : undefined,
    ] as any;
  }, [styles.listContainer, headerHeight]);

  const modalKeyExtractor = useCallback(
    (item: any, i: number) => `modal-img-${i}`,
    [],
  );
  const modalItemLayout = useCallback(
    (_: any, i: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * i,
      index: i,
    }),
    [],
  );

  return (
    <View style={{ flex: 1, width: "100%", paddingTop: 36 }}>
      <Animated.FlatList
        ref={refs.listRef}
        data={displayData}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item, index) =>
          typeof item === "string"
            ? `media-${item}-${index}`
            : `media-obj-${index}`
        }
        renderItem={renderGridItem}
        onScroll={onScroll}
        scrollEventThrottle={16}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS === "android"}
        contentContainerStyle={listContentStyle}
        ListHeaderComponent={
          Platform.OS === "android" ? null : (
            <View style={{ height: headerHeight }} />
          )
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        nestedScrollEnabled={true}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="transparent"
              colors={["transparent"]}
              progressBackgroundColor="transparent"
            />
          ) : undefined
        }
      />

      <Modal
        visible={state.modalVisible}
        transparent
        animationType="fade"
        onRequestClose={actions.closeModal}
        statusBarTranslucent
      >
        <SafeAreaView
          style={[styles.modalSafeArea, { flex: 1, backgroundColor: "#000" }]}
        >
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              type="none"
              size={44}
              style={styles.closeBtn}
              onPress={actions.closeModal}
            />
          </View>

          <FlatList
            ref={refs.modalListRef}
            data={state.data}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={state.initialIndex}
            getItemLayout={modalItemLayout}
            keyExtractor={modalKeyExtractor}
            renderItem={renderModalItem}
            windowSize={3}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                refs.modalListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: false,
                });
              }, 50);
            }}
            style={{ flex: 1 }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

export default memo(MediaGrid);
