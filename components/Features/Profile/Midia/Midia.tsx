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
  const {
    data,
    isLocalLoading,
    modalVisible,
    initialIndex,
    openCarousel,
    closeModal,
  } = useMediaGrid({ userProfileId, refresh_id });

  const displayData = useMemo(() => {
    return isLocalLoading
      ? Array.from({ length: 6 }).map((_, i) => `skeleton-${i}`)
      : data || []; // Fallback seguro
  }, [isLocalLoading, data]);

  const renderItem = useCallback(
    ({ item, index }: { item: string | { uri: string }; index: number }) => {
      if (typeof item === "string" && item.startsWith("skeleton-")) {
        return <SkeletonItem styles={styles} />;
      }

      return (
        <TouchableOpacity
          style={styles.imageWrapper}
          activeOpacity={0.85}
          onPress={() => openCarousel(index)}
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
    [openCarousel, styles],
  );

  const renderEmptyComponent = useCallback(() => {
    if (isLocalLoading) return null;

    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>Nenhuma mídia encontrada.</Text>
      </View>
    );
  }, [isLocalLoading, styles]);

  const listContentStyle = useMemo(
    () => [
      styles.listContainer,
      { minHeight: 400 },
      Platform.OS === "android" ? { paddingTop: headerHeight } : {},
    ],
    [styles.listContainer, headerHeight],
  );

  const contentInsetIOS = useMemo(
    () => (Platform.OS === "ios" ? { top: headerHeight } : undefined),
    [headerHeight],
  );

  const contentOffsetIOS = useMemo(
    () => (Platform.OS === "ios" ? { x: 0, y: -headerHeight } : undefined),
    [headerHeight],
  );

  return (
    <>
      <Animated.FlatList
        data={displayData}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item, index) =>
          typeof item === "string"
            ? `media-${item}-${index}`
            : `media-obj-${index}`
        }
        renderItem={renderItem}
        onScroll={onScroll}
        scrollEventThrottle={16}
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
        contentContainerStyle={listContentStyle}
        contentInset={contentInsetIOS}
        contentOffset={contentOffsetIOS}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        removeClippedSubviews={true}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              type="none"
              size={44}
              style={styles.closeBtn}
              onPress={closeModal}
            />
          </View>

          <FlatList
            data={data}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, i) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * i,
              index: i,
            })}
            keyExtractor={(item, i) => `modal-img-${i}`}
            renderItem={({ item }) => (
              <View style={[styles.modalCarouselItem, { width: SCREEN_WIDTH }]}>
                <Image
                  source={{ uri: getImageUri(item) }}
                  style={styles.modalCarouselImage}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                />
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

export default memo(MediaGrid);
