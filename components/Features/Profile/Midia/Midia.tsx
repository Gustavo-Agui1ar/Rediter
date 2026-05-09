import IconButton from "@/components/UI/IconButton/IconButton";
import { getBaseURL } from "@/utils/configs.utils";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  SectionList,
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
  profileHeader?: React.ReactElement;
  tabBar?: React.ReactElement;
  refresh_id: string;
}

const getImageUri = (item: string | { uri: string }) => {
  if (typeof item === "object" && item?.uri) return item.uri;
  if (typeof item === "string") {
    return `${getBaseURL()}/api/pictures/${encodeURIComponent(item)}`;
  }
  return "";
};

const SkeletonItem = ({ styles }: { styles: any }) => {
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
};

export default function MediaGrid({
  userProfileId,
  onRefresh,
  refreshing = false,
  profileHeader,
  tabBar,
  refresh_id,
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

  const displayData = isLocalLoading
    ? Array.from({ length: 6 }).map((_, i) => `skeleton-${i}`)
    : data;

  const chunkedData = [];
  for (let i = 0; i < displayData.length; i += 2) {
    chunkedData.push(displayData.slice(i, i + 2));
  }

  const renderRow = useCallback(
    ({
      item: rowItems,
      index: rowIndex,
    }: {
      item: string[];
      index: number;
    }) => {
      return (
        <View
          style={[
            styles.columnWrapper,
            { flexDirection: "row", width: "100%" },
          ]}
        >
          {rowItems.map((item, colIndex) => {
            const actualIndex = rowIndex * 2 + colIndex;

            if (item.startsWith("skeleton-")) {
              return (
                <SkeletonItem key={`skel-${actualIndex}`} styles={styles} />
              );
            }

            return (
              <TouchableOpacity
                key={`media-${actualIndex}`}
                style={styles.imageWrapper}
                activeOpacity={0.85}
                onPress={() => openCarousel(actualIndex)}
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
          })}

          {rowItems.length === 1 && (
            <View
              style={[styles.imageWrapper, { backgroundColor: "transparent" }]}
            />
          )}
        </View>
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

  return (
    <>
      <SectionList
        sections={[{ data: chunkedData }]}
        keyExtractor={(item, index) => `media-row-${index}`}
        renderItem={renderRow}
        ListHeaderComponent={profileHeader}
        renderSectionHeader={() => tabBar || <></>}
        stickySectionHeadersEnabled={true}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        contentContainerStyle={[styles.listContainer, { minHeight: 400 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
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
            keyExtractor={(item, i) => `modal-img-${item}-${i}`}
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
