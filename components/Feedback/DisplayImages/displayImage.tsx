import IconButton from "@/components/UI/IconButton/IconButton";
import { useTheme } from "@/context/ThemeContext";
import { configs } from "@/utils/configs.utils";
import { Image } from "expo-image";
// Re-introduzimos o ImageManipulator para processamento de frequência espacial
import * as ImageManipulator from "expo-image-manipulator";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { SCREEN_WIDTH, createdDisplayImageStyles } from "./displayImage.styles";

interface DisplayImagesProps {
  files: any[];
  onRemoveImage?: (index: number) => void;
}

// 1. A Função Formidável de Processamento de Frequência
export async function removeThinEdges(uri: string): Promise<string> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [
        // PASSO 1: Redução Primitiva (Nocauteia Detalhes Finos)
        { resize: { width: 800 } }, // força o sistema a ignorar frequências altas

        // PASSO 2: Up-sampling Suavizado (Cria o Filtro Low-Pass)
        { resize: { width: 1280 } }, // volta suavizando, criando o blur necessário
      ],
      {
        // PASSO 3: Saída Purista PNG (Essencial para manter a transparência)
        // Usamos uma compressão leve para manter a qualidade estrutural.
        compress: 0.8,
        format: ImageManipulator.SaveFormat.PNG,
      },
    );

    return result.uri;
  } catch (error) {
    console.error("Erro ao suavizar frequências da imagem:", error);
    return uri;
  }
}

const FrequencyManipulatedGridImage = ({
  uri,
  style,
  onRemove,
}: {
  uri: string;
  style: any;
  onRemove?: () => void;
}) => {
  const [displayUri, setDisplayUri] = useState<string>(uri);

  useEffect(() => {
    let isMounted = true;

    removeThinEdges(uri).then((processed) => {
      if (isMounted) setDisplayUri(processed);
    });

    return () => {
      isMounted = false;
    };
  }, [uri]);

  return (
    <View style={style.wrapper}>
      <Image
        source={{ uri: displayUri }}
        style={style.image}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      {onRemove && (
        <View style={style.removeBtn}>
          <IconButton icon="close" type="none" size={44} onPress={onRemove} />
        </View>
      )}
    </View>
  );
};

const FlattenedCarouselImage = ({
  uri,
  style,
}: {
  uri: string;
  style: any;
}) => {
  return (
    <Image
      source={{ uri: uri }}
      style={style}
      contentFit="contain"
      transition={200}
      cachePolicy="memory-disk"
    />
  );
};

export default function DisplayImages({
  files,
  onRemoveImage,
}: DisplayImagesProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const { colors } = useTheme();
  const styles = createdDisplayImageStyles(colors);

  if (!files || files.length === 0) return null;

  const getImageUri = useCallback((item: any) => {
    if (item && typeof item === "object" && item.uri) {
      return item.uri;
    }

    if (typeof item === "string") {
      if (item.startsWith("http") || item.startsWith("file://")) {
        return item;
      }
      return `${configs.apiUrls[0]}/Picture/GetPicture?name=${encodeURIComponent(
        item,
      )}`;
    }
    return "";
  }, []);

  const openCarousel = useCallback((index: number) => {
    setInitialIndex(index);
    requestAnimationFrame(() => {
      setModalVisible(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const numFiles = files.length;

  const layoutConfig = useMemo(() => {
    if (numFiles === 1)
      return { aspectRatio: 1, itemWidth: "100%", itemHeight: "100%" };
    if (numFiles === 2)
      return { aspectRatio: 2, itemWidth: "50%", itemHeight: "100%" };
    return { aspectRatio: 1, itemWidth: "50%", itemHeight: "50%" };
  }, [numFiles]);

  return (
    <View
      style={[styles.gridContainer, { aspectRatio: layoutConfig.aspectRatio }]}
    >
      {files.map((file, index) => {
        const finalUri = getImageUri(file);

        return (
          <TouchableOpacity
            key={index}
            style={{
              width: layoutConfig.itemWidth as any,
              height: layoutConfig.itemHeight as any,
            }}
            onPress={() => openCarousel(index)}
            activeOpacity={0.85}
          >
            <FrequencyManipulatedGridImage
              uri={finalUri}
              style={{
                wrapper: [styles.full, styles.imageWrapper],
                image: styles.full,
                removeBtn: styles.removeBtn,
              }}
              onRemove={onRemoveImage ? () => onRemoveImage(index) : undefined}
            />
          </TouchableOpacity>
        );
      })}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalBackground}>
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              type="none"
              size={36}
              onPress={closeModal}
            />
          </View>

          <FlatList
            data={files}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, i) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * i,
              index: i,
            })}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <FlattenedCarouselImage
                  uri={getImageUri(item)}
                  style={styles.largeImage}
                />
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}
