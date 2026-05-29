import IconButton from "@/components/UI/IconButton/IconButton";
import { Image } from "expo-image";

import { memo, useCallback, useEffect, useMemo, useRef } from "react";

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

// 1. IMPORTAÇÃO DA BIBLIOTECA
import { Tabs } from "react-native-collapsible-tab-view";

import { useImageUtils } from "@/utils/imageUri.utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMediaGrid } from "./Midia.script";
import { useMidiaStyles } from "./Midia.styles";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Removemos a necessidade de exportar Refs de ScrollToTop,
// pois a biblioteca cuida da navegação nativa.
interface MediaGridProps {
  userProfileId?: string;
  refresh_id: string;
  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;
}

const SkeletonItem = memo(({ styles }: { styles: any }) => {
  const opacity = useRef(new Animated.Value(0.5)).current;
  // const { getSafeUri } = useImageUtils(); // Removido pois não estava sendo usado aqui

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

const MediaGrid = function MediaGrid({
  userProfileId,
  refresh_id,
  onRefresh,
  refreshing = false,
}: MediaGridProps) {
  const styles = useMidiaStyles();
  const { getSafeUri } = useImageUtils();

  const {
    data,
    loading,
    modalVisible,
    selectedIndex,
    modalListRef,
    openModal,
    closeModal,
  } = useMediaGrid({
    userProfileId,
    refresh_id,
  });

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
            cachePolicy="memory"
          />
        </TouchableOpacity>
      );
    },
    [openModal, styles, getSafeUri],
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
          cachePolicy="memory"
        />
      </View>
    ),
    [styles, getSafeUri],
  );

  // Limpamos a soma matemática do headerHeight.
  // Mantive o 80 de paddingBottom para garantir que a última linha não fique presa debaixo do menu.
  const contentContainerStyle = useMemo(
    () => [
      styles.listContainer,
      {
        flexGrow: 1,
        paddingBottom: 80,
      },
    ],
    [styles.listContainer],
  );

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <Tabs.FlatList // 2. SUBSTITUÍDO AQUI
        data={displayData}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item, index) => `media-${index}-${String(item)}`}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={contentContainerStyle}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled // É bom manter se estiver dentro de outros scrolls
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS === "android"}
        // O RefreshControl pode continuar aqui sem problemas
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

      {/* Modal permanece inalterado pois não afeta o Scroll do Feed */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
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
};

export default memo(MediaGrid);
