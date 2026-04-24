import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export type IconButtonType =
  | "fill"
  | "border"
  | "none"
  | "fill_image"
  | "overlay";

export const iconButtonStyles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },

  fill: {
    backgroundColor: Colors.primaryDark,
  },

  fill_image: {
    backgroundColor: "transparent",
  },

  border: {
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    backgroundColor: "transparent",
  },

  none: {
    backgroundColor: "transparent",
  },

  overlay: {
    backgroundColor: Colors.overlay,
  },
});

export const iconColorByType: Record<IconButtonType, string> = {
  fill: Colors.primaryLight,
  border: Colors.primaryLight,
  none: Colors.white,
  fill_image: Colors.white,
  overlay: Colors.white,
};
