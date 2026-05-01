import { ImageUtils } from "@/utils/imageUri.utils";
import { useCallback, useMemo, useState } from "react";

export function useDisplayImages(files: any[]) {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const getImageUri = useCallback((file: any) => {
    if (!file) return "";
    const imageName =
      typeof file === "string" ? file : file.uri || file.fileName || file.name;
    return ImageUtils.getProfileImageUri(imageName) || "";
  }, []);

  const safeFiles = files || [];
  const MAX_VISIBLE = 4;
  const displayFiles = safeFiles.slice(0, MAX_VISIBLE);
  const remaining = safeFiles.length - MAX_VISIBLE;

  const gridLayout = useMemo(() => {
    const count = displayFiles.length;
    if (count === 1) return { width: "100%", height: "100%", ratio: 1 };
    if (count === 2) return { width: "49%", height: "100%", ratio: 2 };
    return { width: "49%", height: "49%", ratio: 1 };
  }, [displayFiles.length]);

  const openCarousel = useCallback((index: number) => {
    setInitialIndex(index);
    setModalVisible(true);
  }, []);

  const closeCarousel = useCallback(() => {
    setModalVisible(false);
  }, []);

  return {
    safeFiles,
    displayFiles,
    remaining,
    MAX_VISIBLE,
    gridLayout,
    modalVisible,
    initialIndex,
    openCarousel,
    closeCarousel,
    getImageUri,
  };
}
