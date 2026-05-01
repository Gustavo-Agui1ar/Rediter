import IconButton from "@/components/UI/IconButton/IconButton";
import { getBaseURL } from "@/utils/configs.utils";
import { request } from "@/utils/request.utils";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMidiaStyles } from "./Midia.styles";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface MediaGridProps {
  userProfileId?: string;
  isMyProfile: boolean;
}

const getImageUri = (item: string | { uri: string }) => {
  if (typeof item === "object" && item?.uri) return item.uri;
  if (typeof item === "string") {
    return `${getBaseURL()}/Picture/GetPicture?name=${encodeURIComponent(item)}`;
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
  isMyProfile,
}: MediaGridProps) {
  const [data, setData] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  const styles = useMidiaStyles();
  const fetchingRef = useRef(false);

  const fetchMedia = useCallback(
    async (isRefresh = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      if (!isRefresh) setIsLocalLoading(true);

      try {
        if (!isMyProfile && !userProfileId) return;

        const endpoint = isMyProfile
          ? `/Post/GetMyMidiaNames`
          : `/Post/GetAllMidiaNames?userId=${userProfileId}`;

        const response = await request({
          urlComplement: endpoint,
          method: "GET",
          requireAuth: isMyProfile,
        });

        if (response.ok) {
          const json = await response.json();
          setData(json || []);
        } else {
          setData([]);
        }
      } catch {
        setData([]);
      } finally {
        fetchingRef.current = false;
        setIsLocalLoading(false);
      }
    },
    [isMyProfile, userProfileId],
  );

  useEffect(() => {
    fetchMedia(false);

    const sub = DeviceEventEmitter.addListener("refresh_media", () => {
      fetchMedia(true);
    });

    return () => sub.remove();
  }, [fetchMedia]);

  const openCarousel = useCallback((index: number) => {
    setInitialIndex(index);
    requestAnimationFrame(() => setModalVisible(true));
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      if (item.startsWith("skeleton-")) {
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

  const displayData = isLocalLoading
    ? Array.from({ length: 6 }).map((_, i) => `skeleton-${i}`)
    : data;

  return (
    <>
      <FlatList
        data={displayData}
        keyExtractor={(item, index) => `media-${item}-${index}`}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContainer, { minHeight: 400 }]}
        columnWrapperStyle={
          displayData.length > 1 ? styles.columnWrapper : undefined
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
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
