import { IconButton } from "@/components/components";
import { configs } from "@/utils/configs.utils";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { SCREEN_WIDTH, styles } from "./displayImage.styles";

interface DisplayImagesProps {
  files: any[];
  onRemoveImage?: (index: number) => void;
}

export function DisplayImages({ files, onRemoveImage }: DisplayImagesProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  if (!files || files.length === 0) return null;

  const getImageUri = (item: any) => {
    if (item && typeof item === "object" && item.uri) return item.uri;
    if (typeof item === "string") {
      if (item.startsWith("http") || item.startsWith("file://")) return item;
      return `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(item)}`;
    }
    return "";
  };

  const openCarousel = (index: number) => {
    setInitialIndex(index);
    requestAnimationFrame(() => {
      setModalVisible(true);
    });
  };

  const numColumns = files.length === 1 ? 1 : files.length <= 4 ? 2 : 3;
  const gridSize = `${100 / numColumns}%`;

  return (
    <View style={styles.gridContainer}>
      {/* IMAGE GRID */}
      {files.map((file, index) => (
        <TouchableOpacity
          key={index}
          style={{ width: gridSize as any, padding: 4 }}
          onPress={() => openCarousel(index)}
          activeOpacity={0.7}
        >
          <View style={[styles.imageWrapper]}>
            <Image
              source={{ uri: getImageUri(file) }}
              style={styles.full}
              resizeMode="cover"
            />

            {onRemoveImage && (
              <View style={styles.removeBtn}>
                <IconButton
                  icon="close"
                  type="overlay"
                  circle={true}
                  size={36}
                  onPress={() => onRemoveImage(index)}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}

      {/* CAROUSEL MODAL */}
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
              size={44}
              onPress={() => setModalVisible(false)}
            />
          </View>

          <FlatList
            data={files}
            horizontal
            pagingEnabled
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            keyExtractor={(_, i) => i.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image
                  source={{ uri: getImageUri(item) }}
                  style={styles.largeImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}
