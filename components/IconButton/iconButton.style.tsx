import { Colors } from "@/styles/theme";
import { StyleSheet } from "react-native";

export type IconButtonType = "fill" | "border" | "none";

export const iconButtonStyles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },

  fill: {
    backgroundColor: Colors.primaryDark,
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
    backgroundColor: Colors.black,
  },
});

export const iconColorByType: Record<IconButtonType, string> = {
  fill: Colors.primaryLight,
  border: Colors.primaryLight,
  none: Colors.white,
};
