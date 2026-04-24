import { Colors } from "@/styles/theme";
import { Dimensions, StyleSheet } from "react-native";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

export const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginTop: 16,
  },
  imageWrapper: {
    width: "50%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.background,
  },
  full: {
    width: "100%",
    height: "100%",
  },

  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 20,
    zIndex: 10,
  },

  carouselItem: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },

  largeImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
