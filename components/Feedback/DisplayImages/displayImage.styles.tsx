import { Dimensions, StyleSheet } from "react-native";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

export const createdDisplayImageStyles = (colors: any) =>
  StyleSheet.create({
    gridContainer: {
      marginTop: 12,
      borderRadius: 16,
      overflow: "hidden",
      width: "100%",
      borderColor: colors.divider,
      borderWidth: 1,

      flexDirection: "row",
      flexWrap: "wrap",
      gap: 2,
    },

    imageWrapper: {
      backgroundColor: colors.black,

      justifyContent: "center",
      alignItems: "center",

      borderRadius: 8,
    },

    full: {
      width: "100%",
      height: "100%",
    },

    removeBtn: {
      position: "absolute",
      top: 6,
      right: 6,
      zIndex: 10,

      backgroundColor: colors.overlay,
      borderRadius: 9999,
    },

    modalBackground: {
      flex: 1,
      backgroundColor: colors.black,
    },

    modalHeader: {
      position: "absolute",
      top: 48,
      right: 16,
      zIndex: 20,

      backgroundColor: colors.overlay,
      borderRadius: 20,
      padding: 6,
    },

    carouselItem: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,

      justifyContent: "center",
      alignItems: "center",
    },

    largeImage: {
      width: SCREEN_WIDTH,
      height: "100%",

      resizeMode: "contain",
    },
  });
