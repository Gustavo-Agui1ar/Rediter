import IconButton from "@/components/UI/IconButton/IconButton";
import { getBaseURL } from "@/utils/configs.utils";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { SCREEN_WIDTH, useDisplayImageStyles } from "./displayImage.styles";

interface DisplayImagesProps {
  files: any[];
  onRemoveImage?: (index: number) => void;
}

export default function DisplayImages({
  files,
  onRemoveImage,
}: DisplayImagesProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const styles = useDisplayImageStyles();

  const getImageUri = useCallback((item: any) => {
    if (item && typeof item === "object" && item.uri) return item.uri;
    if (typeof item === "string") {
      if (item.startsWith("http") || item.startsWith("file://")) return item;
      return `${getBaseURL()}/Picture/GetPicture?name=${encodeURIComponent(item)}`;
    }
    return "";
  }, []);

  if (!files || files.length === 0) return null;

  const MAX_VISIBLE = 4;
  const displayFiles = files.slice(0, MAX_VISIBLE);
  const remaining = files.length - MAX_VISIBLE;

  const openCarousel = (index: number) => {
    setInitialIndex(index);
    setModalVisible(true);
  };

  const gridLayout = useMemo(() => {
    const count = displayFiles.length;
    if (count === 1) return { width: "100%", height: "100%", ratio: 1 };
    if (count === 2) return { width: "49%", height: "100%", ratio: 2 };
    return { width: "49%", height: "49%", ratio: 1 };
  }, [displayFiles.length]);

  return (
    <View
      style={[
        styles.gridContainer,
        {
          aspectRatio: gridLayout.ratio,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignContent: "space-between",
        },
      ]}
    >
      {displayFiles.map((file, index) => {
        const isLastVisible = index === MAX_VISIBLE - 1 && remaining > 0;
        const uri = getImageUri(file);

        return (
          <TouchableOpacity
            key={index}
            style={{
              width: gridLayout.width as any,
              height: gridLayout.height as any,
              overflow: "hidden",
              borderRadius: 8,
            }}
            onPress={() => openCarousel(index)}
            activeOpacity={0.85}
          >
            <View style={[styles.full, styles.imageWrapper]}>
              <Image
                source={{ uri }}
                style={styles.full}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
              {onRemoveImage && (
                <View style={styles.removeBtn}>
                  <IconButton
                    icon="close"
                    type="none"
                    size={44}
                    onPress={() => onRemoveImage(index)}
                  />
                </View>
              )}
            </View>

            {isLastVisible && (
              <View
                style={{
                  ...styles.full,
                  position: "absolute",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}

      {/* Modal / Carrossel */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              type="none"
              size={36}
              onPress={() => setModalVisible(false)}
            />
          </View>

          <FlatList
            data={files}
            horizontal
            pagingEnabled
            initialScrollIndex={initialIndex}
            getItemLayout={(_, i) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * i,
              index: i,
            })}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image
                  source={{ uri: getImageUri(item) }}
                  style={styles.largeImage}
                  contentFit="contain"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}
