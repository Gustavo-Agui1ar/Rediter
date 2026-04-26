import IconButton from "@/components/UI/IconButton/IconButton";
import { useLoading } from "@/context/loadingContext";
import { useTheme } from "@/context/ThemeContext";
import { configs } from "@/utils/configs.utils";
import { request } from "@/utils/request.utils";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Modal,
    RefreshControl,
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
  ListHeaderComponent: React.ReactNode;
  onRefreshProfile: () => Promise<void>;
}

export default function MediaGrid({
  userProfileId,
  isMyProfile,
  ListHeaderComponent,
  onRefreshProfile,
}: MediaGridProps) {
  const [data, setData] = useState<string[]>([]);
  const { setLoading, loading } = useLoading();
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const { colors } = useTheme();
  const styles = useMidiaStyles();

  const getImageUri = useCallback((item: any) => {
    if (item && typeof item === "object" && item.uri) return item.uri;
    if (typeof item === "string") {
      return `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(item)}`;
    }
    return "";
  }, []);

  const fetchMedia = useCallback(
    async (isRefreshing = false) => {
      if (!isRefreshing) setLoading(true);
      try {
        let endpoint = "";

        if (isMyProfile) {
          endpoint = `/Post/GetMyMidiaNames`;
        } else if (!isMyProfile && userProfileId) {
          endpoint = `/Post/GetAllMidiaNames?userId=${userProfileId}`;
        } else {
          setLoading(false);
          return;
        }

        const response = await request({
          urlComplement: endpoint,
          method: "GET",
          setLoading: setLoading,
        });

        if (response.ok) {
          const json = await response.json();
          setData(json);
        } else {
          console.error("Falha ao buscar imagens");
        }
      } catch (error) {
        console.error("Erro na requisição de mídias:", error);
      } finally {
        if (!isRefreshing) setLoading(false);
      }
    },
    [isMyProfile, userProfileId],
  );

  useEffect(() => {
    fetchMedia(false);
  }, [fetchMedia]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchMedia(true), onRefreshProfile()]);
    setRefreshing(false);
  };

  const openCarousel = useCallback((index: number) => {
    setInitialIndex(index);
    requestAnimationFrame(() => {
      setModalVisible(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const uri = getImageUri(item);

    return (
      <TouchableOpacity
        style={styles.imageWrapper}
        activeOpacity={0.85}
        onPress={() => openCarousel(index)}
      >
        <Image
          source={{ uri }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <FlatList
        data={[]}
        numColumns={2}
        ListHeaderComponent={
          <View>
            {ListHeaderComponent as React.ReactElement}
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                Nenhuma mídia encontrada.
              </Text>
            </View>
          </View>
        }
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    );
  }

  return (
    <>
      <FlatList
        data={data}
        ListHeaderComponent={ListHeaderComponent as React.ReactElement}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              type="none"
              size={36}
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
            keyExtractor={(item, i) => `${item}-${i}`}
            renderItem={({ item }) => (
              <View style={styles.modalCarouselItem}>
                <Image
                  source={{ uri: getImageUri(item) }}
                  style={styles.modalCarouselImage}
                  contentFit="contain"
                  transition={200}
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
