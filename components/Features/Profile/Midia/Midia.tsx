import IconButton from "@/components/UI/IconButton/IconButton";
import { Image } from "expo-image";

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useImageUtils } from "@/utils/imageUri.utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMediaGrid } from "./Midia.script";
import { useMidiaStyles } from "./Midia.styles";

const SCREEN_WIDTH = Dimensions.get("window").width;

export interface MediaGridRef {
  scrollToTop: () => void;
}

interface MediaGridProps {
  userProfileId?: string;
  refresh_id: string;

  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;

  onScroll?: any;

  headerHeight?: number;
}

const SkeletonItem = memo(({ styles }: { styles: any }) => {
  const opacity = useRef(new Animated.Value(0.5)).current;
  const { getSafeUri } = useImageUtils();

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.imageWrapper, styles.skeletonItem, { opacity }]}
    />
  );
});

const MediaGrid = forwardRef<MediaGridRef, MediaGridProps>(function MediaGrid(
  {
    userProfileId,
    refresh_id,

    onRefresh,
    refreshing = false,

    onScroll,

    headerHeight = 0,
  },
  ref,
) {
  const styles = useMidiaStyles();
  const { getSafeUri } = useImageUtils();

  const {
    data,
    loading,
    modalVisible,
    selectedIndex,
    listRef,
    modalListRef,
    openModal,
    closeModal,
    scrollToTop,
  } = useMediaGrid({
    userProfileId,
    refresh_id,
  });

  useImperativeHandle(ref, () => ({
    scrollToTop,
  }));

  const displayData = useMemo(() => {
    if (!loading) {
      return data;
    }

    return Array.from({ length: 12 }, (_, i) => `skeleton-${i}`);
  }, [data, loading]);

  const renderItem = useCallback(
    ({ item, index }: any) => {
      const isSkeleton =
        typeof item === "string" && item.startsWith("skeleton-");

      if (isSkeleton) {
        return <SkeletonItem styles={styles} />;
      }

      return (
        <TouchableOpacity
          style={styles.imageWrapper}
          activeOpacity={0.85}
          onPress={() => openModal(index)}
        >
          <Image
            source={{
              uri: getSafeUri(item),
            }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>
      );
    },
    [openModal, styles],
  );

  const renderEmpty = useCallback(() => {
    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>Nenhuma mídia encontrada.</Text>
      </View>
    );
  }, [loading, styles]);

  const renderModalItem = useCallback(
    ({ item }: any) => (
      <View
        style={[
          styles.modalCarouselItem,
          {
            width: SCREEN_WIDTH,
          },
        ]}
      >
        <Image
          source={{
            uri: getSafeUri(item),
          }}
          style={styles.modalCarouselImage}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
      </View>
    ),
    [styles],
  );

  const contentContainerStyle = useMemo(
    () => [
      styles.listContainer,
      {
        flexGrow: 1,
        paddingBottom: headerHeight + 80,
      },
    ],
    [headerHeight, styles.listContainer],
  );

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
      }}
    >
      <Animated.FlatList
        ref={listRef}
        data={displayData}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item, index) => `media-${index}-${String(item)}`}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={
          <View
            style={{
              height: headerHeight,
            }}
          />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS === "android"}
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
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <SafeAreaView
          style={[
            styles.modalSafeArea,
            {
              flex: 1,
              backgroundColor: "#000",
            },
          ]}
        >
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
            ref={modalListRef}
            data={data}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedIndex}
            renderItem={renderModalItem}
            keyExtractor={(_, i) => `modal-${i}`}
            style={{ flex: 1 }}
            windowSize={3}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                modalListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: false,
                });
              }, 50);
            }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
});

export default memo(MediaGrid);
