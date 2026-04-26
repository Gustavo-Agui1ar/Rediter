import { makeStyles } from "@/utils/makeStyles.utils";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const GAP = 4;
const PADDING_HORIZONTAL = 8;
const AVAILABLE_WIDTH = width - PADDING_HORIZONTAL * 2 - GAP;
const ITEM_WIDTH = AVAILABLE_WIDTH / 2;

export const useMidiaStyles = makeStyles((colors: any) =>
  StyleSheet.create({
    listContainer: {
      paddingHorizontal: PADDING_HORIZONTAL,
      paddingBottom: 20,
      gap: GAP,
    },
    columnWrapper: {
      gap: GAP,
    },
    imageWrapper: {
      width: ITEM_WIDTH,
      aspectRatio: 1.3,
      backgroundColor: colors.background,
      borderRadius: 4,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    // --- NOVOS ESTILOS MOVIDOS DO COMPONENTE ---
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyStateContainer: {
      padding: 20,
      alignItems: "center",
      marginTop: 50,
    },
    emptyStateText: {
      color: colors.textSecondary,
    },
    modalSafeArea: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.95)",
    },
    modalHeader: {
      alignItems: "flex-end",
      padding: 16,
      zIndex: 10,
    },
    modalCarouselItem: {
      width: width,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalCarouselImage: {
      width: "100%",
      height: "80%",
    },
  }),
);
