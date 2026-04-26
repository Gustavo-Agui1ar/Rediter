import { makeStyles } from "@/utils/makeStyles.utils";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const GAP = 4;
export const PADDING_HORIZONTAL = 8;
const AVAILABLE_WIDTH = width - PADDING_HORIZONTAL * 2 - GAP;
const ITEM_WIDTH = AVAILABLE_WIDTH / 2;

export const useMidiaStyles = makeStyles((colors: any) =>
  StyleSheet.create({
    listContainer: {
      paddingBottom: 20,
      gap: GAP,
    },
    columnWrapper: {
      gap: GAP,
      paddingHorizontal: PADDING_HORIZONTAL,
    },
    imageWrapper: {
      width: ITEM_WIDTH,
      aspectRatio: 1.0,
      backgroundColor: colors.background,
      borderRadius: 4,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
    },

    skeletonGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: PADDING_HORIZONTAL,
      gap: GAP,
      justifyContent: "space-between",
    },
    skeletonItem: {
      backgroundColor: colors.border || "#E0E0E0",
      marginBottom: GAP,
    },

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
      backgroundColor: colors.overlayDark,
    },
    modalHeader: {
      position: "absolute",
      top: 0,
      right: 0,
      zIndex: 10,
    },
    modalCarouselItem: {
      width: width,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalCarouselImage: {
      width: width,
      flex: 1,
    },

    headerContainer: {
      width: "100%",
      padding: 0,
    },
  }),
);
