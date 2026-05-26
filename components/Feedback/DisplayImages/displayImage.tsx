import IconButton from "@/components/UI/IconButton/IconButton";
import { useImageUtils } from "@/utils/imageUri.utils";
import { Image } from "expo-image";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useDisplayImages } from "./DisplayImage.script";
import { SCREEN_WIDTH, useDisplayImageStyles } from "./DisplayImage.styles";

interface DisplayImagesProps {
  files: any[];
  onRemoveImage?: (index: number) => void;
}

export default function DisplayImages({
  files,
  onRemoveImage,
}: DisplayImagesProps) {
  const styles = useDisplayImageStyles();
  const { getSafeUri } = useImageUtils();

  const {
    safeFiles,
    displayFiles,
    remaining,
    MAX_VISIBLE,
    gridLayout,
    modalVisible,
    initialIndex,
    openCarousel,
    closeCarousel,
  } = useDisplayImages(files);

  if (safeFiles.length === 0) return null;

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
        const uri = getSafeUri(file);

        return (
          <TouchableOpacity
            key={uri}
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
                source={uri ? { uri } : undefined}
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
              >
                <Text
                  style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
                >
                  +{remaining}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCarousel}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              type="none"
              size={36}
              onPress={closeCarousel}
            />
          </View>

          <FlatList
            data={safeFiles}
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
                  source={{ uri: getSafeUri(item) }}
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
